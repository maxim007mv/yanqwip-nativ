"""
Роутер для AI-агента (чат с DeepSeek)
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas
from ..deps import get_current_user, get_db
from ..services import deepseek

router = APIRouter(prefix="/agent", tags=["agent"])


@router.post("/message", response_model=schemas.AgentMessageResponse)
async def agent_message(
    payload: schemas.AgentMessageRequest,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    """Отправить сообщение AI-агенту"""
    reply = await deepseek.ask_agent(payload)

    # Сохраняем историю в БД
    db.add(models.AgentMessage(user_id=user.id, role="user", content=payload.message))
    db.add(models.AgentMessage(user_id=user.id, role="assistant", content=reply.reply))
    db.commit()

    return reply


@router.get("/history")
async def get_agent_history(
    limit: int = 20,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    """Получить историю чата с агентом"""
    messages = db.query(models.AgentMessage)\
        .filter(models.AgentMessage.user_id == user.id)\
        .order_by(models.AgentMessage.created_at.desc())\
        .limit(limit)\
        .all()
    
    return {
        "messages": [
            {
                "id": msg.id,
                "role": msg.role,
                "content": msg.content,
                "created_at": msg.created_at
            }
            for msg in reversed(messages)
        ]
    }
