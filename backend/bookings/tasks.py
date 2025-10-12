"""
Tareas asíncronas para el módulo de reservas

Estas tareas son ejecutadas por Celery para procesamiento en segundo plano.
"""

from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils import timezone
from django.conf import settings
from datetime import timedelta
import logging

from .models import Booking, BookingReminder

logger = logging.getLogger('condor_expeditions')


@shared_task
def send_payment_reminders():
    """Enviar recordatorios de pago a reservas pendientes"""

    # Buscar reservas con pago pendiente que vencen en las próximas 24 horas
    tomorrow = timezone.now() + timedelta(hours=24)
    pending_bookings = Booking.objects.filter(
        status='pending',
        payment_due_date__lte=tomorrow,
        payment_due_date__gt=timezone.now()
    ).select_related('user', 'tour')

    sent_count = 0

    for booking in pending_bookings:
        try:
            # Verificar si ya se envió recordatorio hoy
            today = timezone.now().date()
            reminder_sent_today = booking.reminders.filter(
                reminder_type='payment_due',
                sent_date__date=today
            ).exists()

            if reminder_sent_today:
                continue

            # Enviar email de recordatorio
            send_mail(
                subject=f'Recordatorio de pago - Reserva {booking.booking_code}',
                message=f"""
                Hola {booking.user.first_name},

                Este es un recordatorio de que su pago de ${booking.total_price} para la reserva {booking.booking_code} vence el {booking.payment_due_date}.

                Tour: {booking.tour.title}
                Fecha de salida: {booking.schedule.departure_date}
                Número de participantes: {booking.number_of_participants}

                Por favor complete su pago para confirmar la reserva.

                Saludos,
                Equipo de Condor Expeditions
                """,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[booking.user.email],
                html_message=render_to_string('emails/payment_reminder.html', {
                    'booking': booking,
                    'user': booking.user,
                    'days_remaining': (booking.payment_due_date - timezone.now()).days
                })
            )

            # Marcar recordatorio como enviado
            booking.reminder_sent = True
            booking.save()

            sent_count += 1
            logger.info(f"Payment reminder sent for booking {booking.booking_code}")

        except Exception as e:
            logger.error(f"Error sending payment reminder for booking {booking.booking_code}: {e}")

    return f"Sent {sent_count} payment reminders"


@shared_task
def send_trip_reminders():
    """Enviar recordatorios de viaje"""

    # Buscar reservas confirmadas con salida en los próximos 7 días
    week_from_now = timezone.now() + timedelta(days=7)

    upcoming_bookings = Booking.objects.filter(
        status='confirmed',
        schedule__departure_date__lte=week_from_now.date(),
        schedule__departure_date__gte=timezone.now().date()
    ).select_related('user', 'tour', 'schedule').prefetch_related('participants')

    sent_count = 0

    for booking in upcoming_bookings:
        try:
            # Verificar si ya se envió recordatorio para este viaje
            reminder_exists = booking.reminders.filter(
                reminder_type='departure',
                sent_date__isnull=False
            ).exists()

            if reminder_exists:
                continue

            # Crear recordatorio de viaje
            reminder = BookingReminder.objects.create(
                booking=booking,
                reminder_type='departure',
                scheduled_date=timezone.now(),
                sent_date=timezone.now(),
                status='sent',
                subject=f'Información de su viaje - {booking.tour.title}',
                message=f'Información importante sobre su próximo viaje con Condor Expeditions.',
                send_email=True,
                recipient_email=booking.user.email
            )

            # Enviar email con información del viaje
            send_mail(
                subject=f'Información de su viaje - {booking.tour.title}',
                message=f"""
                Hola {booking.user.first_name},

                Su viaje con Condor Expeditions se acerca:

                Tour: {booking.tour.title}
                Código de reserva: {booking.booking_code}
                Fecha de salida: {booking.schedule.departure_date}
                Hora de salida: {booking.schedule.departure_time or 'Por confirmar'}
                Punto de encuentro: {booking.schedule.meeting_point or 'Por confirmar'}

                Número de participantes: {booking.number_of_participants}

                Le enviaremos información adicional 24 horas antes de la salida.

                ¡Estamos emocionados por su aventura!

                Saludos,
                Equipo de Condor Expeditions
                """,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[booking.user.email],
                html_message=render_to_string('emails/trip_reminder.html', {
                    'booking': booking,
                    'user': booking.user,
                    'days_until_trip': (booking.schedule.departure_date - timezone.now().date()).days
                })
            )

            sent_count += 1
            logger.info(f"Trip reminder sent for booking {booking.booking_code}")

        except Exception as e:
            logger.error(f"Error sending trip reminder for booking {booking.booking_code}: {e}")

    return f"Sent {sent_count} trip reminders"


