"""
Configuración del admin para el módulo de comunidades

Personalización completa del panel administrativo para gestión de comunidades,
servicios comunitarios y reservas.
"""

from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Sum, Count, Avg
from .models import Community, CommunityService, CommunityMember, CommunityTour, CommunityBooking, CommunityFeedback


@admin.register(Community)
class CommunityAdmin(admin.ModelAdmin):
    """Admin para comunidades"""

    list_display = [
        'name', 'contact_person', 'province', 'canton',
        'status', 'is_verified', 'total_tours_hosted',
        'total_revenue', 'average_rating'
    ]

    list_filter = [
        'status', 'is_verified', 'province', 'canton',
        'verification_date'
    ]

    search_fields = [
        'name', 'contact_person', 'email', 'phone',
        'province', 'canton', 'parish'
    ]

    readonly_fields = ['created_at', 'updated_at', 'total_tours_hosted', 'total_revenue']

    fieldsets = (
        ('Información Básica', {
            'fields': ('name', 'slug', 'description')
        }),
        ('Contacto', {
            'fields': (
                'contact_person', 'email', 'phone', 'address'
            )
        }),
        ('Ubicación', {
            'fields': (
                'province', 'canton', 'parish', 'coordinates'
            )
        }),
        ('Demografía', {
            'fields': (
                'population', 'families', 'main_activities'
            )
        }),
        ('Estado', {
            'fields': (
                'status', 'is_verified', 'verification_date'
            )
        }),
        ('Información Económica', {
            'fields': (
                'main_income_sources', 'tourism_impact',
                'development_needs'
            ),
            'classes': ('collapse',)
        }),
        ('Representante Legal', {
            'fields': (
                'legal_representative', 'legal_id', 'legal_documents'
            ),
            'classes': ('collapse',)
        }),
        ('Configuración de Turismo', {
            'fields': (
                'max_tourists_per_day', 'visiting_hours',
                'languages_spoken'
            )
        }),
        ('Media y Documentos', {
            'fields': ('logo', 'photos', 'documents'),
            'classes': ('collapse',)
        }),
        ('Configuración Financiera', {
            'fields': ('commission_rate', 'payment_terms')
        }),
        ('Métricas', {
            'fields': (
                'total_tours_hosted', 'total_revenue', 'average_rating'
            ),
            'classes': ('collapse',)
        }),
        ('Auditoría', {
            'fields': ('created_by', 'updated_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    # Note: main_activities, photos, documents are likely JSONFields, not ManyToMany
    # filter_horizontal cannot be used with JSONFields

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('services', 'members')

    def logo_thumbnail(self, obj):
        if obj.logo:
            return format_html(
                '<img src="{}" width="50" height="50" style="object-fit: cover; border-radius: 4px;" />',
                obj.logo.url
            )
        return "Sin logo"
    logo_thumbnail.short_description = 'Logo'

    actions = [
        'verify_communities', 'activate_communities',
        'generate_reports', 'calculate_earnings'
    ]

    def verify_communities(self, request, queryset):
        updated = 0
        for community in queryset:
            community.is_verified = True
            community.verification_date = timezone.now()
            community.status = 'active'
            community.save()
            updated += 1

        self.message_user(
            request,
            f'Se verificaron {updated} comunidades.'
        )
    verify_communities.short_description = 'Verificar comunidades seleccionadas'

    def activate_communities(self, request, queryset):
        queryset.update(status='active')
        self.message_user(
            request,
            f'Se activaron {queryset.count()} comunidades.'
        )
    activate_communities.short_description = 'Activar comunidades seleccionadas'


@admin.register(CommunityService)
class CommunityServiceAdmin(admin.ModelAdmin):
    """Admin para servicios comunitarios"""

    list_display = [
        'name', 'community', 'service_type', 'max_capacity',
        'base_price', 'is_active', 'available_days_count'
    ]

    list_filter = ['service_type', 'is_active', 'community__province']
    search_fields = ['name', 'community__name', 'description']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Información Básica', {
            'fields': ('community', 'name', 'description', 'service_type')
        }),
        ('Capacidad y Disponibilidad', {
            'fields': (
                'max_capacity', 'min_notice_hours',
                'available_days', 'available_hours'
            )
        }),
        ('Precios', {
            'fields': ('base_price', 'currency', 'pricing_model')
        }),
        ('Estado', {
            'fields': ('is_active', 'requires_approval')
        }),
        ('Detalles', {
            'fields': (
                'requirements', 'included_items', 'recommendations'
            ),
            'classes': ('collapse',)
        }),
        ('Media', {
            'fields': ('photos', 'videos'),
            'classes': ('collapse',)
        }),
    )

    # Note: available_days, photos, videos are likely JSONFields, not ManyToMany
    # filter_horizontal cannot be used with JSONFields

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('community')

    def available_days_count(self, obj):
        return len(obj.available_days) if obj.available_days else 0
    available_days_count.short_description = 'Días Disponibles'

    actions = ['activate_services', 'deactivate_services', 'update_prices']

    def activate_services(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(
            request,
            f'Se activaron {queryset.count()} servicios.'
        )
    activate_services.short_description = 'Activar servicios seleccionados'

    def deactivate_services(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(
            request,
            f'Se desactivaron {queryset.count()} servicios.'
        )
    deactivate_services.short_description = 'Desactivar servicios seleccionados'


@admin.register(CommunityMember)
class CommunityMemberAdmin(admin.ModelAdmin):
    """Admin para miembros de comunidades"""

    list_display = [
        'first_name', 'last_name', 'community', 'role',
        'is_active', 'can_guide_tours', 'can_host_visitors'
    ]

    list_filter = ['role', 'is_active', 'can_guide_tours', 'community__province']
    search_fields = ['first_name', 'last_name', 'community__name']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Información Personal', {
            'fields': (
                'community', 'first_name', 'last_name',
                'date_of_birth', 'gender'
            )
        }),
        ('Contacto', {
            'fields': ('phone', 'email', 'address')
        }),
        ('Rol en Comunidad', {
            'fields': ('role', 'is_active')
        }),
        ('Especialidades', {
            'fields': (
                'special_skills', 'languages_spoken', 'certifications'
            )
        }),
        ('Permisos', {
            'fields': ('can_guide_tours', 'can_host_visitors')
        }),
        ('Información Adicional', {
            'fields': ('bio', 'photo', 'emergency_contact'),
            'classes': ('collapse',)
        }),
    )

    # Note: special_skills, languages_spoken, certifications are likely JSONFields, not ManyToMany
    # filter_horizontal cannot be used with JSONFields

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('community')


