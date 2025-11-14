from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Achievement, UserAchievement, User
from ..schemas import (
    AchievementRead,
    UserAchievementRead,
    UserAchievementUpdate,
    AchievementProgressResponse
)
from ..deps import get_current_user

router = APIRouter(prefix="/achievements", tags=["achievements"])


@router.get("/", response_model=List[AchievementProgressResponse])
async def get_user_achievements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Получить все достижения пользователя с прогрессом"""
    achievements = db.query(Achievement).filter(Achievement.is_active == True).all()

    result = []
    for achievement in achievements:
        user_achievement = db.query(UserAchievement).filter(
            UserAchievement.user_id == current_user.id,
            UserAchievement.achievement_id == achievement.id
        ).first()

        if not user_achievement:
            # Создаем запись для нового достижения
            user_achievement = UserAchievement(
                user_id=current_user.id,
                achievement_id=achievement.id,
                current_progress=0,
                is_completed=False,
                is_accepted=False
            )
            db.add(user_achievement)
            db.commit()
            db.refresh(user_achievement)

        progress_percentage = min(
            (user_achievement.current_progress / achievement.condition_value) * 100,
            100
        ) if achievement.condition_value > 0 else 0

        can_accept_challenge = not user_achievement.is_accepted and not user_achievement.is_completed

        result.append(AchievementProgressResponse(
            achievement=AchievementRead.from_orm(achievement),
            user_achievement=UserAchievementRead.from_orm(user_achievement),
            progress_percentage=progress_percentage,
            can_accept_challenge=can_accept_challenge
        ))

    return result


@router.post("/{achievement_id}/accept")
async def accept_achievement_challenge(
    achievement_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Принять вызов достижения"""
    achievement = db.query(Achievement).filter(Achievement.id == achievement_id).first()
    if not achievement:
        raise HTTPException(status_code=404, detail="Достижение не найдено")

    user_achievement = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user.id,
        UserAchievement.achievement_id == achievement_id
    ).first()

    if not user_achievement:
        user_achievement = UserAchievement(
            user_id=current_user.id,
            achievement_id=achievement_id,
            current_progress=0,
            is_completed=False,
            is_accepted=True
        )
        db.add(user_achievement)
    else:
        if user_achievement.is_completed:
            raise HTTPException(status_code=400, detail="Достижение уже выполнено")
        user_achievement.is_accepted = True

    db.commit()
    return {"message": "Вызов принят"}


@router.put("/{achievement_id}/progress")
async def update_achievement_progress(
    achievement_id: int,
    update_data: UserAchievementUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Обновить прогресс достижения (для системных обновлений)"""
    user_achievement = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user.id,
        UserAchievement.achievement_id == achievement_id
    ).first()

    if not user_achievement:
        raise HTTPException(status_code=404, detail="Достижение не найдено для пользователя")

    # Обновляем только разрешенные поля
    if update_data.current_progress is not None:
        user_achievement.current_progress = update_data.current_progress

    if update_data.is_completed is not None:
        user_achievement.is_completed = update_data.is_completed
        if update_data.is_completed and not user_achievement.completed_at:
            user_achievement.completed_at = datetime.utcnow()

    if update_data.is_accepted is not None:
        user_achievement.is_accepted = update_data.is_accepted

    db.commit()
    db.refresh(user_achievement)

    return UserAchievementRead.from_orm(user_achievement)


@router.get("/{achievement_id}", response_model=AchievementProgressResponse)
async def get_achievement_detail(
    achievement_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Получить подробную информацию о достижении"""
    achievement = db.query(Achievement).filter(Achievement.id == achievement_id).first()
    if not achievement:
        raise HTTPException(status_code=404, detail="Достижение не найдено")

    user_achievement = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user.id,
        UserAchievement.achievement_id == achievement_id
    ).first()

    if not user_achievement:
        user_achievement = UserAchievement(
            user_id=current_user.id,
            achievement_id=achievement_id,
            current_progress=0,
            is_completed=False,
            is_accepted=False
        )
        db.add(user_achievement)
        db.commit()
        db.refresh(user_achievement)

    progress_percentage = min(
        (user_achievement.current_progress / achievement.condition_value) * 100,
        100
    ) if achievement.condition_value > 0 else 0

    can_accept_challenge = not user_achievement.is_accepted and not user_achievement.is_completed

    return AchievementProgressResponse(
        achievement=AchievementRead.from_orm(achievement),
        user_achievement=UserAchievementRead.from_orm(user_achievement),
        progress_percentage=progress_percentage,
        can_accept_challenge=can_accept_challenge
    )