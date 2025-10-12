"""
API Router para Sistema de Reservas

Gestión completa de reservas, participantes, pagos y recordatorios.
"""

from datetime import datetime, timedelta
from typing import List, Optional
import uuid
from decimal import Decimal
from ninja import Router, Schema, Query
from ninja.pagination import paginate
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils import timezone
from .models import Booking, BookingParticipant, BookingPayment, BookingDocument, BookingReminder
from tours.models import Tour, TourSchedule
from users.models import User

# Crear router para reservas
router = Router(tags=["Bookings"])

# Esquemas de entrada/salida
class BookingParticipantSchema(Schema):
    """Esquema para participante de reserva"""
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    nationality: Optional[str] = None
    passport_number: Optional[str] = None
    medical_conditions: Optional[str] = None
    dietary_restrictions: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None

class BookingCreateSchema(Schema):
    """Esquema para crear reserva"""
    tour_id: str
    schedule_id: str
    number_of_participants: int
    participants: List[BookingParticipantSchema]
    emergency_contact_name: str
    emergency_contact_phone: str
    emergency_contact_relationship: Optional[str] = None
    special_requests: Optional[str] = None
    medical_notes: Optional[str] = None

class BookingResponseSchema(Schema):
    """Esquema de respuesta de reserva"""
    id: str
    booking_code: str
    tour_title: str
    schedule_date: str
    number_of_participants: int
    total_price: float
    currency: str
    status: str
    booking_date: str
    payment_due_date: Optional[str] = None

class BookingDetailSchema(Schema):
    """Esquema detallado de reserva"""
    id: str
    booking_code: str
    user: dict
    tour: dict
    schedule: dict
    participants: List[dict]
    total_price: float
    status: str
    emergency_contact: dict
    special_requests: Optional[str] = None
    medical_notes: Optional[str] = None
    payments: List[dict] = []
    documents: List[dict] = []
    created_at: str

# Funciones auxiliares
def generate_booking_code() -> str:
    """Generar código único de reserva"""
    return f"CE{timezone.now().strftime('%Y%m%d')}{get_random_string(length=6).upper()}"

def calculate_booking_price(tour: Tour, schedule: TourSchedule, participants: int) -> Decimal:
    """Calcular precio total de la reserva"""
    base_price = schedule.price or tour.base_price
    return Decimal(str(base_price * participants))

# Endpoints de reservas

@router.post("", response={201: BookingResponseSchema, 400: dict})
def create_booking(request, payload: BookingCreateSchema):
    """Crear nueva reserva"""

    if not request.user.is_authenticated:
        return 401, {"message": "Authentication required"}

    try:
        # Validar tour y schedule
        tour = get_object_or_404(Tour, id=payload.tour_id, status='published')
        schedule = get_object_or_404(
            TourSchedule,
            id=payload.schedule_id,
            tour=tour,
            status='available'
        )

        # Verificar disponibilidad
        if schedule.available_spots < payload.number_of_participants:
            return 400, {"message": "No hay suficientes cupos disponibles"}

        # Calcular precio
        total_price = calculate_booking_price(tour, schedule, payload.number_of_participants)

        with transaction.atomic():
            # Crear reserva
            booking = Booking.objects.create(
                booking_code=generate_booking_code(),
                user=request.user,
                tour=tour,
                schedule=schedule,
                number_of_participants=payload.number_of_participants,
                emergency_contact_name=payload.emergency_contact_name,
                emergency_contact_phone=payload.emergency_contact_phone,
                emergency_contact_relationship=payload.emergency_contact_relationship or "",
                group_medical_notes=payload.medical_notes or "",
                special_requirements=payload.special_requests or "",
                base_price=tour.base_price,
                total_price=total_price,
                currency=tour.currency,
                payment_due_date=timezone.now() + timedelta(hours=24),  # 24 horas para pagar
                created_by=request.user
            )

            # Crear participantes
            for participant_data in payload.participants:
                BookingParticipant.objects.create(
                    booking=booking,
                    **participant_data.dict()
                )

            # Actualizar cupos disponibles
            schedule.available_spots -= payload.number_of_participants
            schedule.save()

            # Crear recordatorio de pago
            BookingReminder.objects.create(
                booking=booking,
                reminder_type='payment_due',
                scheduled_date=booking.payment_due_date,
                subject='Recordatorio de pago - Condor Expeditions',
                message=f'Su pago de ${total_price} para la reserva {booking.booking_code} vence pronto.'
            )

        return 201, BookingResponseSchema(
            id=str(booking.id),
            booking_code=booking.booking_code,
            tour_title=tour.title,
            schedule_date=str(schedule.departure_date),
            number_of_participants=booking.number_of_participants,
            total_price=float(booking.total_price),
            currency=booking.currency,
            status=booking.status,
            booking_date=booking.booking_date.isoformat(),
            payment_due_date=booking.payment_due_date.isoformat() if booking.payment_due_date else None
        )

    except Exception as e:
        return 400, {"message": "Error al crear reserva", "error": str(e)}

