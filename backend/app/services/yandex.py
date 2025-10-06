from __future__ import annotations

import math
from typing import Iterable, List, Optional

import httpx
import time
import logging

from ..config import settings
from ..schemas import Coordinates, Place


async def geocode_address(address: str) -> Optional[Coordinates]:
    started = time.perf_counter()
    params = {
        "apikey": settings.yandex_api_key,
        "geocode": address,
        "format": "json",
        "results": 1,
        "lang": "ru_RU",
    }

    async with httpx.AsyncClient(timeout=httpx.Timeout(connect=5.0, read=15.0, write=15.0, pool=5.0)) as client:
        response = await client.get(settings.yandex_geocode_base_url, params=params)

    if response.status_code != 200:
        return None

    data = response.json()
    members = data.get("response", {}).get("GeoObjectCollection", {}).get("featureMember", [])
    if not members:
        return None

    point = members[0]["GeoObject"]["Point"]["pos"].split()
    lon, lat = float(point[0]), float(point[1])
    elapsed = (time.perf_counter() - started) * 1000
    logging.getLogger(__name__).info(f"Yandex geocode time: {elapsed:.0f} ms")
    return Coordinates(lat=lat, lon=lon)


def build_yandex_maps_url(points: Iterable[Coordinates]) -> Optional[str]:
    coords = list(points)
    if len(coords) < 2:
        return None
    segments = [f"{c.lat},{c.lon}" for c in coords]
    joined = "~".join(segments)
    return f"https://yandex.ru/maps/?rtext={joined}&rtt=pd"


async def search_places(
    *,
    query: Optional[str],
    lat: Optional[float],
    lon: Optional[float],
    radius: int,
    tags: Optional[List[str]],
    limit: int = 20,
) -> List[Place]:
    params = {
        "apikey": settings.yandex_api_key,
        "lang": "ru_RU",
        "results": str(limit),
        "type": "biz",
    }

    if query:
        params["text"] = query
    elif tags:
        params["text"] = ", ".join(tags)
    else:
        params["text"] = "достопримечательности Москвы"

    if lat is not None and lon is not None:
        params["ll"] = f"{lon},{lat}"
        # Переводим радиус в километры для spn (грубая оценка)
        delta = max(radius / 111000.0, 0.01)
        params["spn"] = f"{delta:.4f},{delta:.4f}"

    started = time.perf_counter()
    async with httpx.AsyncClient(timeout=httpx.Timeout(connect=5.0, read=20.0, write=20.0, pool=5.0)) as client:
        response = await client.get(settings.yandex_places_search_url, params=params)

    if response.status_code != 200:
        return []

    data = response.json()
    features = data.get("features", [])
    places: List[Place] = []
    for feature in features:
        properties = feature.get("properties", {})
        geometry = feature.get("geometry", {})
        coords = geometry.get("coordinates", [None, None])
        lon_value, lat_value = coords if len(coords) == 2 else (None, None)
        if lon_value is None or lat_value is None:
            continue

        meta = properties.get("CompanyMetaData", {})
        categories = [cat.get("class") or cat.get("name") for cat in meta.get("Categories", []) if isinstance(cat, dict)]
        address = meta.get("address") or properties.get("description") or "Москва"
        website = None
        if meta.get("url"):
            website = meta["url"]
        elif meta.get("Links"):
            links = meta["Links"]
            if isinstance(links, list) and links:
                website = links[0].get("href")

        distance = None
        if lat is not None and lon is not None:
            distance = int(_haversine(lat, lon, lat_value, lon_value))

        places.append(
            Place(
                title=properties.get("name") or "Неизвестное место",
                address=address,
                latitude=lat_value,
                longitude=lon_value,
                categories=[cat for cat in categories if cat] or ["place"],
                source="yandex",
                website=website,
                distance_m=distance,
                external_id=properties.get("CompanyMetaData", {}).get("id"),
                description=meta.get("BriefInfo", {}).get("text"),
            )
        )

    elapsed = (time.perf_counter() - started) * 1000
    logging.getLogger(__name__).info(f"Yandex search time: {elapsed:.0f} ms, results={len(places)}")
    return places


def _haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    radius = 6371000.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)
    a = math.sin(d_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return radius * c
