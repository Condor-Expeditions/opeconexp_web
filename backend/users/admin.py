"""
Configuración del admin para el módulo de usuarios

Personalización completa del panel administrativo para gestión de usuarios,
perfiles y actividades.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from django.urls import reverse
from django.utils import timezone
from .models import User, UserProfile, UserPreference, UserActivity


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """Admin personalizado para usuarios"""

    list_display = [
        'email', 'first_name', 'last_name', 'phone', 'is_active',
        'date_joined', 'last_login', 'loyalty_points', 'total_trips'
    ]

    list_filter = [
        'is_active', 'is_staff', 'date_joined', 'nationality',
        'experience_level', 'profile_visibility'
    ]

    search_fields = ['email', 'first_name', 'last_name', 'phone']

    readonly_fields = ['date_joined', 'last_login', 'created_at', 'updated_at']

    fieldsets = UserAdmin.fieldsets + (
        ('Información Turística', {
            'fields': (
                'phone', 'date_of_birth', 'nationality',
                'emergency_contact_name', 'emergency_contact_phone',
                'medical_conditions', 'dietary_restrictions'
            )
        }),
        ('Perfil Turístico', {
            'fields': (
                'preferred_activities', 'experience_level',
                'languages_spoken', 'profile_visibility'
            )
        }),
        ('Fidelización', {
            'fields': ('loyalty_points', 'total_trips', 'member_since')
        }),
        ('Configuración', {
            'fields': (
                'email_notifications', 'sms_notifications', 'marketing_emails'
            )
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Información Adicional', {
            'fields': ('phone', 'nationality', 'experience_level')
        }),
    )

    # Note: preferred_activities and languages_spoken are JSONFields, not ManyToMany
    # filter_horizontal cannot be used with JSONFields

    actions = ['activate_users', 'deactivate_users', 'send_welcome_email']

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('profile', 'preferences')

    def loyalty_points(self, obj):
        return obj.loyalty_points
    loyalty_points.short_description = 'Puntos'

    def total_trips(self, obj):
        return obj.total_trips
    total_trips.short_description = 'Viajes Totales'

    def activate_users(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(
            request,
            f'Se activaron {queryset.count()} usuarios.'
        )
    activate_users.short_description = 'Activar usuarios seleccionados'

    def deactivate_users(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(
            request,
            f'Se desactivaron {queryset.count()} usuarios.'
        )
    deactivate_users.short_description = 'Desactivar usuarios seleccionados'


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Admin para perfiles de usuario"""

    list_display = [
        'user', 'bio', 'city', 'country', 'avatar_thumbnail',
        'created_at'
    ]

    list_filter = ['country', 'created_at']
    search_fields = ['user__email', 'user__first_name', 'bio', 'city']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Usuario', {
            'fields': ('user',)
        }),
        ('Información Personal', {
            'fields': ('bio', 'avatar', 'cover_photo')
        }),
        ('Ubicación', {
            'fields': ('address', 'city', 'country', 'postal_code')
        }),
        ('Profesional', {
            'fields': ('occupation', 'company', 'website')
        }),
        ('Redes Sociales', {
            'fields': ('facebook', 'instagram', 'twitter', 'linkedin')
        }),
        ('Emergencia Médica', {
            'fields': ('blood_type', 'allergies', 'medications')
        }),
        ('Auditoría', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def avatar_thumbnail(self, obj):
        if obj.avatar:
            return format_html(
                '<img src="{}" width="50" height="50" style="border-radius: 50%;" />',
                obj.avatar.url
            )
        return "Sin avatar"
    avatar_thumbnail.short_description = 'Avatar'


@admin.register(UserPreference)
class UserPreferenceAdmin(admin.ModelAdmin):
    """Admin para preferencias de usuario"""

    list_display = [
        'user', 'preferred_language', 'timezone', 'currency',
        'booking_reminders', 'push_notifications'
    ]

    list_filter = ['preferred_language', 'timezone', 'currency']
    search_fields = ['user__email']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Usuario', {
            'fields': ('user',)
        }),
        ('Preferencias Básicas', {
            'fields': ('preferred_language', 'timezone', 'currency')
        }),
        ('Notificaciones', {
            'fields': (
                'email_notifications', 'sms_notifications',
                'marketing_emails', 'booking_reminders', 'push_notifications'
            )
        }),
        ('Privacidad', {
            'fields': (
                'share_booking_history', 'allow_marketing_contact',
                'data_collection_consent'
            )
        }),
        ('Accesibilidad', {
            'fields': ('high_contrast', 'large_text', 'reduced_motion')
        }),
    )


@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    """Admin para actividades de usuario"""

    list_display = [
        'user', 'activity_type', 'description', 'ip_address',
        'created_at'
    ]

    list_filter = ['activity_type', 'created_at']
    search_fields = ['user__email', 'description', 'ip_address']
    readonly_fields = ['created_at']

    fieldsets = (
        ('Información Básica', {
            'fields': ('user', 'activity_type', 'description')
        }),
        ('Detalles Técnicos', {
            'fields': ('ip_address', 'user_agent', 'metadata')
        }),
        ('Auditoría', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

    def has_add_permission(self, request):
        return False  # No permitir agregar actividades manualmente

    def has_change_permission(self, request, obj=None):
        return False  # Solo lectura

    def has_delete_permission(self, request, obj=None):
        return True  # Permitir limpieza de logs antiguos
