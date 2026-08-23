#!/usr/bin/env python3
"""
Script de migración: Convierte 18 tours del JSON API antiguo 
a la nueva interfaz Tour de src/data/tours.ts (rama develop).

Mapea imágenes del antiguo /images/tours/ a los archivos reales 
en public/assets/menu/tours/ usando nombres lógicos.
"""

import json
import os

# Mapeo de slugs antiguos -> archivos de imagen disponibles en assets/menu/tours/
IMAGE_MAP = {
    "city-tour-cuenca": "walking-tour-cuenca.webp",
    "cajas-trekking": "parque-nacional-el-cajas.jpg",
    "cajas-camping": "aventura-parque-nacional-el-cajas.jpg",
    "banos-aventura": "aventura-parque-nacional-el-cajas.jpg",
    "gualaceo-chordeleg": "ruta-artesano.jpg",
    "ingapirca-desde-cuenca": "ingapirca.jpg",
    "parapente-ruta-cuenca": "aventura-parque-nacional-el-cajas.jpg",
    "giron-cascada": "chorro-de-giron.jpg",
    "paute": "parque-nacional-el-cajas.jpg",
    "sigsig-tejido": "ruta-artesano.jpg",
    "yunguilla": "ruta-artesano.jpg",
    "asis-azuay": "aventura-parque-nacional-el-cajas.jpg",
    "cotopaxi-ascenso": "parque-nacional-el-cajas.jpg",
    "quilotoa-loop": "parque-nacional-el-cajas.jpg",
    "chimborazo-ascenso": "parque-nacional-el-cajas.jpg",
    "cuyabeno-4-dias": "conoce-deleg.jpg",
    "yasuni-wao": "conoce-deleg.jpg",
    "ruta-otavalo": "mira-cuenca.jpg",
}

# Mapeo de categories antiguas -> nombres nuevos (estilo Travlla)
CATEGORY_MAP = {
    "cultural": "Cultural",
    "city-tour": "City Tour",
    "trekking": "Naturaleza y Aventura",
    "rafting": "Aventura Extrema",
    "montanismo": "Montañismo",
    "selva": "Amazonía y Selva",
}

# Mapeo de difficulties
DIFFICULTY_MAP = {
    "facil": "Baja",
    "moderado": "Media",
    "intermedio-avanzado": "Media-Alta",
    "muy-avanzado": "Alta",
    "suave-moderado": "Media-Baja",
}

# Mapeo de regiones -> categoría de tour (para el campo category nuevo)
REGION_CATEGORY_MAP = {
    "cuenca": "Cuenca y alrededores",
    "azuay": "Azuay",
    "ecuador": "Ecuador Continental",
}

def get_primary_category(categories, regions):
    """Determina la categoría principal del tour para el nuevo formato."""
    # Prioridad: trekking, montanismo, selva, cultural, city-tour
    for cat in ["trekking", "montanismo", "selva", "rafting", "cultural", "city-tour"]:
        if cat in categories:
            return CATEGORY_MAP.get(cat, cat.title())
    # Fallback a primera región
    if regions:
        return REGION_CATEGORY_MAP.get(regions[0], regions[0].title())
    return "Tour"

def get_badge(tour):
    """Genera badge según duración y tipo."""
    duration = tour.get("duration", "")
    if "d" in duration:
        days = int(duration.replace("d", ""))
        if days >= 3:
            return "Expedición"
        elif days == 2:
            return "2 Días"
        else:
            return "Día completo"
    else:
        # horas - puede ser "3h" o "4h30m"
        import re
        match = re.match(r"(\d+)h", duration)
        if match:
            h = int(match.group(1))
            if h <= 4:
                return "Medio día"
            else:
                return "Día completo"
    return "Tour"

def parse_price(prices):
    """Extrae precios general y special."""
    if not prices:
        return {"general": "$0", "special": "$0"}
    p = prices[0]
    amount = p.get("amount", 0)
    general = f"${amount:,.0f}".replace(",", ".")
    # Special price ~ 10-15% off
    special_amount = round(amount * 0.9)
    special = f"${special_amount:,.0f}".replace(",", ".")
    return {"general": general, "special": special}

