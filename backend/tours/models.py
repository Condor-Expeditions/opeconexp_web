from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
from users.models import User


class TourCategory(models.Model):
    """Categorías de tours y actividades"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(_("Nombre"), max_length=100)
    slug = models.SlugField(_("Slug"), unique=True)
    description = models.TextField(_("Descripción"), blank=True)
    icon = models.CharField(_("Ícono"), max_length=50, blank=True)
    color = models.CharField(_("Color"), max_length=7, default="#007bff")
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subcategories')

    # Configuración
    is_active = models.BooleanField(_("Activo"), default=True)
    sort_order = models.IntegerField(_("Orden"), default=0)
    featured = models.BooleanField(_("Destacado"), default=False)

    # SEO
    meta_title = models.CharField(_("Título SEO"), max_length=200, blank=True)
    meta_description = models.TextField(_("Descripción SEO"), blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Categoría de tour")
        verbose_name_plural = _("Categorías de tours")
        ordering = ['sort_order', 'name']

    def __str__(self):
        return self.name


class Tour(models.Model):
    """Modelo principal de tours y expediciones"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Información básica
    title = models.CharField(_("Título"), max_length=200)
    slug = models.SlugField(_("Slug"), unique=True)
    code = models.CharField(_("Código"), max_length=20, unique=True)
    category = models.ForeignKey(TourCategory, on_delete=models.CASCADE, related_name='tours')

    # Descripción
    short_description = models.TextField(_("Descripción corta"), max_length=500)
    full_description = models.TextField(_("Descripción completa"))
    itinerary = models.JSONField(_("Itinerario"), default=list, blank=True)
    included_services = models.JSONField(_("Servicios incluidos"), default=list, blank=True)
    excluded_services = models.JSONField(_("Servicios excluidos"), default=list, blank=True)
    requirements = models.TextField(_("Requisitos"), blank=True)

    # Ubicación y duración
    location = models.CharField(_("Ubicación"), max_length=200)
    coordinates = models.JSONField(_("Coordenadas GPS"), null=True, blank=True)
    duration_days = models.IntegerField(_("Duración en días"), validators=[MinValueValidator(1)])
    duration_nights = models.IntegerField(_("Noches"), default=0)

    # Dificultad y condiciones
    difficulty_level = models.CharField(_("Nivel de dificultad"), max_length=20, choices=[
        ('easy', 'Fácil'),
        ('moderate', 'Moderado'),
        ('challenging', 'Desafiante'),
        ('extreme', 'Extremo')
    ])

    physical_demand = models.IntegerField(_("Demanda física"), validators=[MinValueValidator(1), MaxValueValidator(10)])
    technical_demand = models.IntegerField(_("Demanda técnica"), validators=[MinValueValidator(1), MaxValueValidator(10)])

    # Precios y disponibilidad
    base_price = models.DecimalField(_("Precio base"), max_digits=10, decimal_places=2)
    currency = models.CharField(_("Moneda"), max_length=3, default='USD')
    min_participants = models.IntegerField(_("Mínimo de participantes"), default=1)
    max_participants = models.IntegerField(_("Máximo de participantes"), validators=[MinValueValidator(1)])

    # Fechas
    start_date = models.DateField(_("Fecha de inicio"))
    end_date = models.DateField(_("Fecha de fin"))
    booking_deadline = models.DateTimeField(_("Fecha límite de reserva"), null=True, blank=True)

    # Estado
    status = models.CharField(_("Estado"), max_length=20, choices=[
        ('draft', 'Borrador'),
        ('published', 'Publicado'),
        ('cancelled', 'Cancelado'),
        ('completed', 'Completado'),
        ('suspended', 'Suspendido')
    ], default='draft')

    # Características especiales
    is_featured = models.BooleanField(_("Destacado"), default=False)
    is_private = models.BooleanField(_("Privado"), default=False)
    requires_approval = models.BooleanField(_("Requiere aprobación"), default=False)
    allow_children = models.BooleanField(_("Permite niños"), default=True)
    minimum_age = models.IntegerField(_("Edad mínima"), null=True, blank=True)

    # Media
    main_image = models.ImageField(_("Imagen principal"), upload_to='tours/main/')
    gallery = models.JSONField(_("Galería de imágenes"), default=list, blank=True)

    # SEO
    meta_title = models.CharField(_("Título SEO"), max_length=200, blank=True)
    meta_description = models.TextField(_("Descripción SEO"), blank=True)

    # Auditoría
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_tours')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_tours')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Tour")
        verbose_name_plural = _("Tours")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'start_date']),
            models.Index(fields=['category', 'status']),
            models.Index(fields=['is_featured', 'status']),
        ]

    def __str__(self):
        return f"{self.title} ({self.code})"


