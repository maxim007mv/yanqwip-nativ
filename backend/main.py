"""
Yanqwip Backend - FastAPI
Минимальный рабочий backend для тестирования frontend
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(title="Yanqwip API", version="1.0.0")

# CORS для разработки
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class User(BaseModel):
    id: str
    name: str
    email: str
    avatar: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class AuthResponse(BaseModel):
    accessToken: str
    refreshToken: str
    user: User

class WizardAnswer(BaseModel):
    questionId: str
    question: str
    answer: str
    type: str

class GenerateRouteRequest(BaseModel):
    answers: List[WizardAnswer]
    context: dict

class RouteStep(BaseModel):
    id: str
    title: str
    description: str
    address: str
    duration: int
    category: str

class Route(BaseModel):
    id: str
    title: str
    summary: str
    tags: List[str]
    steps: List[RouteStep]
    tips: List[str]
    totalDuration: int

class ChatMessage(BaseModel):
    message: str
    history: Optional[List[dict]] = []

# Mock database
MOCK_USER = User(
    id="user_123",
    name="Максим",
    email="maxim@example.com",
    avatar=None
)

MOCK_ROUTES = [
    Route(
        id="route_1",
        title="Романтический вечер в Москве",
        summary="Идеальный маршрут для романтического свидания с посещением лучших мест города",
        tags=["романтика", "вечер", "рестораны"],
        steps=[
            RouteStep(
                id="step_1",
                title="Парк Горького",
                description="Прогулка по парку на закате",
                address="ул. Крымский Вал, 9",
                duration=60,
                category="park"
            ),
            RouteStep(
                id="step_2",
                title="Ресторан White Rabbit",
                description="Ужин с панорамным видом на город",
                address="Смоленская площадь, 3",
                duration=120,
                category="restaurant"
            ),
            RouteStep(
                id="step_3",
                title="Крымская набережная",
                description="Вечерняя прогулка вдоль реки",
                address="Крымская набережная",
                duration=45,
                category="romantic"
            ),
        ],
        tips=[
            "Забронируйте столик в ресторане заранее",
            "Возьмите с собой тёплую одежду для вечерней прогулки",
            "Лучшее время для посещения: 18:00-22:00"
        ],
        totalDuration=225
    )
]

MOCK_PLACES = [
    {
        "id": "place_1",
        "name": "Парк Горького",
        "description": "Центральный парк культуры и отдыха",
        "category": "park",
        "rating": 4.7,
        "price": "free",
        "image": "https://via.placeholder.com/300x200",
        "address": "ул. Крымский Вал, 9",
        "isOpen": True,
        "isFavorite": False
    },
    {
        "id": "place_2",
        "name": "Музей современного искусства Гараж",
        "description": "Современное искусство в Парке Горького",
        "category": "museum",
        "rating": 4.6,
        "price": "₽₽",
        "image": "https://via.placeholder.com/300x200",
        "address": "ул. Крымский Вал, 9, стр. 32",
        "isOpen": True,
        "isFavorite": False
    },
]

# Auth endpoints
@app.post("/auth/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """Вход в систему"""
    if request.email == "maxim@example.com" and request.password == "password":
        return AuthResponse(
            accessToken="mock_access_token_123",
            refreshToken="mock_refresh_token_456",
            user=MOCK_USER
        )
    raise HTTPException(status_code=401, detail="Неверный email или пароль")

@app.post("/auth/register", response_model=AuthResponse)
async def register(request: RegisterRequest):
    """Регистрация"""
    new_user = User(
        id="user_" + request.email,
        name=request.name,
        email=request.email
    )
    return AuthResponse(
        accessToken="mock_access_token_new",
        refreshToken="mock_refresh_token_new",
        user=new_user
    )

@app.post("/auth/refresh")
async def refresh_token():
    """Обновление токена"""
    return {
        "accessToken": "mock_access_token_refreshed",
        "refreshToken": "mock_refresh_token_refreshed"
    }

@app.get("/auth/me", response_model=User)
async def get_current_user():
    """Получить текущего пользователя"""
    return MOCK_USER

@app.put("/auth/me", response_model=User)
async def update_profile(user: User):
    """Обновить профиль"""
    return user

# Routes endpoints
@app.post("/routes/generate", response_model=Route)
async def generate_route(request: GenerateRouteRequest):
    """Генерация маршрута на основе ответов мастера"""
    
    # Симуляция долгой генерации (в реальности здесь будет AI)
    import asyncio
    await asyncio.sleep(2)  # Имитация обработки
    
    # Берём данные из ответов
    budget = next((a.answer for a in request.answers if a.questionId == "budget"), "any")
    categories = next((a.answer for a in request.answers if a.questionId == "categories"), "")
    duration = next((a.answer for a in request.answers if a.questionId == "duration"), "4-6")
    
    return Route(
        id="route_generated",
        title=f"Персональный маршрут ({duration} часов)",
        summary=f"Маршрут создан специально для вас с учётом бюджета '{budget}' и интересов: {categories}",
        tags=categories.split(", ") if categories else ["custom"],
        steps=[
            RouteStep(
                id="step_1",
                title="Первая остановка",
                description="Начало вашего путешествия",
                address="Москва, центр",
                duration=60,
                category=categories.split(", ")[0] if categories else "other"
            ),
            RouteStep(
                id="step_2",
                title="Вторая остановка",
                description="Продолжение маршрута",
                address="Москва, исторический центр",
                duration=90,
                category=categories.split(", ")[1] if "," in categories else "other"
            ),
        ],
        tips=[
            "Маршрут адаптирован под ваши предпочтения",
            f"Оптимальное время: {duration} часов",
            "Рекомендуем начать в светлое время суток"
        ],
        totalDuration=150
    )

@app.get("/routes/my", response_model=List[Route])
async def get_my_routes():
    """Получить мои маршруты"""
    return MOCK_ROUTES

@app.get("/routes/public", response_model=List[Route])
async def get_public_routes():
    """Получить публичные маршруты"""
    return MOCK_ROUTES

@app.get("/routes/{route_id}", response_model=Route)
async def get_route(route_id: str):
    """Получить маршрут по ID"""
    route = next((r for r in MOCK_ROUTES if r.id == route_id), None)
    if not route:
        raise HTTPException(status_code=404, detail="Маршрут не найден")
    return route

@app.post("/routes", response_model=Route)
async def save_route(route: Route):
    """Сохранить маршрут"""
    MOCK_ROUTES.append(route)
    return route

@app.delete("/routes/{route_id}")
async def delete_route(route_id: str):
    """Удалить маршрут"""
    global MOCK_ROUTES
    MOCK_ROUTES = [r for r in MOCK_ROUTES if r.id != route_id]
    return {"message": "Маршрут удалён"}

# Places endpoints
@app.get("/places")
async def get_places():
    """Получить все места"""
    return MOCK_PLACES

@app.get("/places/search")
async def search_places(q: str = ""):
    """Поиск мест"""
    if not q:
        return MOCK_PLACES
    return [p for p in MOCK_PLACES if q.lower() in p["name"].lower() or q.lower() in p["description"].lower()]

@app.post("/places/{place_id}/favorite")
async def toggle_favorite(place_id: str):
    """Добавить/удалить из избранного"""
    place = next((p for p in MOCK_PLACES if p["id"] == place_id), None)
    if place:
        place["isFavorite"] = not place["isFavorite"]
        return place
    raise HTTPException(status_code=404, detail="Место не найдено")

# Agent endpoints
@app.post("/agent/chat")
async def agent_chat(request: ChatMessage):
    """ИИ-агент чат (streaming будет добавлен позже)"""
    
    # Простой mock ответ
    responses = {
        "кафе": "🏪 Рядом с вами есть несколько отличных кафе:\n\n1. **Кофемания** - ул. Тверская, 12\n   ₽₽ • Европейская кухня\n\n2. **Starbucks** - Красная площадь, 1\n   ₽₽ • Кофе и десерты\n\n3. **Пушкин** - Тверской бульвар, 26А\n   ₽₽₽ • Русская кухня",
        
        "ресторан": "🍽️ Лучшие рестораны поблизости:\n\n1. **White Rabbit** - Смоленская пл., 3\n   ₽₽₽₽ • Панорамный вид\n\n2. **Twins Garden** - Страстной бульвар, 8А\n   ₽₽₽₽ • Авторская кухня\n\n3. **Савва** - Рождественка, 10\n   ₽₽₽ • Европейская кухня",
        
        "маршрут": "🗺️ Для создания персонального маршрута воспользуйтесь нашим мастером!\n\nОтветьте на 10 вопросов, и я создам идеальный маршрут специально для вас.\n\nНажмите кнопку 'Создать маршрут' на главном экране 👆",
    }
    
    # Простой поиск по ключевым словам
    message_lower = request.message.lower()
    for keyword, response in responses.items():
        if keyword in message_lower:
            return {"response": response}
    
    # Дефолтный ответ
    return {
        "response": f"🤖 Спасибо за ваш вопрос!\n\nВы спросили: '{request.message}'\n\nЯ могу помочь вам:\n• Найти кафе и рестораны\n• Подобрать места для посещения\n• Создать персональный маршрут\n• Ответить на вопросы о Москве\n\nЧто вас интересует?"
    }

@app.get("/")
async def root():
    """Корневой маршрут"""
    return {
        "message": "Yanqwip API v1.0",
        "status": "running",
        "docs": "/docs"
    }

if __name__ == "__main__":
    print("🚀 Starting Yanqwip Backend...")
    print("📝 API Docs: http://localhost:8000/docs")
    print("🔥 Server running on: http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
