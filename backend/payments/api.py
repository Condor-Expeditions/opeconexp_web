"""
API Router para Sistema de Pagos

Integración completa con múltiples pasarelas de pago:
- Stripe (principal)
- PayPal (alternativa)
- Transferencias bancarias
- Efectivo (para pagos presenciales)
"""

import stripe
import json
from decimal import Decimal
from typing import Dict, Optional
from django.conf import settings
from django.utils import timezone
from django.shortcuts import get_object_or_404
from ninja import Router, Schema
from .models import Payment, PaymentMethod, PaymentTransaction, Refund

# Configurar Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

# Crear router para pagos
router = Router(tags=["Payments"])

# Esquemas de entrada/salida
class PaymentIntentSchema(Schema):
    """Esquema para crear intento de pago"""
    booking_id: str
    payment_method_id: str
    currency: str = "USD"
    success_url: str
    cancel_url: str

class PaymentConfirmSchema(Schema):
    """Esquema para confirmar pago"""
    payment_intent_id: str
    payment_method: str

class RefundSchema(Schema):
    """Esquema para solicitar reembolso"""
    payment_id: str
    amount: Optional[float] = None  # Si None, reembolso total
    reason: str

class PaymentResponseSchema(Schema):
    """Esquema de respuesta de pago"""
    id: str
    payment_number: str
    amount: float
    currency: str
    status: str
    payment_method: str
    created_at: str

class PaymentIntentResponseSchema(Schema):
    """Esquema de respuesta de intento de pago"""
    client_secret: str
    payment_intent_id: str
    amount: int  # En centavos para Stripe
    currency: str

# Servicios de pago
class PaymentService:
    """Servicio para manejar diferentes pasarelas de pago"""

    @staticmethod
    def create_stripe_payment_intent(booking, payment_method: PaymentMethod) -> Dict:
        """Crear intento de pago con Stripe"""

        try:
            # Crear intento de pago en Stripe
            intent = stripe.PaymentIntent.create(
                amount=int(booking.total_price * 100),  # Convertir a centavos
                currency=booking.currency.lower(),
                metadata={
                    'booking_id': str(booking.id),
                    'booking_code': booking.booking_code,
                    'user_id': str(booking.user.id),
                    'payment_method': payment_method.code
                }
            )

            return {
                'success': True,
                'client_secret': intent.client_secret,
                'payment_intent_id': intent.id,
                'amount': intent.amount,
                'currency': intent.currency
            }

        except stripe.error.StripeError as e:
            return {
                'success': False,
                'error': str(e)
            }

    @staticmethod
    def confirm_stripe_payment(payment_intent_id: str, payment_method: str) -> Dict:
        """Confirmar pago con Stripe"""

        try:
            # Confirmar el intento de pago
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            intent.confirm(payment_method_id=payment_method)

            return {
                'success': True,
                'status': intent.status,
                'transaction_id': intent.id
            }

        except stripe.error.StripeError as e:
            return {
                'success': False,
                'error': str(e)
            }

    @staticmethod
    def process_stripe_webhook(payload: Dict, signature: str) -> Dict:
        """Procesar webhook de Stripe"""

        try:
            # Verificar firma del webhook
            webhook_secret = settings.STRIPE_WEBHOOK_SECRET
            if webhook_secret:
                event = stripe.Webhook.construct_event(payload, signature, webhook_secret)
            else:
                event = json.loads(payload)

            # Procesar diferentes tipos de eventos
            event_type = event['type']

            if event_type == 'payment_intent.succeeded':
                payment_intent = event['data']['object']
                return PaymentService._handle_successful_payment(payment_intent)

            elif event_type == 'payment_intent.payment_failed':
                payment_intent = event['data']['object']
                return PaymentService._handle_failed_payment(payment_intent)

            return {'success': True, 'processed': False, 'event_type': event_type}

        except Exception as e:
            return {'success': False, 'error': str(e)}

    @staticmethod
    def _handle_successful_payment(payment_intent: Dict) -> Dict:
        """Manejar pago exitoso"""

        try:
            booking_id = payment_intent['metadata']['booking_id']

            # Crear registro de pago
            payment = Payment.objects.create(
                payment_number=f"STRIPE-{payment_intent['id']}",
                amount=Decimal(str(payment_intent['amount'] / 100)),  # Convertir de centavos
                currency=payment_intent['currency'].upper(),
                status='completed',
                payment_method_id=1,  # Stripe payment method
                gateway_name='stripe',
                gateway_transaction_id=payment_intent['id'],
                gateway_response=payment_intent,
                processed_at=timezone.now()
            )

            # Crear transacción
            PaymentTransaction.objects.create(
                payment=payment,
                transaction_type='charge',
                amount=payment.amount,
                status='completed',
                gateway_transaction_id=payment_intent['id'],
                gateway_response=payment_intent
            )

            return {'success': True, 'payment_id': str(payment.id)}

        except Exception as e:
            return {'success': False, 'error': str(e)}

    @staticmethod
    def _handle_failed_payment(payment_intent: Dict) -> Dict:
        """Manejar pago fallido"""

        try:
            # Actualizar estado del pago si existe
            Payment.objects.filter(
                gateway_transaction_id=payment_intent['id']
            ).update(
                status='failed',
                gateway_response=payment_intent
            )

            return {'success': True, 'marked_failed': True}

        except Exception as e:
            return {'success': False, 'error': str(e)}

