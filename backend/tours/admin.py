"""
Configuración del admin para el módulo de tours

Personalización completa del panel administrativo para gestión de tours,
categorías, horarios y reseñas.
"""

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.db.models import Count, Avg
from .models import Tour, TourCategory, TourSchedule, TourGuide, TourReview


@admin.register(TourCategory)
class TourCategoryAdmin(admin.ModelAdmin):
    """Admin para categorías de tours"""

    list_display = [
        'name', 'slug', 'parent', 'is_active', 'featured',
        'sort_order', 'tours_count'
    ]

    list_filter = ['is_active', 'featured', 'parent']
    search_fields = ['name', 'description', 'slug']
    readonly_fields = ['created_at', 'updated_at']
    prepopulated_fields = {'slug': ('name',)}

    fieldsets = (
        ('Información Básica', {
            'fields': ('name', 'slug', 'description', 'parent')
        }),
        ('Configuración', {
            'fields': ('is_active', 'featured', 'sort_order')
        }),
        ('Apariencia', {
            'fields': ('icon', 'color')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
        ('Auditoría', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def tours_count(self, obj):
        return obj.tours.count()
    tours_count.short_description = 'Número de Tours'

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(
            tours_count=Count('tours')
        )

    actions = ['activate_categories', 'deactivate_categories', 'mark_featured']

    def activate_categories(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(
            request,
            f'Se activaron {queryset.count()} categorías.'
        )
    activate_categories.short_description = 'Activar categorías seleccionadas'

    def deactivate_categories(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(
            request,
            f'Se desactivaron {queryset.count()} categorías.'
        )
    deactivate_categories.short_description = 'Desactivar categorías seleccionadas'

    def mark_featured(self, request, queryset):
        queryset.update(featured=True)
        self.message_user(
            request,
            f'Se marcaron {queryset.count()} categorías como destacadas.'
        )
    mark_featured.short_description = 'Marcar como destacadas'


@admin.register(Tour)
class TourAdmin(admin.ModelAdmin):
    """Admin para tours"""

    list_display = [
        'title', 'code', 'category', 'location', 'duration_days',
        'base_price', 'status', 'is_featured', 'start_date', 'created_at'
    ]

    list_filter = [
        'status', 'category', 'difficulty_level', 'is_featured',
        'start_date', 'created_at'
    ]

    search_fields = ['title', 'code', 'location', 'short_description']
    readonly_fields = ['created_at', 'updated_at', 'slug']
    prepopulated_fields = {'slug': ('title',)}

    fieldsets = (
        ('Información Básica', {
            'fields': ('title', 'slug', 'code', 'category')
        }),
        ('Descripción', {
            'fields': (
                'short_description', 'full_description',
                'itinerary', 'included_services', 'excluded_services', 'requirements'
            )
        }),
        ('Ubicación y Duración', {
            'fields': (
                'location', 'coordinates', 'duration_days',
                'duration_nights'
            )
        }),
        ('Dificultad', {
            'fields': ('difficulty_level', 'physical_demand', 'technical_demand')
        }),
        ('Precios y Capacidad', {
            'fields': (
                'base_price', 'currency', 'min_participants',
                'max_participants'
            )
        }),
        ('Fechas', {
            'fields': ('start_date', 'end_date', 'booking_deadline')
        }),
        ('Estado', {
            'fields': (
                'status', 'is_featured', 'is_private',
                'requires_approval', 'allow_children', 'minimum_age'
            )
        }),
        ('Media', {
            'fields': ('main_image', 'gallery')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
        ('Auditoría', {
            'fields': ('created_by', 'updated_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    # Note: gallery is likely a JSONField, not ManyToMany
    # filter_horizontal cannot be used with JSONFields

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'category', 'created_by'
        ).prefetch_related('schedules')

    def main_image_thumbnail(self, obj):
        if obj.main_image:
            return format_html(
                '<img src="{}" width="100" height="60" style="object-fit: cover; border-radius: 4px;" />',
                obj.main_image.url
            )
        return "Sin imagen"
    main_image_thumbnail.short_description = 'Imagen Principal'

    actions = [
        'publish_tours', 'draft_tours', 'mark_as_featured',
        'unmark_as_featured', 'export_tours_csv'
    ]

    def publish_tours(self, request, queryset):
        queryset.update(status='published')
        self.message_user(
            request,
            f'Se publicaron {queryset.count()} tours.'
        )
    publish_tours.short_description = 'Publicar tours seleccionados'

    def draft_tours(self, request, queryset):
        queryset.update(status='draft')
        self.message_user(
            request,
            f'Se cambiaron {queryset.count()} tours a borrador.'
        )
    draft_tours.short_description = 'Cambiar a borrador'

    def mark_as_featured(self, request, queryset):
        queryset.update(is_featured=True)
        self.message_user(
            request,
            f'Se marcaron {queryset.count()} tours como destacados.'
        )
    mark_as_featured.short_description = 'Marcar como destacados'

    def unmark_as_featured(self, request, queryset):
        queryset.update(is_featured=False)
        self.message_user(
            request,
            f'Se desmarcaron {queryset.count()} tours como destacados.'
        )
    unmark_as_featured.short_description = 'Desmarcar como destacados'


@admin.register(TourSchedule)
class TourScheduleAdmin(admin.ModelAdmin):
    """Admin para horarios de tours"""

    list_display = [
        'tour', 'departure_date', 'return_date', 'max_participants',
        'available_spots', 'price', 'status'
    ]

    list_filter = ['status', 'departure_date']
    search_fields = ['tour__title', 'tour__code']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Tour', {
            'fields': ('tour',)
        }),
        ('Fechas', {
            'fields': ('departure_date', 'return_date')
        }),
        ('Horarios', {
            'fields': ('departure_time', 'meeting_point')
        }),
        ('Capacidad', {
            'fields': ('max_participants', 'available_spots', 'waitlist_available')
        }),
        ('Precios', {
            'fields': (
                'price', 'early_bird_discount', 'last_minute_surcharge'
            )
        }),
        ('Estado', {
            'fields': ('status', 'notes', 'special_conditions')
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('tour')

    actions = ['mark_available', 'mark_full', 'update_prices']

    def mark_available(self, request, queryset):
        queryset.update(status='available')
        self.message_user(
            request,
            f'Se marcaron {queryset.count()} horarios como disponibles.'
        )
    mark_available.short_description = 'Marcar como disponibles'

    def mark_full(self, request, queryset):
        queryset.update(status='full')
        self.message_user(
            request,
            f'Se marcaron {queryset.count()} horarios como completos.'
        )
    mark_full.short_description = 'Marcar como completos'


@admin.register(TourReview)
class TourReviewAdmin(admin.ModelAdmin):
    """Admin para reseñas de tours"""

    list_display = [
        'tour', 'user', 'overall_rating', 'is_verified',
        'status', 'created_at'
    ]

    list_filter = ['overall_rating', 'is_verified', 'status', 'created_at']
    search_fields = ['tour__title', 'user__email', 'comment']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Información Básica', {
            'fields': ('tour', 'user', 'schedule')
        }),
        ('Calificaciones', {
            'fields': (
                'overall_rating', 'guide_rating', 'accommodation_rating',
                'food_rating', 'transportation_rating'
            )
        }),
        ('Reseña', {
            'fields': ('title', 'comment', 'pros', 'cons', 'tips')
        }),
        ('Estado', {
            'fields': ('is_verified', 'is_featured', 'status')
        }),
        ('Media', {
            'fields': ('photos', 'videos'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('tour', 'user')

    actions = ['verify_reviews', 'publish_reviews', 'feature_reviews']

    def verify_reviews(self, request, queryset):
        queryset.update(is_verified=True)
        self.message_user(
            request,
            f'Se verificaron {queryset.count()} reseñas.'
        )
    verify_reviews.short_description = 'Verificar reseñas seleccionadas'

    def publish_reviews(self, request, queryset):
        queryset.update(status='published')
        self.message_user(
            request,
            f'Se publicaron {queryset.count()} reseñas.'
        )
    publish_reviews.short_description = 'Publicar reseñas seleccionadas'

    def feature_reviews(self, request, queryset):
        queryset.update(is_featured=True)
        self.message_user(
            request,
            f'Se destacaron {queryset.count()} reseñas.'
        )
    feature_reviews.short_description = 'Destacar reseñas seleccionadas'


@admin.register(TourGuide)
class TourGuideAdmin(admin.ModelAdmin):
    """Admin para guías asignados a tours"""

    list_display = [
        'tour', 'guide', 'role', 'is_primary', 'created_at'
    ]

    list_filter = ['role', 'is_primary', 'created_at']
    search_fields = ['tour__title', 'guide__user__email']
    readonly_fields = ['created_at']

    fieldsets = (
        ('Asignación', {
            'fields': ('tour', 'guide', 'role', 'is_primary')
        }),
        ('Notas', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('tour', 'guide__user')
