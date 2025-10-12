"""
API Router para CRM y Gestión de Comunidades

Sistema completo para:
- Gestión de comunidades locales
- Servicios comunitarios
- Miembros de comunidades
- Tours comunitarios
- Reservas y feedback
- Métricas de participación
"""

from typing import List, Optional, Dict, Any
from django.shortcuts import get_object_or_404
from django.db.models import Q, Sum, Count, Avg
from django.db import transaction
from django.utils import timezone
from ninja import Router, Schema, Query
from ninja.pagination import paginate
from .models import Community, CommunityService, CommunityMember, CommunityTour, CommunityBooking, CommunityFeedback

# Crear router para comunidades
router = Router(tags=["Communities"])

# Esquemas de entrada/salida
class CommunityCreateSchema(Schema):
    """Esquema para crear comunidad"""
    name: str
    description: str
    contact_person: str
    email: str
    phone: str
    province: str
    canton: str
    parish: str
    coordinates: Optional[Dict[str, float]] = None
    population: Optional[int] = None
    main_activities: List[str] = []
    commission_rate: float = 15.0

class CommunityResponseSchema(Schema):
    """Esquema de respuesta de comunidad"""
    id: str
    name: str
    slug: str
    description: str
    contact_person: str
    email: str
    phone: str
    province: str
    canton: str
    parish: str
    status: str
    is_verified: bool
    total_tours_hosted: int = 0
    total_revenue: float = 0
    average_rating: float = 0
    commission_rate: float = 15.0
    created_at: str

class CommunityServiceCreateSchema(Schema):
    """Esquema para crear servicio comunitario"""
    name: str
    description: str
    service_type: str
    max_capacity: int
    base_price: float
    currency: str = "USD"
    available_days: List[str] = []
    requirements: Optional[str] = None

class CommunityServiceResponseSchema(Schema):
    """Esquema de respuesta de servicio comunitario"""
    id: str
    name: str
    description: str
    service_type: str
    max_capacity: int
    base_price: float
    currency: str
    available_days: List[str] = []
    is_active: bool = True
    requirements: Optional[str] = None

class CommunityBookingCreateSchema(Schema):
    """Esquema para crear reserva comunitaria"""
    service_id: Optional[str] = None
    tour_id: Optional[str] = None
    client_name: str
    client_email: str
    client_phone: str
    number_of_participants: int
    booking_date: str
    start_time: Optional[str] = None
    special_requests: Optional[str] = None

class CommunityBookingResponseSchema(Schema):
    """Esquema de respuesta de reserva comunitaria"""
    id: str
    community_name: str
    service_name: Optional[str] = None
    tour_name: Optional[str] = None
    client_name: str
    client_email: str
    number_of_participants: int
    booking_date: str
    total_amount: float
    commission_amount: float
    community_amount: float
    status: str
    created_at: str

class CommunityStatsSchema(Schema):
    """Esquema de estadísticas de comunidad"""
    total_communities: int
    active_communities: int
    verified_communities: int
    total_services: int
    total_bookings: int
    total_revenue: float
    average_rating: float

# Servicios para comunidades
class CommunityServiceManager:
    """Servicio para gestión de comunidades"""

    @staticmethod
    def calculate_community_earnings(community_id: str, start_date=None, end_date=None) -> Dict:
        """Calcular ganancias de una comunidad"""

        bookings = CommunityBooking.objects.filter(
            community_id=community_id,
            status='completed'
        )

        if start_date:
            bookings = bookings.filter(booking_date__gte=start_date)
        if end_date:
            bookings = bookings.filter(booking_date__lte=end_date)

        total_earnings = bookings.aggregate(
            total=Sum('community_amount'),
            count=Count('id')
        )

        return {
            'total_earnings': float(total_earnings['total'] or 0),
            'total_bookings': total_earnings['count'],
            'average_per_booking': float((total_earnings['total'] or 0) / total_earnings['count']) if total_earnings['count'] > 0 else 0
        }

    @staticmethod
    def get_community_performance(community_id: str) -> Dict:
        """Obtener métricas de rendimiento de comunidad"""

        community = Community.objects.get(id=community_id)

        # Métricas básicas
        total_bookings = community.bookings.count()
        completed_bookings = community.bookings.filter(status='completed').count()
        total_revenue = community.total_revenue

        # Calificaciones promedio
        feedback = CommunityFeedback.objects.filter(community_id=community_id)
        average_rating = feedback.aggregate(avg=Avg('overall_rating'))['avg'] or 0

        # Servicios activos
        active_services = community.services.filter(is_active=True).count()

        return {
            'total_bookings': total_bookings,
            'completed_bookings': completed_bookings,
            'completion_rate': (completed_bookings / total_bookings * 100) if total_bookings > 0 else 0,
            'total_revenue': float(total_revenue),
            'average_rating': float(average_rating),
            'active_services': active_services,
            'member_count': community.members.filter(is_active=True).count()
        }

