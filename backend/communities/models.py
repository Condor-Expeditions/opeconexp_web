from django.db import models
from django.utils.translation import gettext_lazy as _
import uuid
from users.models import User


class Community(models.Model):
    """Comunidades locales asociadas"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Información básica
    name = models.CharField(_("Nombre"), max_length=200)
    slug = models.SlugField(_("Slug"), unique=True)
    description = models.TextField(_("Descripción"))

    # Información de contacto
    contact_person = models.CharField(_("Persona de contacto"), max_length=200)
    email = models.EmailField(_("Email de contacto"))
    phone = models.CharField(_("Teléfono"), max_length=20)
    address = models.TextField(_("Dirección"), blank=True)

    # Ubicación
    province = models.CharField(_("Provincia"), max_length=100)
    canton = models.CharField(_("Cantón"), max_length=100)
    parish = models.CharField(_("Parroquia"), max_length=100)
    coordinates = models.JSONField(_("Coordenadas GPS"), null=True, blank=True)

    # Información demográfica
    population = models.IntegerField(_("Población aproximada"), null=True, blank=True)
    families = models.IntegerField(_("Número de familias"), null=True, blank=True)
    main_activities = models.JSONField(_("Actividades principales"), default=list, blank=True)

    # Estado y configuración
    status = models.CharField(_("Estado"), max_length=20, choices=[
        ('active', 'Activa'),
        ('inactive', 'Inactiva'),
        ('suspended', 'Suspendida'),
        ('in_formation', 'En formación')
    ], default='active')

    is_verified = models.BooleanField(_("Verificada"), default=False)
    verification_date = models.DateField(_("Fecha de verificación"), null=True, blank=True)

    # Información económica
    main_income_sources = models.JSONField(_("Fuentes de ingresos principales"), default=list, blank=True)
    tourism_impact = models.TextField(_("Impacto del turismo"), blank=True)
    development_needs = models.TextField(_("Necesidades de desarrollo"), blank=True)

    # Representante legal
    legal_representative = models.CharField(_("Representante legal"), max_length=200, blank=True)
    legal_id = models.CharField(_("Cédula/RUC"), max_length=20, blank=True)
    legal_documents = models.JSONField(_("Documentos legales"), default=list, blank=True)

    # Configuración de turismo
    max_tourists_per_day = models.IntegerField(_("Máximo de turistas por día"), null=True, blank=True)
    visiting_hours = models.JSONField(_("Horarios de visita"), default=dict, blank=True)
    languages_spoken = models.JSONField(_("Idiomas hablados"), default=list, blank=True)

    # Media y documentación
    logo = models.ImageField(_("Logo"), upload_to='communities/logos/', null=True, blank=True)
    photos = models.JSONField(_("Fotos"), default=list, blank=True)
    documents = models.JSONField(_("Documentos"), default=list, blank=True)

    # Métricas de participación
    total_tours_hosted = models.IntegerField(_("Total de tours recibidos"), default=0)
    total_revenue = models.DecimalField(_("Ingresos totales"), max_digits=12, decimal_places=2, default=0)
    average_rating = models.DecimalField(_("Calificación promedio"), max_digits=3, decimal_places=2, default=0)

    # Configuración de la plataforma
    commission_rate = models.DecimalField(_("Tasa de comisión"), max_digits=5, decimal_places=2, default=15.00)
    payment_terms = models.TextField(_("Términos de pago"), blank=True)

    # Auditoría
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_communities')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_communities')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Comunidad")
        verbose_name_plural = _("Comunidades")
        ordering = ['name']
        indexes = [
            models.Index(fields=['status', 'province']),
            models.Index(fields=['is_verified', 'status']),
        ]

    def __str__(self):
        return self.name


class CommunityService(models.Model):
    """Servicios ofrecidos por las comunidades"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='services')

    # Información básica
    name = models.CharField(_("Nombre del servicio"), max_length=200)
    description = models.TextField(_("Descripción"))
    service_type = models.CharField(_("Tipo de servicio"), max_length=50, choices=[
        ('accommodation', 'Alojamiento'),
        ('food', 'Alimentación'),
        ('guide', 'Guía local'),
        ('crafts', 'Artesanías'),
        ('cultural_show', 'Espectáculo cultural'),
        ('workshop', 'Taller'),
        ('transport', 'Transporte'),
        ('other', 'Otro')
    ])

    # Disponibilidad y capacidad
    max_capacity = models.IntegerField(_("Capacidad máxima"))
    min_notice_hours = models.IntegerField(_("Horas mínimas de anticipación"), default=24)

    # Precios
    base_price = models.DecimalField(_("Precio base"), max_digits=10, decimal_places=2)
    currency = models.CharField(_("Moneda"), max_length=3, default='USD')
    pricing_model = models.CharField(_("Modelo de precios"), max_length=20, choices=[
        ('per_person', 'Por persona'),
        ('per_group', 'Por grupo'),
        ('per_hour', 'Por hora'),
        ('per_day', 'Por día')
    ])

    # Disponibilidad
    available_days = models.JSONField(_("Días disponibles"), default=list, blank=True)  # ['monday', 'tuesday', etc.]
    available_hours = models.JSONField(_("Horarios disponibles"), default=dict, blank=True)

    # Estado
    is_active = models.BooleanField(_("Activo"), default=True)
    requires_approval = models.BooleanField(_("Requiere aprobación"), default=False)

    # Información adicional
    requirements = models.TextField(_("Requisitos"), blank=True)
    included_items = models.JSONField(_("Items incluidos"), default=list, blank=True)
    recommendations = models.TextField(_("Recomendaciones"), blank=True)

    # Media
    photos = models.JSONField(_("Fotos"), default=list, blank=True)
    videos = models.JSONField(_("Videos"), default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Servicio comunitario")
        verbose_name_plural = _("Servicios comunitarios")
        ordering = ['name']

    def __str__(self):
        return f"{self.name} - {self.community.name}"


class CommunityMember(models.Model):
    """Miembros individuales de las comunidades"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='members')

    # Información personal
    first_name = models.CharField(_("Nombre"), max_length=100)
    last_name = models.CharField(_("Apellido"), max_length=100)
    date_of_birth = models.DateField(_("Fecha de nacimiento"), null=True, blank=True)
    gender = models.CharField(_("Género"), max_length=20, blank=True)

    # Información de contacto
    phone = models.CharField(_("Teléfono"), max_length=20, blank=True)
    email = models.EmailField(_("Email"), blank=True)
    address = models.TextField(_("Dirección"), blank=True)

    # Rol en la comunidad
    role = models.CharField(_("Rol"), max_length=50, choices=[
        ('leader', 'Líder'),
        ('elder', 'Anciano'),
        ('guide', 'Guía'),
        ('artisan', 'Artesano'),
        ('cook', 'Cocinero'),
        ('member', 'Miembro'),
        ('other', 'Otro')
    ])

    # Especialidades
    special_skills = models.JSONField(_("Habilidades especiales"), default=list, blank=True)
    languages_spoken = models.JSONField(_("Idiomas hablados"), default=list, blank=True)
    certifications = models.JSONField(_("Certificaciones"), default=list, blank=True)

    # Estado
    is_active = models.BooleanField(_("Activo"), default=True)
    can_guide_tours = models.BooleanField(_("Puede guiar tours"), default=False)
    can_host_visitors = models.BooleanField(_("Puede hospedar visitantes"), default=False)

    # Información adicional
    bio = models.TextField(_("Biografía"), blank=True)
    photo = models.ImageField(_("Foto"), upload_to='community_members/', null=True, blank=True)
    emergency_contact = models.TextField(_("Contacto de emergencia"), blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Miembro de comunidad")
        verbose_name_plural = _("Miembros de comunidad")

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.community.name}"


class CommunityTour(models.Model):
    """Tours específicos organizados por comunidades"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='tours')

    # Información básica
    title = models.CharField(_("Título"), max_length=200)
    description = models.TextField(_("Descripción"))
    duration_hours = models.IntegerField(_("Duración en horas"))

    # Itinerario y actividades
    itinerary = models.JSONField(_("Itinerario"), default=list, blank=True)
    activities = models.JSONField(_("Actividades"), default=list, blank=True)
    difficulty_level = models.CharField(_("Nivel de dificultad"), max_length=20, choices=[
        ('easy', 'Fácil'),
        ('moderate', 'Moderado'),
        ('challenging', 'Desafiante')
    ])

    # Precios y capacidad
    price_per_person = models.DecimalField(_("Precio por persona"), max_digits=10, decimal_places=2)
    min_participants = models.IntegerField(_("Mínimo de participantes"), default=2)
    max_participants = models.IntegerField(_("Máximo de participantes"))

    # Disponibilidad
    available_days = models.JSONField(_("Días disponibles"), default=list, blank=True)
    available_months = models.JSONField(_("Meses disponibles"), default=list, blank=True)

    # Estado
    is_active = models.BooleanField(_("Activo"), default=True)
    is_featured = models.BooleanField(_("Destacado"), default=False)

    # Media
    photos = models.JSONField(_("Fotos"), default=list, blank=True)
    videos = models.JSONField(_("Videos"), default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Tour comunitario")
        verbose_name_plural = _("Tours comunitarios")

    def __str__(self):
        return f"{self.title} - {self.community.name}"


class CommunityBooking(models.Model):
    """Reservas de servicios comunitarios"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='bookings')
    service = models.ForeignKey(CommunityService, on_delete=models.CASCADE, related_name='bookings', null=True, blank=True)
    tour = models.ForeignKey(CommunityTour, on_delete=models.CASCADE, related_name='bookings', null=True, blank=True)

    # Información del cliente
    client_name = models.CharField(_("Nombre del cliente"), max_length=200)
    client_email = models.EmailField(_("Email del cliente"))
    client_phone = models.CharField(_("Teléfono del cliente"), max_length=20)

    # Información de la reserva
    number_of_participants = models.IntegerField(_("Número de participantes"))
    booking_date = models.DateField(_("Fecha de la reserva"))
    start_time = models.TimeField(_("Hora de inicio"), null=True, blank=True)

    # Información financiera
    total_amount = models.DecimalField(_("Monto total"), max_digits=10, decimal_places=2)
    commission_amount = models.DecimalField(_("Monto de comisión"), max_digits=10, decimal_places=2)
    community_amount = models.DecimalField(_("Monto para comunidad"), max_digits=10, decimal_places=2)

    # Estado
    status = models.CharField(_("Estado"), max_length=20, choices=[
        ('pending', 'Pendiente'),
        ('confirmed', 'Confirmada'),
        ('completed', 'Completada'),
        ('cancelled', 'Cancelada'),
        ('no_show', 'No presentado')
    ], default='pending')

    # Información adicional
    special_requests = models.TextField(_("Solicitudes especiales"), blank=True)
    internal_notes = models.TextField(_("Notas internas"), blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Reserva comunitaria")
        verbose_name_plural = _("Reservas comunitarias")

    def __str__(self):
        return f"Reserva {self.id} - {self.community.name}"


class CommunityFeedback(models.Model):
    """Feedback y calificaciones de servicios comunitarios"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='feedback')
    booking = models.ForeignKey(CommunityBooking, on_delete=models.CASCADE, related_name='feedback', null=True, blank=True)

    # Información del feedback
    visitor_name = models.CharField(_("Nombre del visitante"), max_length=200, blank=True)
    visitor_email = models.EmailField(_("Email del visitante"), blank=True)

    # Calificaciones
    overall_rating = models.IntegerField(_("Calificación general"), choices=[(i, i) for i in range(1, 6)])
    service_rating = models.IntegerField(_("Calificación del servicio"), choices=[(i, i) for i in range(1, 6)], null=True, blank=True)
    guide_rating = models.IntegerField(_("Calificación del guía"), choices=[(i, i) for i in range(1, 6)], null=True, blank=True)
    value_rating = models.IntegerField(_("Calificación de valor"), choices=[(i, i) for i in range(1, 6)], null=True, blank=True)

    # Comentarios
    comment = models.TextField(_("Comentario"))
    positives = models.TextField(_("Aspectos positivos"), blank=True)
    improvements = models.TextField(_("Mejoras sugeridas"), blank=True)
    would_recommend = models.BooleanField(_("Recomendaría"), null=True, blank=True)

    # Estado
    is_public = models.BooleanField(_("Comentario público"), default=True)
    is_verified = models.BooleanField(_("Verificado"), default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Feedback comunitario")
        verbose_name_plural = _("Feedback comunitarios")

    def __str__(self):
        return f"Feedback - {self.community.name}"
