"""
Comando personalizado para configurar datos iniciales

Este comando crea:
- Categorías de tours básicas
- Métodos de pago iniciales
- Roles de personal básicos
- Configuración inicial del sistema
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction

from tours.models import TourCategory
from payments.models import PaymentMethod
from staff.models import StaffRole


class Command(BaseCommand):
    help = 'Configurar datos iniciales para Condor Expeditions'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Eliminar datos existentes antes de crear nuevos',
        )

    def handle(self, *args, **options):
        if options['reset']:
            self.stdout.write('Eliminando datos existentes...')
            self.reset_existing_data()

        self.stdout.write('Creando datos iniciales...')
        self.create_initial_data()

        self.stdout.write(
            self.style.SUCCESS('Datos iniciales configurados exitosamente!')
        )

    def reset_existing_data(self):
        """Eliminar datos existentes"""
        TourCategory.objects.all().delete()
        PaymentMethod.objects.all().delete()
        StaffRole.objects.all().delete()

    @transaction.atomic
    def create_initial_data(self):
        """Crear datos iniciales"""

        # Crear categorías de tours
        self.create_tour_categories()

        # Crear métodos de pago
        self.create_payment_methods()

        # Crear roles de personal
        self.create_staff_roles()

        self.stdout.write('Datos iniciales creados:')

    def create_tour_categories(self):
        """Crear categorías básicas de tours"""

        categories_data = [
            {
                'name': 'Aventura Extrema',
                'slug': 'aventura-extrema',
                'description': 'Tours de alta adrenalina y deportes extremos',
                'icon': 'mountain',
                'color': '#ff6b35',
                'sort_order': 1,
                'featured': True,
            },
            {
                'name': 'Naturaleza y Ecoturismo',
                'slug': 'naturaleza-ecoturismo',
                'description': 'Experiencias inmersivas en la naturaleza',
                'icon': 'leaf',
                'color': '#2dd881',
                'sort_order': 2,
                'featured': True,
            },
            {
                'name': 'Cultural y Comunitario',
                'slug': 'cultural-comunitario',
                'description': 'Interacción con comunidades locales y tradiciones',
                'icon': 'users',
                'color': '#4ecdc4',
                'sort_order': 3,
                'featured': True,
            },
            {
                'name': 'Fotografía y Drone',
                'slug': 'fotografia-drone',
                'description': 'Tours especializados en fotografía y tomas aéreas',
                'icon': 'camera',
                'color': '#45b7d1',
                'sort_order': 4,
                'featured': False,
            },
            {
                'name': 'Packs Especiales',
                'slug': 'packs-especiales',
                'description': 'Paquetes completos con múltiples actividades',
                'icon': 'package',
                'color': '#96ceb4',
                'sort_order': 5,
                'featured': True,
            },
        ]

        for category_data in categories_data:
            category, created = TourCategory.objects.get_or_create(
                slug=category_data['slug'],
                defaults=category_data
            )
            if created:
                self.stdout.write(f"  ✓ Categoría creada: {category.name}")

    def create_payment_methods(self):
        """Crear métodos de pago iniciales"""

        payment_methods_data = [
            {
                'name': 'Tarjeta de Crédito/Débito',
                'code': 'credit_card',
                'description': 'Pago con tarjeta de crédito o débito',
                'method_type': 'credit_card',
                'is_online': True,
                'processing_time_hours': 0,
                'fixed_fee': 0.30,
                'percentage_fee': 3.5,
                'currency': 'USD',
            },
            {
                'name': 'PayPal',
                'code': 'paypal',
                'description': 'Pago a través de PayPal',
                'method_type': 'paypal',
                'is_online': True,
                'processing_time_hours': 0,
                'fixed_fee': 0.30,
                'percentage_fee': 4.5,
                'currency': 'USD',
            },
            {
                'name': 'Transferencia Bancaria',
                'code': 'bank_transfer',
                'description': 'Transferencia bancaria tradicional',
                'method_type': 'bank_transfer',
                'is_online': False,
                'processing_time_hours': 24,
                'fixed_fee': 0.00,
                'percentage_fee': 0.0,
                'currency': 'USD',
            },
            {
                'name': 'Efectivo',
                'code': 'cash',
                'description': 'Pago en efectivo en oficina',
                'method_type': 'cash',
                'is_online': False,
                'processing_time_hours': 0,
                'fixed_fee': 0.00,
                'percentage_fee': 0.0,
                'currency': 'USD',
            },
        ]

        for method_data in payment_methods_data:
            method, created = PaymentMethod.objects.get_or_create(
                code=method_data['code'],
                defaults=method_data
            )
            if created:
                self.stdout.write(f"  ✓ Método de pago creado: {method.name}")

    def create_staff_roles(self):
        """Crear roles básicos de personal"""

        roles_data = [
            {
                'name': 'Administrador General',
                'description': 'Control total del sistema',
                'level': 10,
                'can_manage_users': True,
                'can_manage_bookings': True,
                'can_manage_tours': True,
                'can_manage_staff': True,
                'can_manage_communities': True,
                'can_manage_content': True,
                'can_view_reports': True,
                'can_manage_finances': True,
                'can_approve_bookings': True,
                'can_cancel_bookings': True,
                'max_discount_percent': 50.00,
            },
            {
                'name': 'Gerente de Operaciones',
                'description': 'Gestión operativa diaria',
                'level': 8,
                'can_manage_users': False,
                'can_manage_bookings': True,
                'can_manage_tours': True,
                'can_manage_staff': False,
                'can_manage_communities': True,
                'can_manage_content': True,
                'can_view_reports': True,
                'can_manage_finances': False,
                'can_approve_bookings': True,
                'can_cancel_bookings': True,
                'max_discount_percent': 25.00,
            },
            {
                'name': 'Coordinador de Tours',
                'description': 'Gestión específica de tours y guías',
                'level': 6,
                'can_manage_users': False,
                'can_manage_bookings': True,
                'can_manage_tours': True,
                'can_manage_staff': False,
                'can_manage_communities': False,
                'can_manage_content': False,
                'can_view_reports': False,
                'can_manage_finances': False,
                'can_approve_bookings': True,
                'can_cancel_bookings': False,
                'max_discount_percent': 15.00,
            },
            {
                'name': 'Guía Turístico',
                'description': 'Personal operativo en tours',
                'level': 3,
                'can_manage_users': False,
                'can_manage_bookings': False,
                'can_manage_tours': False,
                'can_manage_staff': False,
                'can_manage_communities': False,
                'can_manage_content': False,
                'can_view_reports': False,
                'can_manage_finances': False,
                'can_approve_bookings': False,
                'can_cancel_bookings': False,
                'max_discount_percent': 5.00,
            },
            {
                'name': 'Asistente Administrativo',
                'description': 'Soporte administrativo básico',
                'level': 2,
                'can_manage_users': False,
                'can_manage_bookings': False,
                'can_manage_tours': False,
                'can_manage_staff': False,
                'can_manage_communities': False,
                'can_manage_content': False,
                'can_view_reports': False,
                'can_manage_finances': False,
                'can_approve_bookings': False,
                'can_cancel_bookings': False,
                'max_discount_percent': 0.00,
            },
        ]

        for role_data in roles_data:
            role, created = StaffRole.objects.get_or_create(
                name=role_data['name'],
                defaults=role_data
            )
            if created:
                self.stdout.write(f"  ✓ Rol creado: {role.name}")