# Endpoints de la API

@router.get("/stats", response=CommunityStatsSchema)
def get_communities_stats(request):
    """Obtener estadísticas generales de comunidades"""

    communities = Community.objects.all()
    services = CommunityService.objects.filter(is_active=True)
    bookings = CommunityBooking.objects.all()
    feedback = CommunityFeedback.objects.all()

    return {
        "total_communities": communities.count(),
        "active_communities": communities.filter(status='active').count(),
        "verified_communities": communities.filter(is_verified=True).count(),
        "total_services": services.count(),
        "total_bookings": bookings.count(),
        "total_revenue": float(bookings.filter(status='completed').aggregate(total=Sum('total_amount'))['total'] or 0),
        "average_rating": float(feedback.aggregate(avg=Avg('overall_rating'))['avg'] or 0)
    }

@router.get("", response=List[CommunityResponseSchema])
@paginate
def list_communities(request, province: Optional[str] = None, status: str = "active", verified_only: bool = False):
    """Listar comunidades"""

    queryset = Community.objects.filter(status=status)

    if province:
        queryset = queryset.filter(province=province)

    if verified_only:
        queryset = queryset.filter(is_verified=True)

    communities = queryset.order_by('name')

    return [
        CommunityResponseSchema(
            id=str(community.id),
            name=community.name,
            slug=community.slug,
            description=community.description,
            contact_person=community.contact_person,
            email=community.email,
            phone=community.phone,
            province=community.province,
            canton=community.canton,
            parish=community.parish,
            status=community.status,
            is_verified=community.is_verified,
            total_tours_hosted=community.total_tours_hosted,
            total_revenue=float(community.total_revenue),
            average_rating=float(community.average_rating),
            commission_rate=float(community.commission_rate),
            created_at=community.created_at.isoformat()
        )
        for community in communities
    ]

@router.post("", response={201: CommunityResponseSchema, 400: dict})
def create_community(request, payload: CommunityCreateSchema):
    """Crear nueva comunidad"""

    if not request.user.is_authenticated:
        return 401, {"message": "Authentication required"}

    try:
        community = Community.objects.create(
            name=payload.name,
            description=payload.description,
            contact_person=payload.contact_person,
            email=payload.email,
            phone=payload.phone,
            province=payload.province,
            canton=payload.canton,
            parish=payload.parish,
            coordinates=payload.coordinates,
            population=payload.population,
            main_activities=payload.main_activities,
            commission_rate=payload.commission_rate,
            created_by=request.user
        )

        return 201, CommunityResponseSchema.from_orm(community)

    except Exception as e:
        return 400, {"message": "Error al crear comunidad", "error": str(e)}

@router.get("/{community_id}", response={200: dict, 404: dict})
def get_community_detail(request, community_id: str):
    """Obtener detalles completos de comunidad"""

    try:
        community = get_object_or_404(
            Community.objects.prefetch_related('services', 'members', 'tours', 'bookings', 'feedback'),
            id=community_id
        )

        # Obtener métricas de rendimiento
        performance = CommunityServiceManager.get_community_performance(community_id)

        # Obtener ganancias recientes (últimos 30 días)
        thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
        recent_earnings = CommunityServiceManager.calculate_community_earnings(
            community_id,
            start_date=thirty_days_ago
        )

        return 200, {
            "id": str(community.id),
            "name": community.name,
            "description": community.description,
            "contact_info": {
                "contact_person": community.contact_person,
                "email": community.email,
                "phone": community.phone,
                "address": community.address
            },
            "location": {
                "province": community.province,
                "canton": community.canton,
                "parish": community.parish,
                "coordinates": community.coordinates
            },
            "demographics": {
                "population": community.population,
                "families": community.families,
                "main_activities": community.main_activities
            },
            "status": {
                "status": community.status,
                "is_verified": community.is_verified,
                "verification_date": community.verification_date.isoformat() if community.verification_date else None
            },
            "services": [
                {
                    "id": str(service.id),
                    "name": service.name,
                    "service_type": service.service_type,
                    "max_capacity": service.max_capacity,
                    "base_price": float(service.base_price),
                    "is_active": service.is_active
                }
                for service in community.services.filter(is_active=True)
            ],
            "members": [
                {
                    "id": str(member.id),
                    "name": f"{member.first_name} {member.last_name}",
                    "role": member.role,
                    "is_active": member.is_active,
                    "can_guide_tours": member.can_guide_tours
                }
                for member in community.members.filter(is_active=True)
            ],
            "performance": performance,
            "recent_earnings": recent_earnings,
            "created_at": community.created_at.isoformat()
        }

    except Community.DoesNotExist:
        return 404, {"message": "Comunidad no encontrada"}

