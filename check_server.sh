#!/bin/bash

# Скрипт для проверки сервера Yanqwip

SERVER_URL="http://45.144.28.25:5435"

echo "Проверка доступности сервера..."
curl -s -o /dev/null -w "%{http_code}" $SERVER_URL/api | grep 404 && echo "Сервер отвечает (404 на /api нормально)" || echo "Сервер не отвечает"

echo ""
echo "Тест регистрации..."
REGISTER_RESPONSE=$(curl -s -X POST $SERVER_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}')
echo "Ответ: $REGISTER_RESPONSE"

echo ""
echo "Тест логина..."
LOGIN_RESPONSE=$(curl -s -X POST $SERVER_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}')
echo "Ответ: $LOGIN_RESPONSE"

# Извлечь токен
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$ACCESS_TOKEN" ]; then
  echo ""
  echo "Тест генерации маршрута..."
  ROUTE_RESPONSE=$(curl -s -X POST $SERVER_URL/api/routes/generate \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d '["время начала прогулки","продолжительность","тип прогулки","стартовая точка","бюджет","желанные места","предпочтительные активности","пожелания по еде","транспорт","ограничения"]')
  echo "Ответ: $ROUTE_RESPONSE"

  echo ""
  echo "Тест запроса к нейросети (агент)..."
  AGENT_RESPONSE=$(curl -s -X POST $SERVER_URL/api/agent/message \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d '{"message":"Привет, расскажи о Москве"}')
  echo "Ответ: $AGENT_RESPONSE"
else
  echo "Логин не удался, пропускаем тесты с токеном"
fi

echo ""
echo "Проверка БД (если SQLite, проверить файл на сервере)"
echo "На сервере: ls -la /var/www/react-nativ/backend/yanqwip.db"