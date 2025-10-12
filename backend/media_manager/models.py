from django.db import models
from django.utils.translation import gettext_lazy as _
import uuid
from users.models import User


class MediaAlbum(models.Model):
    """Álbumes de medios (fotos, videos)"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Información básica
    title = models.CharField(_("Título"), max_length=200)
    slug = models.SlugField(_("Slug"), unique=True)
    description = models.TextField(_("Descripción"), blank=True)

    # Asociación con tours y eventos
    tour = models.ForeignKey('tours.Tour', on_delete=models.CASCADE, related_name='albums', null=True, blank=True)
    booking = models.ForeignKey('bookings.Booking', on_delete=models.CASCADE, related_name='albums', null=True, blank=True)
    event_date = models.DateField(_("Fecha del evento"), null=True, blank=True)

    # Configuración de privacidad
    visibility = models.CharField(_("Visibilidad"), max_length=20, choices=[
        ('public', 'Público'),
        ('private', 'Privado'),
        ('password', 'Protegido por contraseña'),
        ('users_only', 'Solo usuarios registrados')
    ], default='public')

    access_password = models.CharField(_("Contraseña de acceso"), max_length=100, blank=True)

    # Organización
    category = models.CharField(_("Categoría"), max_length=50, choices=[
        ('tour', 'Tour'),
        ('event', 'Evento'),
        ('destination', 'Destino'),
        ('wildlife', 'Vida silvestre'),
        ('culture', 'Cultura'),
        ('adventure', 'Aventura'),
        ('other', 'Otro')
    ])

    tags = models.JSONField(_("Etiquetas"), default=list, blank=True)
    location = models.CharField(_("Ubicación"), max_length=200, blank=True)
    coordinates = models.JSONField(_("Coordenadas GPS"), null=True, blank=True)

    # Estadísticas
    view_count = models.IntegerField(_("Número de vistas"), default=0)
    download_count = models.IntegerField(_("Número de descargas"), default=0)
    share_count = models.IntegerField(_("Número de compartidos"), default=0)

    # Estado
    is_featured = models.BooleanField(_("Destacado"), default=False)
    is_active = models.BooleanField(_("Activo"), default=True)
    requires_approval = models.BooleanField(_("Requiere aprobación"), default=False)
    is_approved = models.BooleanField(_("Aprobado"), default=True)

    # Portada del álbum
    cover_image = models.ImageField(_("Imagen de portada"), upload_to='albums/covers/', null=True, blank=True)
    thumbnail = models.ImageField(_("Miniatura"), upload_to='albums/thumbnails/', null=True, blank=True)

    # Configuración avanzada
    allow_downloads = models.BooleanField(_("Permitir descargas"), default=True)
    allow_sharing = models.BooleanField(_("Permitir compartir"), default=True)
    sort_order = models.IntegerField(_("Orden"), default=0)

    # SEO
    meta_title = models.CharField(_("Título SEO"), max_length=200, blank=True)
    meta_description = models.TextField(_("Descripción SEO"), blank=True)

    # Auditoría
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_albums')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_albums')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Álbum de medios")
        verbose_name_plural = _("Álbumes de medios")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['visibility', 'is_active']),
            models.Index(fields=['tour', 'is_active']),
            models.Index(fields=['is_featured', 'created_at']),
        ]

    def __str__(self):
        return self.title


class MediaFile(models.Model):
    """Archivos individuales de medios"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Información básica
    name = models.CharField(_("Nombre"), max_length=200)
    description = models.TextField(_("Descripción"), blank=True)
    alt_text = models.CharField(_("Texto alternativo"), max_length=200, blank=True)

    # Asociación
    album = models.ForeignKey(MediaAlbum, on_delete=models.CASCADE, related_name='files')
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='uploaded_files')

    # Archivo
    file = models.FileField(_("Archivo"), upload_to='media/files/')
    file_type = models.CharField(_("Tipo de archivo"), max_length=50)
    file_size = models.IntegerField(_("Tamaño del archivo"))
    mime_type = models.CharField(_("Tipo MIME"), max_length=100)

    # Información técnica
    width = models.IntegerField(_("Ancho"), null=True, blank=True)
    height = models.IntegerField(_("Alto"), null=True, blank=True)
    duration = models.IntegerField(_("Duración (segundos)"), null=True, blank=True)  # Para videos

    # Procesamiento
    thumbnail = models.ImageField(_("Miniatura"), upload_to='media/thumbnails/', null=True, blank=True)
    is_processed = models.BooleanField(_("Procesado"), default=False)
    processing_error = models.TextField(_("Error de procesamiento"), blank=True)

    # Estado y configuración
    is_featured = models.BooleanField(_("Destacado"), default=False)
    sort_order = models.IntegerField(_("Orden"), default=0)
    is_cover = models.BooleanField(_("Es portada"), default=False)

    # Estadísticas
    view_count = models.IntegerField(_("Número de vistas"), default=0)
    download_count = models.IntegerField(_("Número de descargas"), default=0)

    # Configuración de acceso
    allow_download = models.BooleanField(_("Permitir descarga"), default=True)
    requires_auth = models.BooleanField(_("Requiere autenticación"), default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Archivo de medios")
        verbose_name_plural = _("Archivos de medios")
        ordering = ['sort_order', 'created_at']

    def __str__(self):
        return f"{self.name} - {self.album.title}"


class Media360Project(models.Model):
    """Proyectos de medios 360°"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Información básica
    title = models.CharField(_("Título"), max_length=200)
    slug = models.SlugField(_("Slug"), unique=True)
    description = models.TextField(_("Descripción"), blank=True)

    # Asociación
    tour = models.ForeignKey('tours.Tour', on_delete=models.CASCADE, related_name='projects_360', null=True, blank=True)
    album = models.ForeignKey(MediaAlbum, on_delete=models.CASCADE, related_name='projects_360', null=True, blank=True)
    location = models.CharField(_("Ubicación"), max_length=200, blank=True)
    coordinates = models.JSONField(_("Coordenadas GPS"), null=True, blank=True)

    # Configuración del proyecto
    project_type = models.CharField(_("Tipo de proyecto"), max_length=50, choices=[
        ('single_panorama', 'Panorama único'),
        ('virtual_tour', 'Tour virtual'),
        ('drone_360', 'Drone 360°'),
        ('underwater_360', 'Subacuático 360°')
    ])

    # Estado del proyecto
    status = models.CharField(_("Estado"), max_length=20, choices=[
        ('processing', 'Procesando'),
        ('ready', 'Listo'),
        ('published', 'Publicado'),
        ('draft', 'Borrador'),
        ('error', 'Error')
    ], default='processing')

    # Configuración de visualización
    initial_view = models.JSONField(_("Vista inicial"), default=dict, blank=True)  # yaw, pitch, fov
    hotspots = models.JSONField(_("Puntos de interés"), default=list, blank=True)
    navigation = models.JSONField(_("Navegación"), default=dict, blank=True)

    # Miniaturas y preview
    preview_image = models.ImageField(_("Imagen de preview"), upload_to='360/previews/', null=True, blank=True)
    thumbnail = models.ImageField(_("Miniatura"), upload_to='360/thumbnails/', null=True, blank=True)

    # Estadísticas
    view_count = models.IntegerField(_("Número de vistas"), default=0)
    average_view_time = models.IntegerField(_("Tiempo promedio de vista"), default=0)

    # Configuración de acceso
    visibility = models.CharField(_("Visibilidad"), max_length=20, choices=[
        ('public', 'Público'),
        ('private', 'Privado'),
        ('password', 'Protegido por contraseña')
    ], default='public')

    access_password = models.CharField(_("Contraseña de acceso"), max_length=100, blank=True)

    # Información técnica
    camera_info = models.JSONField(_("Información de cámara"), default=dict, blank=True)
    processing_info = models.JSONField(_("Información de procesamiento"), default=dict, blank=True)

    # Auditoría
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_360_projects')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_360_projects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Proyecto 360°")
        verbose_name_plural = _("Proyectos 360°")
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Media360Scene(models.Model):
    """Escenas individuales dentro de un proyecto 360°"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Media360Project, on_delete=models.CASCADE, related_name='scenes')

    # Información básica
    name = models.CharField(_("Nombre"), max_length=100)
    description = models.TextField(_("Descripción"), blank=True)

    # Archivos 360°
    panorama_file = models.FileField(_("Archivo panorámico"), upload_to='360/panoramas/')
    preview_file = models.ImageField(_("Preview"), upload_to='360/previews/', null=True, blank=True)

    # Configuración de la escena
    initial_yaw = models.FloatField(_("Yaw inicial"), default=0)
    initial_pitch = models.FloatField(_("Pitch inicial"), default=0)
    initial_fov = models.FloatField(_("FOV inicial"), default=75)

    # Información técnica
    width = models.IntegerField(_("Ancho"))
    height = models.IntegerField(_("Alto"))
    file_size = models.IntegerField(_("Tamaño del archivo"))

    # Estado
    is_processed = models.BooleanField(_("Procesado"), default=False)
    processing_error = models.TextField(_("Error de procesamiento"), blank=True)

    # Navegación
    sort_order = models.IntegerField(_("Orden"), default=0)
    hotspots = models.JSONField(_("Puntos de interés"), default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Escena 360°")
        verbose_name_plural = _("Escenas 360°")
        ordering = ['sort_order', 'name']

    def __str__(self):
        return f"{self.name} - {self.project.title}"


class MediaCollection(models.Model):
    """Colecciones de medios para organización"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Información básica
    name = models.CharField(_("Nombre"), max_length=200)
    slug = models.SlugField(_("Slug"), unique=True)
    description = models.TextField(_("Descripción"), blank=True)

    # Configuración
    collection_type = models.CharField(_("Tipo de colección"), max_length=50, choices=[
        ('featured', 'Destacados'),
        ('recent', 'Recientes'),
        ('popular', 'Populares'),
        ('category', 'Por categoría'),
        ('location', 'Por ubicación'),
        ('seasonal', 'Estacional')
    ])

    # Filtros
    filters = models.JSONField(_("Filtros"), default=dict, blank=True)
    sort_order = models.IntegerField(_("Orden"), default=0)

    # Estado
    is_active = models.BooleanField(_("Activo"), default=True)
    is_automatic = models.BooleanField(_("Automático"), default=False)

    # Fechas
    start_date = models.DateField(_("Fecha de inicio"), null=True, blank=True)
    end_date = models.DateField(_("Fecha de fin"), null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Colección de medios")
        verbose_name_plural = _("Colecciones de medios")
        ordering = ['sort_order', 'name']

    def __str__(self):
        return self.name


class MediaView(models.Model):
    """Registro de vistas de medios"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Asociación
    media_file = models.ForeignKey(MediaFile, on_delete=models.CASCADE, related_name='views', null=True, blank=True)
    album = models.ForeignKey(MediaAlbum, on_delete=models.CASCADE, related_name='views', null=True, blank=True)
    project_360 = models.ForeignKey(Media360Project, on_delete=models.CASCADE, related_name='views', null=True, blank=True)

    # Información del usuario
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='media_views')
    session_id = models.CharField(_("ID de sesión"), max_length=100, blank=True)
    ip_address = models.GenericIPAddressField(_("Dirección IP"), null=True, blank=True)

    # Información técnica
    user_agent = models.TextField(_("Agente de usuario"), blank=True)
    referrer = models.URLField(_("Referrer"), blank=True)
    view_duration = models.IntegerField(_("Duración de la vista"), null=True, blank=True)

    # Ubicación geográfica (si está disponible)
    country = models.CharField(_("País"), max_length=100, blank=True)
    city = models.CharField(_("Ciudad"), max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("Vista de medios")
        verbose_name_plural = _("Vistas de medios")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['created_at']),
            models.Index(fields=['media_file', 'created_at']),
            models.Index(fields=['user', 'created_at']),
        ]

    def __str__(self):
        return f"Vista - {self.created_at}"
