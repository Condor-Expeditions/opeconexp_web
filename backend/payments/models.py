from django.db import models
from django.utils.translation import gettext_lazy as _
import uuid
from users.models import User


class PaymentMethod(models.Model):
    """Métodos de pago disponibles"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Información básica
    name = models.CharField(_("Nombre"), max_length=100)
    code = models.CharField(_("Código"), max_length=20, unique=True)
    description = models.TextField(_("Descripción"), blank=True)

    # Tipo de método
    method_type = models.CharField(_("Tipo de método"), max_length=20, choices=[
        ('credit_card', 'Tarjeta de crédito'),
        ('debit_card', 'Tarjeta de débito'),
        ('bank_transfer', 'Transferencia bancaria'),
        ('paypal', 'PayPal'),
        ('cash', 'Efectivo'),
        ('other', 'Otro')
    ])

    # Configuración
    is_active = models.BooleanField(_("Activo"), default=True)
    is_online = models.BooleanField(_("En línea"), default=True)
    requires_approval = models.BooleanField(_("Requiere aprobación"), default=False)

    # Configuración de procesamiento
    processing_time_hours = models.IntegerField(_("Tiempo de procesamiento (horas)"), default=0)
    min_amount = models.DecimalField(_("Monto mínimo"), max_digits=10, decimal_places=2, null=True, blank=True)
    max_amount = models.DecimalField(_("Monto máximo"), max_digits=10, decimal_places=2, null=True, blank=True)

    # Tarifas y comisiones
    fixed_fee = models.DecimalField(_("Tarifa fija"), max_digits=10, decimal_places=2, default=0)
    percentage_fee = models.DecimalField(_("Porcentaje de tarifa"), max_digits=5, decimal_places=2, default=0)
    currency = models.CharField(_("Moneda"), max_length=3, default='USD')

    # Configuración específica
    gateway_config = models.JSONField(_("Configuración de gateway"), default=dict, blank=True)

    # Información adicional
    instructions = models.TextField(_("Instrucciones"), blank=True)
    supported_currencies = models.JSONField(_("Monedas soportadas"), default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Método de pago")
        verbose_name_plural = _("Métodos de pago")
        ordering = ['name']

    def __str__(self):
        return self.name


class Payment(models.Model):
    """Pagos principales del sistema"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Información básica
    payment_number = models.CharField(_("Número de pago"), max_length=50, unique=True)
    amount = models.DecimalField(_("Monto"), max_digits=10, decimal_places=2)
    currency = models.CharField(_("Moneda"), max_length=3, default='USD')

    # Asociación con reservas
    booking = models.ForeignKey('bookings.Booking', on_delete=models.CASCADE, related_name='related_payments', null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')

    # Método de pago
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.CASCADE, related_name='payments')

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

    # Información de procesamiento
    gateway_name = models.CharField(_("Gateway de pago"), max_length=50, blank=True)
    gateway_transaction_id = models.CharField(_("ID de transacción gateway"), max_length=100, blank=True)
    gateway_response = models.JSONField(_("Respuesta del gateway"), default=dict, blank=True)

    # Fechas importantes
    created_at = models.DateTimeField(_("Fecha de creación"), auto_now_add=True)
    processed_at = models.DateTimeField(_("Fecha de procesamiento"), null=True, blank=True)
    due_date = models.DateTimeField(_("Fecha de vencimiento"), null=True, blank=True)

    # Información adicional
    description = models.TextField(_("Descripción"), blank=True)
    notes = models.TextField(_("Notas internas"), blank=True)
    failure_reason = models.TextField(_("Razón de fallo"), blank=True)

    # Información de seguridad
    ip_address = models.GenericIPAddressField(_("Dirección IP"), null=True, blank=True)
    user_agent = models.TextField(_("Agente de usuario"), blank=True)

    class Meta:
        verbose_name = _("Pago")
        verbose_name_plural = _("Pagos")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['payment_number']),
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['user', 'status']),
        ]

    def __str__(self):
        return f"Pago {self.payment_number} - {self.amount} {self.currency}"


