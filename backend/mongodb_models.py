"""
Modelos para MongoDB - Contenido dinámico y medios

Estos modelos están diseñados para ser utilizados con bibliotecas como:
- Djongo (para integración directa con Django ORM)
- MongoEngine (para modelos independientes)
- O como referencia para servicios separados de MongoDB
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from bson import ObjectId
from pydantic import BaseModel, Field


# Modelos Pydantic para validación y serialización
class MongoBaseModel(BaseModel):
    """Modelo base para documentos MongoDB"""

    id: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class MediaContent(MongoBaseModel):
    """Contenido de medios dinámico"""

    # Información básica
    title: str
    description: Optional[str] = None
    content_type: str  # 'image', 'video', 'audio', 'document', '360_photo', '360_video'

    # Asociación con entidades principales
    tour_id: Optional[str] = None
    booking_id: Optional[str] = None
    album_id: Optional[str] = None
    community_id: Optional[str] = None

    # Información del archivo
    filename: str
    original_filename: str
    file_path: str  # Ruta en almacenamiento (S3, local, etc.)
    file_size: int  # Tamaño en bytes
    mime_type: str

    # Información técnica
    width: Optional[int] = None
    height: Optional[int] = None
    duration: Optional[float] = None  # Para videos/audios en segundos
    bitrate: Optional[int] = None

    # Procesamiento
    processing_status: str = "pending"  # pending, processing, completed, failed
    processing_error: Optional[str] = None
    thumbnails: List[str] = []  # Rutas de miniaturas generadas
    optimized_versions: Dict[str, str] = {}  # Diferentes calidades/resoluciones

    # Metadatos específicos por tipo
    exif_data: Optional[Dict[str, Any]] = None  # Para imágenes
    gps_data: Optional[Dict[str, float]] = None  # Latitud, longitud, altitud
    camera_info: Optional[Dict[str, Any]] = None

    # Configuración de acceso
    visibility: str = "public"  # public, private, password_protected
    access_password: Optional[str] = None
    allow_download: bool = True
    requires_auth: bool = False

    # Estadísticas
    view_count: int = 0
    download_count: int = 0
    share_count: int = 0

    # Organización
    tags: List[str] = []
    categories: List[str] = []
    location: Optional[str] = None

    # Información de subida
    uploaded_by: Optional[str] = None  # User ID
    upload_source: str = "web"  # web, mobile, api, import
    upload_ip: Optional[str] = None

    class Config:
        allow_population_by_field_name = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }


class MediaAlbumDocument(MongoBaseModel):
    """Documento de álbum de medios en MongoDB"""

    # Información básica
    title: str
    slug: str
    description: Optional[str] = None

    # Asociación
    tour_id: Optional[str] = None
    booking_id: Optional[str] = None
    community_id: Optional[str] = None

    # Configuración
    visibility: str = "public"
    access_password: Optional[str] = None
    is_featured: bool = False
    sort_order: int = 0

    # Organización
    category: str = "general"
    tags: List[str] = []
    location: Optional[str] = None
    coordinates: Optional[Dict[str, float]] = None

    # Portada y contenido
    cover_image_id: Optional[str] = None
    media_files: List[str] = []  # Lista de MediaContent IDs

    # Estadísticas
    view_count: int = 0
    total_files: int = 0
    total_size: int = 0  # Tamaño total en bytes

    # Información adicional
    event_date: Optional[datetime] = None
    season: Optional[str] = None
    weather_conditions: Optional[str] = None

    # SEO y metadatos
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    custom_fields: Dict[str, Any] = {}


class Project360Document(MongoBaseModel):
    """Proyecto de contenido 360°"""

    # Información básica
    title: str
    slug: str
    description: Optional[str] = None

    # Asociación
    tour_id: Optional[str] = None
    album_id: Optional[str] = None
    location: Optional[str] = None
    coordinates: Optional[Dict[str, float]] = None

    # Configuración del proyecto
    project_type: str  # single_panorama, virtual_tour, drone_360, underwater_360
    status: str = "processing"  # processing, ready, published, error

    # Configuración de navegación
    initial_view: Dict[str, float] = {"yaw": 0, "pitch": 0, "fov": 75}
    hotspots: List[Dict[str, Any]] = []
    navigation_config: Dict[str, Any] = {}

    # Escenas del proyecto
    scenes: List[str] = []  # Lista de Scene360Document IDs

    # Archivos principales
    preview_image_id: Optional[str] = None
    thumbnail_id: Optional[str] = None

    # Información técnica
    camera_info: Dict[str, Any] = {}
    processing_info: Dict[str, Any] = {}

    # Estadísticas
    view_count: int = 0
    average_view_time: float = 0
    completion_rate: float = 0  # Porcentaje de usuarios que completan el tour

    # Configuración de acceso
    visibility: str = "public"
    access_password: Optional[str] = None
    embed_allowed: bool = True


class Scene360Document(MongoBaseModel):
    """Escena individual de un proyecto 360°"""

    # Información básica
    name: str
    description: Optional[str] = None

    # Asociación
    project_id: str  # Project360Document ID

    # Archivos 360°
    panorama_file_id: str  # MediaContent ID
    preview_file_id: Optional[str] = None

    # Configuración de la escena
    initial_yaw: float = 0
    initial_pitch: float = 0
    initial_fov: float = 75

    # Información técnica
    width: int
    height: int
    file_size: int

    # Estado de procesamiento
    processing_status: str = "pending"
    processing_error: Optional[str] = None

    # Navegación y hotspots
    sort_order: int = 0
    hotspots: List[Dict[str, Any]] = []

    # Información adicional
    capture_date: Optional[datetime] = None
    camera_settings: Dict[str, Any] = {}


class SocialMediaPost(MongoBaseModel):
    """Publicaciones en redes sociales"""

    # Información básica
    title: str
    content: str
    platform: str  # facebook, instagram, twitter, linkedin, tiktok

    # Asociación
    tour_id: Optional[str] = None
    album_id: Optional[str] = None
    community_id: Optional[str] = None

    # Programación
    scheduled_date: Optional[datetime] = None
    published_date: Optional[datetime] = None
    status: str = "draft"  # draft, scheduled, published, failed

    # Contenido multimedia
    media_files: List[str] = []  # MediaContent IDs
    hashtags: List[str] = []
    mentions: List[str] = []

    # Métricas de engagement
    likes_count: int = 0
    shares_count: int = 0
    comments_count: int = 0
    reach_count: int = 0
    impressions_count: int = 0

    # Información de publicación
    post_id: Optional[str] = None  # ID del post en la plataforma
    post_url: Optional[str] = None
    error_message: Optional[str] = None

    # Configuración
    auto_publish: bool = False
    approval_required: bool = True
    is_approved: bool = False


class MarketingCampaign(MongoBaseModel):
    """Campañas de marketing"""

    # Información básica
    name: str
    description: str
    campaign_type: str  # promotional, seasonal, event, retargeting

    # Fechas
    start_date: datetime
    end_date: datetime
    status: str = "draft"  # draft, active, paused, completed, cancelled

    # Configuración
    target_audience: Dict[str, Any] = {}
    budget: Optional[float] = None
    channels: List[str] = []  # email, social, ads, sms

    # Contenido
    posts: List[str] = []  # SocialMediaPost IDs
    emails: List[Dict[str, Any]] = []

    # Métricas
    total_reach: int = 0
    total_engagement: int = 0
    conversions: int = 0
    roi: float = 0

    # Información adicional
    goals: List[str] = []
    kpis: Dict[str, Any] = {}


class UserActivityDocument(MongoBaseModel):
    """Registro detallado de actividades de usuario"""

    # Información del usuario
    user_id: str
    session_id: Optional[str] = None

    # Información de la actividad
    activity_type: str  # view, click, search, booking, payment, etc.
    entity_type: Optional[str] = None  # tour, album, community, etc.
    entity_id: Optional[str] = None

    # Información técnica
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    referrer: Optional[str] = None
    device_info: Dict[str, Any] = {}

    # Información geográfica
    country: Optional[str] = None
    city: Optional[str] = None
    coordinates: Optional[Dict[str, float]] = None

    # Contexto de la actividad
    page_url: Optional[str] = None
    time_spent: Optional[int] = None  # segundos
    metadata: Dict[str, Any] = {}

    # Información adicional
    tags: List[str] = []
    category: Optional[str] = None


class SystemLogDocument(MongoBaseModel):
    """Logs del sistema para auditoría y debugging"""

    # Información básica
    level: str  # debug, info, warning, error, critical
    message: str
    source: str  # module, function, service name

    # Información técnica
    function_name: Optional[str] = None
    file_path: Optional[str] = None
    line_number: Optional[int] = None
    thread_id: Optional[str] = None

    # Contexto
    user_id: Optional[str] = None
    request_id: Optional[str] = None
    session_id: Optional[str] = None

    # Información adicional
    stack_trace: Optional[str] = None
    additional_data: Dict[str, Any] = {}
    tags: List[str] = []


class NotificationDocument(MongoBaseModel):
    """Notificaciones del sistema"""

    # Información básica
    title: str
    message: str
    notification_type: str  # email, sms, push, in_app

    # Destinatarios
    recipient_id: str
    recipient_email: Optional[str] = None
    recipient_phone: Optional[str] = None

    # Asociación
    related_entity_type: Optional[str] = None  # booking, tour, payment, etc.
    related_entity_id: Optional[str] = None

    # Estado
    status: str = "pending"  # pending, sent, delivered, failed, read
    sent_at: Optional[datetime] = None
    read_at: Optional[datetime] = None

    # Información de envío
    provider: Optional[str] = None  # sendgrid, twilio, firebase, etc.
    provider_message_id: Optional[str] = None
    error_message: Optional[str] = None

    # Configuración
    priority: str = "normal"  # low, normal, high, urgent
    retry_count: int = 0
    max_retries: int = 3


class ChatMessageDocument(MongoBaseModel):
    """Mensajes de chat y comunicación"""

    # Información básica
    conversation_id: str
    sender_id: str
    message_type: str = "text"  # text, image, file, system

    # Contenido
    content: str
    media_files: List[str] = []

    # Estado
    status: str = "sent"  # sent, delivered, read, failed
    is_edited: bool = False
    edited_at: Optional[datetime] = None

    # Información técnica
    client_message_id: Optional[str] = None
    reply_to_id: Optional[str] = None

    # Metadatos
    metadata: Dict[str, Any] = {}


class SearchQueryDocument(MongoBaseModel):
    """Registro de búsquedas realizadas"""

    # Información básica
    query: str
    user_id: Optional[str] = None
    session_id: Optional[str] = None

    # Resultados
    results_count: int = 0
    clicked_results: List[str] = []

    # Información técnica
    filters_applied: Dict[str, Any] = {}
    sort_by: Optional[str] = None
    ip_address: Optional[str] = None

    # Información geográfica
    country: Optional[str] = None
    city: Optional[str] = None

    # Métricas
    response_time: Optional[float] = None  # milisegundos


# Modelos para configuración y contenido dinámico
class ConfigurationDocument(MongoBaseModel):
    """Configuración dinámica del sistema"""

    # Información básica
    config_key: str
    config_value: Any
    config_type: str  # string, number, boolean, json, file

    # Organización
    category: str
    subcategory: Optional[str] = None

    # Estado
    is_active: bool = True
    is_system: bool = False  # Si es configuración del sistema

    # Información adicional
    description: Optional[str] = None
    validation_rules: Dict[str, Any] = {}
    default_value: Any = None


class ContentBlockDocument(MongoBaseModel):
    """Bloques de contenido dinámico para páginas"""

    # Información básica
    name: str
    block_type: str  # hero, features, testimonials, gallery, etc.
    title: Optional[str] = None
    content: str

    # Asociación
    page: str  # Página donde se muestra
    section: Optional[str] = None

    # Configuración
    is_active: bool = True
    sort_order: int = 0

    # Contenido multimedia
    media_files: List[str] = []
    background_image_id: Optional[str] = None

    # Configuración de estilo
    custom_css: Optional[str] = None
    custom_classes: List[str] = []

    # Configuración específica
    config: Dict[str, Any] = {}


# Modelos para análisis y reportes
class AnalyticsDocument(MongoBaseModel):
    """Datos de análisis agregados"""

    # Información básica
    metric_name: str
    metric_value: Any
    period: str  # daily, weekly, monthly, yearly
    period_date: datetime

    # Dimensiones
    dimensions: Dict[str, Any] = {}  # tour_id, country, device_type, etc.

    # Metadatos
    calculation_method: str
    is_final: bool = False


class ReportDocument(MongoBaseModel):
    """Reportes generados"""

    # Información básica
    report_name: str
    report_type: str  # bookings, revenue, users, tours, etc.
    description: Optional[str] = None

    # Configuración
    parameters: Dict[str, Any] = {}
    filters: Dict[str, Any] = {}

    # Datos del reporte
    data: Dict[str, Any] = {}
    summary: Dict[str, Any] = {}

    # Estado
    status: str = "generating"  # generating, completed, failed
    generated_at: Optional[datetime] = None

    # Información adicional
    generated_by: Optional[str] = None
    file_path: Optional[str] = None  # Si se exporta a archivo


# Tipos para usar en el código
MediaContentDict = dict
MediaAlbumDict = dict
Project360Dict = dict
SocialMediaPostDict = dict
MarketingCampaignDict = dict
UserActivityDict = dict
SystemLogDict = dict
NotificationDict = dict
ChatMessageDict = dict
SearchQueryDict = dict
ConfigurationDict = dict
ContentBlockDict = dict
AnalyticsDict = dict
ReportDict = dict