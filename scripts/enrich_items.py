import json

with open('src/data/api/tours/items.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

LOCATIONS = {
    "city-tour-cuenca": {"lat": -2.8974, "lng": -79.0045},
    "cajas-trekking": {"lat": -2.8353, "lng": -79.2229},
    "cajas-camping": {"lat": -2.8353, "lng": -79.2229},
    "banos-aventura": {"lat": -1.3964, "lng": -78.4249},
    "gualaceo-chordeleg": {"lat": -2.8929, "lng": -78.7758},
    "ingapirca-desde-cuenca": {"lat": -2.5378, "lng": -78.8775},
    "parapente-ruta-cuenca": {"lat": -2.8974, "lng": -79.0045},
    "giron-cascada": {"lat": -3.1601, "lng": -79.1413},
    "paute": {"lat": -2.7790, "lng": -78.7584},
    "sigsig-tejido": {"lat": -3.0539, "lng": -78.8006},
    "yunguilla": {"lat": -3.0189, "lng": -79.1095},
    "asis-azuay": {"lat": -2.8833, "lng": -78.9833},
    "cotopaxi-ascenso": {"lat": -0.6814, "lng": -78.4337},
    "quilotoa-loop": {"lat": -0.8455, "lng": -78.9038},
    "chimborazo-ascenso": {"lat": -1.4694, "lng": -78.8169},
    "cuyabeno-4-dias": {"lat": -0.0833, "lng": -76.0333},
    "yasuni-wao": {"lat": -0.9917, "lng": -76.2504},
    "ruta-otavalo": {"lat": 0.2344, "lng": -78.2632},
}

ITINERARIES = {
    "cajas-camping": [
        {"day": 1, "stops": [
            {"time": "14:00", "title": {"es": "Salida desde Cuenca", "en": "Departure"}, "description": {"es": "Recojo y viaje al Parque Nacional Cajas.", "en": "Pickup and drive to Cajas NP."}, "image": "/images/tours/cajas-camping-it-1.webp"},
            {"time": "15:30", "title": {"es": "Laguna Toreadora", "en": "Toreadora Lake"}, "description": {"es": "Instalación del campamento.", "en": "Camp setup."}},
            {"time": "18:00", "title": {"es": "Fogata", "en": "Bonfire"}, "description": {"es": "Cena y fogata nocturna.", "en": "Dinner and bonfire."}},
            {"time": "20:00", "title": {"es": "Astronomía", "en": "Stargazing"}, "description": {"es": "Observación de estrellas en el páramo.", "en": "Stargazing in the páramo."}}
        ], "meals": ["almuerzo", "cena"], "meals_not_included": ["desayuno"]},
        {"day": 2, "stops": [
            {"time": "06:30", "title": {"es": "Amanecer", "en": "Sunrise"}, "description": {"es": "Desayuno y caminata matutina.", "en": "Breakfast and morning hike."}},
            {"time": "09:00", "title": {"es": "Senderismo", "en": "Hiking"}, "description": {"es": "Flora, fauna y lagunas glaciares.", "en": "Flora, fauna and glacial lakes."}},
            {"time": "12:00", "title": {"es": "Regreso", "en": "Return"}, "description": {"es": "Desmontar y retorno a Cuenca.", "en": "Break camp and return."}}
        ], "meals": ["desayuno", "almuerzo"], "meals_not_included": []}
    ],
    "cotopaxi-ascenso": [
        {"day": 1, "stops": [
            {"time": "07:00", "title": {"es": "Salida", "en": "Departure"}, "description": {"es": "Viaje al Parque Nacional Cotopaxi.", "en": "Journey to Cotopaxi NP."}},
            {"time": "11:00", "title": {"es": "Refugio José Rivas", "en": "José Rivas Refuge"}, "description": {"es": "Aclimatación a 4,800m.", "en": "Acclimatization at 4,800m."}},
            {"time": "14:00", "title": {"es": "Entrenamiento en glaciar", "en": "Glacier training"}, "description": {"es": "Técnica de crampones y piolet.", "en": "Crampon and ice axe technique."}},
            {"time": "18:00", "title": {"es": "Descanso", "en": "Rest"}, "description": {"es": "Cena temprana y descanso previo al ascenso.", "en": "Early dinner and pre-ascent rest."}}
        ], "meals": ["almuerzo", "cena"], "meals_not_included": ["desayuno"]},
        {"day": 2, "stops": [
            {"time": "00:30", "title": {"es": "Ascenso nocturno", "en": "Night ascent"}, "description": {"es": "Inicio del ascenso a la cumbre.", "en": "Summit ascent begins."}},
            {"time": "06:00", "title": {"es": "Cumbre 5,897m", "en": "Summit 5,897m"}, "description": {"es": "Amanecer desde la cumbre.", "en": "Sunrise from the summit."}},
            {"time": "08:00", "title": {"es": "Descenso", "en": "Descent"}, "description": {"es": "Retorno seguro al refugio.", "en": "Safe return to refuge."}},
            {"time": "14:00", "title": {"es": "Regreso a Cuenca", "en": "Return to Cuenca"}, "description": {"es": "Transporte de retorno.", "en": "Return transport."}}
        ], "meals": ["desayuno", "almuerzo"], "meals_not_included": ["cena"]}
    ],
    "quilotoa-loop": [
        {"day": 1, "stops": [
            {"time": "07:00", "title": {"es": "Salida", "en": "Departure"}, "description": {"es": "Viaje escénico a la laguna Quilotoa.", "en": "Scenic drive to Quilotoa Lake."}},
            {"time": "11:00", "title": {"es": "Chugchilán", "en": "Chugchilán"}, "description": {"es": "Registro en lodge comunitario.", "en": "Check-in at community lodge."}},
            {"time": "14:00", "title": {"es": "Descenso al cráter", "en": "Crater descent"}, "description": {"es": "Caminata a la laguna esmeralda.", "en": "Hike to the emerald lake."}}
        ], "meals": ["almuerzo", "cena"], "meals_not_included": ["desayuno"]},
        {"day": 2, "stops": [
            {"time": "08:00", "title": {"es": "Borde del cráter", "en": "Crater rim"}, "description": {"es": "Trekking panorámico.", "en": "Panoramic trek."}},
            {"time": "12:00", "title": {"es": "Comunidad indígena", "en": "Indigenous community"}, "description": {"es": "Almuerzo con familia local.", "en": "Lunch with local family."}},
            {"time": "15:00", "title": {"es": "Regreso", "en": "Return"}, "description": {"es": "Retorno por la avenida de los volcanes.", "en": "Return via Avenue of the Volcanoes."}}
        ], "meals": ["desayuno", "almuerzo"], "meals_not_included": ["cena"]}
    ],
    "chimborazo-ascenso": [{"day": 1, "stops": [], "meals": [], "meals_not_included": []}],
    "cuyabeno-4-dias": [{"day": 1, "stops": [], "meals": [], "meals_not_included": []}],
    "yasuni-wao": [{"day": 1, "stops": [], "meals": [], "meals_not_included": []}],
}

ACCOMMODATIONS = {
    "cajas-camping": [{"name": {"es": "Campamento Toreadora", "en": "Toreadora Camp"}, "type": "camping"}],
    "cotopaxi-ascenso": [{"name": {"es": "Refugio José Rivas", "en": "José Rivas Refuge"}, "type": "hostal"}],
    "quilotoa-loop": [{"name": {"es": "Lodge Chugchilán", "en": "Chugchilán Lodge"}, "type": "hostal"}],
    "chimborazo-ascenso": [{"name": {"es": "Refugio Carrel", "en": "Carrel Refuge"}, "type": "hostal"}],
    "cuyabeno-4-dias": [{"name": {"es": "Lodge Cuyabeno", "en": "Cuyabeno Lodge"}, "type": "hostal"}],
    "yasuni-wao": [{"name": {"es": "Eco-lodge Waorani", "en": "Waorani Eco-lodge"}, "type": "hostal"}],
}

for tour in data["items"]:
    slug = tour["id"]
    tour["image"] = f"/images/tours/{slug}.webp"
    tour["gallery"] = [
        {"type": "image", "src": f"/images/tours/{slug}-1.webp", "alt": {"es": f"{tour['title']['es']}", "en": f"{tour['title']['en']}"}},
        {"type": "image", "src": f"/images/tours/{slug}-2.webp", "alt": {"es": f"{tour['title']['es']} - 2", "en": f"{tour['title']['en']} - 2"}},
    ]
    tour["map"] = LOCATIONS.get(slug, {"lat": -2.8974, "lng": -79.0045})
    tour["itinerary"] = ITINERARIES.get(slug, [])
    tour["accommodations"] = ACCOMMODATIONS.get(slug, [])
    tour["reviews"] = []

with open('src/data/api/tours/items.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# Verify
with open('src/data/api/tours/items.json', 'r') as f:
    d = json.load(f)
print("✓ items.json enriquecido exitosamente")
print(f"  Tours: {len(d['items'])}")
print(f"  Con imagen: {sum(1 for t in d['items'] if 'image' in t)}")
print(f"  Con galería: {sum(1 for t in d['items'] if len(t.get('gallery',[]))>0)}")
print(f"  Con mapa: {sum(1 for t in d['items'] if 'map' in t)}")
print(f"  Con itinerary: {sum(1 for t in d['items'] if len(t.get('itinerary',[]))>0)}")
print(f"  Con accommodations: {sum(1 for t in d['items'] if len(t.get('accommodations',[]))>0)}")