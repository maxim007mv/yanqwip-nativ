"""
Объединённые модели для Yanqwip Backend
Включает пользователей (из old_backend) + места (из old_backend/models_places)
"""
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, Numeric, BigInteger
from sqlalchemy.orm import relationship

from .database import Base


# =====================================================
# МОДЕЛИ ПОЛЬЗОВАТЕЛЕЙ И АВТОРИЗАЦИИ (из old_backend)
# =====================================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    routes = relationship("Route", back_populates="owner", cascade="all, delete-orphan")
    refresh_tokens = relationship("RefreshToken", back_populates="owner", cascade="all, delete-orphan")
    agent_messages = relationship("AgentMessage", back_populates="owner")
    generation_jobs = relationship("GenerationJob", back_populates="owner")
    favorite_places = relationship("UserFavorite", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")


class Route(Base):
    __tablename__ = "routes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=True)
    steps_json = Column(Text, nullable=False)
    deepseek_response = Column(Text, nullable=True)
    yandex_url = Column(String(512), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    owner = relationship("User", back_populates="routes")


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)
    token_hash = Column(String(128), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    owner = relationship("User", back_populates="refresh_tokens")


class AgentMessage(Base):
    __tablename__ = "agent_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(32), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    owner = relationship("User", back_populates="agent_messages")


class GenerationJob(Base):
    __tablename__ = "generation_jobs"

    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    status = Column(String(32), nullable=False, index=True)  # pending, running, done, error
    error_message = Column(Text, nullable=True)
    partial = Column(Boolean, default=False, nullable=False)
    route_id = Column(Integer, ForeignKey("routes.id", ondelete="SET NULL"), nullable=True)
    payload_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    owner = relationship("User", back_populates="generation_jobs")
    route = relationship("Route")


# =====================================================
# МОДЕЛИ МЕСТ (из old_backend/models_places.py)
# =====================================================

class PlaceType(Base):
    __tablename__ = "place_types"

    place_type_id = Column(Integer, primary_key=True, index=True)
    type_name = Column(String(50), nullable=False)
    type_code = Column(String(20))
    description = Column(Text)

    places = relationship("Place", back_populates="place_type")


class PriceCategory(Base):
    __tablename__ = "price_categories"

    price_category_id = Column(Integer, primary_key=True, index=True)
    price_category_name = Column(String(50), nullable=False)

    places = relationship("Place", back_populates="price_category")


class Place(Base):
    __tablename__ = "places"

    place_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    address = Column(Text)
    description = Column(Text)
    latitude = Column(Numeric(10, 7), nullable=False)
    longitude = Column(Numeric(10, 7), nullable=False)
    phone = Column(String(50))
    website = Column(String(500))
    opening_hours = Column(Text)
    place_type_id = Column(Integer, ForeignKey("place_types.place_type_id"), nullable=False)
    price_category_id = Column(Integer, ForeignKey("price_categories.price_category_id"))
    is_active = Column(Boolean, default=True)
    osm_type = Column(String(20))
    osm_id = Column(BigInteger)
    access_type = Column(String(20))

    place_type = relationship("PlaceType", back_populates="places")
    price_category = relationship("PriceCategory", back_populates="places")
    reviews = relationship("PlaceReview", back_populates="place")
    photos = relationship("PlacePhoto", back_populates="place")
    amenities = relationship("PlaceAmenity", back_populates="place")
    cuisines = relationship("PlaceCuisine", back_populates="place")
    sports = relationship("PlaceSport", back_populates="place")
    tags = relationship("PlaceTag", back_populates="place")
    natural_features = relationship("PlaceNaturalFeature", back_populates="place")
    user_favorites = relationship("UserFavorite", back_populates="place", cascade="all, delete-orphan")


class PlaceReview(Base):
    __tablename__ = "place_reviews"

    review_id = Column(Integer, primary_key=True, index=True)
    place_id = Column(Integer, ForeignKey("places.place_id"), nullable=False)
    rating = Column(Integer, nullable=False)
    review_text = Column(Text)
    author_name = Column(String(100))

    place = relationship("Place", back_populates="reviews")


class PlacePhoto(Base):
    __tablename__ = "place_photos"

    photo_id = Column(Integer, primary_key=True, index=True)
    place_id = Column(Integer, ForeignKey("places.place_id"), nullable=False)
    photo_url = Column(String(500), nullable=False)
    description = Column(Text)

    place = relationship("Place", back_populates="photos")


class Amenity(Base):
    __tablename__ = "amenities"

    amenity_id = Column(Integer, primary_key=True, index=True)
    amenity_name = Column(String(50), nullable=False)
    amenity_type = Column(String(30))
    description = Column(Text)

    place_amenities = relationship("PlaceAmenity", back_populates="amenity")


class PlaceAmenity(Base):
    __tablename__ = "place_amenities"

    place_amenity_id = Column(Integer, primary_key=True, index=True)
    place_id = Column(Integer, ForeignKey("places.place_id"), nullable=False)
    amenity_id = Column(Integer, ForeignKey("amenities.amenity_id"), nullable=False)
    amenity_value = Column(String(50), default="yes")

    place = relationship("Place", back_populates="amenities")
    amenity = relationship("Amenity", back_populates="place_amenities")


class Cuisine(Base):
    __tablename__ = "cuisines"

    cuisine_id = Column(Integer, primary_key=True, index=True)
    cuisine_name = Column(String(100), nullable=False)
    cuisine_code = Column(String(50))

    place_cuisines = relationship("PlaceCuisine", back_populates="cuisine")


class PlaceCuisine(Base):
    __tablename__ = "place_cuisines"

    place_cuisine_id = Column(Integer, primary_key=True, index=True)
    place_id = Column(Integer, ForeignKey("places.place_id"), nullable=False)
    cuisine_id = Column(Integer, ForeignKey("cuisines.cuisine_id"), nullable=False)
    is_main = Column(Boolean, default=False)

    place = relationship("Place", back_populates="cuisines")
    cuisine = relationship("Cuisine", back_populates="place_cuisines")


class Sport(Base):
    __tablename__ = "sports"

    sport_id = Column(Integer, primary_key=True, index=True)
    sport_name = Column(String(50), nullable=False)
    sport_code = Column(String(30))

    place_sports = relationship("PlaceSport", back_populates="sport")


class PlaceSport(Base):
    __tablename__ = "place_sports"

    place_sport_id = Column(Integer, primary_key=True, index=True)
    place_id = Column(Integer, ForeignKey("places.place_id"), nullable=False)
    sport_id = Column(Integer, ForeignKey("sports.sport_id"), nullable=False)

    place = relationship("Place", back_populates="sports")
    sport = relationship("Sport", back_populates="place_sports")


class Tag(Base):
    __tablename__ = "tags"

    tag_id = Column(Integer, primary_key=True, index=True)
    tag_name = Column(String(50), nullable=False)
    tag_code = Column(String(50))

    place_tags = relationship("PlaceTag", back_populates="tag")


class PlaceTag(Base):
    __tablename__ = "place_tags"

    place_tag_id = Column(Integer, primary_key=True, index=True)
    place_id = Column(Integer, ForeignKey("places.place_id"), nullable=False)
    tag_id = Column(Integer, ForeignKey("tags.tag_id"), nullable=False)
    tag_value = Column(String(100))

    place = relationship("Place", back_populates="tags")
    tag = relationship("Tag", back_populates="place_tags")


class NaturalFeature(Base):
    __tablename__ = "natural_features"

    feature_id = Column(Integer, primary_key=True, index=True)
    feature_type = Column(String(50), nullable=False)
    feature_name = Column(String(50), nullable=False)

    place_features = relationship("PlaceNaturalFeature", back_populates="feature")


class PlaceNaturalFeature(Base):
    __tablename__ = "place_natural_features"

    place_feature_id = Column(Integer, primary_key=True, index=True)
    place_id = Column(Integer, ForeignKey("places.place_id"), nullable=False)
    feature_id = Column(Integer, ForeignKey("natural_features.feature_id"), nullable=False)

    place = relationship("Place", back_populates="natural_features")
    feature = relationship("NaturalFeature", back_populates="place_features")


# =====================================================
# МОДЕЛЬ ИЗБРАННОГО (использует существующую таблицу user_favorites)
# =====================================================

class UserFavorite(Base):
    __tablename__ = "user_favorites"
    
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, primary_key=True)
    place_id = Column(Integer, ForeignKey("places.place_id", ondelete="CASCADE"), nullable=False, primary_key=True)
    created_at = Column(DateTime(timezone=True), server_default="CURRENT_TIMESTAMP", nullable=True)
    
    user = relationship("User", back_populates="favorite_places")
    place = relationship("Place", back_populates="user_favorites")


# =====================================================
# МОДЕЛИ ДОСТИЖЕНИЙ
# =====================================================

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String(50), nullable=False)  # Эмодзи или название иконки
    condition_type = Column(String(100), nullable=False)  # Тип условия (routes_count, places_count, etc.)
    condition_value = Column(Integer, nullable=False)  # Значение для выполнения
    reward_points = Column(Integer, default=0)  # Очки за выполнение
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user_achievements = relationship("UserAchievement", back_populates="achievement", cascade="all, delete-orphan")


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id", ondelete="CASCADE"), nullable=False)
    current_progress = Column(Integer, default=0)  # Текущий прогресс
    is_completed = Column(Boolean, default=False)  # Выполнено ли достижение
    is_accepted = Column(Boolean, default=False)  # Принял ли пользователь вызов
    completed_at = Column(DateTime, nullable=True)  # Когда выполнено
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")

    __table_args__ = (
        {"schema": None},
    )
