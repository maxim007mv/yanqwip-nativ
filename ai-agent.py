import asyncio
import aiohttp
import re
import math
import csv
from datetime import datetime, timedelta
from dataclasses import dataclass
from openai import AsyncOpenAI
from telegram import Update, ReplyKeyboardMarkup, ReplyKeyboardRemove
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, ContextTypes, filters, ConversationHandler
import logging
import json
from typing import Dict, List, Optional, Tuple, Set
import uuid
import html
import time
import sqlite3
import os
from pathlib import Path

# ==========================================
# Настройка логирования
# ==========================================
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)
logging.getLogger("openai").setLevel(logging.WARNING)

# ==========================================
# Конфигурация API
# ==========================================
DEEPSEEK_API_KEY = "sk-1fcbc1c97bc24fb9a17ba2b1afafa3a2" # Убедитесь, что это действительный ключ
DEEPSEEK_BASE_URL = "https://api.deepseek.com"
YANDEX_GEOCODER_API_KEY = "fdc69334-3f89-4a96-b29a-499da1f7142a" # Убедитесь, что это действительный ключ
YANDEX_STATIC_MAPS_API_KEY = "1d34fe00-70f9-4f28-bba4-ff9ae1f1e969" # Убедитесь, что это действительный ключ

deepseek_client = AsyncOpenAI(
    api_key=DEEPSEEK_API_KEY,
    base_url=DEEPSEEK_BASE_URL,
    timeout=60.0,
    max_retries=3
)

# ==========================================
# Настройка базы данных
# ==========================================
DB_PATH = "routes.db"