@router.get("", response=List[BookingResponseSchema])
@paginate
def list_user_bookings(request):
    """Listar reservas del usuario autenticado"""

    if not request.user.is_authenticated:
        return []

    bookings = Booking.objects.select_related('tour', 'schedule').filter(
        user=request.user
    ).order_by('-booking_date')

    return [
        BookingResponseSchema(
            id=str(booking.id),
            booking_code=booking.booking_code,
            tour_title=booking.tour.title,
            schedule_date=str(booking.schedule.departure_date),
            number_of_participants=booking.number_of_participants,
            total_price=float(booking.total_price),
            currency=booking.currency,
            status=booking.status,
            booking_date=booking.booking_date.isoformat(),
            payment_due_date=booking.payment_due_date.isoformat() if booking.payment_due_date else None
        )
        for booking in bookings
    ]

@router.get("/{booking_id}", response={200: BookingDetailSchema, 404: dict})
def get_booking_detail(request, booking_id: str):
    """Obtener detalles completos de una reserva"""

    if not request.user.is_authenticated:
        return 404, {"message": "Authentication required"}

    try:
        booking = Booking.objects.select_related(
            'tour', 'schedule', 'user'
        ).prefetch_related(
            'participants', 'payments', 'documents'
        ).get(id=booking_id, user=request.user)

        # Construir respuesta detallada
        return BookingDetailSchema(
            id=str(booking.id),
            booking_code=booking.booking_code,
            user={
                "id": str(booking.user.id),
                "name": booking.user.get_full_name(),
                "email": booking.user.email
            },
            tour={
                "id": str(booking.tour.id),
                "title": booking.tour.title,
                "location": booking.tour.location,
                "duration_days": booking.tour.duration_days
            },
            schedule={
                "id": str(booking.schedule.id),
                "departure_date": booking.schedule.departure_date.isoformat(),
                "return_date": booking.schedule.return_date.isoformat(),
                "meeting_point": booking.schedule.meeting_point
            },
            participants=[
                {
                    "id": str(participant.id),
                    "first_name": participant.first_name,
                    "last_name": participant.last_name,
                    "email": participant.email,
                    "phone": participant.phone,
                    "nationality": participant.nationality
                }
                for participant in booking.participants.all()
            ],
            total_price=float(booking.total_price),
            status=booking.status,
            emergency_contact={
                "name": booking.emergency_contact_name,
                "phone": booking.emergency_contact_phone,
                "relationship": booking.emergency_contact_relationship
            },
            special_requests=booking.special_requirements,
            medical_notes=booking.group_medical_notes,
            payments=[
                {
                    "id": str(payment.id),
                    "amount": float(payment.amount),
                    "status": payment.status,
                    "payment_date": payment.payment_date.isoformat() if payment.payment_date else None
                }
                for payment in booking.payments.all()
            ],
            documents=[
                {
                    "id": str(document.id),
                    "name": document.name,
                    "document_type": document.document_type,
                    "file_url": document.file.url if document.file else None
                }
                for document in booking.documents.all()
            ],
            created_at=booking.created_at.isoformat()
        )

    except Booking.DoesNotExist:
        return 404, {"message": "Reserva no encontrada"}

@router.post("/{booking_id}/cancel", response={200: dict, 400: dict})
def cancel_booking(request, booking_id: str):
    """Cancelar reserva"""

    if not request.user.is_authenticated:
        return 401, {"message": "Authentication required"}

    try:
        booking = Booking.objects.select_related('schedule').get(
            id=booking_id,
            user=request.user,
            status__in=['pending', 'confirmed']
        )

        with transaction.atomic():
            # Actualizar estado de la reserva
            booking.status = 'cancelled'
            booking.cancellation_date = timezone.now()
            booking.save()

            # Restaurar cupos disponibles
            booking.schedule.available_spots += booking.number_of_participants
            booking.schedule.save()

            # Cancelar recordatorios pendientes
            booking.reminders.filter(
                status='scheduled',
                reminder_type='payment_due'
            ).update(status='cancelled')

        return 200, {"message": "Reserva cancelada exitosamente"}

    except Booking.DoesNotExist:
        return 404, {"message": "Reserva no encontrada o no puede ser cancelada"}

