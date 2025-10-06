from __future__ import annotations

from typing import Dict, Iterable, List

import httpx
import time
import logging

from ..config import settings
from ..schemas import Place
from .yandex import _haversine  # reuse distance helper


TAG_MAPPINGS: Dict[str, Dict[str, str]] = {
    "cafe": {"amenity": "cafe"},
    "coffee": {"amenity": "cafe"},
    "restaurant": {"amenity": "restaurant"},
    "bar": {"amenity": "bar"},
    "park": {"leisure": "park"},
    "museum": {"tourism": "museum"},
    "theatre": {"amenity": "theatre"},
    "cinema": {"amenity": "cinema"},
    "gallery": {"tourism": "gallery"},
    "sight": {"tourism": "attraction"},
}


async def fetch_places(
    *,
    lat: float,
    lon: float,
    radius: int,
    tags: Iterable[str],
    limit: int = 20,
) -> List[Place]:
    statements: List[str] = []
    for tag in tags:
        mapping = TAG_MAPPINGS.get(tag.lower(), {"amenity": tag})
        for key, value in mapping.items():
            statements.append(f'node["{key}"="{value}"](around:{radius},{lat},{lon});')
            statements.append(f'way["{key}"="{value}"](around:{radius},{lat},{lon});')
            statements.append(f'relation["{key}"="{value}"](around:{radius},{lat},{lon});')

    if not statements:
        statements.append(f'node["tourism"="attraction"](around:{radius},{lat},{lon});')
        statements.append(f'way["tourism"="attraction"](around:{radius},{lat},{lon});')

    query = "[out:json][timeout:25];(" + "".join(statements) + ");out center {limit};"

    started = time.perf_counter()
    async with httpx.AsyncClient(timeout=httpx.Timeout(connect=5.0, read=25.0, write=25.0, pool=5.0)) as client:
        response = await client.post(settings.overpass_endpoint, data={"data": query})

    if response.status_code != 200:
        return []

    data = response.json()
    elements = data.get("elements", [])
    places: List[Place] = []
    for element in elements[:limit]:
        tags_dict = element.get("tags", {})
        name = tags_dict.get("name") or "Неизвестное место"
        lat_value = element.get("lat") or element.get("center", {}).get("lat")
        lon_value = element.get("lon") or element.get("center", {}).get("lon")
        if lat_value is None or lon_value is None:
            continue

        address_parts = [
            tags_dict.get("addr:street"),
            tags_dict.get("addr:housenumber"),
        ]
        address = ", ".join(part for part in address_parts if part)
        if not address:
            address = "Москва"

        categories = [tags_dict.get("amenity"), tags_dict.get("tourism"), tags_dict.get("leisure")]
        categories = [cat for cat in categories if cat]

        distance = int(_haversine(lat, lon, lat_value, lon_value))
        places.append(
            Place(
                title=name,
                address=address,
                latitude=lat_value,
                longitude=lon_value,
                categories=categories or ["place"],
                source="overpass",
                distance_m=distance,
                external_id=str(element.get("id")),
                website=tags_dict.get("website"),
            )
        )

    elapsed = (time.perf_counter() - started) * 1000
    logging.getLogger(__name__).info(f"Overpass time: {elapsed:.0f} ms, results={len(places)}")
    return places