@shared_task
def process_booking_payment(booking_id: str, payment_data: dict):
    """Procesar pago de reserva"""

    try:
        booking = Booking.objects.select_related('user', 'tour').get(id=booking_id)

        # Aquí se integraría con pasarelas de pago reales
        # Por ahora, simulamos procesamiento exitoso

        # Crear registro de pago
        from payments.models import Payment, PaymentTransaction

        payment = Payment.objects.create(
            payment_number=f"PAY-{booking.booking_code}",
            amount=booking.total_price,
            currency=booking.currency,
            user=booking.user,
            booking=booking,
            status='completed',
            payment_method=payment_data.get('method', 'credit_card'),
            gateway_response=payment_data
        )

        # Crear transacción
        PaymentTransaction.objects.create(
            payment=payment,
            transaction_type='charge',
            amount=payment.amount,
            status='completed',
            gateway_transaction_id=payment_data.get('transaction_id', 'SIMULATED')
        )

        # Actualizar estado de la reserva
        booking.status = 'paid'
        booking.payment_status = 'completed'
        booking.save()

        # Enviar confirmación de pago
        send_booking_confirmation.delay(booking_id)

        logger.info(f"Payment processed successfully for booking {booking.booking_code}")
        return True

    except Exception as e:
        logger.error(f"Error processing payment for booking {booking_id}: {e}")
        return False


@shared_task
def send_booking_confirmation(booking_id: str):
    """Enviar confirmación de reserva pagada"""

    try:
        booking = Booking.objects.select_related('user', 'tour', 'schedule').get(id=booking_id)

        send_mail(
            subject=f'¡Reserva confirmada! - {booking.tour.title}',
            message=f"""
            ¡Hola {booking.user.first_name}!

            ¡Excelente noticia! Su reserva ha sido confirmada exitosamente.

            Detalles de su reserva:
            - Código: {booking.booking_code}
            - Tour: {booking.tour.title}
            - Fecha: {booking.schedule.departure_date}
            - Participantes: {booking.number_of_participants}
            - Total pagado: ${booking.total_price}

            Le enviaremos información adicional sobre su viaje 7 días antes de la fecha de salida.

            ¡Gracias por elegir Condor Expeditions!

            Saludos,
            Equipo de Condor Expeditions
            """,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[booking.user.email],
            html_message=render_to_string('emails/booking_confirmed.html', {
                'booking': booking,
                'user': booking.user
            })
        )

        logger.info(f"Booking confirmation sent for {booking.booking_code}")
        return True

    except Exception as e:
        logger.error(f"Error sending booking confirmation for {booking_id}: {e}")
        return False


@shared_task
def check_booking_deadlines():
    """Verificar reservas con pagos vencidos y cancelarlas automáticamente"""

    # Buscar reservas pendientes con pago vencido
    expired_bookings = Booking.objects.filter(
        status='pending',
        payment_due_date__lt=timezone.now()
    ).select_related('schedule')

    cancelled_count = 0

    for booking in expired_bookings:
        try:
            # Cancelar reserva
            booking.status = 'cancelled'
            booking.cancellation_date = timezone.now()
            booking.save()

            # Restaurar cupos
            booking.schedule.available_spots += booking.number_of_participants
            booking.schedule.save()

            # Cancelar recordatorios pendientes
            booking.reminders.filter(status='scheduled').update(status='cancelled')

            # Notificar al usuario
            send_mail(
                subject=f'Reserva cancelada - {booking.booking_code}',
                message=f"""
                Hola {booking.user.first_name},

                Lamentablemente, su reserva {booking.booking_code} ha sido cancelada automáticamente
                debido a que el pago no se realizó dentro del plazo establecido.

                Si desea volver a reservar, puede hacerlo en cualquier momento desde nuestra plataforma.

                Saludos,
                Equipo de Condor Expeditions
                """,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[booking.user.email]
            )

            cancelled_count += 1
            logger.info(f"Booking {booking.booking_code} cancelled due to expired payment")

        except Exception as e:
            logger.error(f"Error cancelling expired booking {booking.booking_code}: {e}")

    return f"Cancelled {cancelled_count} expired bookings"