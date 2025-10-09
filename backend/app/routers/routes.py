from __future__ import annotations

import asyncio
import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..deps import get_current_user, get_db
from ..services.generator import process_generation_job

router = APIRouter(prefix="/routes", tags=["routes"])


@router.post("/generate", response_model=schemas.JobCreateResponse)
async def create_generation_job(
    request: schemas.RouteGenerateRequest,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    job_id = str(__import__("uuid").uuid4())
    job = models.GenerationJob(
        id=job_id,
        user_id=user.id,
        status="pending",
        payload_json=request.model_dump_json(),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(job)
    db.commit()

    # Schedule async background task on the current running loop
    asyncio.create_task(process_generation_job(job_id))
    return schemas.JobCreateResponse(job_id=job_id)


@router.get("/generate/{job_id}", response_model=schemas.JobStatusResponse)
def get_generation_status(job_id: str, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    job = db.get(models.GenerationJob, job_id)
    if not job or job.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Задача не найдена")

    if job.status != "done" or not job.route_id:
        return schemas.JobStatusResponse(status=job.status, partial=job.partial, error=job.error_message)

    route = db.get(models.Route, job.route_id)
    if not route:
        return schemas.JobStatusResponse(status="error", error="Результат маршрута отсутствует")

    summary_data = json.loads(route.summary) if route.summary else {}
    steps_data = json.loads(route.steps_json) if route.steps_json else []
    summary = schemas.RouteSummary(**summary_data)
    steps = [schemas.RouteStep(**s) for s in steps_data]
    detail = schemas.RouteDetail(
        id=route.id,
        title=route.title,
        created_at=route.created_at,
        summary=summary,
        steps=steps,
        yandex_url=route.yandex_url,
        raw_response=route.deepseek_response,
    )
    return schemas.JobStatusResponse(status="done", partial=job.partial, route=detail)


@router.post("/save", response_model=schemas.RouteDetail, status_code=status.HTTP_201_CREATED)
def save_route(
    payload: schemas.RouteSaveRequest,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    summary_json = payload.summary.model_dump_json()
    steps_json = json.dumps([step.model_dump() for step in payload.steps], ensure_ascii=False)

    route = models.Route(
        user_id=user.id,
        title=payload.title,
        summary=summary_json,
        steps_json=steps_json,
        yandex_url=payload.yandex_url,
        deepseek_response=payload.deepseek_raw,
    )
    db.add(route)
    db.commit()
    db.refresh(route)

    return schemas.RouteDetail(
        id=route.id,
        title=route.title,
        created_at=route.created_at,
        summary=payload.summary,
        steps=payload.steps,
        yandex_url=payload.yandex_url,
        raw_response=payload.deepseek_raw,
    )


@router.get("/user", response_model=list[schemas.RouteListItem])
def list_user_routes(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    routes = db.execute(
        select(models.Route).where(models.Route.user_id == user.id).order_by(models.Route.created_at.desc())
    ).scalars().all()
    return [
        schemas.RouteListItem(id=item.id, title=item.title, created_at=item.created_at)
        for item in routes
    ]


@router.get("/{route_id}", response_model=schemas.RouteDetail)
def get_route(route_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    route = db.get(models.Route, route_id)
    if not route or route.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Маршрут не найден")

    summary_data = json.loads(route.summary) if route.summary else {}
    steps_data = json.loads(route.steps_json) if route.steps_json else []

    summary = schemas.RouteSummary(**summary_data)
    steps = [schemas.RouteStep(**step) for step in steps_data]

    return schemas.RouteDetail(
        id=route.id,
        title=route.title,
        created_at=route.created_at,
        summary=summary,
        steps=steps,
        yandex_url=route.yandex_url,
        raw_response=route.deepseek_response,
    )