class DatabaseManager:
    def __init__(self, db_path: str = "routes.db"):
        self.db_path = db_path
        self.init_database()

    def get_connection(self):
        """Создание подключения к базе данных"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def init_database(self):
        """Инициализация базы данных и создание таблиц"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            # Таблица для сохраненных маршрутов
            cursor.execute('''
                           CREATE TABLE IF NOT EXISTS saved_routes
                           (
                               id INTEGER PRIMARY KEY AUTOINCREMENT,
                               user_id INTEGER NOT NULL,
                               user_name TEXT,
                               route_name TEXT,
                               route_data TEXT,
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                           )
                           ''')
            # Таблица для обучения (вопросы и ответы)
            cursor.execute('''
                           CREATE TABLE IF NOT EXISTS training_data
                           (
                               id INTEGER PRIMARY KEY AUTOINCREMENT,
                               user_id INTEGER,
                               user_input TEXT,
                               ai_response TEXT,
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                           )
                           ''')
            # Таблица для диалогов (все ответы пользователя)
            cursor.execute('''
                           CREATE TABLE IF NOT EXISTS user_dialogs
                           (
                               id INTEGER PRIMARY KEY AUTOINCREMENT,
                               user_id INTEGER NOT NULL,
                               question_type TEXT NOT NULL,
                               question_text TEXT NOT NULL,
                               user_response TEXT NOT NULL,
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                           )
                           ''')
            conn.commit()

    def save_training_data(self, user_id: int, user_input: str, ai_response: str):
        """Сохранение данных для обучения"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO training_data (user_id, user_input, ai_response) VALUES (?, ?, ?)",
                    (user_id, user_input, ai_response)
                )
                conn.commit()
                return True
        except Exception as e:
            logging.error(f"Ошибка сохранения training_data: {e}")
            return False

    def save_route(self, user_id: int, user_name: str, route_name: str, route_data: str): # Исправленная строка
        """Сохранение маршрута в базу данных"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO saved_routes (user_id, user_name, route_name, route_data) VALUES (?, ?, ?, ?)",
                    (user_id, user_name, route_name, route_data) # route_data теперь корректно передаётся
                )
                conn.commit()
                return True
        except Exception as e:
            logging.error(f"Ошибка сохранения маршрута: {e}")
            return False

    def get_user_routes(self, user_id: int):
        """Получение сохраненных маршрутов пользователя"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT id, route_name, created_at FROM saved_routes WHERE user_id = ? ORDER BY created_at DESC",
                    (user_id,)
                )
                return cursor.fetchall()
        except Exception as e:
            logging.error(f"Ошибка получения маршрутов: {e}")
            return []

    def get_route_by_id(self, route_id: int, user_id: int):
        """Получение маршрута по ID"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT route_name, route_data FROM saved_routes WHERE id = ? AND user_id = ?",
                    (route_id, user_id)
                )
                return cursor.fetchone()
        except Exception as e:
            logging.error(f"Ошибка получения маршрута: {e}")
            return None

    def save_dialog(self, user_id: int, question_type: str, question_text: str, user_response: str):
        """Сохранение диалога пользователя"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO user_dialogs (user_id, question_type, question_text, user_response) VALUES (?, ?, ?, ?)",
                    (user_id, question_type, question_text, user_response)
                )
                conn.commit()
                return True
        except Exception as e:
            logging.error(f"Ошибка сохранения диалога: {e}")
            return False

# Создаем глобальный экземпляр менеджера базы данных
db_manager = DatabaseManager(DB_PATH)

EXPORT_DATA_DIR = Path(__file__).parent / "export_moscow"

CATEGORY_TITLES: Dict[str, str] = {
    "restaurants": "Рестораны",
    "coffee_shops": "Кофейни",
    "bars_pubs": "Бары и пабы",
    "park": "Парки",
    "romantic_spots": "Романтические места",
    "quiet_spots": "Тихие места",
    "kids_family": "Семейные локации",
    "sports_grounds": "Спортивные площадки",
    "fitness_workout": "Фитнес и тренировки",
    "swim_places": "Места для купания",
    "nature_reserves": "Природные заповедники",
    "lakes_ponds_canals": "Водоёмы",
    "squares": "Площади",
    "cinema": "Кинотеатры",
    "community_centre": "Дома культуры",
    "storage_lockers": "Камеры хранения",
    "wifi_zones": "Зоны Wi-Fi",
    "phone_charging": "Зарядные станции",
    "unusual_trees_structures": "Необычные деревья и объекты",
}

TYPE_CATEGORY_HINTS: Dict[str, Set[str]] = {
    "1": {"park", "community_centre", "cinema", "squares"},
    "культур": {"park", "community_centre", "cinema", "squares"},
    "музей": {"community_centre", "park", "squares"},
    "2": {"squares", "park", "romantic_spots"},
    "истор": {"squares", "park", "romantic_spots"},
    "3": {"park", "cinema", "kids_family", "sports_grounds"},
    "развлек": {"park", "cinema", "kids_family", "sports_grounds"},
    "4": {"romantic_spots", "restaurants", "quiet_spots", "lakes_ponds_canals"},
    "роман": {"romantic_spots", "restaurants", "quiet_spots", "lakes_ponds_canals"},
    "5": {"kids_family", "park", "swim_places", "restaurants"},
    "сем": {"kids_family", "park", "swim_places", "restaurants"},
    "дет": {"kids_family", "park", "swim_places"},
    "6": {"sports_grounds", "fitness_workout", "park"},
    "спорт": {"sports_grounds", "fitness_workout", "park"},
    "актив": {"sports_grounds", "fitness_workout", "park"},
    "7": {"restaurants", "coffee_shops", "bars_pubs"},
    "гастр": {"restaurants", "coffee_shops", "bars_pubs"},
    "еда": {"restaurants", "coffee_shops", "bars_pubs"},
    "8": {"restaurants", "coffee_shops", "squares"},
    "шоп": {"restaurants", "coffee_shops", "squares"},
    "9": {"park", "restaurants", "coffee_shops", "romantic_spots"},
}

KEYWORD_CATEGORY_HINTS: Dict[str, Set[str]] = {
    "парк": {"park", "nature_reserves", "quiet_spots"},
    "сад": {"park", "nature_reserves"},
    "прир": {"nature_reserves", "park", "lakes_ponds_canals"},
    "вод": {"lakes_ponds_canals", "swim_places"},
    "озер": {"lakes_ponds_canals"},
    "канал": {"lakes_ponds_canals"},
    "рек": {"lakes_ponds_canals"},
    "прогул": {"park", "romantic_spots", "quiet_spots"},
    "роман": {"romantic_spots", "restaurants", "quiet_spots"},
    "вид": {"romantic_spots", "quiet_spots"},
    "коф": {"coffee_shops"},
    "каф": {"coffee_shops", "restaurants"},
    "чай": {"coffee_shops"},
    "ресторан": {"restaurants", "bars_pubs"},
    "бар": {"bars_pubs"},
    "паб": {"bars_pubs"},
    "еда": {"restaurants", "coffee_shops", "bars_pubs"},
    "обед": {"restaurants", "coffee_shops"},
    "ужин": {"restaurants", "coffee_shops"},
    "кино": {"cinema"},
    "фильм": {"cinema"},
    "театр": {"community_centre", "cinema"},
    "концерт": {"community_centre"},
    "музей": {"community_centre", "squares"},
    "истор": {"squares", "park"},
    "экскурс": {"squares", "park"},
    "сем": {"kids_family", "park", "swim_places"},
    "реб": {"kids_family", "park"},
    "дет": {"kids_family", "park"},
    "спорт": {"sports_grounds", "fitness_workout", "park"},
    "бег": {"sports_grounds", "fitness_workout"},
    "вел": {"sports_grounds", "park"},
    "куп": {"swim_places"},
    "плав": {"swim_places"},
    "тих": {"quiet_spots"},
    "wifi": {"wifi_zones"},
    "заряд": {"phone_charging"},
    "хран": {"storage_lockers"},
    "дерев": {"unusual_trees_structures"},
}

DEFAULT_CATEGORY_FALLBACK: Set[str] = {
    "park",
    "restaurants",
    "coffee_shops",
    "romantic_spots",
}


@dataclass
class PlaceRecord:
    category: str
    name: str
    lat: Optional[float]
    lon: Optional[float]
    address: str
    phone: Optional[str]
    website: Optional[str]
    opening_hours: Optional[str]
    tags: Dict[str, str]
    source_file: str
    raw: Dict[str, str]
    search_blob: str

    def has_coordinates(self) -> bool:
        return self.lat is not None and self.lon is not None

    def distance_km(self, latitude: float, longitude: float) -> Optional[float]:
        if not self.has_coordinates():
            return None
        r = 6371.0
        phi1 = math.radians(self.lat)
        phi2 = math.radians(latitude)
        d_phi = math.radians(latitude - self.lat)
        d_lambda = math.radians(longitude - self.lon)
        a = math.sin(d_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return r * c


class LocalPlacesDatabase:
    def __init__(self, base_path: Path):
        self.base_path = base_path
        self.places: List[PlaceRecord] = []
        self.available = False
        self._load()

    def _load(self) -> None:
        if not self.base_path.exists():
            logging.warning(f"Локальная база {self.base_path} не найдена")
            return

        total = 0
        for category_dir in sorted(self.base_path.iterdir()):
            if not category_dir.is_dir():
                continue
            category_name = category_dir.name.lower()
            for csv_path in sorted(category_dir.glob("*.csv")):
                total += self._load_csv(category_name, csv_path)

        self.available = total > 0
        if self.available:
            logging.info(f"Локальная база объектов загружена: {total} точек")
        else:
            logging.warning("Не удалось загрузить объекты из локальной базы export_moscow")

    @staticmethod
    def _safe_float(value: Optional[str]) -> Optional[float]:
        if value is None:
            return None
        if isinstance(value, (int, float)):
            return float(value)
        text = str(value).strip().replace(",", ".")
        if not text:
            return None
        try:
            return float(text)
        except ValueError:
            return None

    def _load_csv(self, fallback_category: str, csv_path: Path) -> int:
        loaded = 0
        try:
            with open(csv_path, newline="", encoding="utf-8-sig") as csv_file:
                reader = csv.DictReader(csv_file)
                for row in reader:
                    place = self._row_to_place(fallback_category, csv_path.name, row)
                    if place:
                        self.places.append(place)
                        loaded += 1
        except FileNotFoundError:
            logging.error(f"CSV файл не найден: {csv_path}")
        except Exception as exc:
            logging.error(f"Ошибка чтения {csv_path}: {exc}")
        return loaded

    def _row_to_place(self, fallback_category: str, source_name: str, row: Dict[str, str]) -> Optional[PlaceRecord]:
        if not row:
            return None

        tags_raw = row.get("tags_json") or row.get("tags")
        tags: Dict[str, str] = {}
        if tags_raw:
            try:
                tags = json.loads(tags_raw)
            except json.JSONDecodeError:
                try:
                    tags = json.loads(tags_raw.replace("'", '"'))
                except Exception:
                    tags = {}

        name = (row.get("name") or row.get("Name") or tags.get("name") or "").strip()
        address = (row.get("address") or row.get("addr") or "").strip()
        if not address:
            addr_parts = [
                tags.get("addr:city"),
                tags.get("addr:place") or tags.get("addr:subdistrict"),
                tags.get("addr:street"),
                tags.get("addr:housenumber"),
            ]
            address = ", ".join(part.strip() for part in addr_parts if isinstance(part, str) and part.strip())

        phone = (row.get("phone") or row.get("contact:phone") or tags.get("phone") or "").strip()
        website = (row.get("website") or row.get("contact:website") or tags.get("website") or "").strip()
        opening_hours = (row.get("opening_hours") or tags.get("opening_hours") or "").strip()

        category = (row.get("category") or row.get("label") or fallback_category).strip().lower()

        lat = self._safe_float(row.get("lat") or row.get("latitude") or tags.get("lat"))
        lon = self._safe_float(row.get("lon") or row.get("longitude") or tags.get("lon"))

        if not name and not address:
            return None

        search_parts = [category, name, address, phone, website, opening_hours]
        if tags:
            search_parts.extend(str(value) for value in tags.values())
        search_blob = " ".join(part.lower() for part in search_parts if isinstance(part, str) and part)

        return PlaceRecord(
            category=category,
            name=name or address,
            lat=lat,
            lon=lon,
            address=address,
            phone=phone or None,
            website=website or None,
            opening_hours=opening_hours or None,
            tags=tags,
            source_file=source_name,
            raw=row,
            search_blob=search_blob,
        )

    def search_places(
        self,
        categories: Optional[Set[str]] = None,
        keywords: Optional[List[str]] = None,
        start_coords: Optional[Dict[str, float]] = None,
        limit: int = 40,
    ) -> List[PlaceRecord]:
        if not self.available:
            return []

        normalized_categories = {cat.lower() for cat in categories or set() if cat}
        keyword_list = [kw.lower() for kw in keywords or [] if kw and len(kw) > 2]

        scored: List[Tuple[float, float, PlaceRecord]] = []
        for place in self.places:
            score = 0.0

            if normalized_categories:
                if place.category in normalized_categories:
                    score += 3.0
                elif not keyword_list:
                    continue
            else:
                score += 1.0

            if keyword_list:
                matches = sum(1 for kw in keyword_list if kw in place.search_blob)
                if matches:
                    score += matches * 1.5
                elif not normalized_categories:
                    continue

            distance = None
            if start_coords and place.has_coordinates():
                distance = place.distance_km(start_coords["lat"], start_coords["lon"])
                if distance is not None:
                    if distance <= 1.0:
                        score += 3.0
                    elif distance <= 3.0:
                        score += 2.0
                    elif distance <= 7.0:
                        score += 1.0

            if score <= 0:
                continue

            scored.append((score, distance if distance is not None else float("inf"), place))

        scored.sort(key=lambda item: (-item[0], item[1]))
        return [place for _, _, place in scored[:limit]]


local_places_db = LocalPlacesDatabase(EXPORT_DATA_DIR)


def get_category_title(category: str) -> str:
    return CATEGORY_TITLES.get(category.lower(), category.replace("_", " ").title())


def infer_categories_from_answers(answers: Dict[str, str]) -> Set[str]:
    categories: Set[str] = set()
    type_answer = (answers.get('type') or '').lower()
    for hint, cats in TYPE_CATEGORY_HINTS.items():
        if hint in type_answer:
            categories.update(cats)

    for field in ("preferences", "activities", "food", "limits"):
        value = (answers.get(field) or '').lower()
        if not value:
            continue
        for hint, cats in KEYWORD_CATEGORY_HINTS.items():
            if hint in value:
                categories.update(cats)

    if not categories:
        categories.update(DEFAULT_CATEGORY_FALLBACK)

    return categories


def extract_keywords_from_answers(answers: Dict[str, str]) -> List[str]:
    sources = []
    for field in ("preferences", "activities", "food", "limits", "type"):
        value = answers.get(field)
        if not value:
            continue
        text = value.strip().lower()
        if text and text not in {"нет", "не знаю", "-"}:
            sources.append(text)

    if not sources:
        return []

    tokens = re.findall(r"[a-zA-Zа-яА-ЯёЁ0-9\-]{3,}", " ".join(sources))
    unique: List[str] = []
    seen: Set[str] = set()
    for token in tokens:
        normalized = token.lower()
        if normalized not in seen:
            seen.add(normalized)
            unique.append(normalized)
    return unique[:40]


def collect_local_places(answers: Dict[str, str], start_coords: Optional[Dict[str, float]]) -> List[PlaceRecord]:
    if not local_places_db.available:
        return []

    categories = infer_categories_from_answers(answers)
    keywords = extract_keywords_from_answers(answers)

    places = local_places_db.search_places(categories=categories, keywords=keywords, start_coords=start_coords)

    if not places and keywords:
        places = local_places_db.search_places(categories=set(), keywords=keywords, start_coords=start_coords)

    if not places:
        places = local_places_db.search_places(categories=DEFAULT_CATEGORY_FALLBACK, keywords=[], start_coords=start_coords)

    return places


def format_places_for_prompt(places: List[PlaceRecord], limit: int = 20) -> str:
    if not places:
        return "Локально релевантные места не найдены в базе данных."

    rows = []
    for place in places[:limit]:
        coords = f"{place.lat:.6f}, {place.lon:.6f}" if place.has_coordinates() else "не указаны"
        parts = [
            f"{get_category_title(place.category)} — {place.name}",
            f"Адрес: {place.address or 'не указан'}",
            f"Координаты: {coords}",
        ]
        if place.website:
            parts.append(f"Сайт: {place.website}")
        if place.opening_hours:
            parts.append(f"Время работы: {place.opening_hours}")
        rows.append("; ".join(parts))
    return "\n".join(rows)


def calculate_distance_between(coords_a: Optional[Tuple[float, float]], coords_b: Optional[Tuple[float, float]]) -> Optional[float]:
    if not coords_a or not coords_b:
        return None
    lat1, lon1 = coords_a
    lat2, lon2 = coords_b
    r = 6371.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)
    a = math.sin(d_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return r * c


def build_structured_route(
    places: List[PlaceRecord],
    start_coords: Optional[Dict[str, float]],
    min_points: int = 3,
    max_points: int = 5,
) -> List[PlaceRecord]:
    if not places:
        return []

    with_coords = [p for p in places if p.has_coordinates()]
    without_coords = [p for p in places if not p.has_coordinates()]

    pool = with_coords if with_coords else places
    pool = pool[: max_points * 2]

    route: List[PlaceRecord] = []

    current_coords: Optional[Tuple[float, float]] = None
    if start_coords:
        current_coords = (start_coords["lat"], start_coords["lon"])
    elif pool and pool[0].has_coordinates():
        current_coords = (pool[0].lat, pool[0].lon)

    remaining = pool.copy()
    while remaining and len(route) < max_points:
        if current_coords:
            remaining_with_coords = [p for p in remaining if p.has_coordinates()]
            if remaining_with_coords:
                nearest = min(
                    remaining_with_coords,
                    key=lambda p: calculate_distance_between(current_coords, (p.lat, p.lon)) or float("inf"),
                )
            else:
                nearest = remaining[0]
        else:
            nearest = remaining[0]

        route.append(nearest)
        remaining.remove(nearest)
        if nearest.has_coordinates():
            current_coords = (nearest.lat, nearest.lon)

    if len(route) < min_points:
        extras = [p for p in (with_coords + without_coords) if p not in route]
        for place in extras:
            route.append(place)
            if len(route) >= min_points:
                break

    return route[:max_points]


def format_structured_route_for_prompt(
    structured_route: List[PlaceRecord],
    start_point_text: str,
    start_coords: Optional[Dict[str, float]],
) -> str:
    if not structured_route:
        return "Готовый список точек не сформирован, составь маршрут на основе общих предпочтений."

    lines = []
    if start_point_text:
        if start_coords:
            lines.append(
                f"0. Старт — {start_point_text} (координаты: {start_coords['lat']:.6f}, {start_coords['lon']:.6f})"
            )
        else:
            lines.append(f"0. Старт — {start_point_text}")

    prev_coords = (start_coords['lat'], start_coords['lon']) if start_coords else None
    for idx, place in enumerate(structured_route, start=1):
        coords_text = f"{place.lat:.6f}, {place.lon:.6f}" if place.has_coordinates() else "не указаны"
        distance_text = "—"
        if place.has_coordinates() and prev_coords:
            distance = calculate_distance_between(prev_coords, (place.lat, place.lon))
            if distance is not None:
                distance_text = f"≈{distance:.1f} км"
        prev_coords = (place.lat, place.lon) if place.has_coordinates() else prev_coords

        parts = [
            f"{idx}. {place.name} ({get_category_title(place.category)})",
            f"Адрес: {place.address or '—'}",
            f"Координаты: {coords_text}",
            f"Дистанция от предыдущей точки: {distance_text}",
        ]
        if place.website:
            parts.append(f"Официальный сайт: {place.website}")
        if place.opening_hours:
            parts.append(f"Время работы: {place.opening_hours}")
        lines.append("; ".join(parts))

    return "\n".join(lines)


def serialize_structured_route(structured_route: List[PlaceRecord]) -> List[Dict[str, Optional[str]]]:
    serialized = []
    for idx, place in enumerate(structured_route, start=1):
        serialized.append({
            "order": idx,
            "category": place.category,
            "name": place.name,
            "address": place.address,
            "lat": place.lat,
            "lon": place.lon,
            "phone": place.phone,
            "website": place.website,
            "opening_hours": place.opening_hours,
            "source_file": place.source_file,
        })
    return serialized


def prepare_map_points(
    start_coords: Optional[Dict[str, float]],
    structured_route: List[PlaceRecord],
) -> List[Dict[str, float]]:
    points: List[Dict[str, float]] = []
    if start_coords:
        points.append({
            "lat": start_coords["lat"],
            "lon": start_coords["lon"],
            "address": start_coords.get("address", "Стартовая точка"),
        })
    for place in structured_route:
        if place.has_coordinates():
            points.append({
                "lat": place.lat,
                "lon": place.lon,
                "address": place.address or place.name,
            })
    return points

# ==========================================
# Этапы диалога Telegram-бота
# ==========================================
(ASK_TIME, ASK_DURATION, ASK_TYPE, ASK_START_POINT, ASK_BUDGET,
 ASK_PREFERENCES, ASK_ACTIVITIES, ASK_FOOD, ASK_TRANSPORT, ASK_LIMITS) = range(10)

# Используем словарь для хранения данных пользователей
user_data_store = {}

# Кэш для геокодирования (чтобы уменьшить количество запросов к API)
geocoding_cache = {}

# ==========================================
# Вспомогательные функции
# ==========================================
def normalize_address(address: str) -> str:
    """Нормализация адреса для улучшения геокодирования"""
    address = address.lower().strip()
    # Заменяем сокращения
    replacements = {
        "ул.": "улица",
        "пр.": "проспект",
        "пер.": "переулок",
        "пл.": "площадь",
        "наб.": "набережная",
        "б-р": "бульвар",
        "м.": "метро",
        "ст.": "станция",
        "ш.": "шоссе"
    }
    for short, full in replacements.items():
        address = address.replace(short, full)
    # Добавляем "Москва" если не указано
    if "москва" not in address:
        address = f"москва, {address}"
    return address.title()

def split_long_message(text: str, max_length: int = 4000) -> List[str]:
    """Разделяет длинное сообщение на части"""
    if len(text) <= max_length:
        return [text]
    # Пытаемся разбить по абзацам
    paragraphs = text.split('\n')
    result = []
    current_part = ""
    for paragraph in paragraphs:
        if len(current_part) + len(paragraph) + 2 > max_length:
            if current_part:
                result.append(current_part)
                current_part = paragraph
            else:
                # Абзац слишком длинный, разбиваем по предложениям
                sentences = re.split(r'(?<=[.!?])\s+', paragraph)
                for sentence in sentences:
                    if len(current_part) + len(sentence) + 1 > max_length:
                        if current_part:
                            result.append(current_part)
                            current_part = sentence
                        else:
                            # Предложение слишком длинное, разбиваем принудительно
                            parts = [sentence[i:i + max_length] for i in range(0, len(sentence), max_length)]
                            result.extend(parts[:-1])
                            current_part = parts[-1]
                    else:
                        current_part += " " + sentence if current_part else sentence
        else:
            current_part += "\n" + paragraph if current_part else paragraph

    if current_part:
        result.append(current_part)
    return result

def clean_ai_response(text: str) -> str:
    """Очищает ответ ИИ от ненужных символов форматирования"""
    # Убираем ### и другие маркеры заголовков
    text = re.sub(r'#+\s*', '', text)
    # Заменяем ** на 🔸
    text = re.sub(r'\*\*(.*?)\*\*', r'🔸 \1', text)
    # Заменяем * на •
    text = re.sub(r'\*(.*?)\*', r'• \1', text)
    # Убираем лишние пробелы
    text = re.sub(r'\n\s+\n', '\n', text)
    # Убеждаемся, что есть правильные отступы
    text = re.sub(r'^(\d+[\.\)]?)', r'\n\1', text, flags=re.MULTILINE)
    return text.strip()

# ==========================================
# Функции для работы с Яндекс API
# ==========================================
async def geocode_address(address: str) -> Optional[Dict]:
    """Геокодирование адреса с помощью Яндекс API с кэшированием"""
    normalized_address = normalize_address(address)
    # Проверяем кэш
    if normalized_address in geocoding_cache:
        return geocoding_cache[normalized_address]

    url = "https://geocode-maps.yandex.ru/1.x/"
    params = {
        "apikey": YANDEX_GEOCODER_API_KEY,
        "geocode": normalized_address,
        "format": "json",
        "results": 1
    }

    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params, timeout=10) as response:
                data = await response.json()
                if response.status == 200 and data.get('response', {}).get('GeoObjectCollection', {}).get(
                        'featureMember'):
                    feature = data['response']['GeoObjectCollection']['featureMember'][0]['GeoObject']
                    point = feature['Point']['pos'].split()
                    result = {
                        "lat": float(point[1]),
                        "lon": float(point[0]),
                        "address": feature['metaDataProperty']['GeocoderMetaData']['text'],
                        "precision": feature['metaDataProperty']['GeocoderMetaData']['precision']
                    }
                    # Сохраняем в кэш
                    geocoding_cache[normalized_address] = result
                    return result
        return None
    except asyncio.TimeoutError:
        logging.error(f"Таймаут при геокодировании адреса: {address}")
        return None
    except Exception as e:
        logging.error(f"Ошибка геокодирования адреса {address}: {e}")
        return None

async def generate_map_image(points: List[Dict]) -> Optional[str]:
    """Генерация изображения карты с маршрутом и точками"""
    if not points or len(points) < 2:
        logging.info("Недостаточно точек для генерации изображения карты.")
        return None

    try:
        # Формируем маркеры точек
        points_str = "~".join([f"{point['lon']},{point['lat']},pm2rdl{i + 1}" for i, point in enumerate(points)])
        # Формируем линию маршрута
        route_line = ",".join([f"{point['lon']},{point['lat']}" for point in points])

        url = "https://static-maps.yandex.ru/v1"
        params = {
            "apikey": YANDEX_STATIC_MAPS_API_KEY,
            "size": "650,450",
            "z": "13",
            "l": "map",
            "pt": points_str, # Добавляем маркеры
            "pl": f"c:8822DDC0,w:5,{route_line}" # Добавляем линию маршрута
        }

        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params, timeout=15) as response:
                if response.status == 200:
                    filename = f"map_{uuid.uuid4().hex}.png"
                    with open(filename, "wb") as f:
                        f.write(await response.read())
                    logging.info(f"Карта сохранена как {filename}")
                    return filename
                else:
                    logging.error(f"Ошибка при генерации карты: {response.status}")
                    return None
        return None
    except asyncio.TimeoutError:
        logging.error("Таймаут при генерации карты")
        return None
    except Exception as e:
        logging.error(f"Ошибка генерации карты: {e}")
        return None

def generate_yandex_maps_url(points: List[Dict]) -> Optional[str]:
    """Генерирует URL для открытия маршрута в Яндекс.Картах"""
    if not points or len(points) < 2:
        logging.info("Недостаточно точек для генерации URL маршрута.")
        return None
    # Формируем параметры для URL (используем rtext для построения маршрута)
    # Формат: rtext=широта,долгота~широта,долгота
    points_str = "~".join([f"{point['lat']},{point['lon']}" for point in points])
    url = f"https://yandex.ru/maps/?rtext={points_str}&rtt=pd"
    logging.info(f"Сгенерирован URL маршрута: {url}")
    return url

# ==========================================
# Улучшенные функции диалога
# ==========================================
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.message.from_user.id
    user_data_store[user_id] = {
        "user_name": update.message.from_user.first_name,
        "created_at": datetime.now().isoformat(),
        "conversation_lock": asyncio.Lock(),
        "answers": {}
    }

    await update.message.reply_text(
        f"Привет, {update.message.from_user.first_name}! 👋\n"
        "Я твой персональный гид по Москве! 🏛️\n"
        "Давай вместе создадим идеальный маршрут, который точно подойдет именно тебе!\n\n"
        "Для начала расскажи, во сколько ты планируешь начать прогулку?\n"
        "⏰ (например: 10:00, после обеда, вечером)"
    )
    return ASK_TIME

async def ask_duration(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.message.from_user.id
    async with user_data_store[user_id]["conversation_lock"]:
        user_data_store[user_id]['time'] = update.message.text
        user_data_store[user_id]['answers']['time'] = update.message.text

    # Сохраняем данные для обучения
    db_manager.save_dialog(user_id, "time", "Во сколько планируете начать прогулку?", update.message.text)

    await update.message.reply_text(
        "Отлично! ⏳\n"
        "Сколько времени ты хочешь посвятить прогулке?\n\n"
        "🕒 Например:\n"
        "• 2-3 часа для короткой прогулки\n"
        "• 4-5 часов для полноценной экскурсии\n"
        "• Целый день для максимального погружения"
    )
    return ASK_DURATION

async def ask_type(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.message.from_user.id
    async with user_data_store[user_id]["conversation_lock"]:
        user_data_store[user_id]['duration'] = update.message.text
        user_data_store[user_id]['answers']['duration'] = update.message.text

    # Сохраняем данные для обучения
    db_manager.save_dialog(user_id, "duration", "Сколько времени хотите посвятить прогулке?", update.message.text)

    await update.message.reply_text(
        "Какой тип прогулки тебе ближе? 🎯\n\n"
        "1. 🎨 Культурная (музеи, галереи, выставки)\n"
        "2. 🏛️ Историческая (Кремль, Красная площадь, старинные усадьбы)\n"
        "3. 🎪 Развлекательная (парки, аттракционы, шоу)\n"
        "4. 💖 Романтическая (уютные уголки, красивые виды)\n"
        "5. 👨‍👩‍👧‍👦 Семейная (интересно и детям, и взрослым)\n"
        "6. 🏃‍♂️ Спортивная/активная (велопрогулки, пробежки)\n"
        "7. 🍽️ Гастрономическая (рестораны, кафе, фуд-корты)\n"
        "8. 🛍️ Шопинг (торговые центры, бутики, рынки)\n"
        "9. 🎭 Другое (опиши своими словами)"
    )
    return ASK_TYPE

async def ask_start_point(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.message.from_user.id
    async with user_data_store[user_id]["conversation_lock"]:
        user_data_store[user_id]['type'] = update.message.text
        user_data_store[user_id]['answers']['type'] = update.message.text

    # Сохраняем данные для обучения
    db_manager.save_dialog(user_id, "type", "Какой тип прогулки предпочитаете?", update.message.text)

    await update.message.reply_text(
        "Откуда тебе удобно начать маршрут? 🗺️\n\n"
        "Укажи конкретное место:\n"
        "• Метро (например: Китай-город, Охотный ряд)\n"
        "• Улица и дом (например: ул. Арбат, 45)\n"
        "• Достопримечательность (например: Красная площадь)\n"
        "• Район (например: от Замоскворечья)\n\n"
        "💡 Совет: чем точнее адрес, тем лучше будет маршрут!"
    )
    return ASK_START_POINT

async def ask_budget(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.message.from_user.id
    async with user_data_store[user_id]["conversation_lock"]:
        user_data_store[user_id]['start_point'] = update.message.text
        user_data_store[user_id]['answers']['start_point'] = update.message.text

    # Сохраняем данные для обучения
    db_manager.save_dialog(user_id, "start_point", "Откуда удобно начать маршрут?", update.message.text)

    await update.message.reply_text(
        "Какой бюджет ты планируешь на прогулку? 💰\n\n"
        "1. 🎗️ Эконом (бесплатные мероприятия, пикник)\n"
        "2. 💵 Средний (недорогие музеи, кафе, общественный транспорт)\n"
        "3. 💎 Премиум (рестораны, такси, VIP-экскурсии)\n"
        "4. 🚀 Не ограничен (лучшие места города)"
    )
    return ASK_BUDGET

async def ask_preferences(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.message.from_user.id
    async with user_data_store[user_id]["conversation_lock"]:
        user_data_store[user_id]['budget'] = update.message.text
        user_data_store[user_id]['answers']['budget'] = update.message.text

    # Сохраняем данные для обучения
    db_manager.save_dialog(user_id, "budget", "Какой бюджет планируете?", update.message.text)

    await update.message.reply_text(
        "Есть ли конкретные места, которые ты хотел бы посетить? 📍\n\n"
        "Можешь перечислить:\n"
        "• Достопримечательности (Кремль, ВДНХ, Останкинская башня)\n"
        "• Районы (Арбат, Замоскворечье, Хамовники)\n"
        "• Парки (Парк Горького, Сокольники, Коломенское)\n"
        "• Музеи (Третьяковка, Пушкинский, Исторический)\n\n"
        "Или просто напиши 'нет', если у тебя нет предпочтений"
    )
    return ASK_PREFERENCES

async def ask_activities(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.message.from_user.id
    async with user_data_store[user_id]["conversation_lock"]:
        user_data_store[user_id]['preferences'] = update.message.text
        user_data_store[user_id]['answers']['preferences'] = update.message.text

    # Сохраняем данные для обучения
    db_manager.save_dialog(user_id, "preferences", "Какие места хотите посетить?", update.message.text)

    await update.message.reply_text(
        "Какие активности тебе интересны? 🎭\n\n"
        "Выбери несколько вариантов:\n"
        "• 🖼️ Посещение музеев и выставок\n"
        "• 🏛️ Осмотр архитектуры и памятников\n"
        "• 🌳 Прогулки по паркам и набережным\n"
        "• 🛍️ Шопинг в торговых центрах\n"
        "• 📸 Фотосессии в красивых местах\n"
        "• 🍽️ Посещение кафе и ресторанов\n"
        "• 🎡 Развлечения и аттракционы\n"
        "• 🎭 Театры и концерты\n"
        "• 🚶‍♂️ Просто прогуляться без цели"
    )
    return ASK_ACTIVITIES

async def ask_food(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.message.from_user.id
    async with user_data_store[user_id]["conversation_lock"]:
        user_data_store[user_id]['activities'] = update.message.text
        user_data_store[user_id]['answers']['activities'] = update.message.text

    # Сохраняем данные для обучения
    db_manager.save_dialog(user_id, "activities", "Какие активности интересны?", update.message.text)

    await update.message.reply_text(
        "Как насчет питания во время прогулки? 🍽️\n\n"
        "1. 🍔 Бюджетные варианты (столовые, фудкорты)\n"
        "2. 🍕 Средний уровень (кафе, бистро)\n"
        "3. 🍷 Премиум-заведения (рестораны, бары)\n"
        "4. 🚫 Не нужно, поем дома\n"
        "5. 🥗 Особые предпочтения (вегетарианское, безглютеновое и т.д.)"
    )
    return ASK_FOOD

async def ask_transport(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.message.from_user.id
    async with user_data_store[user_id]["conversation_lock"]:
        user_data_store[user_id]['food'] = update.message.text
        user_data_store[user_id]['answers']['food'] = update.message.text

    # Сохраняем данные для обучения
    db_manager.save_dialog(user_id, "food", "Как насчет питания?", update.message.text)

    await update.message.reply_text(
        "Как ты планируешь перемещаться по городу? 🚗\n\n"
        "1. 🚶‍♂️ Пешком (для небольших расстояний)\n"
        "2. 🚇 На общественном транспорте (метро, автобусы)\n"
        "3. 🚕 На такси/каршеринге (максимум комфорта)\n"
        "4. 🚲 На велосипеде/самокате (активный вариант)\n"
        "5. 🔀 Смешанный вариант (что-то пешком, что-то на транспорте)"
    )
    return ASK_TRANSPORT

async def ask_limits(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.message.from_user.id
    async with user_data_store[user_id]["conversation_lock"]:
        user_data_store[user_id]['transport'] = update.message.text
        user_data_store[user_id]['answers']['transport'] = update.message.text

    # Сохраняем данные для обучения
    db_manager.save_dialog(user_id, "transport", "Как планируете перемещаться?", update.message.text)

    await update.message.reply_text(
        "Последний вопрос! Есть ли особые пожелания или ограничения? 🚧\n\n"
        "Например:\n"
        "• ♿ Доступная среда (для людей с ограниченной подвижностью)\n"
        "• 👶 С детьми (укажи возраст)\n"
        "• 🚷 Избегать толп/очередей\n"
        "• 🏛️ Предпочтение крытым/уличным мероприятиям\n"
        "• 🐕 С домашними животными\n"
        "• 🚭 Некурящие зоны\n"
        "• 🚫 Никаких ограничений"
    )
    return ASK_LIMITS

async def generate_route_with_retry(prompt: str, retries: int = 3) -> str:
    """Генерация краткого описания маршрута с повторными попытками и улучшенной обработкой ошибок"""
    for attempt in range(retries):
        try:
            response = await deepseek_client.chat.completions.create(
                model="deepseek-chat", # Используем deepseek-chat для рассуждений
                messages=[
                    {"role": "system", "content": """Ты — мой дружелюбный и опытный гид по Москве, который знает все самые интересные и уютные места в городе. Ты общаешься со мной как с другом, используя теплый, живой и немного разговорный стиль. Ты помогаешь мне составить идеальный маршрут, который будет не просто списком мест, а настоящим приключением!

