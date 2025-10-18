# 🏗️ Production Сборка Yanqwip

Полное руководство по сборке готового приложения для iOS и Android.

---

## 📦 Android Production Build

### Вариант 1: Gradle (локально)

#### Шаг 1: Prebuild

```bash
cd frontend
npm run prebuild
```

Это создаст папку `android/` с нативными файлами.

#### Шаг 2: Подготовка окружения

Убедитесь, что установлено:
- ✅ Android Studio
- ✅ Android SDK (API 33+)
- ✅ Java JDK 17

#### Шаг 3: Сборка APK

```bash
cd android

# Release APK
./gradlew assembleRelease

# Файл будет в:
# android/app/build/outputs/apk/release/app-release.apk
```

#### Шаг 4: Сборка AAB (для Google Play)

```bash
# Release AAB (App Bundle)
./gradlew bundleRelease

# Файл будет в:
# android/app/build/outputs/bundle/release/app-release.aab
```

#### Шаг 5: Подписать APK/AAB

**Создать ключ (если нет):**
```bash
keytool -genkey -v -keystore yanqwip-release.keystore \
  -alias yanqwip -keyalg RSA -keysize 2048 -validity 10000
```

**Настроить gradle (android/app/build.gradle):**
```gradle
android {
  signingConfigs {
    release {
      storeFile file("yanqwip-release.keystore")
      storePassword "your-password"
      keyAlias "yanqwip"
      keyPassword "your-password"
    }
  }
  buildTypes {
    release {
      signingConfig signingConfigs.release
    }
  }
}
```

**Пересобрать:**
```bash
./gradlew assembleRelease
```

---

### Вариант 2: EAS Build (рекомендуется)

#### Шаг 1: Установка EAS CLI

```bash
npm install -g eas-cli
```

#### Шаг 2: Логин

```bash
eas login
```

#### Шаг 3: Конфигурация (eas.json)

Создайте `frontend/eas.json`:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

#### Шаг 4: Сборка

```bash
# Preview APK (для тестирования)
eas build --platform android --profile preview

# Production AAB (для Google Play)
eas build --platform android --profile production
```

#### Шаг 5: Скачать

После завершения (10-20 минут) скачайте файл из EAS Dashboard:
```
https://expo.dev/accounts/YOUR_ACCOUNT/projects/yanqwip/builds
```

---

## 🍎 iOS Production Build

### Вариант 1: Xcode (локально)

#### Шаг 1: Prebuild

```bash
cd frontend
npm run prebuild
```

Это создаст папку `ios/` с нативными файлами.

#### Шаг 2: Установка зависимостей

```bash
cd ios
pod install
```

#### Шаг 3: Открыть Xcode

```bash
open yanqwip.xcworkspace
```

#### Шаг 4: Настройка

В Xcode:
1. Выберите **Generic iOS Device** (или реальное устройство)
2. **Product → Scheme → Edit Scheme** → Release
3. **Product → Archive**

#### Шаг 5: Экспорт

После архивации:
1. **Window → Organizer**
2. Выбрать архив → **Distribute App**
3. Варианты:
   - **App Store Connect** (для TestFlight/App Store)
   - **Ad Hoc** (для тестирования на конкретных устройствах)
   - **Development** (для разработки)

#### Шаг 6: Подписание

Убедитесь, что настроено:
- ✅ Apple Developer Account
- ✅ Certificates (iOS Distribution)
- ✅ Provisioning Profiles
- ✅ Bundle ID: `com.yanqwip.app`

---

### Вариант 2: EAS Build (рекомендуется)

#### Шаг 1: Сборка

```bash
# Production IPA (для App Store)
eas build --platform ios --profile production
```

#### Шаг 2: Submit в App Store

```bash
eas submit --platform ios
```

Или вручную через Xcode Organizer.

---

## 🔐 Настройка окружения для Production

### Frontend (.env.production)