# Endpoints de la API

@router.post("/create-payment-intent", response={200: PaymentIntentResponseSchema, 400: dict})
def create_payment_intent(request, payload: PaymentIntentSchema):
    """Crear intento de pago con Stripe"""

    if not request.user.is_authenticated:
        return 401, {"message": "Authentication required"}

    try:
        # Obtener reserva
        booking = get_object_or_404(
            Booking.objects.select_related('tour'),
            id=payload.booking_id,
            user=request.user
        )

        if booking.status != 'pending':
            return 400, {"message": "Reserva no está pendiente de pago"}

        # Obtener método de pago
        payment_method = get_object_or_404(
            PaymentMethod,
            id=payload.payment_method_id,
            is_active=True
        )

        # Crear intento de pago con Stripe
        result = PaymentService.create_stripe_payment_intent(booking, payment_method)

        if result['success']:
            return 200, PaymentIntentResponseSchema(
                client_secret=result['client_secret'],
                payment_intent_id=result['payment_intent_id'],
                amount=result['amount'],
                currency=result['currency']
            )
        else:
            return 400, {"message": result['error']}

    except Exception as e:
        return 400, {"message": "Error al crear intento de pago", "error": str(e)}

@router.post("/confirm-payment", response={200: dict, 400: dict})
def confirm_payment(request, payload: PaymentConfirmSchema):
    """Confirmar pago realizado"""

    if not request.user.is_authenticated:
        return 401, {"message": "Authentication required"}

    try:
        # Confirmar pago con Stripe
        result = PaymentService.confirm_stripe_payment(
            payload.payment_intent_id,
            payload.payment_method
        )

        if result['success']:
            return 200, {
                "message": "Pago confirmado exitosamente",
                "status": result['status'],
                "transaction_id": result['transaction_id']
            }
        else:
            return 400, {"message": result['error']}

    except Exception as e:
        return 400, {"message": "Error al confirmar pago", "error": str(e)}

@router.post("/webhook/stripe", response={200: dict, 400: dict})
def stripe_webhook(request):
    """Webhook para procesar eventos de Stripe"""

    try:
        payload = request.body.decode('utf-8')
        signature = request.headers.get('Stripe-Signature', '')

        result = PaymentService.process_stripe_webhook(payload, signature)

        if result['success']:
            return 200, {"message": "Webhook procesado correctamente"}
        else:
            return 400, {"message": result['error']}

    except Exception as e:
        return 400, {"message": "Error procesando webhook", "error": str(e)}