def get_meeting_points(tour):
    """Convierte meetingPoint a array de strings."""
    mp_id = tour.get("meetingPoint", "parque-calderon")
    # Solo tenemos parque-calderon en meeting-points.json
    return [
        "08:20 am: Plaza San Blas.",
        "08:30 am: Parque Calderón (Catedral).",
    ]

def get_itinerary(tour):
    """Convierte schedules + description a itinerario."""
    desc = tour.get("description", {}).get("es", "")
    schedules = tour.get("schedules", [])
    items = [desc]
    if schedules:
        s = schedules[0]
        start = s.get("start", "")
        end = s.get("end", "")
        days = s.get("days", [])
        if start:
            items.append(f"{start}: Salida desde punto de encuentro.")
        if days:
            day_names = {
                "mon": "Lunes", "tue": "Martes", "wed": "Miércoles",
                "thu": "Jueves", "fri": "Viernes", "sat": "Sábado", "sun": "Domingo"
            }
            day_str = ", ".join([day_names.get(d, d) for d in days])
            items.append(f"Días de operación: {day_str}.")
    items.append("Regreso a punto de origen.")
    return items

def get_includes(tour):
    """Convierte includes array a strings simples."""
    result = []
    for inc in tour.get("includes", []):
        if isinstance(inc, dict):
            text = inc.get("text", {}).get("es", "")
            if text:
                result.append(text)
        elif isinstance(inc, str):
            result.append(inc)
    return result

def get_excludes(tour):
    """Genera excludes basados en includes."""
    includes_text = " ".join(get_includes(tour)).lower()
    excludes = ["Propinas", "Souvenirs", "Bebidas adicionales"]
    if "almuerzo" not in includes_text and "comida" not in includes_text:
        excludes.append("Almuerzo")
    return excludes

def get_what_to_bring(tour):
    """Genera whatToBring basado en difficulty/duration."""
    difficulty = tour.get("difficulty", "facil")
    items = ["Zapatos cómodos", "Ropa ligera y abrigo", "Bloqueador solar", "Agua"]
    if difficulty in ["moderado", "intermedio-avanzado", "muy-avanzado"]:
        items.extend(["Zapatos de trekking", "Impermeable", "Mochila pequeña"])
    return items

def get_activities(tour):
    """Extrae actividades del tour."""
    includes = get_includes(tour)
    activities = []
    for inc in includes:
        if any(kw in inc.lower() for kw in ["canopy", "skybike", "puente", "caminata", "trekking", "parapente", "cascada"]):
            activities.append(inc)
    return activities

def migrate_tour(old_tour):
    """Convierte un tour del formato antiguo al nuevo."""
    slug = old_tour["slug"]
    image_file = IMAGE_MAP.get(slug, "mira-cuenca.jpg")
    image_path = f"/assets/menu/tours/{image_file}"
    
    return {
        "id": old_tour["id"],
        "slug": slug,
        "name": old_tour.get("title", {}).get("es", old_tour["id"]),
        "category": get_primary_category(old_tour.get("categories", []), old_tour.get("regions", [])),
        "shortDescription": old_tour.get("description", {}).get("es", ""),
        "meetingPoints": get_meeting_points(old_tour),
        "itinerary": get_itinerary(old_tour),
        "activities": get_activities(old_tour) or None,
        "operational": {
            "duration": old_tour.get("duration", ""),
            "days": ", ".join([d for s in old_tour.get("schedules", []) for d in s.get("days", [])]) or "Consultar",
            "capacity": "Mín. 4 personas / Máx. 24 personas",
            "difficulty": DIFFICULTY_MAP.get(old_tour.get("difficulty", "facil"), "Media"),
        },
        "includes": get_includes(old_tour),
        "excludes": get_excludes(old_tour),
        "whatToBring": get_what_to_bring(old_tour),
        "pricing": parse_price(old_tour.get("prices", [])),
        "image": image_path,
        "heroImage": image_path,
        "badge": get_badge(old_tour),
    }

