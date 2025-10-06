from __future__ import annotations

import json
import re
import uuid
from datetime import datetime, timedelta
from typing import Any, Dict, Iterable, List, Optional

import httpx
import asyncio
import time
import logging
from fastapi import HTTPException

from ..config import settings
from ..schemas import (
    AgentMessage,
    AgentMessageRequest,
    AgentMessageResponse,
    Coordinates,
    GeneratedRoute,
    RouteGenerateRequest,
    RouteStep,
    RouteSummary,
)
from .yandex import build_yandex_maps_url

logger = logging.getLogger(__name__)
DEEPSEEK_MODEL = "deepseek-chat"

# Simple in-memory cache for agent responses
_agent_cache: Dict[str, str] = {}
_cache_timestamps: Dict[str, datetime] = {}

def _get_cached_response(key: str) -> Optional[str]:
    if key in _agent_cache:
        if datetime.utcnow() - _cache_timestamps[key] < timedelta(hours=1):
            return _agent_cache[key]
        else:
            # Expired
            del _agent_cache[key]
            del _cache_timestamps[key]
    return None

def _cache_response(key: str, response: str):
    _agent_cache[key] = response
    _cache_timestamps[key] = datetime.utcnow()

ROUTE_SYSTEM_PROMPT = (
    "You are Yanqwip, a personal travel curator for Moscow. You create warm, human,"
    " detail rich itineraries while strictly staying inside Moscow."
    " You must always respond in Russian. Keep responses engaging yet concise."
    " Ensure all locations are real and within Moscow city limits."
    " Provide accurate addresses, transportation options, and practical tips."
)

ROUTE_RESPONSE_INSTRUCTION = r"""
Ты отвечаешь **ТОЛЬКО** в формате JSON без дополнительного текста и пояснений.
Структура ответа:
{
  "title": "",
  "summary": {
    "intro": "",
    "transport": "",
    "budget": "",
    "food": "",
    "tips": "",
    "weather_plan": ""
  },
  "steps": [
    {
      "title": "",
      "description": "",
      "start_time": "",
      "end_time": "",
      "duration_minutes": 60,
      "address": "",
      "website": "",
      "coordinates": {"lat": 55.7558, "lon": 37.6173}
    }
  ],
  "yandex_url": ""
}
Не добавляй markdown, комментарии или текст вне JSON.
"""


def _extract_json_block(text: str) -> Optional[Dict[str, Any]]:
    code_block_match = re.search(r"```(?:json)?\s*(\{[\s\S]*?\})\s*```", text)
    if code_block_match:
        candidate = code_block_match.group(1)
    else:
        brace_match = re.search(r"\{[\s\S]*\}", text)
        if not brace_match:
            return None
        candidate = brace_match.group(0)

    candidate = candidate.replace("“", '"').replace("”", '"').replace("’", "'")
    cleaned = re.sub(r",\s*([}\]])", r"\1", candidate)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return None


def _build_route_prompt(payload: RouteGenerateRequest) -> str:
    answers: Iterable[tuple[str, str]] = (
        ("Время начала", payload.start_time),
        ("Продолжительность", payload.duration),
        ("Тип прогулки", payload.walk_type),
        ("Стартовая точка", payload.start_point),
        ("Бюджет", payload.budget),
        ("Предпочтения", payload.preferences),
        ("Активности", payload.activities),
        ("Питание", payload.food),
        ("Транспорт", payload.transport),
        ("Ограничения", payload.limitations),
    )

    lines = [
        "Сгенерируй персональный маршрут по Москве на основе ответов пользователя.",
        "Каждый блок должен быть тёплым и живым, как дружеский совет.",
        "Обязательно указывай только реальные места в пределах Москвы.",
    ]

    for idx, (title, value) in enumerate(answers, start=1):
        lines.append(f"{idx}. {title}: {value}")

    if payload.context:
        lines.append(f"Дополнительный контекст: {payload.context}")

    lines.append(ROUTE_RESPONSE_INSTRUCTION)
    return "\n".join(lines)


async def _retry_request(fn, *, retries: int = 3, base_delay: float = 0.75):
    last_exc: Exception | None = None
    for attempt in range(retries):
        try:
            return await fn()
        except (httpx.TimeoutException, httpx.RequestError) as exc:
            last_exc = exc
            await asyncio.sleep(base_delay * (2 ** attempt))
        except HTTPException as exc:
            # Retry on 429 and 5xx
            if 500 <= exc.status_code < 600 or exc.status_code == 429:
                last_exc = exc
                await asyncio.sleep(base_delay * (2 ** attempt))
            else:
                raise
    if isinstance(last_exc, HTTPException):
        raise last_exc
    raise HTTPException(status_code=502, detail=str(last_exc or "DeepSeek request failed"))


