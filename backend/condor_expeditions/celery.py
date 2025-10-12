"""
Configuración de Celery para Condor Expeditions

Celery es usado para tareas asíncronas como:
- Envío de emails
- Procesamiento de pagos
- Recordatorios automáticos
- Generación de reportes
- Procesamiento de medios
"""

import os
from celery import Celery
from django.conf import settings

# Configurar Django settings para Celery
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'condor_expeditions.settings')

app = Celery('condor_expeditions')

# Usar configuración de Django para Celery
app.config_from_object('django.conf:settings', namespace='CELERY')

# Descubrir tareas automáticamente
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    """Tarea de debug para verificar que Celery funciona"""
    print(f'Request: {self.request!r}')

# Configuración de tareas periódicas (Beat)
from celery.schedules import crontab

app.conf.beat_schedule = {
    # Recordatorios de pago (cada hora)
    'send-payment-reminders': {
        'task': 'bookings.tasks.send_payment_reminders',
        'schedule': crontab(minute=0),  # Cada hora
    },

    # Recordatorios de viaje (diario a las 9 AM)
    'send-trip-reminders': {
        'task': 'bookings.tasks.send_trip_reminders',
        'schedule': crontab(hour=9, minute=0),  # 9:00 AM diario
    },

    # Procesamiento de medios (cada 10 minutos)
    'process-media-files': {
        'task': 'media_manager.tasks.process_media_files',
        'schedule': crontab(minute='*/10'),  # Cada 10 minutos
    },

    # Publicaciones en redes sociales (diario a las 10 AM)
    'publish-social-media': {
        'task': 'media_manager.tasks.publish_scheduled_posts',
        'schedule': crontab(hour=10, minute=0),  # 10:00 AM diario
    },

    # Generación de reportes (semanal los lunes a las 2 AM)
    'generate-weekly-reports': {
        'task': 'staff.tasks.generate_weekly_reports',
        'schedule': crontab(day_of_week=1, hour=2, minute=0),  # Lunes 2:00 AM
    },

    # Limpieza de archivos temporales (diario a las 3 AM)
    'cleanup-temp-files': {
        'task': 'core.tasks.cleanup_temp_files',
        'schedule': crontab(hour=3, minute=0),  # 3:00 AM diario
    },
}

app.conf.timezone = settings.TIME_ZONE