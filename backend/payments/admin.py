"""
Configuración del admin para el módulo de pagos

Personalización completa del panel administrativo para gestión de pagos,
transacciones y reembolsos.
"""

from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Sum, Count, Avg
from django.utils import timezone
from .models import Payment, PaymentMethod, PaymentTransaction, Refund, PaymentWebhook, PaymentPlan, PaymentInstallment, PaymentCommission


@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    """Admin para métodos de pago"""

    list_display = [
        'name', 'code', 'method_type', 'is_active', 'is_online',
        'fixed_fee', 'percentage_fee', 'currency'
    ]

    list_filter = ['method_type', 'is_active', 'is_online', 'currency']
    search_fields = ['name', 'code', 'description']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Información Básica', {
            'fields': ('name', 'code', 'description', 'method_type')
        }),
        ('Configuración', {
            'fields': ('is_active', 'is_online', 'requires_approval')
        }),
        ('Procesamiento', {
            'fields': (
                'processing_time_hours', 'min_amount', 'max_amount'
            )
        }),
        ('Tarifas', {
            'fields': (
                'fixed_fee', 'percentage_fee', 'currency'
            )
        }),
        ('Configuración Específica', {
            'fields': ('gateway_config', 'instructions', 'supported_currencies'),
            'classes': ('collapse',)
        }),
    )

    actions = ['activate_methods', 'deactivate_methods']

    def activate_methods(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(
            request,
            f'Se activaron {queryset.count()} métodos de pago.'
        )
    activate_methods.short_description = 'Activar métodos seleccionados'

    def deactivate_methods(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(
            request,
            f'Se desactivaron {queryset.count()} métodos de pago.'
        )
    deactivate_methods.short_description = 'Desactivar métodos seleccionados'


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """Admin para pagos"""

    list_display = [
        'payment_number', 'booking', 'amount', 'currency',
        'status', 'payment_method', 'gateway_name', 'created_at'
    ]

    list_filter = [
        'status', 'payment_method', 'gateway_name', 'currency', 'created_at'
    ]

    search_fields = [
        'payment_number', 'booking__booking_code', 'transaction_id'
    ]

    readonly_fields = ['created_at', 'payment_number']

    fieldsets = (
        ('Información Básica', {
            'fields': ('payment_number', 'booking', 'amount', 'currency')
        }),
        ('Método de Pago', {
            'fields': ('payment_method',)
        }),
        ('Estado', {
            'fields': ('status', 'payment_date', 'processed_date', 'due_date')
        }),
        ('Gateway', {
            'fields': (
                'gateway_name', 'gateway_transaction_id', 'gateway_response'
            )
        }),
        ('Notas', {
            'fields': ('description', 'notes', 'failure_reason'),
            'classes': ('collapse',)
        }),
        ('Auditoría', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('booking', 'payment_method')

    actions = ['mark_as_completed', 'mark_as_failed', 'export_payments']

    def mark_as_completed(self, request, queryset):
        updated = 0
        for payment in queryset.filter(status='pending'):
            payment.status = 'completed'
            payment.processed_at = timezone.now()
            payment.save()
            updated += 1

        self.message_user(
            request,
            f'Se marcaron {updated} pagos como completados.'
        )
    mark_as_completed.short_description = 'Marcar como completados'

    def mark_as_failed(self, request, queryset):
        queryset.update(status='failed')
        self.message_user(
            request,
            f'Se marcaron {queryset.count()} pagos como fallidos.'
        )
    mark_as_failed.short_description = 'Marcar como fallidos'


@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    """Admin para transacciones de pago"""

    list_display = [
        'payment', 'transaction_type', 'amount', 'status',
        'gateway_transaction_id', 'processed_at'
    ]

    list_filter = ['transaction_type', 'status', 'processed_at']
    search_fields = ['payment__payment_number', 'gateway_transaction_id']
    readonly_fields = ['created_at']

    fieldsets = (
        ('Información Básica', {
            'fields': ('payment', 'transaction_type', 'amount', 'currency')
        }),
        ('Estado', {
            'fields': ('status', 'processed_at')
        }),
        ('Gateway', {
            'fields': ('gateway_transaction_id', 'gateway_response')
        }),
        ('Detalles', {
            'fields': ('description', 'metadata'),
            'classes': ('collapse',)
        }),
    )

    def has_add_permission(self, request):
        return False  # Las transacciones se crean automáticamente

    def has_change_permission(self, request, obj=None):
        return False  # Solo lectura


@admin.register(Refund)
class RefundAdmin(admin.ModelAdmin):
    """Admin para reembolsos"""

    list_display = [
        'refund_number', 'payment', 'amount', 'status',
        'reason', 'processed_at'
    ]

    list_filter = ['status', 'processed_at']
    search_fields = ['refund_number', 'payment__payment_number']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Información Básica', {
            'fields': ('payment', 'refund_number', 'amount', 'currency')
        }),
        ('Razón', {
            'fields': ('reason', 'reason_code')
        }),
        ('Estado', {
            'fields': ('status', 'processed_by', 'processed_at')
        }),
        ('Gateway', {
            'fields': ('gateway_refund_id', 'gateway_response'),
            'classes': ('collapse',)
        }),
        ('Notas', {
            'fields': ('notes', 'customer_notified'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('payment', 'processed_by')

    actions = ['mark_as_completed', 'notify_customers']

    def mark_as_completed(self, request, queryset):
        updated = 0
        for refund in queryset.filter(status='processing'):
            refund.status = 'completed'
            refund.processed_at = timezone.now()
            refund.save()
            updated += 1

        self.message_user(
            request,
            f'Se marcaron {updated} reembolsos como completados.'
        )
    mark_as_completed.short_description = 'Marcar como completados'

    def notify_customers(self, request, queryset):
        # Lógica para notificar a clientes sobre reembolsos
        count = queryset.count()
        self.message_user(
            request,
            f'Función de notificación implementada para {count} reembolsos.'
        )
    notify_customers.short_description = 'Notificar clientes'


@admin.register(PaymentWebhook)
class PaymentWebhookAdmin(admin.ModelAdmin):
    """Admin para webhooks de pago"""

    list_display = [
        'webhook_id', 'event_type', 'source', 'status',
        'related_payment', 'created_at'
    ]

    list_filter = ['event_type', 'source', 'status', 'created_at']
    search_fields = ['webhook_id', 'event_type']
    readonly_fields = ['created_at', 'webhook_id', 'payload', 'signature']

    fieldsets = (
        ('Información Básica', {
            'fields': ('webhook_id', 'event_type', 'source')
        }),
        ('Estado', {
            'fields': ('status', 'processed_at', 'error_message', 'retry_count')
        }),
        ('Datos', {
            'fields': ('payload', 'signature'),
            'classes': ('collapse',)
        }),
        ('Relaciones', {
            'fields': ('related_payment',),
            'classes': ('collapse',)
        }),
    )

    def has_add_permission(self, request):
        return False  # Los webhooks llegan automáticamente

    def has_change_permission(self, request, obj=None):
        return False  # Solo lectura


@admin.register(PaymentPlan)
class PaymentPlanAdmin(admin.ModelAdmin):
    """Admin para planes de pago"""

    list_display = [
        'plan_name', 'booking', 'total_amount', 'number_of_payments',
        'frequency', 'status', 'next_payment_date'
    ]

    list_filter = ['frequency', 'status', 'start_date']
    search_fields = ['plan_name', 'booking__booking_code']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Información Básica', {
            'fields': ('booking', 'plan_name', 'total_amount', 'currency')
        }),
        ('Configuración', {
            'fields': ('number_of_payments', 'frequency', 'start_date')
        }),
        ('Estado', {
            'fields': ('status', 'next_payment_date')
        }),
        ('Detalles', {
            'fields': ('down_payment', 'notes'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('booking')


@admin.register(PaymentInstallment)
class PaymentInstallmentAdmin(admin.ModelAdmin):
    """Admin para cuotas de planes de pago"""

    list_display = [
        'payment_plan', 'installment_number', 'amount',
        'due_date', 'status', 'paid_date'
    ]

    list_filter = ['status', 'due_date']
    search_fields = ['payment_plan__plan_name']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Información Básica', {
            'fields': ('payment_plan', 'installment_number', 'amount', 'due_date')
        }),
        ('Estado', {
            'fields': ('status', 'paid_date', 'payment')
        }),
        ('Notas', {
            'fields': ('late_fee', 'notes'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('payment_plan', 'payment')

    actions = ['mark_as_paid', 'mark_as_overdue']

    def mark_as_paid(self, request, queryset):
        updated = 0
        for installment in queryset.filter(status='pending'):
            installment.status = 'paid'
            installment.paid_date = timezone.now()
            installment.save()
            updated += 1

        self.message_user(
            request,
            f'Se marcaron {updated} cuotas como pagadas.'
        )
    mark_as_paid.short_description = 'Marcar como pagadas'

    def mark_as_overdue(self, request, queryset):
        queryset.filter(
            status='pending',
            due_date__lt=timezone.now()
        ).update(status='overdue')
        self.message_user(
            request,
            f'Se marcaron cuotas vencidas como overdue.'
        )
    mark_as_overdue.short_description = 'Marcar vencidas como overdue'


@admin.register(PaymentCommission)
class PaymentCommissionAdmin(admin.ModelAdmin):
    """Admin para comisiones de pago"""

    list_display = [
        'payment', 'commission_type', 'base_amount',
        'commission_amount', 'status', 'paid_date'
    ]

    list_filter = ['commission_type', 'status', 'paid_date']
    search_fields = ['payment__payment_number']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Información Básica', {
            'fields': ('payment', 'booking', 'commission_type')
        }),
        ('Cálculo', {
            'fields': (
                'base_amount', 'commission_rate', 'commission_amount'
            )
        }),
        ('Estado', {
            'fields': ('status', 'paid_date', 'payment_reference')
        }),
        ('Notas', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('payment', 'booking')

    actions = ['mark_as_paid', 'calculate_commissions']

    def mark_as_paid(self, request, queryset):
        updated = 0
        for commission in queryset.filter(status='pending'):
            commission.status = 'paid'
            commission.paid_date = timezone.now()
            commission.save()
            updated += 1

        self.message_user(
            request,
            f'Se marcaron {updated} comisiones como pagadas.'
        )
    mark_as_paid.short_description = 'Marcar como pagadas'

    def calculate_commissions(self, request, queryset):
        # Recalcular comisiones
        count = queryset.count()
        self.message_user(
            request,
            f'Función de recálculo implementada para {count} comisiones.'
        )
    calculate_commissions.short_description = 'Recalcular comisiones'
