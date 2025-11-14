-- Миграция: добавление таблиц для системы достижений
-- Дата создания: 2025-01-14

-- Таблица достижений
CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    condition_type VARCHAR(100) NOT NULL,
    condition_value INTEGER NOT NULL,
    reward_points INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица пользовательских достижений
CREATE TABLE IF NOT EXISTS user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    current_progress INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    is_accepted BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_completed ON user_achievements(is_completed);
CREATE INDEX IF NOT EXISTS idx_achievements_active ON achievements(is_active);

-- Начальные достижения
INSERT INTO achievements (title, description, icon, condition_type, condition_value, reward_points) VALUES
('Первый маршрут', 'Создайте свой первый маршрут путешествия', '🏆', 'routes_count', 1, 10),
('10 мест', 'Посетите 10 различных мест', '⭐', 'places_count', 10, 25),
('Неделя активности', 'Будьте активны в приложении 7 дней подряд', '🎯', 'active_days', 7, 50),
('Месяц в путешествиях', 'Проводите время в путешествиях целый месяц', '🔥', 'travel_days', 30, 100),
('Исследователь', 'Создайте 5 различных маршрутов', '🗺️', 'routes_count', 5, 30),
('Коллекционер', 'Добавьте 20 мест в избранное', '❤️', 'favorites_count', 20, 40),
('Мастер маршрутов', 'Создайте 10 маршрутов', '👑', 'routes_count', 10, 75),
('Гуру путешествий', 'Наберите 1000 очков достижений', '🌟', 'total_points', 1000, 200)
ON CONFLICT DO NOTHING;