class PaymentTransaction(models.Model):
    """Transacciones individuales de pago"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='transactions')

    # Información de la transacción
    transaction_type = models.CharField(_("Tipo de transacción"), max_length=20, choices=[
        ('charge', 'Cargo'),
        ('refund', 'Reembolso'),
        ('void', 'Anulación'),
        ('capture', 'Captura'),
        ('authorization', 'Autorización')
    ])

    amount = models.DecimalField(_("Monto"), max_digits=10, decimal_places=2)
    currency = models.CharField(_("Moneda"), max_length=3, default='USD')

    # Estado
    status = models.CharField(_("Estado"), max_length=20, choices=[
        ('pending', 'Pendiente'),
        ('processing', 'Procesando'),
        ('completed', 'Completado'),
        ('failed', 'Fallido'),
        ('cancelled', 'Cancelado')
    ], default='pending')

    # Información del gateway
    gateway_transaction_id = models.CharField(_("ID de transacción gateway"), max_length=100, blank=True)
    gateway_response = models.JSONField(_("Respuesta del gateway"), default=dict, blank=True)

    # Fechas
    processed_at = models.DateTimeField(_("Fecha de procesamiento"), null=True, blank=True)
    created_at = models.DateTimeField(_("Fecha de creación"), auto_now_add=True)

    # Información adicional
    description = models.TextField(_("Descripción"), blank=True)
    metadata = models.JSONField(_("Metadatos"), default=dict, blank=True)

    class Meta:
        verbose_name = _("Transacción de pago")
        verbose_name_plural = _("Transacciones de pago")
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.transaction_type} - {self.amount} - {self.payment.payment_number}"


class Refund(models.Model):
    """Reembolsos de pagos"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='refunds')

    # Información del reembolso
    refund_number = models.CharField(_("Número de reembolso"), max_length=50, unique=True)
    amount = models.DecimalField(_("Monto"), max_digits=10, decimal_places=2)
    currency = models.CharField(_("Moneda"), max_length=3, default='USD')

    # Razón del reembolso
    reason = models.TextField(_("Razón del reembolso"))
    reason_code = models.CharField(_("Código de razón"), max_length=50, blank=True)

    # Estado
    status = models.CharField(_("Estado"), max_length=20, choices=[
        ('requested', 'Solicitado'),
        ('processing', 'Procesando'),
        ('completed', 'Completado'),
        ('failed', 'Fallido'),
        ('cancelled', 'Cancelado')
    ], default='requested')

    # Información de procesamiento
    processed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='processed_refunds')
    processed_at = models.DateTimeField(_("Fecha de procesamiento"), null=True, blank=True)

    # Información del gateway
    gateway_refund_id = models.CharField(_("ID de reembolso gateway"), max_length=100, blank=True)
    gateway_response = models.JSONField(_("Respuesta del gateway"), default=dict, blank=True)

    # Información adicional
    notes = models.TextField(_("Notas"), blank=True)
    customer_notified = models.BooleanField(_("Cliente notificado"), default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Reembolso")
        verbose_name_plural = _("Reembolsos")
        ordering = ['-created_at']

    def __str__(self):
        return f"Reembolso {self.refund_number} - {self.amount}"


class PaymentWebhook(models.Model):
    """Webhooks recibidos de pasarelas de pago"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Información del webhook
    webhook_id = models.CharField(_("ID del webhook"), max_length=100, unique=True)
    event_type = models.CharField(_("Tipo de evento"), max_length=50)
    source = models.CharField(_("Fuente"), max_length=50)

    # Datos del webhook
    payload = models.JSONField(_("Payload"))
    signature = models.CharField(_("Firma"), max_length=200, blank=True)

    # Estado de procesamiento
    status = models.CharField(_("Estado"), max_length=20, choices=[
        ('received', 'Recibido'),
        ('processing', 'Procesando'),
        ('processed', 'Procesado'),
        ('failed', 'Fallido'),
        ('ignored', 'Ignorado')
    ], default='received')

    # Información de procesamiento
    processed_at = models.DateTimeField(_("Fecha de procesamiento"), null=True, blank=True)
    error_message = models.TextField(_("Mensaje de error"), blank=True)
    retry_count = models.IntegerField(_("Número de reintentos"), default=0)

    # Asociación con pagos
    related_payment = models.ForeignKey(Payment, on_delete=models.SET_NULL, null=True, blank=True, related_name='webhooks')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("Webhook de pago")
        verbose_name_plural = _("Webhooks de pago")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['event_type', 'status']),
            models.Index(fields=['source', 'created_at']),
        ]

    def __str__(self):
        return f"Webhook {self.webhook_id} - {self.event_type}"


class PaymentPlan(models.Model):
    """Planes de pago para reservas grandes"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey('bookings.Booking', on_delete=models.CASCADE, related_name='payment_plans')

    # Información del plan
    plan_name = models.CharField(_("Nombre del plan"), max_length=200)
    total_amount = models.DecimalField(_("Monto total"), max_digits=10, decimal_places=2)
    currency = models.CharField(_("Moneda"), max_length=3, default='USD')

    # Configuración del plan
    number_of_payments = models.IntegerField(_("Número de pagos"))
    frequency = models.CharField(_("Frecuencia"), max_length=20, choices=[
        ('weekly', 'Semanal'),
        ('biweekly', 'Quincenal'),
        ('monthly', 'Mensual'),
        ('quarterly', 'Trimestral')
    ])

    # Fechas
    start_date = models.DateField(_("Fecha de inicio"))
    next_payment_date = models.DateField(_("Próxima fecha de pago"), null=True, blank=True)

    # Estado
    status = models.CharField(_("Estado"), max_length=20, choices=[
        ('active', 'Activo'),
        ('completed', 'Completado'),
        ('cancelled', 'Cancelado'),
        ('defaulted', 'En mora')
    ], default='active')

    # Información adicional
    down_payment = models.DecimalField(_("Pago inicial"), max_digits=10, decimal_places=2, default=0)
    notes = models.TextField(_("Notas"), blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Plan de pago")
        verbose_name_plural = _("Planes de pago")

    def __str__(self):
        return f"Plan {self.plan_name} - {self.booking.booking_code}"


class PaymentInstallment(models.Model):
    """Cuotas individuales de planes de pago"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payment_plan = models.ForeignKey(PaymentPlan, on_delete=models.CASCADE, related_name='installments')

    # Información de la cuota
    installment_number = models.IntegerField(_("Número de cuota"))
    amount = models.DecimalField(_("Monto"), max_digits=10, decimal_places=2)
    due_date = models.DateField(_("Fecha de vencimiento"))

    # Estado
    status = models.CharField(_("Estado"), max_length=20, choices=[
        ('pending', 'Pendiente'),
        ('paid', 'Pagada'),
        ('overdue', 'Vencida'),
        ('cancelled', 'Cancelada')
    ], default='pending')

    # Información de pago
    payment = models.ForeignKey(Payment, on_delete=models.SET_NULL, null=True, blank=True, related_name='installment_payments')
    paid_date = models.DateField(_("Fecha de pago"), null=True, blank=True)

    # Información adicional
    late_fee = models.DecimalField(_("Mora"), max_digits=10, decimal_places=2, default=0)
    notes = models.TextField(_("Notas"), blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Cuota de pago")
        verbose_name_plural = _("Cuotas de pago")
        ordering = ['installment_number']

    def __str__(self):
        return f"Cuota {self.installment_number} - {self.payment_plan.plan_name}"


class PaymentCommission(models.Model):
    """Comisiones generadas por pagos"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Asociación
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='commissions')
    booking = models.ForeignKey('bookings.Booking', on_delete=models.CASCADE, related_name='commissions', null=True, blank=True)

    # Información de la comisión
    commission_type = models.CharField(_("Tipo de comisión"), max_length=50, choices=[
        ('community', 'Comunidad'),
        ('guide', 'Guía'),
        ('agency', 'Agencia'),
        ('platform', 'Plataforma')
    ])

    # Cálculo de comisión
    base_amount = models.DecimalField(_("Monto base"), max_digits=10, decimal_places=2)
    commission_rate = models.DecimalField(_("Tasa de comisión"), max_digits=5, decimal_places=2)
    commission_amount = models.DecimalField(_("Monto de comisión"), max_digits=10, decimal_places=2)

    # Estado
    status = models.CharField(_("Estado"), max_length=20, choices=[
        ('calculated', 'Calculada'),
        ('pending', 'Pendiente de pago'),
        ('paid', 'Pagada'),
        ('cancelled', 'Cancelada')
    ], default='calculated')

    # Información de pago
    paid_date = models.DateField(_("Fecha de pago"), null=True, blank=True)
    payment_reference = models.CharField(_("Referencia de pago"), max_length=100, blank=True)

    # Información adicional
    notes = models.TextField(_("Notas"), blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Comisión de pago")
        verbose_name_plural = _("Comisiones de pago")

    def __str__(self):
        return f"Comisión {self.commission_type} - {self.commission_amount}"
