"""
API Router para Tours usando Django Ninja

Ejemplo de implementación de API endpoints para el módulo de tours.
Este patrón debe seguirse para todos los demás módulos.
"""

from typing import List, Optional
from ninja import Router, Schema, Query
from ninja.pagination import paginate
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Tour, TourCategory, TourSchedule, TourReview

# Crear router para tours
router = Router(tags=["Tours"])

# Esquemas de entrada/salida (Schemas)
class TourCategorySchema(Schema):
    """Esquema para categorías de tours"""
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None
    is_active: bool = True

class TourScheduleSchema(Schema):
    """Esquema para horarios de tours"""
    id: str
    departure_date: str  # ISO date format
    return_date: str
    max_participants: int
    available_spots: int
    price: Optional[float] = None
    status: str

class TourSchema(Schema):
    """Esquema completo para tours"""
    id: str
    title: str
    slug: str
    code: str
    category: TourCategorySchema
    short_description: str
    full_description: str
    location: str
    duration_days: int
    difficulty_level: str
    base_price: float
    currency: str
    max_participants: int
    start_date: str
    end_date: str
    status: str
    is_featured: bool
    main_image: Optional[str] = None
    average_rating: Optional[float] = None
    total_reviews: int = 0
    schedules: List[TourScheduleSchema] = []

class TourCreateSchema(Schema):
    """Esquema para crear tours"""
    title: str
    category_id: str
    short_description: str
    full_description: str
    location: str
    duration_days: int
    difficulty_level: str
    base_price: float
    currency: str = "USD"
    max_participants: int
    start_date: str
    end_date: str

class TourFilterSchema(Schema):
    """Esquema para filtros de búsqueda"""
    category: Optional[str] = None
    location: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    difficulty_level: Optional[str] = None
    start_date_after: Optional[str] = None
    featured_only: bool = False
    status: str = "published"

# Endpoints de la API

@router.get("/categories", response=List[TourCategorySchema])
def list_tour_categories(request):
    """Listar todas las categorías de tours activas"""
    categories = TourCategory.objects.filter(is_active=True).order_by('sort_order', 'name')
    return categories

@router.get("/categories/{category_id}", response=TourCategorySchema)
def get_tour_category(request, category_id: str):
    """Obtener una categoría específica"""
    category = get_object_or_404(TourCategory, id=category_id, is_active=True)
    return category

@router.get("", response=List[TourSchema])
@paginate
def list_tours(request, filters: TourFilterSchema = Query(...)):
    """Listar tours con filtros opcionales"""
    queryset = Tour.objects.select_related('category').prefetch_related('schedules').filter(status='published')

    # Aplicar filtros
    if filters.category:
        queryset = queryset.filter(category_id=filters.category)

    if filters.location:
        queryset = queryset.filter(location__icontains=filters.location)

    if filters.min_price:
        queryset = queryset.filter(base_price__gte=filters.min_price)

    if filters.max_price:
        queryset = queryset.filter(base_price__lte=filters.max_price)

    if filters.difficulty_level:
        queryset = queryset.filter(difficulty_level=filters.difficulty_level)

    if filters.featured_only:
        queryset = queryset.filter(is_featured=True)

    if filters.start_date_after:
        queryset = queryset.filter(start_date__gte=filters.start_date_after)

    return queryset

@router.get("/{tour_id}", response=TourSchema)
def get_tour(request, tour_id: str):
    """Obtener detalles de un tour específico"""
    tour = get_object_or_404(
        Tour.objects.select_related('category').prefetch_related('schedules'),
        id=tour_id,
        status='published'
    )

    # Calcular estadísticas adicionales
    reviews = tour.reviews.filter(status='published')
    average_rating = reviews.aggregate(avg_rating=models.Avg('overall_rating'))['avg_rating'] if reviews.exists() else None

    # Construir respuesta
    result = TourSchema.from_orm(tour)
    result.average_rating = average_rating
    result.total_reviews = reviews.count()
    result.schedules = tour.schedules.filter(status='available')

    return result

