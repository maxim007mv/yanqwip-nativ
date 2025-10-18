# Yanqwip — персональный гид по Москве

Нативное Expo-приложение и FastAPI-бэкенд, которые переносят весь интеллект Telegram-бота в полноценного мобильного ассистента. Yanqwip использует DeepSeek для генерации маршрутов, Яндекс.Карты и , а также хранит персональные данные и сохранённые прогулки в собственной базе.

## 🌟 Ключевые возможности
- Мастер из 10 вопросов, точно повторяющий сценарий Telegram-бота и генерирующий маршрут в DeepSeek.
- Экран результатов с картой, таймлайном шагов, ссылкой на Яндекс.Карты и кнопкой «Сохранить».
- Чат с ИИ-агентом в стиле мессенджера с поддержкой контекста переписки.
- Каталог мест с фильтрами и фильтрацией по карте (Яндекс + Overpass).
- Профиль c безопасной авторизацией, списком сохранённых маршрутов и управлением сессией.
- Современный UI: glassmorphism, neumorphism, плавные градиенты, шрифты Inter + Unbounded.

## 🛠 Технологии
### Клиент (Expo + TypeScript)
- React Native 0.81, Expo 54, React 19
- React Navigation (Native Stack + Bottom Tabs)
- Zustand для стора авторизации и мастера, @tanstack/react-query для запросов и кеша
- Axios с перехватчиками access/refresh токенов и автообновлением сессии
- react-hook-form + zod, nativewind + Tailwind classes, expo-secure-store, react-native-maps

### Бэкенд (Python 3.11+)
- FastAPI + Uvicorn
- SQLAlchemy + SQLite (готово к замене на PostgreSQL)
- Passlib + python-jose для JWT, refresh-токены с хранением в БД
- DeepSeek API для генерации маршрутов и ответов агента
- Яндекс Геокодер и Search API + Overpass API для поиска мест

## ⚙️ Быстрый старт
### 1. Настройка бэкенда
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # при необходимости поправьте ключи и базу
uvicorn app.main:app --reload --port 8000
```
Бэкенд поднимется на `http://localhost:8000`, все REST-эндпоинты доступны на префиксе `/api`.

### 2. Настройка мобильного клиента
```bash
cd ..
npm install
cp .env.example .env   # переменные окружения для Expo
npx expo start --tunnel
```
Откройте проект в Expo Go, авторизуйтесь, пройдите мастер и получите маршрут. Для корректной работы убедитесь, что Expo использует тот же URL, что и бэкенд.

## 🔐 Переменные окружения
### Expo (`.env` в корне)
| Имя | Описание | Значение по умолчанию |
| --- | --- | --- |
| `EXPO_PUBLIC_API_BASE_URL` | URL бэкенда (без `/api`) | `http://localhost:8000` |
| `EXPO_PUBLIC_DEEPSEEK_API_KEY` | Ключ DeepSeek (используется приложением) | `sk-1f` |
| `EXPO_PUBLIC_YANDEX_GEOCODER_KEY` | Ключ Яндекс Геокодера | `fdc6` |
| `EXPO_PUBLIC_DEEPSEEK_BASE_URL` | Базовый URL DeepSeek API | `https://api.deepseek.com` |

### FastAPI (`backend/.env`)
| Имя | Описание | Значение |
| --- | --- | --- |
| `DATABASE_URL` | Строка подключения (SQLite/PostgreSQL) | `sqlite:///./yanqwip.db` |
| `SECRET_KEY` | Секрет для подписания JWT | `change-me` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Время жизни access-токена | `30` |
| `REFRESH_TOKEN_EXPIRE_MINUTES` | Время жизни refresh-токена | `20160` |
| `DEEPSEEK_API_KEY` | Ключ DeepSeek | `sk` |
| `DEEPSEEK_BASE_URL` | Адрес DeepSeek | `https://api.deepseek.com` |
| `YANDEX_API_KEY` | Ключ Яндекс.Карт (геокодер + поиск) | `fdc6` |

## 🔌 REST API (префикс `/api`)
| Метод | Путь | Описание |
| --- | --- | --- |
| `POST` | `/auth/register` | Регистрация пользователя |
| `POST` | `/auth/login` | Получение access/refresh |
| `POST` | `/auth/refresh` | Обновление access-токена |
| `POST` | `/auth/logout` | Отзыв refresh-токена |
| `GET`  | `/auth/me` | Текущий пользователь |
| `POST` | `/routes/generate` | Генерация маршрута по 10 ответам |
| `POST` | `/routes/save` | Сохранение маршрута |
| `GET`  | `/routes/user` | Список сохранённых маршрутов |
| `GET`  | `/routes/{id}` | Детали маршрута |
| `POST` | `/agent/message` | Ответ ИИ-агента с учётом истории |
| `GET`  | `/places` | Поиск мест в радиусе (Яндекс + Overpass) |

## 🧭 Логика мастера (1:1 с ботом)
1. Время начала прогулки
2. Продолжительность
3. Тип прогулки
4. Стартовая точка
5. Бюджет
6. Желанные места
7. Предпочтительные активности
8. Пожелания по еде
9. Транспорт
10. Ограничения/особенности

Ответы формируют промпт, DeepSeek возвращает структурированный JSON: шапка маршрута, сводка и список шагов с координатами. Бэкенд дополнительно строит ссылку на Яндекс.Карты и сохраняет «сырое» сообщение для последующего анализа.

## 🗂 Структура проекта
```
backend/
└── app/
    ├── main.py          # FastAPI-приложение, CORS, роуты
    ├── config.py        # настройки + env
    ├── database.py      # SQLAlchemy engine/session
    ├── models.py        # User, Route, RefreshToken, AgentMessage
    ├── schemas.py       # Pydantic-схемы API
    ├── security.py      # JWT и хэширование паролей
    ├── services/        # DeepSeek, Яндекс, Overpass
    └── routers/         # auth, routes, places, agent

src/
├── api/                # Axios-клиенты и вызовы REST
├── components/ui/      # GlassCard, NeoButton, Chip, RouteStepCard, и т.д.
├── constants/          # Цвета, вопросы мастера
├── navigation/         # RootNavigator, стеки и табы
├── screens/            # Onboarding, Auth, Home, Wizard, Agent, Places, Profile, Details
├── store/              # Zustand-хранилища (auth + wizard)
├── types/              # DTO и типы API
└── utils/              # Форматирование, secure storage helpers
```

## 📱 UI/UX
- Шрифты Inter & Unbounded из @expo-google-fonts.
- Gradient background + glass эффекты (expo-blur + nativewind классы).
- Неоморфные кнопки, плавные тени, анимации на навигацию.
- Поддержка iOS/Android, частичная web-совместимость (Expo).

## 🧪 Проверка
- `npx tsc --noEmit` — статический анализ TypeScript.
- `python -m compileall backend` — валидация Python модулей.
- Рекомендуется добавить e2e проверки (Detox/Playwright) и юнит-тесты FastAPI (pytest) при дальнейшем развитии.

## 🚀 Дальнейшие шаги
- Обернуть DeepSeek-ответы в кеш, чтобы уменьшить задержку повторных генераций.
- Добавить push-уведомления (Expo Notifications) для напоминаний о маршрутах.
- Расширить бэкенд до PostgreSQL + Alembic миграций — модели уже готовы к переходу.
- Подключить EAS Build для продакшен-сборок iOS/Android.

---

**Yanwqip** — открывайте Москву по-новому, теперь и без Telegram. 🏛️✨
