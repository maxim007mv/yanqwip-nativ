# 🚀 Quick Start Guide

## Запуск проекта

### Вариант 1: Через BAT файлы (рекомендуется)

1. **Backend**: Двойной клик на `start_backend.bat`
2. **Frontend**: Двойной клик на `start_frontend.bat`

### Вариант 2: Через терминал

**Backend:**
```bash
cd d:\NEWNEWNEW\merged_backend
C:\Users\Damir\AppData\Local\Programs\Python\Python313\python.exe run.py
```

**Frontend:**
```bash
cd d:\NEWNEWNEW\frontend
npx expo start
```

## Тестирование

### 1. Backend API (Swagger)
- Откройте: http://localhost:8000/docs
- Протестируйте `/api/auth/register` и `/api/auth/login`

### 2. Mobile App
- Откройте Expo Go на телефоне
- Отсканируйте QR код из терминала
- Или используйте туннель: `npx expo start --tunnel`

### 3. Web версия
- Откройте: http://localhost:8081
- Нажмите `w` в терминале Expo

## Структура

```
d:\NEWNEWNEW\
├── start_backend.bat          ← Запуск backend сервера
├── start_frontend.bat         ← Запуск frontend (Expo)
├── merged_backend/            ← FastAPI backend (Python 3.13)
│   ├── run.py                 ← Entry point
│   ├── init_db.py             ← Инициализация БД
│   └── app/                   ← Код приложения
└── frontend/                  ← React Native app
    ├── App.tsx                ← Entry point
    └── app/                   ← Код приложения
        ├── api/               ← API client (обновлён ✅)
        ├── screens/           ← Экраны (обновлены ✅)
        └── store/             ← State management
```

## Что было сделано ✅

1. **Backend объединён** - `old_backend` + `backend1` → `merged_backend`
2. **API client обновлён** - префикс `/api`, трансформация данных
3. **Screens обновлены** - LoginScreen, RegisterScreen работают с новым API
4. **bcrypt исправлен** - версия 4.0.1, поддержка Python 3.13
5. **Зависимости установлены** - frontend готов к запуску

## Следующий шаг

Протестируйте регистрацию и вход в мобильном приложении! 📱
