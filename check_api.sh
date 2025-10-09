#!/bin/bash

# API Health Check Script
# Проверяет доступность всех основных эндпоинтов API

API_BASE="http://45.144.28.25:5435"
API_PREFIX="/api"

echo "🔍 Проверка API сервера: $API_BASE"
echo "========================================"

# Функция для проверки эндпоинта
check_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4

    echo -n "📡 $description ($method $endpoint): "

    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "HTTPSTATUS:%{http_code};" -X GET "$API_BASE$API_PREFIX$endpoint" -H "Content-Type: application/json")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "HTTPSTATUS:%{http_code};" -X POST "$API_BASE$API_PREFIX$endpoint" -H "Content-Type: application/json" -d "$data")
    fi

    http_code=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://' | sed -e 's/;.*//g')
    response_body=$(echo "$response" | sed -e 's/HTTPSTATUS:.*//g')

    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo "✅ OK ($http_code)"
    elif [ "$http_code" -eq 401 ]; then
        echo "🔒 Требуется авторизация ($http_code)"
    elif [ "$http_code" -eq 404 ]; then
        echo "❌ Не найден ($http_code)"
    elif [ "$http_code" -ge 500 ]; then
        echo "💥 Ошибка сервера ($http_code)"
    else
        echo "⚠️  Неожиданный код ($http_code)"
    fi
}

echo ""
echo "🌐 Проверка основных эндпоинтов:"
echo ""

# Проверка базовой доступности
check_endpoint "GET" "/" "Корневой эндпоинт"

# Проверка аутентификации
check_endpoint "GET" "/auth/me" "Проверка авторизации"
check_endpoint "POST" "/auth/login" '{"username": "test", "password": "test"}' "Вход в систему"

# Проверка маршрутов
check_endpoint "GET" "/routes/user" "Получение маршрутов пользователя"

# Проверка агента
check_endpoint "POST" "/agent/chat" '{"message": "test"}' "Чат с агентом"

# Проверка мест
check_endpoint "GET" "/places/search?q=test" "Поиск мест"

echo ""
echo "📊 Проверка завершена!"
echo ""
echo "💡 Для тестирования с авторизацией:"
echo "1. Зарегистрируйтесь или войдите в приложение"
echo "2. Получите токен доступа"
echo "3. Используйте токен в заголовке: Authorization: Bearer <token>"
echo ""
echo "🔗 Swagger документация: $API_BASE/docs"
echo "📄 OpenAPI спецификация: $API_BASE/openapi.json"