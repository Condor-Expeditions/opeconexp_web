from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator
import uuid
from users.models import User


class Booking(models.Model):
    """Reserva principal del sistema"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Código único de reserva
    booking_code = models.CharField(_("Código de reserva"), max_length=20, unique=True)

    # Usuario que realiza la reserva
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')

    # Información del tour
    tour = models.ForeignKey('tours.Tour', on_delete=models.CASCADE, related_name='bookings')
    schedule = models.ForeignKey('tours.TourSchedule', on_delete=models.CASCADE, related_name='bookings')

    # Participantes
    number_of_participants = models.IntegerField(_("Número de participantes"), validators=[MinValueValidator(1)])
    participants_info = models.JSONField(_("Información de participantes"), default=list, blank=True)

    # Información del contacto principal
    emergency_contact_name = models.CharField(_("Contacto de emergencia"), max_length=200)
    emergency_contact_phone = models.CharField(_("Teléfono de emergencia"), max_length=20)
    emergency_contact_relationship = models.CharField(_("Relación"), max_length=50, blank=True)

    # Información médica grupal
    group_medical_notes = models.TextField(_("Notas médicas grupales"), blank=True)
    special_requirements = models.TextField(_("Requerimientos especiales"), blank=True)

    # Precios y pagos
    base_price = models.DecimalField(_("Precio base"), max_digits=10, decimal_places=2)
    total_price = models.DecimalField(_("Precio total"), max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(_("Descuento aplicado"), max_digits=10, decimal_places=2, default=0)
    taxes_amount = models.DecimalField(_("Impuestos"), max_digits=10, decimal_places=2, default=0)
    currency = models.CharField(_("Moneda"), max_length=3, default='USD')

    # Estado de la reserva
    status = models.CharField(_("Estado"), max_length=20, choices=[
        ('pending', 'Pendiente de pago'),
        ('confirmed', 'Confirmada'),
        ('paid', 'Pagada'),
        ('cancelled', 'Cancelada'),
        ('refunded', 'Reembolsada'),
        ('completed', 'Completada'),
        ('no_show', 'No presentado')
    ], default='pending')

    # Fechas importantes
    booking_date = models.DateTimeField(_("Fecha de reserva"), auto_now_add=True)
    confirmation_date = models.DateTimeField(_("Fecha de confirmación"), null=True, blank=True)
    payment_due_date = models.DateTimeField(_("Fecha límite de pago"), null=True, blank=True)
    cancellation_date = models.DateTimeField(_("Fecha de cancelación"), null=True, blank=True)

    # Información de pago
    payment_method = models.CharField(_("Método de pago"), max_length=50, blank=True)
    payment_reference = models.CharField(_("Referencia de pago"), max_length=100, blank=True)
    payment_status = models.CharField(_("Estado de pago"), max_length=20, choices=[
        ('pending', 'Pendiente'),
        ('processing', 'Procesando'),
        ('completed', 'Completado'),
        ('failed', 'Fallido'),
        ('cancelled', 'Cancelado'),
        ('refunded', 'Reembolsado')
    ], default='pending')

    # Información adicional
    special_requests = models.TextField(_("Solicitudes especiales"), blank=True)
    internal_notes = models.TextField(_("Notas internas"), blank=True)
    customer_notes = models.TextField(_("Notas del cliente"), blank=True)

    # Configuración de notificaciones
    send_reminders = models.BooleanField(_("Enviar recordatorios"), default=True)
    reminder_sent = models.BooleanField(_("Recordatorio enviado"), default=False)

    # Auditoría
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_bookings')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_bookings')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Reserva")
        verbose_name_plural = _("Reservas")
        ordering = ['-booking_date']
        indexes = [
            models.Index(fields=['booking_code']),
            models.Index(fields=['user', 'status']),
            models.Index(fields=['tour', 'schedule']),
            models.Index(fields=['status', 'booking_date']),
        ]

    def __str__(self):
        return f"Reserva {self.booking_code} - {self.user.get_full_name()}"


class BookingParticipant(models.Model):
    """Información detallada de cada participante en la reserva"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='participants')

    # Información personal
    first_name = models.CharField(_("Nombre"), max_length=100)
    last_name = models.CharField(_("Apellido"), max_length=100)
    email = models.EmailField(_("Email"), blank=True)
    phone = models.CharField(_("Teléfono"), max_length=20, blank=True)

    # Información adicional
    date_of_birth = models.DateField(_("Fecha de nacimiento"), null=True, blank=True)
    nationality = models.CharField(_("Nacionalidad"), max_length=100, blank=True)
    passport_number = models.CharField(_("Número de pasaporte"), max_length=50, blank=True)
    passport_expiry = models.DateField(_("Vencimiento de pasaporte"), null=True, blank=True)

    # Información médica individual
    medical_conditions = models.TextField(_("Condiciones médicas"), blank=True)
    allergies = models.TextField(_("Alergias"), blank=True)
    medications = models.TextField(_("Medicamentos"), blank=True)
    dietary_restrictions = models.TextField(_("Restricciones alimentarias"), blank=True)

    # Información de emergencia
    emergency_contact_name = models.CharField(_("Contacto de emergencia"), max_length=200, blank=True)
    emergency_contact_phone = models.CharField(_("Teléfono de emergencia"), max_length=20, blank=True)
    emergency_contact_relationship = models.CharField(_("Relación"), max_length=50, blank=True)

    # Estado del participante
    status = models.CharField(_("Estado"), max_length=20, choices=[
        ('confirmed', 'Confirmado'),
        ('pending', 'Pendiente'),
        ('cancelled', 'Cancelado'),
        ('waitlist', 'Lista de espera')
    ], default='confirmed')

    # Información adicional
    special_requests = models.TextField(_("Solicitudes especiales"), blank=True)
    room_preference = models.CharField(_("Preferencia de habitación"), max_length=50, blank=True)
    seat_preference = models.CharField(_("Preferencia de asiento"), max_length=50, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Participante de reserva")
        verbose_name_plural = _("Participantes de reserva")

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.booking.booking_code}"


