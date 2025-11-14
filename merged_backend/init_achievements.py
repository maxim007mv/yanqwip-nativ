"""
Инициализация достижений в базе данных
"""
import sys
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

# Добавляем путь к app модулю
sys.path.insert(0, '.')

from app.config import settings
from app.database import SessionLocal
from app.models import Achievement

def init_achievements():
    """Создать базовые достижения в базе данных"""
    print("🎯 Инициализация достижений...")

    # Создаём engine
    engine = create_engine(settings.database_url)

    # Создаём сессию
    db = SessionLocal()

    try:
        # Проверяем, есть ли уже достижения
        existing_count = db.query(Achievement).count()
        if existing_count > 0:
            print(f"✅ Достижения уже существуют ({existing_count} шт.)")
            return

        # Создаём базовые достижения
        achievements_data = [
            {
                "title": "Первый маршрут",
                "description": "Создайте свой первый маршрут",
                "icon": "🗺️",
                "condition_type": "routes_count",
                "condition_value": 1,
                "reward_points": 10,
            },
            {
                "title": "Путешественник",
                "description": "Создайте 5 маршрутов",
                "icon": "✈️",
                "condition_type": "routes_count",
                "condition_value": 5,
                "reward_points": 50,
            },
            {
                "title": "Исследователь",
                "description": "Посетите 10 разных мест",
                "icon": "🔍",
                "condition_type": "places_count",
                "condition_value": 10,
                "reward_points": 30,
            },
            {
                "title": "Мастер маршрутов",
                "description": "Создайте 10 маршрутов",
                "icon": "🏆",
                "condition_type": "routes_count",
                "condition_value": 10,
                "reward_points": 100,
            },
            {
                "title": "Любитель прогулок",
                "description": "Пройдите 50 км",
                "icon": "🚶",
                "condition_type": "distance_km",
                "condition_value": 50,
                "reward_points": 75,
            },
            {
                "title": "Городской гид",
                "description": "Посетите 25 разных мест",
                "icon": "🏙️",
                "condition_type": "places_count",
                "condition_value": 25,
                "reward_points": 80,
            },
            {
                "title": "Легенда",
                "description": "Создайте 25 маршрутов",
                "icon": "👑",
                "condition_type": "routes_count",
                "condition_value": 25,
                "reward_points": 200,
            },
            {
                "title": "Марафонец",
                "description": "Пройдите 100 км",
                "icon": "🏃",
                "condition_type": "distance_km",
                "condition_value": 100,
                "reward_points": 150,
            },
        ]

        print(f"📝 Создаём {len(achievements_data)} достижений...")

        for data in achievements_data:
            achievement = Achievement(**data)
            db.add(achievement)

        db.commit()

        # Проверяем результат
        count = db.query(Achievement).count()
        print(f"✅ Создано {count} достижений!")

        # Выводим список
        achievements = db.query(Achievement).all()
        print("\n📋 Созданные достижения:")
        for ach in achievements:
            print(f"   • {ach.icon} {ach.title} - {ach.description}")

    except Exception as e:
        print(f"❌ Ошибка при инициализации достижений: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    init_achievements()