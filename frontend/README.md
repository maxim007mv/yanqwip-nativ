# Yanqwip – Персональный ИИ-гид по городу

🌟 **Production-ready кроссплатформенное приложение** на React Native (Expo + TypeScript) для iOS и Android.

## � Статус проекта: 75% готово

```
├─ ✅ Конфигурация проекта (100%)
├─ ✅ Дизайн-система (100%)
├─ ✅ Компоненты (100%)
├─ ✅ Навигация (100%)
├─ ✅ HomeScreen (100%)
├─ ✅ PlacesScreen (100%)
├─ ✅ AgentScreen (90%)
├─ ✅ ProfileScreen (100%)
├─ ⏳ WizardScreen (40%)
├─ ⏳ RouteOverviewScreen (40%)
├─ ⏳ RouteDetailsScreen (30%)
├─ ⏳ Auth экраны (80%)
├─ ⏳ Карты и геолокация (20%)
├─ ⏳ Backend интеграция (70%)
└─ 📚 Документация (100%)
```

📋 **[Подробный план оставшихся задач](../TODO_DETAILED.md)**

## �📱 Возможности

- **ИИ-агент** – быстрый чат-помощник с streaming-ответами (≤700ms)
- **Генератор маршрутов** – мастер из 10 вопросов с визуализацией на Яндекс.Картах
- **Каталог мест** – фильтры, поиск, карточки с рейтингами и избранным
- **Профиль** – статистика, история маршрутов, настройки, тёмная/светлая тема
- **Премиальный дизайн** – стекломорфизм, градиенты, плавные анимации

## 🚀 Быстрый старт

### Требования

- Node.js ≥18
- npm или yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS: Xcode + CocoaPods
- Android: Android Studio + SDK

### Установка

```bash
cd frontend
npm install
```

### Настройка окружения

Создайте `.env` файл:

```bash
cp .env.example .env
```

Заполните переменные:

```env
API_URL=http://YOUR_BACKEND_URL:8000
YANDEX_MAPS_KEY=your_actual_yandex_api_key
```

> **Получить ключ Яндекс.Карт:** https://developer.tech.yandex.ru/services/

### Запуск

```bash
# Development
npm start

# iOS симулятор
npm run ios

# Android эмулятор
npm run android

# Web (для тестирования)
npm run web
```

### Сборка Production

#### Android (.apk / .aab)

```bash
# Prebuild (генерация android/)
npm run prebuild

# Gradle сборка
cd android
./gradlew assembleRelease  # APK
./gradlew bundleRelease    # AAB

# Файлы в android/app/build/outputs/
```

#### iOS (.ipa)

```bash
# Prebuild (генерация ios/)
npm run prebuild

# Xcode
open ios/yanqwip.xcworkspace

# Archive → Distribute → App Store / Ad Hoc
```

#### Через EAS Build (рекомендуется)

```bash
npm install -g eas-cli
eas login
eas build --platform all
```

## 📂 Структура проекта

```
frontend/
├── app/
│   ├── screens/          # Экраны (Home, Places, Agent, Profile, Wizard...)
│   ├── components/       # Переиспользуемые компоненты (GlassCard, Button...)
│   ├── navigation/       # React Navigation (Stack + Tabs)
│   ├── api/              # API клиент (axios + интерсепторы)
│   ├── store/            # Zustand (auth, UI)
│   ├── lib/              # Theme, types, utils
│   └── assets/           # Изображения, шрифты
├── App.tsx               # Точка входа
├── app.config.js         # Expo конфигурация
├── package.json
└── tsconfig.json
```

## 🎨 Дизайн-система

### Цвета

```typescript
// Accent (brand)
accent: '#FFB84A'
accent2: '#FFC566'

// Glass morphism
glassBg: 'rgba(255,255,255,0.10)'      // dark mode
glassBorder: 'rgba(255,255,255,0.28)'

// Text
text1: 'rgba(255,255,255,0.98)'
text2: 'rgba(255,255,255,0.82)'
text3: 'rgba(255,255,255,0.60)'
```

### Компоненты

- **GlassCard** – стеклянные карточки с blur эффектом
- **Button** – варианты: accent / glass / outline
- **TypingIndicator** – анимированные точки для чата

### Темы

- Light / Dark / Auto (следует системной настройке)
- Переключение в настройках профиля

## 🤖 ИИ-функционал

### 1. ИИ-агент (AgentScreen)

**Назначение:** Быстрые диалоговые ответы, справки, рекомендации.

**Технология:**
- Streaming API (`/agent/chat`)
- Debounce 250ms
- Постепенная отрисовка текста

**Промт:**
```
Ты — доброжелательный персональный помощник-гид. 
Отвечай на любые вопросы пользователя по Москве и окрестностям: 
где поесть, куда сходить, какие кафе рядом, как доехать и т.д. 
Отвечай кратко, чётко и естественно.
```

