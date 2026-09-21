#!/usr/bin/env python3
"""
Script de migración: Convierte 18 tours del JSON API antiguo 
al nuevo formato API-local (helpers.ts/types) con mapas de idioma.

Input: src/data/api_tours_old.json (18 tours legacy)
Output: src/data/api/tours/items.json (formato API-local)
"""

import json, os, re

base = os.getcwd()

# Cargar tours legacy
legacy = json.load(open(f"{base}/src/data/api_tours_old.json", 'r', encoding='utf-8'))
items = legacy.get('items', [])

# Mapeo de categorías legacy → API-local
category_id_map = {
    "Naturaleza y Aventura": "trekking",
    "Cultural": "cultural",
    "Montañismo": "mountaineering",
    "Amazonía y Selva": "jungle",
    "City Tour": "city-tour",
}

# Mapeo de dificultad
difficulty_id_map = {
    "Baja": "easy",
    "Media": "medium",
    "Media-Alta": "intermediate",
    "Alta": "hard",
    "Media-Baja": "easy-medium",
}

default_tags = ["outdoor", "group"]

def _parse_days(days_str):
    if not days_str or days_str == "Consultar":
        return ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
    day_map = {
        "mon": "lunes", "tue": "martes", "wed": "miércoles",
        "thu": "jueves", "fri": "viernes", "sat": "sábado", "sun": "domingo",
        "lun": "lunes", "mar": "martes", "mie": "miércoles",
        "jue": "jueves", "vie": "viernes", "sáb": "sábado", "dom": "domingo"
    }
    parts = [d.strip().lower() for d in str(days_str).replace("Días de operación: ", "").rstrip('.').split(",")]
    return [day_map.get(p, p) for p in parts]

def _parse_price(price_str):
    if not price_str:
        return 0
    match = re.search(r'[\d.]+', price_str)
    return int(float(match.group())) if match else 0

def get_badge(duration):
    if "d" in duration:
        days = int(duration.replace("d", ""))
        if days >= 5:
            return "Expedición"
        elif days >= 2:
            return f"{days} Días"
        else:
            return "Día completo"
    else:
        match = re.match(r"(\d+)h", duration)
        if match:
            h = int(match.group(1))
            if h <= 4:
                return "Medio día"
            else:
                return "Día completo"
    return duration

# Convertir cada tour
new_items = []

for t in items:
    legacy_cat = t.get("category", "Cultural")
    cat_id = category_id_map.get(legacy_cat, "cultural")
    diff_slug = difficulty_id_map.get(t.get("operational", {}).get("difficulty", "Media"), "medium")
    description = t.get("shortDescription", "")

    program_days = []
    for idx, item in enumerate(t.get("itinerary", [])):
        program_days.append({
            "day": idx + 1,
            "stops": [{"time": "", "title": {"es": item, "en": item}}],
            "meals": [],
            "meals_not_included": [],
            "highlights": [],
            "activities": t.get("activities", [])
        })

    includes_data = [{"icon": "✓", "text": {"es": inc, "en": inc}} 
                     for inc in (t.get("includes") or [])]
    schedules = [{"start": "00:00", "days": _parse_days(t.get("operational", {}).get("days", ""))}]

    new_tour = {
        "id": t["id"],
        "slug": t["slug"],
        "type": "tour",
        "status": t.get("status", "active"),
        "title": {"es": t["name"]},
        "description": {"es": description, "en": description},
        "categories": [cat_id],
        "regions": ["cuenca"],
        "tags": default_tags,
        "operator": "condor-expeditions",
        "meetingPoint": "main",
        "duration": t.get("operational", {}).get("duration", "1d"),
        "difficulty": diff_slug,
        "prices": [{"label": {"es": "General", "en": "General"}, "amount": _parse_price(t.get("pricing", {}).get("general")), "currency": "USD"}],
        "includes": includes_data,
        "itinerary": program_days,
        "schedules": schedules,
        "gallery": [{"type": "image", "src": t.get("image") or t.get("heroImage") or "/placeholder.webp", "alt": {"es": t["name"], "en": t["name"]}}],
        "seo": {"title": {"es": t["name"], "en": t["name"]}, "description": {"es": description, "en": description}},
        "createdAt": t.get("createdAt", "2026-01-01T00:00:00Z"),
        "updatedAt": t.get("updatedAt", "2026-01-01T00:00:00Z"),
        "_legacy": {
            "id": t["id"],
            "slug": t["slug"],
            "name": t["name"],
            "category": t.get("category", ""),
            "shortDescription": t.get("shortDescription", ""),
            "meetingPoints": t.get("meetingPoints", []),
            "itinerary": t.get("itinerary", []),
            "activities": t.get("activities", []),
            "operational": t.get("operational", {}),
            "includes": t.get("includes", []),
            "excludes": t.get("excludes", []),
            "whatToBring": t.get("whatToBring", []),
            "pricing": t.get("pricing", {"general": "$0", "special": "$0"}),
            "image": t.get("image", ""),
            "heroImage": t.get("heroImage", ""),
            "badge": get_badge(t.get("operational", {}).get("duration", "1d")),
        }
    }
    new_items.append(new_tour)

output = {"items": new_items}
output_path = f"{base}/src/data/api/tours/items.json"
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"✅ Migrados {len(new_items)} tours al formato API-local")
print(f"✅ Archivo: {output_path}")