async def _chat_completion(
    messages: List[Dict[str, str]],
    *,
    temperature: float = 0.7,
    max_tokens: int = 1800,
    read_timeout: float = 30.0,
    retries: int = 3,
) -> str:
    headers = {
        "Authorization": f"Bearer {settings.deepseek_api_key}",
        "Content-Type": "application/json",
    }
    body = {
        "model": DEEPSEEK_MODEL,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }

    connect_timeout = 5.0
    # httpx requires either a single default or all components (connect, read, write, pool)
    timeout = httpx.Timeout(connect=connect_timeout, read=read_timeout, write=read_timeout, pool=5.0)

    async def do_request():
        async with httpx.AsyncClient(timeout=timeout) as client:
            started = time.perf_counter()
            response = await client.post(
                f"{settings.deepseek_base_url}/v1/chat/completions",
                headers=headers,
                json=body,
            )
            elapsed = (time.perf_counter() - started) * 1000
            logger.info(f"DeepSeek chat completion time: {elapsed:.0f} ms, status={response.status_code}")
            if response.status_code >= 400:
                raise HTTPException(status_code=response.status_code, detail=response.text)
            data = response.json()
            try:
                return data["choices"][0]["message"]["content"]
            except (KeyError, IndexError) as exc:
                raise HTTPException(status_code=502, detail="Invalid DeepSeek response shape") from exc

    return await _retry_request(do_request, retries=retries)


def _convert_summary(data: Dict[str, Any]) -> RouteSummary:
    return RouteSummary(
        intro=data.get("intro"),
        transport=data.get("transport"),
        budget=data.get("budget"),
        food=data.get("food"),
        tips=data.get("tips"),
        weather_plan=data.get("weather_plan"),
    )


def _convert_step(raw: Dict[str, Any]) -> RouteStep:
    coordinates_data = raw.get("coordinates")
    coordinates: Optional[Coordinates] = None
    if isinstance(coordinates_data, dict):
        lat = coordinates_data.get("lat")
        lon = coordinates_data.get("lon")
        if lat is not None and lon is not None:
            coordinates = Coordinates(lat=float(lat), lon=float(lon))

    return RouteStep(
        title=raw.get("title") or "Без названия",
        description=raw.get("description") or "",
        start_time=raw.get("start_time"),
        end_time=raw.get("end_time"),
        duration_minutes=raw.get("duration_minutes"),
        address=raw.get("address"),
        website=raw.get("website"),
        coordinates=coordinates,
    )


async def generate_route(payload: RouteGenerateRequest) -> GeneratedRoute:
    prompt = _build_route_prompt(payload)
    # Longer read timeout for route generation
    content = await _chat_completion([
        {"role": "system", "content": ROUTE_SYSTEM_PROMPT},
        {"role": "user", "content": prompt},
    ], read_timeout=60.0, retries=4)

    json_payload = _extract_json_block(content)
    if not json_payload:
        raise HTTPException(status_code=502, detail="Не удалось разобрать ответ генерации маршрута")

    summary = _convert_summary(json_payload.get("summary") or {})
    steps = [_convert_step(item) for item in json_payload.get("steps", [])]

    yandex_url = json_payload.get("yandex_url")
    if not yandex_url:
        coordinates = [step.coordinates for step in steps if step.coordinates]
        if coordinates:
            yandex_url = build_yandex_maps_url(coordinates)

    generated = GeneratedRoute(
        route_id=str(uuid.uuid4()),
        title=json_payload.get("title") or "Маршрут по Москве",
        summary=summary,
        steps=steps,
        yandex_url=yandex_url,
        created_at=datetime.utcnow(),
        raw_response=content,
    )
    return generated


async def ask_agent(request: AgentMessageRequest) -> AgentMessageResponse:
    # Simple cache for common questions
    cache_key = f"{request.message}_{len(request.history or [])}"
    cached = _get_cached_response(cache_key)
    if cached:
        return AgentMessageResponse(reply=cached, created_at=datetime.utcnow())

    messages: List[Dict[str, str]] = [
        {
            "role": "system",
            "content": (
                "Ты — Yanqwip, гид по Москве. Отвечай кратко, точно, по-русски."
                " Фокус на маршрутах, местах, еде, транспорте Москвы."
                " Если вопрос не о Москве — перенаправь на Москву."
                " Задавай 1-2 вопроса если нужно уточнить."
                " Будь полезным, не болтливым."
            ),
        }
    ]

    if request.history:
        for item in request.history[-10:]:
            role = item.role if item.role in {"user", "assistant"} else "user"
            messages.append({"role": role, "content": item.content})

    messages.append({"role": "user", "content": request.message})

    reply_text = await _chat_completion(
        messages, temperature=0.65, max_tokens=600, read_timeout=20.0, retries=3
    )

    # Cache the response for 1 hour
    _cache_response(cache_key, reply_text)

    return AgentMessageResponse(reply=reply_text, created_at=datetime.utcnow())


async def stream_agent_reply(message: str, history: Optional[List[AgentMessage]] = None):
    # Fallback streaming: get full reply then yield chunks as SSE
    req = AgentMessageRequest(message=message, history=history)
    full = await ask_agent(req)
    text = full.reply
    chunk_size = 80
    for i in range(0, len(text), chunk_size):
        yield text[i : i + chunk_size]
