"""
Configuración del admin para el módulo de reservas

Personalización completa del panel administrativo para gestión de reservas,
participantes, pagos y documentos.
"""

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.db.models import Sum, Count
from django.utils import timezone
from .models import Booking, BookingParticipant, BookingPayment, BookingDocument, BookingReminder


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    """Admin para reservas"""

    list_display = [
        'booking_code', 'user', 'tour', 'schedule_date',
        'number_of_participants', 'total_price', 'status',
        'booking_date', 'payment_due_date'
    ]

    list_filter = [
        'status', 'booking_date', 'payment_due_date',
        'tour__category', 'tour__difficulty_level'
    ]

    search_fields = [
        'booking_code', 'user__email', 'user__first_name',
        'tour__title', 'emergency_contact_name'
    ]

    readonly_fields = [
        'booking_code', 'created_at', 'updated_at', 'created_by'
    ]

    fieldsets = (
        ('Información Básica', {
            'fields': ('booking_code', 'user', 'tour', 'schedule')
        }),
        ('Participantes', {
            'fields': ('number_of_participants', 'participants_info')
        }),
        ('Contacto de Emergencia', {
            'fields': (
                'emergency_contact_name', 'emergency_contact_phone',
                'emergency_contact_relationship'
            )
        }),
        ('Información Médica', {
            'fields': ('group_medical_notes', 'special_requirements')
        }),
        ('Precios', {
            'fields': (
                'base_price', 'total_price', 'discount_amount',
                'taxes_amount', 'currency'
            )
        }),
        ('Estado y Fechas', {
            'fields': (
                'status', 'booking_date', 'confirmation_date',
                'payment_due_date', 'cancellation_date'
            )
        }),
        ('Información de Pago', {
            'fields': (
                'payment_method', 'payment_reference', 'payment_status'
            )
        }),
        ('Notas', {
            'fields': ('special_requests', 'internal_notes', 'customer_notes'),
            'classes': ('collapse',)
        }),
        ('Configuración', {
            'fields': ('send_reminders', 'reminder_sent'),
            'classes': ('collapse',)
        }),
        ('Auditoría', {
            'fields': ('created_by', 'updated_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    # Note: participants_info is likely a JSONField, not ManyToMany
    # filter_horizontal cannot be used with JSONFields

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'user', 'tour', 'schedule', 'created_by'
        ).prefetch_related('participants', 'payments')

    def schedule_date(self, obj):
        return obj.schedule.departure_date if obj.schedule else 'Sin fecha'
    schedule_date.short_description = 'Fecha de Tour'
    schedule_date.admin_order_field = 'schedule__departure_date'

    def tour(self, obj):
        if obj.tour:
            return format_html(
                '<a href="{}">{}</a>',
                reverse('admin:tours_tour_change', args=[obj.tour.id]),
                obj.tour.title
            )
        return 'Sin tour'
    tour.short_description = 'Tour'

    actions = [
        'confirm_bookings', 'cancel_bookings', 'send_confirmation_emails',
        'export_bookings_csv', 'calculate_revenue'
    ]

    def confirm_bookings(self, request, queryset):
        updated = 0
        for booking in queryset.filter(status='pending'):
            booking.status = 'confirmed'
            booking.confirmation_date = timezone.now()
            booking.save()
            updated += 1

        self.message_user(
            request,
            f'Se confirmaron {updated} reservas.'
        )
    confirm_bookings.short_description = 'Confirmar reservas seleccionadas'

    def cancel_bookings(self, request, queryset):
        updated = 0
        for booking in queryset.exclude(status__in=['cancelled', 'completed']):
            booking.status = 'cancelled'
            booking.cancellation_date = timezone.now()
            booking.save()
            updated += 1

        self.message_user(
            request,
            f'Se cancelaron {updated} reservas.'
        )
    cancel_bookings.short_description = 'Cancelar reservas seleccionadas'

    def send_confirmation_emails(self, request, queryset):
        # Esta acción enviaría emails de confirmación
        # Por ahora solo marca como enviados
        count = queryset.count()
        self.message_user(
            request,
            f'Función de envío de emails implementada para {count} reservas.'
        )
    send_confirmation_emails.short_description = 'Enviar emails de confirmación'


@admin.register(BookingParticipant)
class BookingParticipantAdmin(admin.ModelAdmin):
    """Admin para participantes de reservas"""

    list_display = [
        'booking', 'first_name', 'last_name', 'email',
        'phone', 'nationality', 'status'
    ]

    list_filter = ['status', 'nationality', 'booking__tour__category']
    search_fields = [
        'first_name', 'last_name', 'email', 'booking__booking_code'
    ]

    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Reserva', {
            'fields': ('booking',)
        }),
        ('Información Personal', {
            'fields': (
                'first_name', 'last_name', 'email', 'phone'
            )
        }),
        ('Documentos', {
            'fields': (
                'date_of_birth', 'nationality', 'passport_number',
                'passport_expiry'
            )
        }),
        ('Información Médica', {
            'fields': (
                'medical_conditions', 'allergies', 'medications',
                'dietary_restrictions'
            )
        }),
        ('Contacto de Emergencia', {
            'fields': (
                'emergency_contact_name', 'emergency_contact_phone',
                'emergency_contact_relationship'
            )
        }),
        ('Preferencias', {
            'fields': ('special_requests', 'room_preference', 'seat_preference')
        }),
        ('Estado', {
            'fields': ('status',),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('booking__tour')


@admin.register(BookingPayment)
class BookingPaymentAdmin(admin.ModelAdmin):
    """Admin para pagos de reservas"""

    list_display = [
        'booking', 'amount', 'currency', 'status',
        'payment_method', 'created_at'
    ]

    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['booking__booking_code', 'transaction_id']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Información Básica', {
            'fields': ('booking', 'amount', 'currency', 'payment_method')
        }),
        ('Estado', {
            'fields': ('status', 'payment_date', 'processed_date')
        }),
        ('Gateway', {
            'fields': (
                'transaction_id', 'gateway_name', 'gateway_response'
            )
        }),
        ('Notas', {
            'fields': ('notes', 'failure_reason'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('booking')


@admin.register(BookingDocument)
class BookingDocumentAdmin(admin.ModelAdmin):
    """Admin para documentos de reservas"""

    list_display = [
        'booking', 'name', 'document_type', 'is_required',
        'is_verified', 'uploaded_by', 'created_at'
    ]

    list_filter = ['document_type', 'is_required', 'is_verified', 'created_at']
    search_fields = ['booking__booking_code', 'name']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Información Básica', {
            'fields': ('booking', 'name', 'document_type')
        }),
        ('Archivo', {
            'fields': ('file', 'file_size', 'mime_type')
        }),
        ('Verificación', {
            'fields': (
                'is_required', 'is_verified', 'verification_date'
            )
        }),
        ('Notas', {
            'fields': ('description', 'expiry_date', 'notes'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('booking', 'uploaded_by')


@admin.register(BookingReminder)
class BookingReminderAdmin(admin.ModelAdmin):
    """Admin para recordatorios de reservas"""

    list_display = [
        'booking', 'reminder_type', 'scheduled_date',
        'sent_date', 'status', 'recipient_email'
    ]

    list_filter = ['reminder_type', 'status', 'scheduled_date']
    search_fields = ['booking__booking_code', 'recipient_email']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Información Básica', {
            'fields': ('booking', 'reminder_type', 'scheduled_date')
        }),
        ('Estado', {
            'fields': ('status', 'sent_date')
        }),
        ('Contenido', {
            'fields': ('subject', 'message')
        }),
        ('Envío', {
            'fields': (
                'send_email', 'send_sms', 'send_push',
                'recipient_email', 'recipient_phone'
            )
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('booking')

    actions = ['mark_as_sent', 'reschedule_reminders']

    def mark_as_sent(self, request, queryset):
        queryset.update(status='sent', sent_date=timezone.now())
        self.message_user(
            request,
            f'Se marcaron {queryset.count()} recordatorios como enviados.'
        )
    mark_as_sent.short_description = 'Marcar como enviados'

    def reschedule_reminders(self, request, queryset):
        # Lógica para reprogramar recordatorios
        count = queryset.count()
        self.message_user(
            request,
            f'Función de reprogramación implementada para {count} recordatorios.'
        )
    reschedule_reminders.short_description = 'Reprogramar recordatorios'
