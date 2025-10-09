from __future__ import annotations

import asyncio
import json
import logging
import time
from datetime import datetime
from typing import List, Optional

from sqlalchemy.orm import Session

from ..database import SessionLocal
from .. import models, schemas
from . import yandex, overpass, deepseek

logger = logging.getLogger(__name__)


async def process_generation_job(job_id: str) -> None:
    """Background processor for a route generation job."""
    # Each background task must use its own DB session
    db: Session = SessionLocal()
    try:
        job = db.get(models.GenerationJob, job_id)
        if not job:
            return
        job.status = "running"
        job.updated_at = datetime.utcnow()
        db.commit()

        # Load payload
        payload_dict = json.loads(job.payload_json or "{}")
        request = schemas.RouteGenerateRequest(**payload_dict)

        # 1) Geocode start_point for candidates
        t0 = time.perf_counter()
        coords = await yandex.geocode_address(request.start_point)
        t1 = time.perf_counter()
        logger.info(f"[job {job_id}] geocode {request.start_point!r}: {(t1-t0)*1000:.0f} ms")

        candidates: List[schemas.Place] = []
        if coords:
            y0 = time.perf_counter()
            primary = await yandex.search_places(
                query=None,
                lat=coords.lat,
                lon=coords.lon,
                radius=1500,
                tags=["cafe", "park", "museum"],
                limit=12,
            )
            y1 = time.perf_counter()
            logger.info(f"[job {job_id}] yandex places: {(y1-y0)*1000:.0f} ms -> {len(primary)}")

            o0 = time.perf_counter()
            fallback = await overpass.fetch_places(
                lat=coords.lat, lon=coords.lon, radius=1500, tags=["cafe", "park", "museum"], limit=12
            )
            o1 = time.perf_counter()
            logger.info(f"[job {job_id}] overpass: {(o1-o0)*1000:.0f} ms -> {len(fallback)}")

            # merge unique
            seen = {(p.latitude, p.longitude) for p in primary}
            for p in fallback:
                if (p.latitude, p.longitude) not in seen:
                    primary.append(p)
            candidates = primary

        # 2) Ask DeepSeek for full route
        success = True
        error_message: Optional[str] = None
        partial = False
        try:
            d0 = time.perf_counter()
            generated = await deepseek.generate_route(request)
            d1 = time.perf_counter()
            logger.info(f"[job {job_id}] deepseek route: {(d1-d0)*1000:.0f} ms, steps={len(generated.steps)}")
        except Exception as exc:  # noqa: BLE001
            success = False
            partial = True
            error_message = str(exc)
            logger.warning(f"[job {job_id}] deepseek failed: {error_message}")
            generated = await _fallback_route(request, coords, candidates)

        # 3) Persist route in DB
        route = models.Route(
            user_id=job.user_id,
            title=generated.title,
            summary=generated.summary.model_dump_json(),
            steps_json=json.dumps([s.model_dump() for s in generated.steps], ensure_ascii=False),
            deepseek_response=generated.raw_response,
            yandex_url=generated.yandex_url,
        )
        db.add(route)
        db.commit()
        db.refresh(route)

        # 4) Update job
        job.status = "done" if success or partial else "error"
        job.partial = partial
        job.error_message = error_message
        job.route_id = route.id
        job.updated_at = datetime.utcnow()
        db.commit()
    except Exception as exc:  # noqa: BLE001
        logger.exception(f"[job {job_id}] unexpected failure: {exc}")
        job = db.get(models.GenerationJob, job_id)
        if job:
            job.status = "error"
            job.error_message = str(exc)
            job.updated_at = datetime.utcnow()
            db.commit()
    finally:
        db.close()


async def _fallback_route(
    req: schemas.RouteGenerateRequest,
    coords: Optional[schemas.Coordinates],
    candidates: List[schemas.Place],
) -> schemas.GeneratedRoute:
    # Make a simple 3-4 step route from candidates
    steps: List[schemas.RouteStep] = []
    for idx, p in enumerate(candidates[:4]):
        steps.append(
            schemas.RouteStep(
                title=p.title,
                description=p.description or "Подойдёт для короткой остановки.",
                duration_minutes=45,
                address=p.address,
                website=p.website,
                coordinates=schemas.Coordinates(lat=p.latitude, lon=p.longitude),
            )
        )

    y_url = None
    coords_list = [s.coordinates for s in steps if s.coordinates]
    if coords_list:
        y_url = yandex.build_yandex_maps_url(coords_list) or None

    return schemas.GeneratedRoute(
        route_id="fallback",
        title="Базовый маршрут поблизости",
        summary=schemas.RouteSummary(
            intro="Пока готовим персональный маршрут, предлагаем близкие точки.",
            transport=req.transport,
        ),
        steps=steps,
        yandex_url=y_url,
        created_at=datetime.utcnow(),
        raw_response="fallback",
    )

