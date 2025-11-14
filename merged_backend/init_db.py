"""
Инициализация таблиц пользователей в PostgreSQL
ВАЖНО: Таблицы мест (places, cuisines и т.д.) уже существуют!
Этот скрипт создаёт только таблицы для пользователей и маршрутов.
"""
import sys
from sqlalchemy import create_engine, text

# Добавляем путь к app модулю
sys.path.insert(0, '.')

from app.config import settings
from app.database import Base
from app.models import User, Route, RefreshToken, AgentMessage, GenerationJob

def init_user_tables():
    """Создать таблицы пользователей в существующей БД"""
    print("🔧 Инициализация таблиц пользователей в PostgreSQL...")
    print(f"📍 Подключение: {settings.database_url}")
    
    try:
        # Создаём engine
        engine = create_engine(settings.database_url)
        
        # Проверяем подключение
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version();"))
            version = result.fetchone()
            print(f"✅ Подключение успешно!")
            print(f"📊 PostgreSQL: {version[0][:50]}...")
        
        # Проверяем существующие таблицы
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name;
            """))
            existing_tables = [row[0] for row in result.fetchall()]
            print(f"\n📋 Существующие таблицы ({len(existing_tables)}):")
            for table in existing_tables[:5]:
                print(f"   - {table}")
            if len(existing_tables) > 5:
                print(f"   ... и ещё {len(existing_tables) - 5}")
        
        # Создаём ТОЛЬКО таблицы пользователей
        print("\n🔨 Создание таблиц пользователей...")
        
        # Создаём только те таблицы, которых нет
        tables_to_create = ['users', 'routes', 'refresh_tokens', 'agent_messages', 'generation_jobs']
        
        # Фильтруем только несуществующие таблицы
        new_tables = [t for t in tables_to_create if t not in existing_tables]
        
        if not new_tables:
            print("✅ Все таблицы пользователей уже существуют!")
        else:
            print(f"📝 Создаём таблицы: {', '.join(new_tables)}")
            
            # Создаём таблицы через metadata
            # Base.metadata.create_all создаст только те таблицы, которых нет
            Base.metadata.create_all(bind=engine, checkfirst=True)
            
            print("✅ Таблицы успешно созданы!")
        
        # Проверяем результат
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_name IN ('users', 'routes', 'refresh_tokens', 'agent_messages', 'generation_jobs')
                ORDER BY table_name;
            """))
            user_tables = [row[0] for row in result.fetchall()]
            print(f"\n✅ Таблицы пользователей ({len(user_tables)}):")
            for table in user_tables:
                print(f"   ✓ {table}")
        
        print("\n🎉 Инициализация завершена успешно!")
        print("\n📝 Следующие шаги:")
        print("   1. Установите зависимости: pip install -r requirements.txt")
        print("   2. Проверьте .env файл с настройками")
        print("   3. Запустите сервер: python -m app.main")
        
    except Exception as e:
        print(f"\n❌ Ошибка при инициализации: {e}")
        print("\n💡 Проверьте:")
        print("   - Правильность DATABASE_URL в .env")
        print("   - Запущен ли PostgreSQL сервер")
        print("   - Существует ли база данных 'yanqwip'")
        sys.exit(1)


if __name__ == "__main__":
    init_user_tables()
