# 🚀 Запуск Backend

## Быстрый старт

```bash
# 1. Установить Python зависимости
cd backend
pip install -r requirements.txt

# 2. Запустить сервер
python main.py
```

Сервер запустится на **http://localhost:8000**

API документация: **http://localhost:8000/docs**

---

## 🧪 Тестирование API

### 1. Открыть документацию
```
http://localhost:8000/docs
```

### 2. Протестировать endpoints

#### Login
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maxim@example.com",
    "password": "password"
  }'
```

#### Generate Route
```bash
curl -X POST "http://localhost:8000/routes/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {"questionId": "budget", "question": "budget", "answer": "medium", "type": "text"},
      {"questionId": "categories", "question": "categories", "answer": "cafe, museum", "type": "text"}
    ],
    "context": {
      "city": "Москва",
      "budget": "medium",
      "categories": ["cafe", "museum"]
    }
  }'
```

#### Get Places
```bash
curl "http://localhost:8000/places"
```

#### Chat with AI Agent
```bash
curl -X POST "http://localhost:8000/agent/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Где поесть рядом с Красной площадью?",
    "history": []
  }'
```

---

## 📝 Доступные endpoints

### Auth
- `POST /auth/login` - Вход
- `POST /auth/register` - Регистрация
- `POST /auth/refresh` - Обновить токен
- `GET /auth/me` - Текущий пользователь
- `PUT /auth/me` - Обновить профиль

### Routes
- `POST /routes/generate` - Генерация маршрута
- `GET /routes/my` - Мои маршруты
- `GET /routes/public` - Публичные маршруты
- `GET /routes/{id}` - Получить маршрут
- `POST /routes` - Сохранить маршрут
- `DELETE /routes/{id}` - Удалить маршрут

### Places
- `GET /places` - Все места
- `GET /places/search?q=query` - Поиск
- `POST /places/{id}/favorite` - Избранное

### Agent
- `POST /agent/chat` - Чат с ИИ

---

## 🔧 Конфигурация

Backend работает на порту **8000**

Для изменения порта отредактируйте `main.py`:
```python
uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
```

---

## ✅ Готово!

Backend готов для интеграции с frontend приложением.

Не забудьте обновить `.env` в frontend:
```env
API_URL=http://localhost:8000
```
