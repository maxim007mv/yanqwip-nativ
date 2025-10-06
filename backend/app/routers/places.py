from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, Query

from .. import models, schemas
from ..deps import get_current_user
from ..services import overpass, yandex

router = APIRouter(prefix="/places", tags=["places"])


@router.get("", response_model=schemas.PlacesResponse)
async def search_places(
    query: Optional[str] = Query(default=None, description="Строка поиска"),
    lat: Optional[float] = Query(default=None, description="Широта пользователя"),
    lon: Optional[float] = Query(default=None, description="Долгота пользователя"),
    radius: int = Query(default=1500, ge=100, le=10000),
    tags: Optional[str] = Query(default=None, description="Список тегов через запятую"),
    user: models.User = Depends(get_current_user),
):
    _ = user
    tags_list: Optional[List[str]] = [tag.strip() for tag in tags.split(",") if tag.strip()] if tags else None

    primary = await yandex.search_places(query=query, lat=lat, lon=lon, radius=radius, tags=tags_list)

    if lat is not None and lon is not None and tags_list:
        fallback = await overpass.fetch_places(lat=lat, lon=lon, radius=radius, tags=tags_list)
        existing = {(place.latitude, place.longitude) for place in primary}
        for place in fallback:
            if (place.latitude, place.longitude) not in existing:
                primary.append(place)

    return schemas.PlacesResponse(places=primary[:40])