**Время ответа:** ≤700ms до первого токена

### 2. Генератор маршрутов (WizardScreen → RouteOverviewScreen)

**Назначение:** Создание персонализированных маршрутов на основе 10 вопросов.

**Процесс:**
1. Мастер из 10 шагов (бюджет, категории, темп, погода и т.д.)
2. Кнопка "Сгенерировать маршрут"
3. Анимация генерации (20-40 сек)
4. Визуализация на Яндекс.Картах с точками и маршрутом
5. Сохранение в профиль

**API:**
```typescript
POST /routes/generate
{
  answers: WizardAnswer[],
  context: {
    city: string,
    budget?: string,
    categories?: string[]
  }
}

Response: {
  route: {
    title: string,
    summary: string,
    tags: string[],
    steps: RouteStep[],
    tips: string[],
    totalDuration: number
  }
}
```

**Карта:**
- Библиотека: `react-native-yamap`
- Полилиния между точками
- Маркеры с иконками категорий
- Тап на маркер → карточка шага

## 🗺️ Яндекс.Карты

### Установка

```bash
npm install react-native-yamap
```

### Конфигурация

**iOS (ios/Podfile):**
```ruby
pod 'react-native-yamap', path: '../node_modules/react-native-yamap'
```

**Android (android/app/build.gradle):**
```gradle
dependencies {
  implementation project(':react-native-yamap')
}
```

**API ключ (app.config.js):**
```javascript
plugins: [
  ['react-native-yamap', {
    apiKey: process.env.YANDEX_MAPS_KEY
  }]
]
```

### Использование

```typescript
import { YaMap, Marker, Polyline } from 'react-native-yamap';

<YaMap
  initialRegion={{
    lat: 55.751244,
    lon: 37.618423,
    zoom: 12
  }}
>
  {steps.map(step => (
    <Marker
      key={step.id}
      point={{ lat: step.coordinates.lat, lon: step.coordinates.lon }}
      onPress={() => onMarkerPress(step)}
    />
  ))}
  <Polyline points={routePath} strokeColor="#FFB84A" strokeWidth={4} />
</YaMap>
```

## 🔐 Аутентификация

### Хранение токенов

- **expo-secure-store** (iOS Keychain / Android Keystore)
- НЕ AsyncStorage (небезопасно)

### Рефреш токенов

Axios interceptor автоматически обновляет токены при 401:

```typescript
// api/client.ts
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      const newTokens = await refreshToken();
      originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
      return apiClient(originalRequest);
    }
  }
);
```

## 📊 State Management

### Zustand Stores

**authStore:**
- user, tokens, isAuthenticated
- login(), logout(), loadStoredAuth()

**uiStore:**
- theme, isOnboarded
- setTheme(), toggleTheme()

### React Query

Для серверных данных:
- `useQuery(['myRoutes'], routesApi.getMyRoutes)`
- `useMutation(routesApi.generate)`

## 🧪 Тестирование

```bash
# Type check
npm run type-check

# Lint
npm run lint
```

## 📦 Деплой

### TestFlight (iOS)

1. Archive в Xcode
2. Upload to App Store Connect
3. TestFlight → Internal Testing

### Google Play (Android)

1. Сборка `.aab`
2. Play Console → Internal Testing / Production
3. Загрузить релиз

### EAS (Expo Application Services)

```bash
eas build --platform all
eas submit --platform ios
eas submit --platform android
```

## 🛠️ Backend (FastAPI)

Требуемые эндпоинты:

### Auth
- `POST /auth/login` – вход
- `POST /auth/register` – регистрация
- `POST /auth/refresh` – обновление токена
- `GET /auth/me` – текущий пользователь

### Routes
- `POST /routes/generate` – генерация маршрута (долгий процесс)
- `GET /routes/my` – мои маршруты
- `GET /routes/public` – публичные маршруты
- `POST /routes` – сохранить маршрут
- `GET /routes/:id` – детали маршрута

### Places
- `GET /places` – все места
- `GET /places/search?q=...` – поиск
- `POST /places/:id/favorite` – добавить в избранное

### Agent
- `POST /agent/chat` – стриминговый чат (Server-Sent Events / chunked response)

## 🎯 Roadmap

- [ ] Оффлайн режим (кэширование маршрутов)
- [ ] Push-уведомления (напоминания о маршрутах)
- [ ] Социальные функции (шаринг, комментарии)
- [ ] AR-навигация (ARKit/ARCore)
- [ ] Apple Watch / Wear OS приложение

## 📄 Лицензия

MIT

## 👥 Команда

Разработано с ❤️ для института Web-Agent

---

**Вопросы?** Создайте issue в репозитории или напишите на support@yanqwip.app