ВАЖНЫЕ ПРАВИЛА ДЛЯ ТЕБЯ:
1.  **Актуальность:** Вся информация должна быть актуальной на 2025 год. Учитывай изменения в режиме работы, цены и доступность мест.
2.  **Ссылки:** Обязательно включай в ответы **ссылки на официальные сайты** всех упомянутых мест — ресторанов, театров, парков, музеев и т.д. (например: [Официальный сайт: https://example.com]). Без ссылок маршрут считается неполным!
3.  **Человечность:** Пиши как человек, а не робот. Используй эмодзи, обращения ("дорогой друг", "подруга"), восклицания, вопросы. Делай текст живым и приятным для чтения.
4.  **Формат:** Используй формат времени: 🕔 16:30 – 17:30 | Прогулка по парку «Тропарёво». Для каждого места указывай точный адрес в формате: [Адрес: ул. Примерная, 12].
5.  **Структура:** Составляй маршрут по следующей структуре:
    *   🎯 Название и краткое описание маршрута (с эмоциональным акцентом!)
    *   📍 Начальная точка и как добраться (с простыми инструкциями)
    *   🗓️ Детальный почасовой план (с описанием, что делать и почему это круто)
    *   💰 Примерный бюджет (с указанием, где можно сэкономить)
    *   🚌 Рекомендации по транспорту (с учетом выбранного пользователем способа)
    *   🍽️ Варианты питания (с описанием атмосферы и цен)
    *   💡 Советы и лайфхаки (как сделать прогулку еще лучше)
    *   🌧️ Альтернатива на случай непогоды (обязательно!)
6.  **Ограничения:** Все места в маршруте должны находиться **строго в пределах Москвы**. Не выходи за границы города.
7.  **Не используй символы ### для заголовков!**

Твоя цель — сделать так, чтобы я, прочитав маршрут, сразу захотел отправиться в путь! Давай сделаем это незабываемым!"""},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=2000,
                timeout=60.0
            )
            result = response.choices[0].message.content
            # Очищаем ответ от нежелательного форматирования
            result = clean_ai_response(result)
            return result
        except asyncio.TimeoutError:
            if attempt == retries - 1:
                raise Exception("Таймаут при подключении к API. Попробуйте позже.")
            await asyncio.sleep(2 ** attempt)
        except Exception as e:
            if attempt == retries - 1:
                error_msg = str(e).lower()
                if "401" in error_msg:
                    raise Exception("Ошибка аутентификации. Проверьте API-ключ DeepSeek.")
                elif "429" in error_msg:
                    raise Exception("Превышен лимит запросов. Попробуйте позже.")
                elif "500" in error_msg or "502" in error_msg or "503" in error_msg:
                    raise Exception("Временные проблемы с сервером DeepSeek. Попробуйте позже.")
                else:
                    raise Exception(f"Неизвестная ошибка: {e}")
            await asyncio.sleep(2 ** attempt)

# ==========================================
# Улучшенная функция финализации маршрута (новая)
# ==========================================
async def finalize(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.message.from_user.id
    # Проверяем, есть ли данные пользователя
    if user_id not in user_data_store:
        await update.message.reply_text("⚠️ Сессия устарела. Пожалуйста, начните заново с /start")
        return ConversationHandler.END

    async with user_data_store[user_id]["conversation_lock"]:
        user_data_store[user_id]['limits'] = update.message.text
        user_data_store[user_id]['answers']['limits'] = update.message.text

    # Сохраняем данные для обучения
    db_manager.save_dialog(user_id, "limits", "Есть ли особые пожелания или ограничения?", update.message.text)

    # Показываем анимацию процесса
    progress_message = await update.message.reply_text("🔄 Начинаю генерацию маршрута... 0%")

    # Обновляем прогресс
    for percent in range(10, 101, 10):
        try:
            await context.bot.edit_message_text(
                chat_id=update.message.chat_id,
                message_id=progress_message.message_id,
                text=f"🔄 Генерирую ваш персональный маршрут... {percent}%"
            )
            await asyncio.sleep(0.2)
        except:
            pass

    # Получаем координаты начальной точки
    start_point = user_data_store[user_id].get('start_point', '')
    start_coords = None
    if start_point:
        start_coords = await geocode_address(start_point)
        if not start_coords:
            await update.message.reply_text(
                "⚠️ Не удалось определить координаты начальной точки. "
                "Маршрут будет сгенерирован, но карта может быть неточной."
            )

    # Собираем локальные места на основе ответов
    answers_snapshot = dict(user_data_store[user_id].get('answers', {}))
    local_places = collect_local_places(answers_snapshot, start_coords)
    structured_route = build_structured_route(local_places, start_coords)
    structured_route_text = format_structured_route_for_prompt(
        structured_route,
        user_data_store[user_id].get('start_point', ''),
        start_coords,
    )
    local_places_text = format_places_for_prompt(local_places)

    prompt = f"""
Создай подробный персонализированный маршрут прогулки по Москве для пользователя {user_data_store[user_id].get('user_name', '')}.

ДАННЫЕ ПОЛЬЗОВАТЕЛЯ:
1. 🕐 Время начала: {user_data_store[user_id].get('time', 'не указано')}
2. ⏳ Продолжительность: {user_data_store[user_id].get('duration', 'не указана')}
3. 🎯 Тип прогулки: {user_data_store[user_id].get('type', 'не указан')}
4. 📍 Начальная точка: {user_data_store[user_id].get('start_point', 'не указана')}
5. 💰 Бюджет: {user_data_store[user_id].get('budget', 'не указан')}
6. ❤️ Предпочтения по местам: {user_data_store[user_id].get('preferences', 'не указаны')}
7. 🎭 Активности: {user_data_store[user_id].get('activities', 'не указаны')}
8. 🍽️ Питание: {user_data_store[user_id].get('food', 'не указано')}
9. 🚗 Транспорт: {user_data_store[user_id].get('transport', 'не указан')}
10. ⚠️ Ограничения: {user_data_store[user_id].get('limits', 'не указаны')}

ОСНОВНОЙ МАРШРУТ ИЗ ЛОКАЛЬНОЙ БАЗЫ (сохраняй порядок точек, продумывай переходы и дополняй подробностями):
{structured_route_text}

ДОПОЛНИТЕЛЬНЫЕ ВАРИАНТЫ ИЗ ЛОКАЛЬНОЙ БАЗЫ (используй только если нужно усилить маршрут, проверяя уместность):
{local_places_text}

ТРЕБОВАНИЯ К МАРШРУТУ:
1. Используй актуальную информацию на 2025 год (цены, режим работы, доступность мест)
2. Создай логически связанный маршрут, где точки находятся близко друг к другу
3. Учитывай выбранный тип транспорта и бюджет
4. Предложи альтернативные варианты на случай непогоды или других обстоятельств
5. Укажи точные адреса для каждого места в формате: [Адрес: ул. Примерная, 12]
6. Рассчитай время с учетом перемещения между точками
7. Укажи примерные цены на входные билеты и питание
8. Добавь интересные факты и советы для каждого места
9. Обязательно включи ссылки на официальные сайты всех упомянутых мест!
10. Все места должны находиться строго в пределах Москвы.
11. Основной маршрут должен включать 3–5 точек и следовать указанной последовательности из локальной базы.

СОЗДАЙ СТРУКТУРИРОВАННЫЙ МАРШРУТ С:
- Названием и описанием маршрута
- Детальным почасовым планом
- Точными адресами и способами перемещения
- Примерной стоимостью (где применимо)
- Персональными рекомендациями
- Советами и лайфхаками
- Альтернативой на случай непогоды

УБЕДИСЬ, ЧТО ВСЕ МЕСТА СУЩЕСТВУЮТ И АДРЕСА ТОЧНЫЕ.
НЕ ИСПОЛЬЗУЙ СИМВОЛЫ ### ДЛЯ ЗАГОЛОВКОВ!
"""

    try:
        # Генерируем маршрут через DeepSeek API
        route_description = await generate_route_with_retry(prompt)

        # Сохраняем ответ ИИ для обучения
        user_input = json.dumps(user_data_store[user_id]['answers'], ensure_ascii=False)
        db_manager.save_training_data(user_id, user_input, route_description)

        points = prepare_map_points(start_coords, structured_route)

        if len(points) < 2:
            address_pattern = r'\[Адрес:\s*([^\]]+)\]'
            extracted_addresses = []
            for match in re.findall(address_pattern, route_description):
                cleaned = match.strip()
                if cleaned and cleaned not in extracted_addresses:
                    extracted_addresses.append(cleaned)
            for address in extracted_addresses:
                coords = await geocode_address(address)
                if not coords:
                    continue
                already_present = any(
                    abs(point['lat'] - coords['lat']) < 1e-5 and abs(point['lon'] - coords['lon']) < 1e-5
                    for point in points
                )
                if not already_present:
                    points.append({
                        "lat": coords['lat'],
                        "lon": coords['lon'],
                        "address": coords.get('address', address),
                    })
                if len(points) >= 5:
                    break

        # Генерируем карту, если есть хотя бы 2 точки
        map_filename = None
        yandex_maps_url = None
        if len(points) >= 2:
            map_filename = await generate_map_image(points)
            yandex_maps_url = generate_yandex_maps_url(points)

    except Exception as e:
        logging.error(f"Ошибка при генерации маршрута: {e}")
        route_description = f"⚠️ Произошла ошибка при генерации маршрута: {str(e)}\n\nПожалуйста, попробуйте позже или начните заново с /start"
        map_filename = None
        yandex_maps_url = None

    # Завершаем анимацию прогресса
    try:
        await context.bot.edit_message_text(
            chat_id=update.message.chat_id,
            message_id=progress_message.message_id,
            text="✅ Персональный маршрут успешно создан!"
        )
    except:
        pass

    # Сохраняем маршрут в контексте для возможного сохранения
    context.user_data['generated_route'] = route_description
    context.user_data['map_filename'] = map_filename
    context.user_data['yandex_maps_url'] = yandex_maps_url
    context.user_data['user_answers'] = user_data_store[user_id]['answers']
    context.user_data['structured_route'] = serialize_structured_route(structured_route)
    context.user_data['structured_route_text'] = structured_route_text

    # Отправляем карту, если она сгенерирована
    if map_filename:
        try:
            with open(map_filename, 'rb') as map_file:
                caption = "🗺️ Карта вашего маршрута с отмеченными точками"
                if yandex_maps_url:
                    caption += f"\n📍 Открыть в Яндекс.Картах: {yandex_maps_url}"
                await update.message.reply_photo(
                    photo=map_file,
                    caption=caption
                )
        except Exception as e:
            logging.error(f"Ошибка отправки карты: {e}")
            # Если не удалось отправить карту, отправляем ссылку
            if yandex_maps_url:
                await update.message.reply_text(
                    f"📍 Открыть маршрут в Яндекс.Картах:\n{yandex_maps_url}"
                )
    elif yandex_maps_url:
        await update.message.reply_text(
            f"📍 Открыть маршрут в Яндекс.Картах:\n{yandex_maps_url}"
        )

    # Отправляем текстовый маршрут частями
    message_parts = split_long_message(route_description)
    for i, part in enumerate(message_parts):
        if i == 0:
            await update.message.reply_text(f"📝 Ваш персональный маршрут:\n\n{part}")
        else:
            await update.message.reply_text(part)
        await asyncio.sleep(0.5)  # Небольшая задержка между сообщениями

    # Добавляем кнопку для сохранения маршрута
    keyboard = [["💾 Сохранить маршрут"]]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    await update.message.reply_text(
        "✨ Ваш персональный маршрут готов! ✨\n\n"
        "Вы можете сохранить его для будущего использования или создать новый маршрут с помощью /start\n\n"
        "Приятной прогулки по Москве! 🏛️",
        reply_markup=reply_markup
    )

    return ConversationHandler.END

# ==========================================
# Функции для работы с сохраненными маршрутами
# ==========================================
async def save_route_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработчик кнопки сохранения маршрута"""
    user_id = update.message.from_user.id

    if 'generated_route' not in context.user_data:
        await update.message.reply_text(
            "⚠️ Нет активного маршрута для сохранения. Создайте новый маршрут с помощью /start",
            reply_markup=ReplyKeyboardRemove()
        )
        return

    # Извлекаем название маршрута из текста
    route_text = context.user_data['generated_route']
    route_name_match = re.search(r'🎯\s*(.*?)\n', route_text)
    if route_name_match:
        route_name = route_name_match.group(1).strip()
    else:
        # Используем первую строку как название
        route_name = route_text.split('\n')[0].strip()[:30] + "..."

    # Сохраняем маршрут в базу данных
    route_data = json.dumps({
        "route_text": route_text,
        "map_filename": context.user_data.get('map_filename'),
        "yandex_maps_url": context.user_data.get('yandex_maps_url'),
        "user_answers": context.user_data.get('user_answers', {}),
        "structured_route": context.user_data.get('structured_route', []),
        "structured_route_text": context.user_data.get('structured_route_text'),
        "created_at": datetime.now().isoformat()
    }, ensure_ascii=False)

    # Используем менеджер базы данных для сохранения
    success = db_manager.save_route(
        user_id=user_id,
        user_name=update.message.from_user.first_name,
        route_name=route_name,
        route_data=route_data
    )

    if success:
        await update.message.reply_text(
            f"✅ Маршрут '{route_name}' успешно сохранен!\n\n"
            "Вы можете просмотреть свои сохраненные маршруты с помощью команды /my_routes",
            reply_markup=ReplyKeyboardRemove()
        )
    else:
        await update.message.reply_text(
            "❌ Не удалось сохранить маршрут. Попробуйте позже.",
            reply_markup=ReplyKeyboardRemove()
        )

    # Очищаем данные пользователя
    if user_id in user_data_store:
        del user_data_store[user_id]

    # Очищаем контекст
    context.user_data.pop('generated_route', None)
    context.user_data.pop('map_filename', None)
    context.user_data.pop('yandex_maps_url', None)
    context.user_data.pop('user_answers', None)
    context.user_data.pop('structured_route', None)
    context.user_data.pop('structured_route_text', None)

async def my_routes(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Показать сохраненные маршруты пользователя"""
    user_id = update.message.from_user.id
    routes = db_manager.get_user_routes(user_id)

    if not routes:
        await update.message.reply_text("У вас пока нет сохраненных маршрутов.")
        return

    message = "📁 Ваши сохраненные маршруты:\n\n"
    for i, (route_id, route_name, created_at) in enumerate(routes, 1):
        try:
            date = datetime.strptime(created_at, "%Y-%m-%d %H:%M:%S").strftime("%d.%m.%Y")
        except:
            date = created_at.split()[0] if isinstance(created_at, str) else "неизвестно"
        message += f"{i}. {route_name} (создан {date})\n   /route_{route_id}\n\n"

    await update.message.reply_text(message)

async def show_route(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Показать конкретный сохраненный маршрут"""
    user_id = update.message.from_user.id
    command = update.message.text

    # Извлекаем ID маршрута из команды
    try:
        route_id = int(command.replace('/route_', ''))
    except ValueError:
        await update.message.reply_text("Неверный формат команды.")
        return

    # Получаем маршрут из базы данных
    route = db_manager.get_route_by_id(route_id, user_id)
    if not route:
        await update.message.reply_text("Маршрут не найден или у вас нет доступа к нему.")
        return

    route_name, route_data_json = route
    route_data = json.loads(route_data_json)

    # Отправляем маршрут
    message_parts = split_long_message(route_data['route_text'])
    for i, part in enumerate(message_parts):
        if i == 0:
            await update.message.reply_text(f"📝 {route_name}:\n\n{part}")
        else:
            await update.message.reply_text(part)
        await asyncio.sleep(0.5)

    # Если есть ссылка на карту, отправляем ее
    if route_data.get('yandex_maps_url'):
        await update.message.reply_text(
            f"📍 Открыть маршрут в Яндекс.Картах:\n{route_data['yandex_maps_url']}"
        )

async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.message.from_user.id
    if user_id in user_data_store:
        del user_data_store[user_id]

    await update.message.reply_text(
        "Прогулка отменена. Если передумаешь, просто введи /start 🎯\n\n"
        "Жду тебя для новых приключений по Москве! 🏛️",
        reply_markup=ReplyKeyboardRemove()
    )
    return ConversationHandler.END

async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик ошибок для телеграм бота"""
    logging.error("Exception while handling an update:", exc_info=context.error)
    if update and update.message:
        try:
            await update.message.reply_text(
                "⚠️ Произошла непредвиденная ошибка. Пожалуйста, попробуйте еще раз позже.\n\n"
                "Если проблема повторяется, введи /start для начала заново.",
                reply_markup=ReplyKeyboardRemove()
            )
        except:
            pass

# ==========================================
# Основная функция
# ==========================================
def main():
    TELEGRAM_TOKEN = "8026850963:AAFxNcGhTgrisb2cw7ZaV_Dp-Ybug9mb3MU"

    app = ApplicationBuilder().token(TELEGRAM_TOKEN).build()
    app.add_error_handler(error_handler)

    conv_handler = ConversationHandler(
        entry_points=[CommandHandler('start', start)],
        states={
            ASK_TIME: [MessageHandler(filters.TEXT & ~filters.COMMAND, ask_duration)],
            ASK_DURATION: [MessageHandler(filters.TEXT & ~filters.COMMAND, ask_type)],
            ASK_TYPE: [MessageHandler(filters.TEXT & ~filters.COMMAND, ask_start_point)],
            ASK_START_POINT: [MessageHandler(filters.TEXT & ~filters.COMMAND, ask_budget)],
            ASK_BUDGET: [MessageHandler(filters.TEXT & ~filters.COMMAND, ask_preferences)],
            ASK_PREFERENCES: [MessageHandler(filters.TEXT & ~filters.COMMAND, ask_activities)],
            ASK_ACTIVITIES: [MessageHandler(filters.TEXT & ~filters.COMMAND, ask_food)],
            ASK_FOOD: [MessageHandler(filters.TEXT & ~filters.COMMAND, ask_transport)],
            ASK_TRANSPORT: [MessageHandler(filters.TEXT & ~filters.COMMAND, ask_limits)],
            ASK_LIMITS: [MessageHandler(filters.TEXT & ~filters.COMMAND, finalize)],
        },
        fallbacks=[CommandHandler('cancel', cancel)],
        allow_reentry=True
    )

    # Добавляем обработчики команд
    app.add_handler(conv_handler)
    app.add_handler(MessageHandler(filters.Regex(r'^💾 Сохранить маршрут$'), save_route_handler))
    app.add_handler(CommandHandler('my_routes', my_routes))
    app.add_handler(MessageHandler(filters.Regex(r'^/route_\d+$'), show_route))

    print("🤖 Бот запущен...")
    app.run_polling()

if __name__ == '__main__':
    main()
