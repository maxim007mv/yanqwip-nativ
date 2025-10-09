# Проверка API

## 🚀 Быстрый запуск

### 1. Проверка доступности сервера

```bash
curl -X GET "http://45.144.28.25:5435/health"
# Ожидаемый ответ: {"status":"ok"}
```

### 2. Полная проверка API (Bash скрипт)

```bash
./check_api.sh
```

### 3. Полная проверка API (Node.js скрипт)

```bash
node check_api.js
```

### 4. Ручная проверка основных эндпоинтов

#### Health Check

```bash
curl -X GET "http://45.144.28.25:5435/health"
```

#### Swagger документация

- Откройте в браузере: `http://45.144.28.25:5435/docs`
- OpenAPI спецификация: `http://45.144.28.25:5435/openapi.json`

#### Проверка аутентификации

```bash
# Проверка авторизации (требует токена)
curl -X GET "http://45.144.28.25:5435/api/auth/me" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Регистрация
curl -X POST "http://45.144.28.25:5435/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'

# Вход
curl -X POST "http://45.144.28.25:5435/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

#### Проверка маршрутов

```bash
# Получение маршрутов пользователя (требует токена)
curl -X GET "http://45.144.28.25:5435/api/routes/user" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Проверка агента

```bash
# Чат с агентом (требует токена)
curl -X POST "http://45.144.28.25:5435/api/agent/chat" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"message": "Привет! Расскажи о Москве"}'
```

#### Проверка мест

```bash
# Поиск мест (требует токена)
curl -X GET "http://45.144.28.25:5435/api/places/search?q=красная+площадь" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📊 Результаты проверки

### ✅ Рабочие эндпоинты:

- `/health` - Health check (GET)
- `/docs` - Swagger документация
- `/openapi.json` - OpenAPI спецификация
- `/api/auth/me` - Проверка авторизации (требует токена)
- `/api/auth/login` - Вход в систему
- `/api/auth/register` - Регистрация

### ⚠️ Эндпоинты, требующие авторизации:

- `/api/routes/user` - Получение маршрутов
- `/api/agent/chat` - Чат с агентом
- `/api/places/search` - Поиск мест

### ❌ Не найденные эндпоинты:

- Корневой эндпоинт `/` возвращает 404 (нормально для API)
- Некоторые эндпоинты могут быть не реализованы

## 🔧 Устранение неполадок

### Network Error в приложении:

1. Проверьте подключение к интернету
2. Убедитесь, что сервер работает: `curl http://45.144.28.25:5435/health`
3. Проверьте переменные окружения в приложении
4. Проверьте логи приложения

### Ошибка авторизации:

1. Получите токен через `/api/auth/login`
2. Используйте токен в заголовке: `Authorization: Bearer <token>`
3. Проверьте срок действия токена

### Ошибка сервера (5xx):

1. Проверьте логи сервера
2. Убедитесь, что все зависимости установлены
3. Проверьте подключение к базе данных
