"""
Configuración principal del sitio administrativo

Personalización completa del admin de Django para Condor Expeditions.
"""

from django.contrib.admin import AdminSite
from django.utils.translation import gettext_lazy as _
from django.urls import reverse
from django.utils.html import format_html
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta


class CondorExpeditionsAdminSite(AdminSite):
    """Sitio administrativo personalizado para Condor Expeditions"""

    site_header = 'Condor Expeditions - Administración'
    site_title = 'Condor Expeditions Admin'
    index_title = 'Panel de Administración'
    index_template = 'admin/custom_index.html'

    def get_app_list(self, request):
        """Personalizar el orden de las apps en el admin"""

        app_list = super().get_app_list(request)

        # Orden personalizado de las apps
        app_order = {
            'Usuarios': 1,
            'Tours': 2,
            'Reservas': 3,
            'Pagos': 4,
            'Comunidades': 5,
            'Personal': 6,
            'Medios': 7,
            'Autenticación y Autorización': 8,
        }

        # Ordenar las apps según nuestra prioridad
        for app in app_list:
            app['order'] = app_order.get(app['name'], 999)

        app_list.sort(key=lambda x: x['order'])

        return app_list

    def each_context(self, request):
        """Agregar contexto adicional a todas las páginas del admin"""

        context = super().each_context(request)

        # Agregar estadísticas rápidas al contexto
        context['dashboard_stats'] = self.get_dashboard_stats()

        return context

    def get_dashboard_stats(self):
        """Obtener estadísticas rápidas para el dashboard"""

        from bookings.models import Booking
        from tours.models import Tour
        from communities.models import Community
        from payments.models import Payment

        today = timezone.now().date()
        thirty_days_ago = today - timedelta(days=30)

        try:
            stats = {
                'total_bookings': Booking.objects.count(),
                'pending_bookings': Booking.objects.filter(status='pending').count(),
                'confirmed_bookings': Booking.objects.filter(status='confirmed').count(),
                'total_tours': Tour.objects.filter(status='published').count(),
                'active_communities': Community.objects.filter(status='active').count(),
                'verified_communities': Community.objects.filter(is_verified=True).count(),
                'total_payments': Payment.objects.filter(status='completed').count(),
                'recent_revenue': float(Payment.objects.filter(
                    status='completed',
                    created_at__gte=thirty_days_ago
                ).aggregate(total=Sum('amount'))['total'] or 0),
            }

            return stats

        except Exception:
            # En caso de error, devolver estadísticas básicas
            return {
                'total_bookings': 0,
                'pending_bookings': 0,
                'confirmed_bookings': 0,
                'total_tours': 0,
                'active_communities': 0,
                'verified_communities': 0,
                'total_payments': 0,
                'recent_revenue': 0.0,
            }


# Crear instancia personalizada del sitio admin
admin_site = CondorExpeditionsAdminSite(name='condor_admin')