```env
API_URL=https://api.yanqwip.app
YANDEX_MAPS_KEY=production_yandex_maps_api_key
SENTRY_DSN=https://your-sentry-dsn
```

### app.config.js (динамические переменные)

```javascript
export default ({ config }) => ({
  ...config,
  extra: {
    apiUrl: process.env.API_URL || "http://localhost:8000",
    yandexMapsKey: process.env.YANDEX_MAPS_KEY || "",
    sentryDsn: process.env.SENTRY_DSN || "",
  },
});
```

---

## 📋 Чек-лист перед сборкой

### Общее
- [ ] Все зависимости установлены (`npm install`)
- [ ] `.env` файл настроен (prod credentials)
- [ ] TypeScript проверка пройдена (`npm run type-check`)
- [ ] Линтер пройден (`npm run lint`)
- [ ] Версия обновлена (`package.json`, `app.config.js`)

### Android
- [ ] `android/` папка существует (`npm run prebuild`)
- [ ] Keystore создан и настроен
- [ ] `applicationId` в `build.gradle` корректен
- [ ] Permissions в `AndroidManifest.xml` проверены
- [ ] Иконки и splash screen добавлены

### iOS
- [ ] `ios/` папка существует (`npm run prebuild`)
- [ ] Pods установлены (`cd ios && pod install`)
- [ ] Bundle ID настроен (`com.yanqwip.app`)
- [ ] Certificates и Provisioning Profiles готовы
- [ ] Иконки и launch screen добавлены
- [ ] Info.plist проверен (permissions, keys)

---

## 🚢 Деплой в магазины

### Google Play Console

1. **Создать приложение:**
   - https://play.google.com/console
   - New app → `Yanqwip`

2. **Загрузить AAB:**
   - Production → Create new release
   - Upload `app-release.aab`
   - Release notes, screenshots

3. **Тестирование:**
   - Internal testing (команда)
   - Closed testing (beta)
   - Open testing (публичная бета)

4. **Публикация:**
   - Production → Publish

---

### App Store Connect

1. **Создать приложение:**
   - https://appstoreconnect.apple.com
   - My Apps → + → New App

2. **Загрузить IPA:**
   - Через Xcode Organizer
   - Или `eas submit --platform ios`

3. **TestFlight:**
   - Internal Testing (до 100 тестеров)
   - External Testing (публичная бета)

4. **Публикация:**
   - App Store → Submit for Review
   - Ожидание (1-3 дня)

---

## 🔍 Проверка сборки

### Android APK

```bash
# Установить на устройство
adb install android/app/build/outputs/apk/release/app-release.apk

# Проверить логи
adb logcat | grep ReactNative
```

### iOS IPA

```bash
# Через Xcode или TestFlight
```

---

## 🛡️ Безопасность Production

### Обфускация кода (Android)

В `android/app/build.gradle`:

```gradle
buildTypes {
  release {
    minifyEnabled true
    shrinkResources true
    proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
  }
}
```

### Защита API ключей

- ✅ Хранить в `.env` (не в репозитории)
- ✅ Использовать environment variables
- ✅ Ротация ключей раз в квартал

### HTTPS Only

Все API запросы должны идти через HTTPS в production.

---

## 📊 Мониторинг

### Sentry (Crashlytics)

```bash
npm install @sentry/react-native
```

**app.config.js:**
```javascript
plugins: [
  ["@sentry/react-native/expo", {
    organization: "yanqwip",
    project: "yanqwip-mobile"
  }]
]
```

### Analytics

- Firebase Analytics
- Amplitude
- Mixpanel

---

## 🎉 Готово!

Теперь у вас есть:
- ✅ Production APK для Android
- ✅ Production IPA для iOS
- ✅ Готовность к публикации в магазины

**Следующие шаги:**
1. Загрузить в Google Play / App Store
2. Пройти review
3. Опубликовать! 🚀

---

**Вопросы?** Проверьте `frontend/README.md` или создайте issue.
