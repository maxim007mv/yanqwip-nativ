# Backend Yanqwip – FastAPI

## Структура

```
backend/
├── app/
│   ├── main.py           # Точка входа FastAPI
│   ├── api/
│   │   ├── auth.py       # /auth/* эндпоинты
│   │   ├── routes.py     # /routes/* эндпоинты
│   │   ├── places.py     # /places/* эндпоинты
│   │   └── agent.py      # /agent/* эндпоинты (streaming)
│   ├── models/           # SQLAlchemy модели
│   ├── schemas/          # Pydantic схемы
│   ├── services/         # Бизнес-логика
│   ├── core/             # Конфигурация, безопасность
│   └── db/               # База данных
├── requirements.txt
└── Dockerfile
```

## Требуемые эндпоинты

### 1. Auth
- `POST /auth/login` – вход (email, password)
- `POST /auth/register` – регистрация
- `POST /auth/refresh` – обновление токена
- `GET /auth/me` – текущий пользователь

### 2. Routes
- `POST /routes/generate` – генерация маршрута (20-40 сек)
  - Input: `{answers: [], context: {city, budget, categories}}`
  - Output: `{route: {title, summary, tags, steps[], tips[], totalDuration}}`
- `GET /routes/my` – мои маршруты
- `GET /routes/public?limit=10` – публичные маршруты
- `GET /routes/:id` – детали маршрута
- `POST /routes` – сохранить маршрут
- `DELETE /routes/:id` – удалить маршрут
- `POST /routes/:id/like` – лайкнуть маршрут

### 3. Places
- `GET /places?category=cafe` – все места
- `GET /places/search?q=...&category=...` – поиск
- `GET /places/:id` – детали места
- `POST /places/:id/favorite` – добавить в избранное

### 4. Agent (Streaming)
- `POST /agent/chat` – стриминговый чат
  - Input: `{message: string, history: [], context: {}}`
  - Output: **Server-Sent Events** или **chunked response**
  - Пример FastAPI:

```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

@app.post("/agent/chat")
async def agent_chat(request: ChatRequest):
    async def generate():
        # Вызов LLM (OpenAI, Anthropic и т.д.)
        async for chunk in llm_stream(request.message, request.history):
            yield chunk.encode('utf-8')
    
    return StreamingResponse(generate(), media_type="text/plain")
```

## Системные промты

### ИИ-агент (быстрый чат)
```
Ты — доброжелательный персональный помощник-гид. 
Отвечай на любые вопросы пользователя по Москве и окрестностям: 
где поесть, куда сходить, какие кафе рядом, как доехать и т.д. 
Отвечай кратко, чётко и естественно. 
Если запрос неясен — уточняй детали (место, время, бюджет). 
Никогда не выдумывай несуществующих заведений. 
Используй актуальные данные о локациях, категориях и ценах.
```

### Генератор маршрутов
```
Ты — персональный гид по городу. 
На основе 10 ответов пользователя и его истории маршрутов 
верни чёткий пошаговый план: 5–9 остановок, для каждой — 
краткое описание, примерная длительность, адрес/ссылка (если есть), 
категория, ориентировочное время (учитывай погоду/бюджет/темп). 

Если данных мало — задай 1–3 уточнения. 
Не выдумывай закрытые места; отмечай часы работы. 

Итог: JSON {title, tags[], steps[], tips[], totalDuration} + 
краткий summary (3–5 предложений).
```

## Пример маршрута (JSON)

```json
{
  "id": "route-123",
  "title": "Классическая Москва за день",
  "summary": "Исторический центр: Кремль, ГУМ, Третьяковка...",
  "tags": ["история", "культура", "пешком"],
  "totalDuration": 480,
  "city": "Москва",
  "steps": [
    {
      "id": "step-1",
      "title": "Красная площадь",
      "description": "Начните с главной площади страны",
      "address": "Красная площадь",
      "category": "museum",
      "duration": 60,
      "order": 1,
      "coordinates": { "lat": 55.753544, "lon": 37.621202 },
      "openHours": "09:00-18:00",
      "tips": ["Лучше приходить с утра", "Возьмите аудиогид"]
    }
  ],
  "tips": ["Наденьте удобную обувь", "Возьмите воду"],
  "createdAt": "2025-10-15T10:00:00Z",
  "userId": "user-456",
  "isPublic": true,
  "likes": 142,
  "views": 1520
}
```

## Технологии

- **FastAPI** – веб-фреймворк
- **SQLAlchemy** – ORM (PostgreSQL)
- **Redis** – кэш, очереди
- **Celery** – фоновые задачи (генерация маршрутов)
- **OpenAI API** – LLM для чата и генерации
- **Pydantic** – валидация
- **JWT** – аутентификация

## Запуск

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Docker

```bash
docker-compose up
```

---

**Всё готово для интеграции с фронтендом!** 🚀
