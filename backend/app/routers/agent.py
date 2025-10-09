from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse
import json

from .. import models, schemas
from ..deps import get_current_user, get_db
from ..services.deepseek import ask_agent, stream_agent_reply

router = APIRouter(prefix="/agent", tags=["agent"])


@router.post("/message", response_model=schemas.AgentMessageResponse)
async def agent_message(
    payload: schemas.AgentMessageRequest,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    reply = await ask_agent(payload)

    db.add(models.AgentMessage(user_id=user.id, role="user", content=payload.message))
    db.add(models.AgentMessage(user_id=user.id, role="assistant", content=reply.reply))
    db.commit()

    return reply


@router.post("/message/stream")
async def agent_message_stream(
    payload: schemas.AgentMessageRequest,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    async def event_gen():
        try:
            async for _ in _async_iter_stream(payload):
                yield _
        except Exception as exc:
            yield f"event: error\ndata: {str(exc)}\n\n"

    return StreamingResponse(event_gen(), media_type="text/event-stream")


async def _async_iter_stream(payload: schemas.AgentMessageRequest):
    history = payload.history or []
    async for chunk in stream_agent_reply(payload.message, history):
        data = json.dumps({"delta": chunk}, ensure_ascii=False)
        yield f"data: {data}\n\n"
    yield "event: done\ndata: [DONE]\n\n"
