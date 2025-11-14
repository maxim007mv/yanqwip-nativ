"""
Роутер для генерации и управления маршрутами
Использует DeepSeek AI для генерации + работу с БД мест
"""
from __future__ import annotations

import json
import uuid
import asyncio
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..deps import get_current_user, get_current_user_optional, get_db
from ..services import deepseek

router = APIRouter(prefix="/routes", tags=["routes"])


async def background_generate_route(
    job_id: str,
    request: schemas.RouteGenerateRequest,
    db: Session
):
    """Фоновая генерация маршрута"""
    try:
        # Обновляем статус на running
        job = db.get(models.GenerationJob, job_id)
        if job:
            job.status = "running"
            job.updated_at = datetime.utcnow()
            db.commit()
        
        print(f"🤖 [{job_id}] Начало генерации маршрута...")
        generated = await deepseek.generate_route(request)
        print(f"✅ [{job_id}] Маршрут сгенерирован: {generated.title}")
        
        # Сохраняем результат
        if job:
            result_json = generated.model_dump_json()
            job.status = "done"
            job.payload_json = result_json
            job.updated_at = datetime.utcnow()
            db.commit()
            print(f"✅ [{job_id}] Результат сохранен в БД")
    except Exception as e:
        print(f"❌ [{job_id}] Ошибка генерации: {str(e)}")
        import traceback
        traceback.print_exc()
        
        # Сохраняем ошибку
        job = db.get(models.GenerationJob, job_id)
        if job:
            job.status = "error"
            job.error_message = str(e)
            job.updated_at = datetime.utcnow()
            db.commit()


@router.post("/generate/start", response_model=dict)
async def start_route_generation(
    request: schemas.RouteGenerateRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user: Optional[models.User] = Depends(get_current_user_optional),
):
    """Запуск генерации маршрута (асинхронно)"""
    print(f"🚀 Получен запрос на генерацию маршрута")
    print(f"📝 Параметры: {request.model_dump()}")
    
    # Создаем задачу в БД
    job_id = str(uuid.uuid4())
    job = models.GenerationJob(
        id=job_id,
        user_id=user.id if user else None,
        status="pending",
        payload_json=request.model_dump_json()
    )
    db.add(job)
    db.commit()
    
    print(f"📋 Создана задача: {job_id}")
    
    # Запускаем генерацию в фоне
    background_tasks.add_task(background_generate_route, job_id, request, db)
    
    return {
        "job_id": job_id,
        "status": "pending",
        "message": "Генерация маршрута началась"
    }


@router.get("/generate/status/{job_id}", response_model=dict)
def get_generation_status(
    job_id: str,
    db: Session = Depends(get_db),
    user: Optional[models.User] = Depends(get_current_user_optional),
):
    """Проверка статуса генерации"""
    job = db.get(models.GenerationJob, job_id)
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Задача не найдена"
        )
    
    # Проверка прав доступа
    if user and job.user_id and job.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нет доступа к этой задаче"
        )
    
    response = {
        "job_id": job.id,
        "status": job.status,
        "created_at": job.created_at.isoformat(),
        "updated_at": job.updated_at.isoformat()
    }
    
    if job.status == "done" and job.payload_json:
        response["result"] = json.loads(job.payload_json)
    elif job.status == "error" and job.error_message:
        response["error"] = job.error_message
    
    return response


@router.post("/generate", response_model=schemas.GeneratedRoute)
async def generate_route(
    request: schemas.RouteGenerateRequest,
    db: Session = Depends(get_db),
    user: Optional[models.User] = Depends(get_current_user_optional),
):
    """Генерация маршрута с помощью DeepSeek AI (старый синхронный метод)"""
    print(f"🚀 Получен запрос на генерацию маршрута")
    print(f"📝 Параметры: {request.model_dump()}")
    
    try:
        print("🤖 Вызов DeepSeek API...")
        generated = await deepseek.generate_route(request)
        print(f"✅ Маршрут сгенерирован: {generated.title}")
        return generated
    except Exception as e:
        print(f"❌ Ошибка генерации: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при генерации маршрута: {str(e)}"
        )


@router.post("/save", response_model=schemas.RouteDetail, status_code=status.HTTP_201_CREATED)
def save_route(
    payload: schemas.RouteSaveRequest,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    """Сохранение маршрута в БД"""
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
    """Получить список маршрутов пользователя"""
    routes = db.execute(
        select(models.Route).where(models.Route.user_id == user.id).order_by(models.Route.created_at.desc())
    ).scalars().all()
    return [
        schemas.RouteListItem(id=item.id, title=item.title, created_at=item.created_at)
        for item in routes
    ]


@router.get("/{route_id}", response_model=schemas.RouteDetail)
def get_route(route_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    """Получить маршрут по ID"""
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


@router.delete("/{route_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_route(route_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    """Удалить маршрут"""
    route = db.get(models.Route, route_id)
    if not route or route.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Маршрут не найден")
    
    db.delete(route)
    db.commit()
    return None