class TourSchedule(models.Model):
    """Horarios específicos de tours"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name='schedules')

    # Fechas específicas
    departure_date = models.DateField(_("Fecha de salida"))
    return_date = models.DateField(_("Fecha de regreso"))

    # Horarios
    departure_time = models.TimeField(_("Hora de salida"), null=True, blank=True)
    meeting_point = models.CharField(_("Punto de encuentro"), max_length=200, blank=True)

    # Disponibilidad
    max_participants = models.IntegerField(_("Máximo de participantes"))
    available_spots = models.IntegerField(_("Cupos disponibles"))
    waitlist_available = models.BooleanField(_("Lista de espera"), default=True)

    # Precios específicos
    price = models.DecimalField(_("Precio"), max_digits=10, decimal_places=2, null=True, blank=True)
    early_bird_discount = models.DecimalField(_("Descuento early bird"), max_digits=5, decimal_places=2, default=0)
    last_minute_surcharge = models.DecimalField(_("Recargo last minute"), max_digits=5, decimal_places=2, default=0)

    # Estado
    status = models.CharField(_("Estado"), max_length=20, choices=[
        ('available', 'Disponible'),
        ('full', 'Completo'),
        ('cancelled', 'Cancelado'),
        ('postponed', 'Pospuesto')
    ], default='available')

    # Información adicional
    notes = models.TextField(_("Notas"), blank=True)
    special_conditions = models.TextField(_("Condiciones especiales"), blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Horario de tour")
        verbose_name_plural = _("Horarios de tours")
        ordering = ['departure_date', 'departure_time']
        unique_together = ['tour', 'departure_date']

    def __str__(self):
        return f"{self.tour.title} - {self.departure_date}"


class TourGuide(models.Model):
    """Guías turísticos asignados a tours"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name='assigned_guides')
    guide = models.ForeignKey('staff.Staff', on_delete=models.CASCADE, related_name='assigned_tours')

    role = models.CharField(_("Rol"), max_length=50, choices=[
        ('lead_guide', 'Guía principal'),
        ('assistant_guide', 'Guía asistente'),
        ('specialist', 'Especialista'),
        ('photographer', 'Fotógrafo'),
        ('logistics', 'Logística')
    ])

    is_primary = models.BooleanField(_("Guía principal"), default=False)
    notes = models.TextField(_("Notas"), blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("Guía de tour")
        verbose_name_plural = _("Guías de tours")
        unique_together = ['tour', 'guide', 'role']

    def __str__(self):
        return f"{self.guide.user.get_full_name()} - {self.tour.title}"


class TourReview(models.Model):
    """Reseñas y calificaciones de tours"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tour_reviews')
    schedule = models.ForeignKey(TourSchedule, on_delete=models.CASCADE, related_name='reviews', null=True, blank=True)

    # Calificación
    overall_rating = models.IntegerField(_("Calificación general"), validators=[MinValueValidator(1), MaxValueValidator(5)])
    guide_rating = models.IntegerField(_("Calificación del guía"), validators=[MinValueValidator(1), MaxValueValidator(5)], null=True, blank=True)
    accommodation_rating = models.IntegerField(_("Calificación del alojamiento"), validators=[MinValueValidator(1), MaxValueValidator(5)], null=True, blank=True)
    food_rating = models.IntegerField(_("Calificación de la comida"), validators=[MinValueValidator(1), MaxValueValidator(5)], null=True, blank=True)
    transportation_rating = models.IntegerField(_("Calificación del transporte"), validators=[MinValueValidator(1), MaxValueValidator(5)], null=True, blank=True)

    # Reseña
    title = models.CharField(_("Título"), max_length=200, blank=True)
    comment = models.TextField(_("Comentario"))
    pros = models.TextField(_("Aspectos positivos"), blank=True)
    cons = models.TextField(_("Aspectos negativos"), blank=True)
    tips = models.TextField(_("Consejos"), blank=True)

    # Estado
    is_verified = models.BooleanField(_("Verificado"), default=False)
    is_featured = models.BooleanField(_("Destacado"), default=False)
    status = models.CharField(_("Estado"), max_length=20, choices=[
        ('published', 'Publicado'),
        ('pending', 'Pendiente'),
        ('rejected', 'Rechazado'),
        ('hidden', 'Oculto')
    ], default='pending')

    # Media
    photos = models.JSONField(_("Fotos"), default=list, blank=True)
    videos = models.JSONField(_("Videos"), default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Reseña de tour")
        verbose_name_plural = _("Reseñas de tours")
        ordering = ['-created_at']
        unique_together = ['tour', 'user', 'schedule']

    def __str__(self):
        return f"Reseña de {self.user.get_full_name()} - {self.tour.title}"