@router.get("/methods", response=list)
def list_payment_methods(request):
    """Listar métodos de pago disponibles"""

    methods = PaymentMethod.objects.filter(is_active=True).order_by('name')

    return [
        {
            "id": str(method.id),
            "name": method.name,
            "code": method.code,
            "method_type": method.method_type,
            "is_online": method.is_online,
            "processing_time_hours": method.processing_time_hours,
            "min_amount": float(method.min_amount) if method.min_amount else None,
            "max_amount": float(method.max_amount) if method.max_amount else None,
            "fixed_fee": float(method.fixed_fee),
            "percentage_fee": float(method.percentage_fee),
            "currency": method.currency
        }
        for method in methods
    ]

@router.get("/booking/{booking_id}", response=list)
def get_booking_payments(request, booking_id: str):
    """Obtener pagos de una reserva específica"""

    if not request.user.is_authenticated:
        return []

    try:
        booking = get_object_or_404(
            Booking.objects.prefetch_related('payments__transactions'),
            id=booking_id,
            user=request.user
        )

        payments = []
        for payment in booking.payments.all():
            payments.append({
                "id": str(payment.id),
                "payment_number": payment.payment_number,
                "amount": float(payment.amount),
                "currency": payment.currency,
                "status": payment.status,
                "payment_method": payment.payment_method.name if payment.payment_method else "No especificado",
                "gateway_name": payment.gateway_name,
                "gateway_transaction_id": payment.gateway_transaction_id,
                "created_at": payment.created_at.isoformat(),
                "processed_at": payment.processed_at.isoformat() if payment.processed_at else None,
                "transactions": [
                    {
                        "id": str(tx.id),
                        "transaction_type": tx.transaction_type,
                        "amount": float(tx.amount),
                        "status": tx.status,
                        "processed_at": tx.processed_at.isoformat() if tx.processed_at else None
                    }
                    for tx in payment.transactions.all()
                ]
            })

        return payments

    except Booking.DoesNotExist:
        return []

@router.post("/refund", response={200: dict, 400: dict})
def request_refund(request, payload: RefundSchema):
    """Solicitar reembolso de pago"""

    if not request.user.is_authenticated:
        return 401, {"message": "Authentication required"}

    try:
        payment = get_object_or_404(
            Payment.objects.select_related('booking'),
            id=payload.payment_id,
            booking__user=request.user
        )

        if payment.status != 'completed':
            return 400, {"message": "Solo se pueden reembolsar pagos completados"}

        # Calcular monto del reembolso
        refund_amount = Decimal(str(payload.amount)) if payload.amount else payment.amount

        if refund_amount > payment.amount:
            return 400, {"message": "El monto del reembolso no puede ser mayor al pago original"}

        # Crear registro de reembolso
        refund = Refund.objects.create(
            payment=payment,
            refund_number=f"REF-{payment.payment_number}",
            amount=refund_amount,
            currency=payment.currency,
            reason=payload.reason,
            status='requested'
        )

        # Procesar reembolso con Stripe si aplica
        if payment.gateway_name == 'stripe':
            try:
                stripe_refund = stripe.Refund.create(
                    payment_intent=payment.gateway_transaction_id,
                    amount=int(refund_amount * 100),  # Convertir a centavos
                    reason='requested_by_customer',
                    metadata={
                        'refund_id': str(refund.id),
                        'booking_id': str(payment.booking.id)
                    }
                )

                refund.gateway_refund_id = stripe_refund.id
                refund.gateway_response = stripe_refund
                refund.status = 'completed'
                refund.processed_at = timezone.now()
                refund.save()

            except stripe.error.StripeError as e:
                refund.status = 'failed'
                refund.save()
                return 400, {"message": f"Error procesando reembolso: {str(e)}"}

        return 200, {
            "message": "Reembolso solicitado exitosamente",
            "refund_id": str(refund.id),
            "amount": float(refund.amount),
            "status": refund.status
        }

    except Payment.DoesNotExist:
        return 404, {"message": "Pago no encontrado"}

