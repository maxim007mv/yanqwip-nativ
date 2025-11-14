-- Миграция: добавление таблицы generation_jobs
-- Эта таблица используется для асинхронной генерации маршрутов

CREATE TABLE IF NOT EXISTS generation_jobs (
    id VARCHAR(36) PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(32) NOT NULL,
    error_message TEXT,
    partial BOOLEAN NOT NULL DEFAULT FALSE,
    route_id INTEGER REFERENCES routes(id) ON DELETE SET NULL,
    payload_json TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_generation_jobs_user_id ON generation_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_status ON generation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_created_at ON generation_jobs(created_at);

-- Комментарии
COMMENT ON TABLE generation_jobs IS 'Асинхронные задачи генерации маршрутов';
COMMENT ON COLUMN generation_jobs.status IS 'pending, running, done, error';