@router.post("/{community_id}/services", response={201: CommunityServiceResponseSchema, 400: dict})
def create_community_service(request, community_id: str, payload: CommunityServiceCreateSchema):
    """Crear servicio para comunidad"""

    if not request.user.is_authenticated:
        return 401, {"message": "Authentication required"}

    try:
        community = get_object_or_404(Community, id=community_id)

        service = CommunityService.objects.create(
            community=community,
            name=payload.name,
            description=payload.description,
            service_type=payload.service_type,
            max_capacity=payload.max_capacity,
            base_price=payload.base_price,
            currency=payload.currency,
            available_days=payload.available_days,
            requirements=payload.requirements
        )

        return 201, CommunityServiceResponseSchema.from_orm(service)

    except Exception as e:
        return 400, {"message": "Error al crear servicio", "error": str(e)}

@router.get("/{community_id}/services", response=List[CommunityServiceResponseSchema])
def list_community_services(request, community_id: str):
    """Listar servicios de una comunidad"""

    try:
        community = get_object_or_404(Community, id=community_id)
        services = community.services.filter(is_active=True).order_by('name')

        return [
            CommunityServiceResponseSchema.from_orm(service)
            for service in services
        ]

    except Community.DoesNotExist:
        return []

@router.post("/{community_id}/bookings", response={201: CommunityBookingResponseSchema, 400: dict})
def create_community_booking(request, community_id: str, payload: CommunityBookingCreateSchema):
    """Crear reserva para servicio comunitario"""

    if not request.user.is_authenticated:
        return 401, {"message": "Authentication required"}

    try:
        community = get_object_or_404(Community, id=community_id)

        # Validar servicio o tour
        service = None
        tour = None

        if payload.service_id:
            service = get_object_or_404(CommunityService, id=payload.service_id, community=community)
            base_price = service.base_price
        elif payload.tour_id:
            tour = get_object_or_404(CommunityTour, id=payload.tour_id, community=community)
            base_price = tour.price_per_person
        else:
            return 400, {"message": "Debe especificar un servicio o tour"}

        # Calcular montos
        total_amount = base_price * payload.number_of_participants
        commission_amount = total_amount * (community.commission_rate / 100)
        community_amount = total_amount - commission_amount

        with transaction.atomic():
            booking = CommunityBooking.objects.create(
                community=community,
                service=service,
                tour=tour,
                client_name=payload.client_name,
                client_email=payload.client_email,
                client_phone=payload.client_phone,
                number_of_participants=payload.number_of_participants,
                booking_date=payload.booking_date,
                start_time=payload.start_time,
                total_amount=total_amount,
                commission_amount=commission_amount,
                community_amount=community_amount,
                special_requests=payload.special_requests
            )

            # Actualizar métricas de la comunidad
            community.total_tours_hosted += 1
            community.total_revenue += community_amount
            community.save()

        return 201, CommunityBookingResponseSchema(
            id=str(booking.id),
            community_name=community.name,
            service_name=service.name if service else None,
            tour_name=tour.title if tour else None,
            client_name=booking.client_name,
            client_email=booking.client_email,
            number_of_participants=booking.number_of_participants,
            booking_date=booking.booking_date.isoformat(),
            total_amount=float(booking.total_amount),
            commission_amount=float(booking.commission_amount),
            community_amount=float(booking.community_amount),
            status=booking.status,
            created_at=booking.created_at.isoformat()
        )

    except Exception as e:
        return 400, {"message": "Error al crear reserva", "error": str(e)}

@router.get("/{community_id}/bookings", response=List[CommunityBookingResponseSchema])
@paginate
def list_community_bookings(request, community_id: str, status: Optional[str] = None):
    """Listar reservas de una comunidad"""

    try:
        community = get_object_or_404(Community, id=community_id)
        bookings = community.bookings.all()

        if status:
            bookings = bookings.filter(status=status)

        bookings = bookings.order_by('-created_at')

        return [
            CommunityBookingResponseSchema(
                id=str(booking.id),
                community_name=community.name,
                service_name=booking.service.name if booking.service else None,
                tour_name=booking.tour.title if booking.tour else None,
                client_name=booking.client_name,
                client_email=booking.client_email,
                number_of_participants=booking.number_of_participants,
                booking_date=booking.booking_date.isoformat(),
                total_amount=float(booking.total_amount),
                commission_amount=float(booking.commission_amount),
                community_amount=float(booking.community_amount),
                status=booking.status,
                created_at=booking.created_at.isoformat()
            )
            for booking in bookings
        ]

    except Community.DoesNotExist:
        return []

