"""
Роутер для работы с местами из PostgreSQL БД
Использует SQLAlchemy ORM для работы с таблицами places
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func

from ..deps import get_db, get_current_user
from .. import models

router = APIRouter(prefix="/places", tags=["places"])


@router.get("/search")
async def search_places(
    query: Optional[str] = Query(None, description="Поисковый запрос"),
    place_type_id: Optional[int] = Query(None, description="ID типа места"),
    price_category_id: Optional[int] = Query(None, description="ID ценовой категории"),
    lat: Optional[float] = Query(None, description="Широта для поиска поблизости"),
    lon: Optional[float] = Query(None, description="Долгота для поиска поблизости"),
    radius_km: float = Query(5.0, ge=0.1, le=50, description="Радиус поиска в км"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """Поиск мест в базе данных с различными фильтрами"""
    query_obj = db.query(models.Place).filter(models.Place.is_active == True)
    
    if place_type_id:
        query_obj = query_obj.filter(models.Place.place_type_id == place_type_id)
    
    if price_category_id:
        query_obj = query_obj.filter(models.Place.price_category_id == price_category_id)
    
    if query:
        search_pattern = f"%{query}%"
        query_obj = query_obj.filter(
            or_(
                models.Place.name.ilike(search_pattern),
                models.Place.description.ilike(search_pattern),
                models.Place.address.ilike(search_pattern)
            )
        )
    
    if lat is not None and lon is not None:
        lat_delta = radius_km / 111.0
        lon_delta = radius_km / (111.0 * abs(func.cos(func.radians(lat))))
        
        query_obj = query_obj.filter(
            and_(
                models.Place.latitude >= lat - lat_delta,
                models.Place.latitude <= lat + lat_delta,
                models.Place.longitude >= lon - lon_delta,
                models.Place.longitude <= lon + lon_delta
            )
        )
    
    total = query_obj.count()
    places = query_obj.offset(offset).limit(limit).all()
    
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "places": [
            {
                "place_id": p.place_id,
                "name": p.name,
                "address": p.address,
                "description": p.description,
                "latitude": float(p.latitude),
                "longitude": float(p.longitude),
                "phone": p.phone,
                "website": p.website,
                "opening_hours": p.opening_hours,
                "place_type_id": p.place_type_id,
                "price_category_id": p.price_category_id,
            }
            for p in places
        ]
    }


@router.get("/{place_id}")
async def get_place_details(
    place_id: int,
    db: Session = Depends(get_db),
):
    """Получить детальную информацию о месте по ID"""
    place = db.query(models.Place).filter(models.Place.place_id == place_id).first()
    
    if not place:
        raise HTTPException(status_code=404, detail="Место не найдено")
    
    return {
        "place_id": place.place_id,
        "name": place.name,
        "address": place.address,
        "description": place.description,
        "latitude": float(place.latitude),
        "longitude": float(place.longitude),
        "phone": place.phone,
        "website": place.website,
        "opening_hours": place.opening_hours,
        "place_type": {
            "id": place.place_type.place_type_id,
            "name": place.place_type.type_name,
            "code": place.place_type.type_code
        } if place.place_type else None,
        "price_category": {
            "id": place.price_category.price_category_id,
            "name": place.price_category.price_category_name
        } if place.price_category else None,
    }


@router.get("/types/list")
async def get_place_types(db: Session = Depends(get_db)):
    """Получить список всех типов мест"""
    types = db.query(models.PlaceType).all()
    return {
        "types": [
            {
                "place_type_id": t.place_type_id,
                "type_name": t.type_name,
                "type_code": t.type_code,
                "description": t.description
            }
            for t in types
        ]
    }


@router.get("/cuisines/list")
async def get_cuisines(db: Session = Depends(get_db)):
    """Получить список всех типов кухонь"""
    cuisines = db.query(models.Cuisine).all()
    return {
        "cuisines": [
            {
                "cuisine_id": c.cuisine_id,
                "cuisine_name": c.cuisine_name,
                "cuisine_code": c.cuisine_code
            }
            for c in cuisines
        ]
    }


@router.get("/amenities/list")
async def get_amenities(db: Session = Depends(get_db)):
    """Получить список всех удобств"""
    amenities = db.query(models.Amenity).all()
    return {
        "amenities": [
            {
                "amenity_id": a.amenity_id,
                "amenity_name": a.amenity_name,
                "amenity_type": a.amenity_type,
                "description": a.description
            }
            for a in amenities
        ]
    }


# =====================================================
# ИЗБРАННОЕ (использует существующую таблицу user_favorites)
# =====================================================

@router.post("/{place_id}/favorite", status_code=status.HTTP_201_CREATED)
async def add_to_favorites(
    place_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    """Добавить место в избранное"""
    # Проверяем, существует ли место
    place = db.query(models.Place).filter(models.Place.place_id == place_id).first()
    if not place:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Место не найдено")
    
    # Проверяем, не добавлено ли уже в избранное
    existing = db.query(models.UserFavorite).filter(
        models.UserFavorite.user_id == user.id,
        models.UserFavorite.place_id == place_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Место уже в избранном"
        )
    
    # Добавляем в избранное
    favorite = models.UserFavorite(user_id=user.id, place_id=place_id)
    db.add(favorite)
    db.commit()
    
    return {"message": "Место добавлено в избранное"}


@router.delete("/{place_id}/favorite", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_favorites(
    place_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    """Удалить место из избранного"""
    favorite = db.query(models.UserFavorite).filter(
        models.UserFavorite.user_id == user.id,
        models.UserFavorite.place_id == place_id
    ).first()
    
    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Место не найдено в избранном"
        )
    
    # Удаляем запись из базы данных
    db.delete(favorite)
    db.flush()  # Применяем изменения в транзакции
    db.commit()  # Коммитим транзакцию
    
    return None


@router.get("/favorites/ids")
async def get_favorite_place_ids(
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    """Получить список ID избранных мест пользователя"""
    favorites = db.query(models.UserFavorite).filter(
        models.UserFavorite.user_id == user.id
    ).all()
    
    return {
        "place_ids": [f.place_id for f in favorites]
    }