@router.get("/{booking_id}/participants", response=list)
def get_booking_participants(request, booking_id: str):
    """Obtener participantes de una reserva"""

    if not request.user.is_authenticated:
        return []

    try:
        booking = Booking.objects.get(id=booking_id, user=request.user)
        participants = booking.participants.all()

        return [
            {
                "id": str(participant.id),
                "first_name": participant.first_name,
                "last_name": participant.last_name,
                "email": participant.email,
                "phone": participant.phone,
                "date_of_birth": participant.date_of_birth.isoformat() if participant.date_of_birth else None,
                "nationality": participant.nationality,
                "passport_number": participant.passport_number,
                "medical_conditions": participant.medical_conditions,
                "dietary_restrictions": participant.dietary_restrictions,
                "emergency_contact": {
                    "name": participant.emergency_contact_name,
                    "phone": participant.emergency_contact_phone,
                    "relationship": participant.emergency_contact_relationship
                }
            }
            for participant in participants
        ]

    except Booking.DoesNotExist:
        return []

@router.post("/{booking_id}/participants/{participant_id}", response={200: dict, 404: dict})
def update_participant(request, booking_id: str, participant_id: str, participant_data: BookingParticipantSchema):
    """Actualizar información de participante"""

    if not request.user.is_authenticated:
        return 401, {"message": "Authentication required"}

    try:
        participant = BookingParticipant.objects.get(
            id=participant_id,
            booking_id=booking_id,
            booking__user=request.user
        )

        # Actualizar campos
        for field, value in participant_data.dict(exclude_unset=True).items():
            setattr(participant, field, value)

        participant.save()

        return 200, {"message": "Participante actualizado exitosamente"}

    except BookingParticipant.DoesNotExist:
        return 404, {"message": "Participante no encontrado"}

# Endpoints para operaciones administrativas (requieren permisos especiales)

@router.get("/admin/all", response=List[BookingResponseSchema])
@paginate
def list_all_bookings(request, status: Optional[str] = None, tour_id: Optional[str] = None):
    """Listar todas las reservas (solo para administradores)"""

    if not request.user.is_authenticated or not request.user.is_staff:
        return []

    queryset = Booking.objects.select_related('tour', 'schedule', 'user')

    if status:
        queryset = queryset.filter(status=status)

    if tour_id:
        queryset = queryset.filter(tour_id=tour_id)

    bookings = queryset.order_by('-booking_date')

    return [
        BookingResponseSchema(
            id=str(booking.id),
            booking_code=booking.booking_code,
            tour_title=booking.tour.title,
            schedule_date=str(booking.schedule.departure_date),
            number_of_participants=booking.number_of_participants,
            total_price=float(booking.total_price),
            currency=booking.currency,
            status=booking.status,
            booking_date=booking.booking_date.isoformat(),
            payment_due_date=booking.payment_due_date.isoformat() if booking.payment_due_date else None
        )
        for booking in bookings
    ]

@router.post("/{booking_id}/confirm", response={200: dict, 404: dict})
def confirm_booking(request, booking_id: str):
    """Confirmar reserva (operación administrativa)"""

    if not request.user.is_authenticated or not request.user.is_staff:
        return 401, {"message": "Admin access required"}

    try:
        booking = Booking.objects.get(id=booking_id, status='pending')
        booking.status = 'confirmed'
        booking.confirmation_date = timezone.now()
        booking.save()

        return 200, {"message": "Reserva confirmada exitosamente"}

    except Booking.DoesNotExist:
        return 404, {"message": "Reserva no encontrada"}

# Estadísticas rápidas para dashboard
@router.get("/stats", response=dict)
def get_booking_stats(request):
    """Obtener estadísticas de reservas"""

    if not request.user.is_authenticated:
        return {}

    # Estadísticas básicas del usuario
    user_bookings = Booking.objects.filter(user=request.user)

    return {
        "total_bookings": user_bookings.count(),
        "pending_bookings": user_bookings.filter(status='pending').count(),
        "confirmed_bookings": user_bookings.filter(status='confirmed').count(),
        "completed_bookings": user_bookings.filter(status='completed').count(),
        "cancelled_bookings": user_bookings.filter(status='cancelled').count(),
        "total_spent": float(user_bookings.filter(status='completed').aggregate(
            total=models.Sum('total_price')
        )['total'] or 0)
    }