@router.post("/{community_id}/feedback", response={201: dict, 400: dict})
def submit_community_feedback(request, community_id: str, overall_rating: int, comment: str, visitor_name: str = None, visitor_email: str = None):
    """Enviar feedback de comunidad"""

    try:
        community = get_object_or_404(Community, id=community_id)

        feedback = CommunityFeedback.objects.create(
            community=community,
            visitor_name=visitor_name or "Anónimo",
            visitor_email=visitor_email,
            overall_rating=overall_rating,
            comment=comment,
            is_public=visitor_name is not None
        )

        # Actualizar promedio de calificaciones
        all_feedback = CommunityFeedback.objects.filter(community=community)
        community.average_rating = all_feedback.aggregate(avg=Avg('overall_rating'))['avg'] or 0
        community.save()

        return 201, {
            "message": "Feedback enviado exitosamente",
            "feedback_id": str(feedback.id)
        }

    except Exception as e:
        return 400, {"message": "Error al enviar feedback", "error": str(e)}

@router.get("/{community_id}/feedback", response=list)
@paginate
def list_community_feedback(request, community_id: str):
    """Listar feedback público de comunidad"""

    try:
        community = get_object_or_404(Community, id=community_id)
        feedback = community.feedback.filter(is_public=True).order_by('-created_at')

        return [
            {
                "id": str(fb.id),
                "visitor_name": fb.visitor_name,
                "overall_rating": fb.overall_rating,
                "comment": fb.comment,
                "created_at": fb.created_at.isoformat()
            }
            for fb in feedback
        ]

    except Community.DoesNotExist:
        return []

# Endpoints administrativos

@router.get("/admin/dashboard", response=dict)
def get_communities_dashboard(request):
    """Dashboard administrativo de comunidades"""

    if not request.user.is_authenticated or not request.user.is_staff:
        return {}

    # Métricas generales
    total_communities = Community.objects.count()
    active_communities = Community.objects.filter(status='active').count()
    verified_communities = Community.objects.filter(is_verified=True).count()

    # Comunidades por provincia
    communities_by_province = Community.objects.values('province').annotate(
        count=Count('id')
    ).order_by('-count')

    # Métricas de ingresos (últimos 30 días)
    thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
    recent_bookings = CommunityBooking.objects.filter(
        booking_date__gte=thirty_days_ago,
        status='completed'
    )

    total_recent_revenue = recent_bookings.aggregate(
        total=Sum('total_amount'),
        community_total=Sum('community_amount')
    )

    return {
        "overview": {
            "total_communities": total_communities,
            "active_communities": active_communities,
            "verified_communities": verified_communities,
            "recent_revenue": float(total_recent_revenue['total'] or 0),
            "recent_community_earnings": float(total_recent_revenue['community_total'] or 0)
        },
        "by_province": list(communities_by_province),
        "top_communities": [],  # Implementar lógica para comunidades destacadas
        "recent_activity": []  # Implementar actividad reciente
    }

@router.post("/admin/{community_id}/verify", response={200: dict, 404: dict})
def verify_community(request, community_id: str):
    """Verificar comunidad (solo administradores)"""

    if not request.user.is_authenticated or not request.user.is_staff:
        return 401, {"message": "Admin access required"}

    try:
        community = get_object_or_404(Community, id=community_id)
        community.is_verified = True
        community.verification_date = timezone.now()
        community.status = 'active'
        community.save()

        return 200, {"message": "Comunidad verificada exitosamente"}

    except Community.DoesNotExist:
        return 404, {"message": "Comunidad no encontrada"}

@router.get("/provinces", response=list)
def list_provinces(request):
    """Listar provincias disponibles"""

    provinces = Community.objects.values_list('province', flat=True).distinct().order_by('province')

    return [
        {"province": province, "count": Community.objects.filter(province=province).count()}
        for province in provinces
    ]

@router.get("/search", response=List[CommunityResponseSchema])
@paginate
def search_communities(request, q: str = "", province: Optional[str] = None):
    """Buscar comunidades por texto"""

    if not q:
        return []

    queryset = Community.objects.filter(
        Q(name__icontains=q) |
        Q(description__icontains=q) |
        Q(contact_person__icontains=q) |
        Q(main_activities__icontains=q),
        status='active'
    )

    if province:
        queryset = queryset.filter(province=province)

    communities = queryset.order_by('name')

    return [
        CommunityResponseSchema(
            id=str(community.id),
            name=community.name,
            slug=community.slug,
            description=community.description,
            contact_person=community.contact_person,
            email=community.email,
            phone=community.phone,
            province=community.province,
            canton=community.canton,
            parish=community.parish,
            status=community.status,
            is_verified=community.is_verified,
            total_tours_hosted=community.total_tours_hosted,
            total_revenue=float(community.total_revenue),
            average_rating=float(community.average_rating),
            commission_rate=float(community.commission_rate),
            created_at=community.created_at.isoformat()
        )
        for community in communities
    ]