class BookingPayment(models.Model):
    """Pagos asociados a reservas"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='payments')

    # Información del pago
    amount = models.DecimalField(_("Monto"), max_digits=10, decimal_places=2)
    currency = models.CharField(_("Moneda"), max_length=3, default='USD')
    payment_method = models.CharField(_("Método de pago"), max_length=50)

    # Estado del pago
    status = models.CharField(_("Estado"), max_length=20, choices=[
        ('pending', 'Pendiente'),
        ('processing', 'Procesando'),
        ('completed', 'Completado'),
        ('failed', 'Fallido'),
        ('cancelled', 'Cancelado'),
        ('refunded', 'Reembolsado'),
        ('partially_refunded', 'Parcialmente reembolsado')
    ], default='pending')

    # Información de la transacción
    transaction_id = models.CharField(_("ID de transacción"), max_length=100, blank=True)
    payment_gateway = models.CharField(_("Pasarela de pago"), max_length=50, blank=True)
    gateway_response = models.JSONField(_("Respuesta de la pasarela"), default=dict, blank=True)

    # Fechas
    payment_date = models.DateTimeField(_("Fecha de pago"), null=True, blank=True)
    processed_date = models.DateTimeField(_("Fecha de procesamiento"), null=True, blank=True)

    # Información adicional
    notes = models.TextField(_("Notas"), blank=True)
    failure_reason = models.TextField(_("Razón de fallo"), blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Pago de reserva")
        verbose_name_plural = _("Pagos de reserva")
        ordering = ['-created_at']

    def __str__(self):
        return f"Pago {self.transaction_id} - {self.booking.booking_code}"


class BookingDocument(models.Model):
    """Documentos asociados a reservas (comprobantes, contratos, etc.)"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='documents')

    # Información del documento
    name = models.CharField(_("Nombre"), max_length=200)
    document_type = models.CharField(_("Tipo de documento"), max_length=50, choices=[
        ('contract', 'Contrato'),
        ('invoice', 'Factura'),
        ('receipt', 'Recibo'),
        ('waiver', 'Descargo de responsabilidad'),
        ('insurance', 'Seguro'),
        ('itinerary', 'Itinerario'),
        ('confirmation', 'Confirmación'),
        ('other', 'Otro')
    ])

    # Archivo
    file = models.FileField(_("Archivo"), upload_to='booking_documents/')
    file_size = models.IntegerField(_("Tamaño del archivo"), null=True, blank=True)
    mime_type = models.CharField(_("Tipo MIME"), max_length=100, blank=True)

    # Estado
    is_required = models.BooleanField(_("Requerido"), default=False)
    is_verified = models.BooleanField(_("Verificado"), default=False)
    verification_date = models.DateTimeField(_("Fecha de verificación"), null=True, blank=True)

    # Información adicional
    description = models.TextField(_("Descripción"), blank=True)
    expiry_date = models.DateField(_("Fecha de expiración"), null=True, blank=True)
    notes = models.TextField(_("Notas"), blank=True)

    # Auditoría
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='uploaded_documents')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Documento de reserva")
        verbose_name_plural = _("Documentos de reserva")
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.booking.booking_code}"


class BookingReminder(models.Model):
    """Recordatorios asociados a reservas"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='reminders')

    # Información del recordatorio
    reminder_type = models.CharField(_("Tipo de recordatorio"), max_length=50, choices=[
        ('payment_due', 'Vencimiento de pago'),
        ('departure', 'Fecha de salida'),
        ('document_required', 'Documento requerido'),
        ('preparation', 'Preparación para el viaje'),
        ('feedback', 'Solicitud de feedback')
    ])

    # Programación
    scheduled_date = models.DateTimeField(_("Fecha programada"))
    sent_date = models.DateTimeField(_("Fecha de envío"), null=True, blank=True)

    # Estado
    status = models.CharField(_("Estado"), max_length=20, choices=[
        ('scheduled', 'Programado'),
        ('sent', 'Enviado'),
        ('cancelled', 'Cancelado'),
        ('failed', 'Fallido')
    ], default='scheduled')

    # Contenido
    subject = models.CharField(_("Asunto"), max_length=200, blank=True)
    message = models.TextField(_("Mensaje"), blank=True)

    # Canal de envío
    send_email = models.BooleanField(_("Enviar por email"), default=True)
    send_sms = models.BooleanField(_("Enviar por SMS"), default=False)
    send_push = models.BooleanField(_("Enviar push"), default=False)

    # Información adicional
    recipient_email = models.EmailField(_("Email del destinatario"), blank=True)
    recipient_phone = models.CharField(_("Teléfono del destinatario"), max_length=20, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Recordatorio de reserva")
        verbose_name_plural = _("Recordatorios de reserva")
        ordering = ['scheduled_date']

    def __str__(self):
        return f"{self.reminder_type} - {self.booking.booking_code}"