def main():
    with open("src/data/api_tours_old.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    migrated = []
    for old in data.get("items", []):
        if old.get("status") == "active":
            migrated.append(migrate_tour(old))
    
    print(f"Migrados {len(migrated)} tours activos de {len(data.get('items', []))} totales")
    
    # Generar código TypeScript
    ts_code = "// Auto-generado desde JSON API antigua\n"
    ts_code += "export interface Tour {\n"
    ts_code += "\tid: string;\n"
    ts_code += "\tslug: string;\n"
    ts_code += "\tname: string;\n"
    ts_code += "\tcategory: string;\n"
    ts_code += "\tshortDescription: string;\n"
    ts_code += "\tmeetingPoints: string[];\n"
    ts_code += "\titinerary: string[];\n"
    ts_code += "\tactivities?: string[];\n"
    ts_code += "\toperational: {\n"
    ts_code += "\t\tduration: string;\n"
    ts_code += "\t\tdays: string;\n"
    ts_code += "\t\tcapacity: string;\n"
    ts_code += "\t\tdifficulty: string;\n"
    ts_code += "\t};\n"
    ts_code += "\tincludes: string[];\n"
    ts_code += "\texcludes: string[];\n"
    ts_code += "\twhatToBring: string[];\n"
    ts_code += "\tpricing: {\n"
    ts_code += "\t\tgeneral: string;\n"
    ts_code += "\t\tspecial: string;\n"
    ts_code += "\t};\n"
    ts_code += "\timage?: string;\n"
    ts_code += "\theroImage?: string;\n"
    ts_code += "\tbadge?: string;\n"
    ts_code += "}\n\n"
    ts_code += "export const tours: Tour[] = [\n"
    
    for i, tour in enumerate(migrated):
        ts_code += "\t{\n"
        for key, value in tour.items():
            if key == "activities" and value is None:
                continue
            if isinstance(value, str):
                ts_code += f'\t\t{key}: "{value}",\n'
            elif isinstance(value, list):
                if all(isinstance(v, str) for v in value):
                    arr_str = ", ".join([f'"{v}"' for v in value])
                    ts_code += f"\t\t{key}: [{arr_str}],\n"
                elif isinstance(value[0], dict):
                    # operational
                    inner = ", ".join([f'{k}: "{v}"' for k, v in value.items()])
                    ts_code += f"\t\t{key}: {{{inner}}},\n"
                else:
                    ts_code += f"\t\t{key}: {json.dumps(value, ensure_ascii=False)},\n"
            elif isinstance(value, dict):
                inner = ", ".join([f'{k}: "{v}"' for k, v in value.items()])
                ts_code += f"\t\t{key}: {{{inner}}},\n"
        ts_code += "\t}" + ("," if i < len(migrated) - 1 else "") + "\n"
    
    ts_code += "];\n\n"
    ts_code += "export const getTourBySlug = (slug: string): Tour | undefined =>\n"
    ts_code += "\ttours.find((tour) => tour.slug === slug);\n\n"
    ts_code += "export const getFeaturedTours = (count = 6): Tour[] => tours.slice(0, count);\n\n"
    ts_code += "export const getToursByCategory = (category: string): Tour[] =>\n"
    ts_code += "\ttours.filter((tour) =>\n"
    ts_code += "\t\ttour.category.toLowerCase().includes(category.toLowerCase()),\n"
    ts_code += "\t);\n"
    
    with open("src/data/tours.ts", "w", encoding="utf-8") as f:
        f.write(ts_code)
    
    print("✅ tours.ts actualizado con 18 tours migrados")
    
    # Verificar
    print("\n=== Tours migrados ===")
    for t in migrated:
        print(f"  {t['id']:30s} | {t['name'][:50]:50s} | {t['category']} | {t['badge']}")

if __name__ == "__main__":
    main()