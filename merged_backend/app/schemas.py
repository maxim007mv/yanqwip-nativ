from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


# =====================================================
# AUTHENTICATION SCHEMAS
# =====================================================

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenRefreshRequest(BaseModel):
    refresh_token: str


class TokenRefreshResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserRead(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None


# =====================================================
# ROUTE SCHEMAS
# =====================================================

class Coordinates(BaseModel):
    lat: float
    lon: float


class RouteStep(BaseModel):
    title: str
    description: str
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    duration_minutes: Optional[int] = None
    address: Optional[str] = None
    website: Optional[str] = None
    coordinates: Optional[Coordinates] = None


class RouteSummary(BaseModel):
    intro: Optional[str] = None
    transport: Optional[str] = None
    budget: Optional[str] = None
    food: Optional[str] = None
    tips: Optional[str] = None
    weather_plan: Optional[str] = None


class RouteGenerateRequest(BaseModel):
    start_time: str
    duration: str
    walk_type: str
    start_point: str
    budget: str
    preferences: str
    activities: str
    food: str
    transport: str
    limitations: str
    context: Optional[str] = None


class GeneratedRoute(BaseModel):
    route_id: str
    title: str
    summary: RouteSummary
    steps: List[RouteStep]
    yandex_url: Optional[str]
    created_at: datetime
    raw_response: str


class RouteSaveRequest(BaseModel):
    title: str
    summary: RouteSummary
    steps: List[RouteStep]
    yandex_url: Optional[str] = None
    deepseek_raw: str


class RouteListItem(BaseModel):
    id: int
    title: str
    created_at: datetime

    class Config:
        from_attributes = True


class RouteDetail(RouteListItem):
    summary: RouteSummary
    steps: List[RouteStep]
    yandex_url: Optional[str]
    raw_response: Optional[str] = None


# =====================================================
# AGENT SCHEMAS
# =====================================================

class AgentMessage(BaseModel):
    role: str
    content: str


class AgentMessageRequest(BaseModel):
    message: str
    history: Optional[List[AgentMessage]] = None


class AgentMessageResponse(BaseModel):
    reply: str
    created_at: datetime


# =====================================================
# PLACES SCHEMAS
# =====================================================

class Place(BaseModel):
    title: str
    address: str
    latitude: float
    longitude: float
    categories: List[str]
    source: str
    distance_m: Optional[int] = None
    external_id: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None


class PlacesQuery(BaseModel):
    query: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
    radius: Optional[int] = Field(default=1500, ge=100, le=10000)
    tags: Optional[List[str]] = None


class PlacesResponse(BaseModel):
    places: List[Place]


# =====================================================
# JOBS SCHEMAS
# =====================================================

class JobCreateResponse(BaseModel):
    job_id: str


class JobStatus(str):
    PENDING = "pending"
    RUNNING = "running"
    DONE = "done"
    ERROR = "error"


class JobStatusResponse(BaseModel):
    status: str
    partial: Optional[bool] = None
    error: Optional[str] = None
    route: Optional[RouteDetail] = None


# =====================================================
# ACHIEVEMENT SCHEMAS
# =====================================================

class AchievementBase(BaseModel):
    title: str
    description: str
    icon: str
    condition_type: str
    condition_value: int
    reward_points: int = 0
    is_active: bool = True


class AchievementCreate(AchievementBase):
    pass


class AchievementRead(AchievementBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class UserAchievementBase(BaseModel):
    achievement_id: int
    current_progress: int = 0
    is_completed: bool = False
    is_accepted: bool = False


class UserAchievementCreate(UserAchievementBase):
    pass


class UserAchievementUpdate(BaseModel):
    current_progress: Optional[int] = None
    is_completed: Optional[bool] = None
    is_accepted: Optional[bool] = None


class UserAchievementRead(BaseModel):
    id: int
    user_id: int
    achievement_id: int
    current_progress: int
    is_completed: bool
    is_accepted: bool
    completed_at: Optional[datetime]
    created_at: datetime
    achievement: AchievementRead

    class Config:
        from_attributes = True


class AchievementProgressResponse(BaseModel):
    achievement: AchievementRead
    user_achievement: Optional[UserAchievementRead]
    progress_percentage: float
    can_accept_challenge: bool