@router.get("/{tour_id}/schedules", response=List[TourScheduleSchema])
def get_tour_schedules(request, tour_id: str):
    """Obtener horarios disponibles para un tour"""
    tour = get_object_or_404(Tour, id=tour_id, status='published')
    schedules = tour.schedules.filter(status='available').order_by('departure_date')
    return schedules

@router.get("/{tour_id}/reviews", response=List[dict])
@paginate
def get_tour_reviews(request, tour_id: str):
    """Obtener reseñas de un tour"""
    tour = get_object_or_404(Tour, id=tour_id, status='published')
    reviews = tour.reviews.filter(status='published').select_related('user').order_by('-created_at')

    return [
        {
            "id": str(review.id),
            "user_name": review.user.get_full_name(),
            "overall_rating": review.overall_rating,
            "title": review.title,
            "comment": review.comment,
            "created_at": review.created_at.isoformat(),
            "is_verified": review.is_verified
        }
        for review in reviews
    ]

@router.post("", response={201: TourSchema, 400: dict})
def create_tour(request, payload: TourCreateSchema):
    """Crear un nuevo tour (requiere autenticación)"""
    # Verificar permisos
    if not request.user.is_authenticated:
        return 401, {"message": "Authentication required"}

    try:
        category = get_object_or_404(TourCategory, id=payload.category_id, is_active=True)

        tour = Tour.objects.create(
            title=payload.title,
            category=category,
            short_description=payload.short_description,
            full_description=payload.full_description,
            location=payload.location,
            duration_days=payload.duration_days,
            difficulty_level=payload.difficulty_level,
            base_price=payload.base_price,
            currency=payload.currency,
            max_participants=payload.max_participants,
            start_date=payload.start_date,
            end_date=payload.end_date,
            created_by=request.user,
            updated_by=request.user
        )

        return 201, TourSchema.from_orm(tour)

    except Exception as e:
        return 400, {"message": "Error creating tour", "error": str(e)}

@router.get("/search", response=List[TourSchema])
@paginate
def search_tours(request, q: str = "", filters: TourFilterSchema = Query(...)):
    """Buscar tours por texto"""
    if not q:
        return []

    queryset = Tour.objects.select_related('category').filter(
        Q(title__icontains=q) |
        Q(short_description__icontains=q) |
        Q(full_description__icontains=q) |
        Q(location__icontains=q),
        status='published'
    )

    # Aplicar filtros adicionales
    if filters.category:
        queryset = queryset.filter(category_id=filters.category)

    if filters.difficulty_level:
        queryset = queryset.filter(difficulty_level=filters.difficulty_level)

    return queryset

@router.get("/featured", response=List[TourSchema])
def get_featured_tours(request):
    """Obtener tours destacados"""
    tours = Tour.objects.select_related('category').filter(
        is_featured=True,
        status='published'
    ).order_by('-created_at')[:10]

    return tours

@router.get("/availability", response=dict)
def check_availability(request, tour_id: str, start_date: str, participants: int = 1):
    """Verificar disponibilidad para fechas específicas"""
    tour = get_object_or_404(Tour, id=tour_id, status='published')

    try:
        # Buscar horario disponible
        schedule = TourSchedule.objects.get(
            tour=tour,
            departure_date=start_date,
            status='available'
        )

        if schedule.available_spots >= participants:
            return {
                "available": True,
                "spots_remaining": schedule.available_spots,
                "price_per_person": schedule.price or tour.base_price,
                "total_price": (schedule.price or tour.base_price) * participants
            }
        else:
            return {
                "available": False,
                "spots_remaining": schedule.available_spots,
                "message": "No hay suficientes cupos disponibles"
            }

    except TourSchedule.DoesNotExist:
        return {
            "available": False,
            "message": "No hay horarios disponibles para esta fecha"
        }