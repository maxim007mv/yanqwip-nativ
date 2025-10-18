#!/bin/bash

# Yanqwip Frontend Setup Script
# Автоматическая установка и настройка React Native приложения

echo "🚀 Yanqwip Frontend Setup"
echo "=========================="
echo ""

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Установите Node.js ≥18 и повторите."
    exit 1
fi

echo "✓ Node.js $(node -v) найден"

# Проверка npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm не установлен."
    exit 1
fi

echo "✓ npm $(npm -v) найден"

# Установка зависимостей
echo ""
echo "📦 Установка зависимостей..."
npm install

# Проверка .env
if [ ! -f .env ]; then
    echo ""
    echo "⚙️  Создание .env файла..."
    cp .env.example .env
    echo "⚠️  ВАЖНО: Отредактируйте .env и добавьте:"
    echo "   - API_URL (адрес вашего бэкенда)"
    echo "   - YANDEX_MAPS_KEY (ключ API Яндекс.Карт)"
    echo ""
    echo "   Получить ключ: https://developer.tech.yandex.ru/services/"
else
    echo "✓ .env файл существует"
fi

echo ""
echo "✅ Установка завершена!"
echo ""
echo "📱 Запуск приложения:"
echo "   npm start       - Development сервер"
echo "   npm run ios     - iOS симулятор"
echo "   npm run android - Android эмулятор"
echo ""
echo "🔨 Сборка Production:"
echo "   npm run prebuild           - Генерация нативных папок"
echo "   cd android && ./gradlew assembleRelease  - Android APK"
echo ""
