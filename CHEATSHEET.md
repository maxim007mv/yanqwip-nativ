# ⚡ Быстрая шпаргалка Yanqwip

## 🚀 Запуск за 3 команды

### 1. Frontend
```bash
cd frontend && npm start
# Нажать 'i' для iOS или 'a' для Android
```

### 2. Backend
```bash
cd backend && python main.py
# API: http://localhost:8000/docs
```

### 3. Тест
```
Login: maxim@example.com
Password: password
```

---

## 🔧 Быстрые исправления

### TypeScript ошибки
Файл: `frontend/app/screens/WizardScreen.tsx`

Заменить:
- `Colors.accent` → `colors.accent`
- `Colors.accent2` → `colors.accent2`
- `colors.glass` → `colors.glassBg`

### Установить карты
```bash
cd frontend
npx expo install react-native-maps expo-location
```

---

## 📂 Важные файлы

- `frontend/.env` - API URL
- `frontend/app.config.js` - Expo config
- `backend/main.py` - API сервер
- `backend/requirements.txt` - Python deps

---

## 🐛 Проблемы

**"Cannot find module"**
```bash
cd frontend && npm install
```

**"Module not found: fastapi"**
```bash
cd backend && pip install -r requirements.txt
```

**"Network error"**
1. Backend запущен? → `cd backend && python main.py`
2. `.env` правильный? → `API_URL=http://localhost:8000`
3. Перезапустить frontend

---

## 📊 Статус: 95% готово!

**Осталось:**
- 5 мин: TypeScript fixes
- 5 мин: Install maps
- 10 мин: Test integration

**Итого: 20 минут до завершения!** ⏰

---

## 📚 Документация

- **[FINAL_STATUS.md](FINAL_STATUS.md)** - Полный статус
- **[FINAL_CHECKLIST.md](FINAL_CHECKLIST.md)** - Чек-лист
- **[QUICK_COMPLETION_GUIDE.md](QUICK_COMPLETION_GUIDE.md)** - Детальный гайд
- **[TODO_DETAILED.md](TODO_DETAILED.md)** - Оставшиеся задачи

---

**🎉 Всё почти готово! Удачи!**