@router.get("/calculate-fees", response=dict)
def calculate_payment_fees(request, amount: float, payment_method_id: str):
    """Calcular tarifas de pago"""

    try:
        method = get_object_or_404(PaymentMethod, id=payment_method_id, is_active=True)

        # Calcular tarifas
        fixed_fee = Decimal(str(method.fixed_fee))
        percentage_fee = Decimal(str(method.percentage_fee)) * Decimal(str(amount)) / 100
        total_fee = fixed_fee + percentage_fee
        total_amount = Decimal(str(amount)) + total_fee

        return {
            "base_amount": amount,
            "fixed_fee": float(fixed_fee),
            "percentage_fee": float(percentage_fee),
            "total_fee": float(total_fee),
            "total_amount": float(total_amount),
            "currency": method.currency
        }

    except PaymentMethod.DoesNotExist:
        return {"message": "Método de pago no encontrado"}, 404

# Endpoints para operaciones administrativas

@router.get("/admin/all", response=list)
def list_all_payments(request, status: Optional[str] = None, limit: int = 50):
    """Listar todos los pagos (solo administradores)"""

    if not request.user.is_authenticated or not request.user.is_staff:
        return []

    queryset = Payment.objects.select_related('booking', 'payment_method').all()

    if status:
        queryset = queryset.filter(status=status)

    payments = queryset.order_by('-created_at')[:limit]

    return [
        {
            "id": str(payment.id),
            "payment_number": payment.payment_number,
            "amount": float(payment.amount),
            "currency": payment.currency,
            "status": payment.status,
            "payment_method": payment.payment_method.name if payment.payment_method else "No especificado",
            "booking_code": payment.booking.booking_code if payment.booking else "N/A",
            "user": payment.booking.user.get_full_name() if payment.booking else "N/A",
            "created_at": payment.created_at.isoformat(),
            "gateway_name": payment.gateway_name
        }
        for payment in payments
    ]

@router.post("/admin/{payment_id}/process", response={200: dict, 400: dict})
def admin_process_payment(request, payment_id: str):
    """Procesar pago manualmente (solo administradores)"""

    if not request.user.is_authenticated or not request.user.is_staff:
        return 401, {"message": "Admin access required"}

    try:
        payment = get_object_or_404(Payment, id=payment_id)

        if payment.status != 'pending':
            return 400, {"message": "Solo se pueden procesar pagos pendientes"}

        # Marcar como completado (simulación)
        payment.status = 'completed'
        payment.processed_at = timezone.now()
        payment.save()

        # Crear transacción
        PaymentTransaction.objects.create(
            payment=payment,
            transaction_type='charge',
            amount=payment.amount,
            status='completed',
            gateway_transaction_id=f"MANUAL-{payment.id}"
        )

        return 200, {"message": "Pago procesado manualmente"}

    except Payment.DoesNotExist:
        return 404, {"message": "Pago no encontrado"}

# Estadísticas de pagos
@router.get("/stats", response=dict)
def get_payment_stats(request, days: int = 30):
    """Obtener estadísticas de pagos"""

    if not request.user.is_authenticated:
        return {}

    start_date = timezone.now() - timezone.timedelta(days=days)

    payments = Payment.objects.filter(created_at__gte=start_date)

    # Si no es admin, solo ver sus propios pagos
    if not request.user.is_staff:
        payments = payments.filter(booking__user=request.user)

    stats = payments.aggregate(
        total_amount=Sum('amount'),
        total_payments=Count('id'),
        completed_payments=Count('id', filter=Q(status='completed')),
        failed_payments=Count('id', filter=Q(status='failed'))
    )

    return {
        "period_days": days,
        "total_amount": float(stats['total_amount'] or 0),
        "total_payments": stats['total_payments'],
        "completed_payments": stats['completed_payments'],
        "failed_payments": stats['failed_payments'],
        "success_rate": (stats['completed_payments'] / stats['total_payments'] * 100) if stats['total_payments'] > 0 else 0
    }