@admin.register(CommunityBooking)
class CommunityBookingAdmin(admin.ModelAdmin):
    """Admin para reservas comunitarias"""

    list_display = [
        'id', 'community', 'client_name', 'client_email',
        'number_of_participants', 'booking_date', 'total_amount',
        'status', 'created_at'
    ]

    list_filter = [
        'status', 'booking_date', 'community__province',
        'created_at'
    ]

    search_fields = [
        'client_name', 'client_email', 'community__name'
    ]

    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Información Básica', {
            'fields': ('community', 'service', 'tour')
        }),
        ('Cliente', {
            'fields': ('client_name', 'client_email', 'client_phone')
        }),
        ('Reserva', {
            'fields': (
                'number_of_participants', 'booking_date', 'start_time'
            )
        }),
        ('Financiero', {
            'fields': (
                'total_amount', 'commission_amount', 'community_amount'
            )
        }),
        ('Estado', {
            'fields': ('status',)
        }),
        ('Notas', {
            'fields': ('special_requests', 'internal_notes'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('community', 'service', 'tour')

    actions = ['confirm_bookings', 'complete_bookings', 'cancel_community_bookings']

    def confirm_bookings(self, request, queryset):
        queryset.update(status='confirmed')
        self.message_user(
            request,
            f'Se confirmaron {queryset.count()} reservas comunitarias.'
        )
    confirm_bookings.short_description = 'Confirmar reservas seleccionadas'

    def complete_bookings(self, request, queryset):
        updated = 0
        for booking in queryset.filter(status='confirmed'):
            booking.status = 'completed'
            booking.save()

            # Actualizar métricas de la comunidad
            booking.community.total_tours_hosted += 1
            booking.community.total_revenue += booking.community_amount
            booking.community.save()

            updated += 1

        self.message_user(
            request,
            f'Se completaron {updated} reservas comunitarias.'
        )
    complete_bookings.short_description = 'Marcar como completadas'

    def cancel_community_bookings(self, request, queryset):
        queryset.update(status='cancelled')
        self.message_user(
            request,
            f'Se cancelaron {queryset.count()} reservas comunitarias.'
        )
    cancel_community_bookings.short_description = 'Cancelar reservas seleccionadas'


@admin.register(CommunityFeedback)
class CommunityFeedbackAdmin(admin.ModelAdmin):
    """Admin para feedback de comunidades"""

    list_display = [
        'community', 'visitor_name', 'overall_rating',
        'is_public', 'is_verified', 'created_at'
    ]

    list_filter = [
        'overall_rating', 'is_public', 'is_verified', 'created_at'
    ]

    search_fields = ['community__name', 'visitor_name', 'comment']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Información Básica', {
            'fields': ('community', 'visitor_name', 'visitor_email')
        }),
        ('Calificaciones', {
            'fields': (
                'overall_rating', 'service_rating', 'guide_rating', 'value_rating'
            )
        }),
        ('Comentarios', {
            'fields': ('comment', 'positives', 'improvements', 'would_recommend')
        }),
        ('Estado', {
            'fields': ('is_public', 'is_verified')
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('community')

    actions = ['publish_feedback', 'verify_feedback', 'hide_feedback']

    def publish_feedback(self, request, queryset):
        queryset.update(is_public=True)
        self.message_user(
            request,
            f'Se publicaron {queryset.count()} comentarios.'
        )
    publish_feedback.short_description = 'Publicar comentarios seleccionados'

    def verify_feedback(self, request, queryset):
        queryset.update(is_verified=True)
        self.message_user(
            request,
            f'Se verificaron {queryset.count()} comentarios.'
        )
    verify_feedback.short_description = 'Verificar comentarios seleccionados'

    def hide_feedback(self, request, queryset):
        queryset.update(is_public=False)
        self.message_user(
            request,
            f'Se ocultaron {queryset.count()} comentarios.'
        )
    hide_feedback.short_description = 'Ocultar comentarios seleccionados'


@admin.register(CommunityTour)
class CommunityTourAdmin(admin.ModelAdmin):
    """Admin para tours comunitarios"""

    list_display = [
        'title', 'community', 'duration_hours', 'price_per_person',
        'difficulty_level', 'is_active', 'is_featured'
    ]

    list_filter = [
        'difficulty_level', 'is_active', 'is_featured',
        'community__province'
    ]

    search_fields = ['title', 'community__name', 'description']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Información Básica', {
            'fields': ('community', 'title', 'description')
        }),
        ('Detalles del Tour', {
            'fields': (
                'duration_hours', 'itinerary', 'activities', 'difficulty_level'
            )
        }),
        ('Precios y Capacidad', {
            'fields': (
                'price_per_person', 'min_participants', 'max_participants'
            )
        }),
        ('Disponibilidad', {
            'fields': ('available_days', 'available_months')
        }),
        ('Estado', {
            'fields': ('is_active', 'is_featured')
        }),
        ('Media', {
            'fields': ('photos', 'videos'),
            'classes': ('collapse',)
        }),
    )

    # Note: photos, videos are likely JSONFields, not ManyToMany
    # filter_horizontal cannot be used with JSONFields

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('community')

    actions = ['activate_tours', 'feature_tours']

    def activate_tours(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(
            request,
            f'Se activaron {queryset.count()} tours comunitarios.'
        )
    activate_tours.short_description = 'Activar tours seleccionados'

    def feature_tours(self, request, queryset):
        queryset.update(is_featured=True)
        self.message_user(
            request,
            f'Se destacaron {queryset.count()} tours comunitarios.'
        )
    feature_tours.short_description = 'Destacar tours seleccionados'
