"""
API Router para Gestión de Medios y Contenido 360°

Sistema completo para gestión de:
- Imágenes y videos
- Proyectos 360°
- Tours virtuales
- Álbumes de medios
- Procesamiento automático
"""

import os
from typing import List, Optional, Dict, Any
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from ninja import Router, Schema, Form, File
from ninja.files import UploadedFile
from ninja.pagination import paginate
from .models import MediaAlbum, MediaFile, Media360Project, Media360Scene

# Crear router para medios
router = Router(tags=["Media"])

# Esquemas de entrada/salida
class MediaAlbumCreateSchema(Schema):
    """Esquema para crear álbum"""
    title: str
    description: Optional[str] = None
    visibility: str = "public"
    category: str = "general"
    tour_id: Optional[str] = None
    booking_id: Optional[str] = None

class MediaAlbumResponseSchema(Schema):
    """Esquema de respuesta de álbum"""
    id: str
    title: str
    slug: str
    description: Optional[str] = None
    visibility: str
    category: str
    cover_image: Optional[str] = None
    total_files: int = 0
    view_count: int = 0
    is_featured: bool = False
    created_at: str

class MediaFileUploadSchema(Schema):
    """Esquema para subir archivo"""
    album_id: str
    name: Optional[str] = None
    description: Optional[str] = None
    alt_text: Optional[str] = None
    is_featured: bool = False
    sort_order: int = 0

class MediaFileResponseSchema(Schema):
    """Esquema de respuesta de archivo"""
    id: str
    name: str
    description: Optional[str] = None
    file_url: str
    file_type: str
    file_size: int
    width: Optional[int] = None
    height: Optional[int] = None
    thumbnail_url: Optional[str] = None
    is_featured: bool = False
    view_count: int = 0
    created_at: str

class Project360CreateSchema(Schema):
    """Esquema para crear proyecto 360°"""
    title: str
    description: Optional[str] = None
    project_type: str
    tour_id: Optional[str] = None
    location: Optional[str] = None
    visibility: str = "public"

class Project360ResponseSchema(Schema):
    """Esquema de respuesta de proyecto 360°"""
    id: str
    title: str
    slug: str
    description: Optional[str] = None
    project_type: str
    status: str
    visibility: str
    preview_image_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    view_count: int = 0
    total_scenes: int = 0
    created_at: str

# Servicios para procesamiento de medios
class MediaProcessingService:
    """Servicio para procesamiento de archivos multimedia"""

    @staticmethod
    def process_image(file_path: str, file_name: str) -> Dict:
        """Procesar imagen subida"""

        try:
            from PIL import Image
            import hashlib

            # Abrir imagen
            with Image.open(file_path) as img:
                # Obtener dimensiones
                width, height = img.size

                # Crear hash único
                file_hash = hashlib.md5(img.tobytes()).hexdigest()

                # Crear miniaturas
                thumbnail_sizes = [
                    (300, 300),  # Cuadrada
                    (800, 600),  # Web
                    (1920, 1080)  # Full HD
                ]

                thumbnails = {}
                for size in thumbnail_sizes:
                    thumbnail = img.copy()
                    thumbnail.thumbnail(size, Image.Resampling.LANCZOS)

                    # Crear nombre único para miniatura
                    thumb_name = f"thumb_{size[0]}x{size[1]}_{file_hash}_{file_name}"
                    thumb_path = os.path.join(settings.MEDIA_ROOT, 'thumbnails', thumb_name)

                    # Crear directorio si no existe
                    os.makedirs(os.path.dirname(thumb_path), exist_ok=True)

                    # Guardar miniatura
                    thumbnail.save(thumb_path, optimize=True, quality=85)
                    thumbnails[f"{size[0]}x{size[1]}"] = f"thumbnails/{thumb_name}"

                return {
                    'success': True,
                    'width': width,
                    'height': height,
                    'thumbnails': thumbnails,
                    'file_hash': file_hash
                }

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    @staticmethod
    def process_360_image(file_path: str, file_name: str) -> Dict:
        """Procesar imagen panorámica 360°"""

        try:
            # Aquí se integraría con herramientas especializadas como:
            # - Pannellum
            # - Marzipano
            # - Krpano

            # Por ahora, procesar como imagen normal
            result = MediaProcessingService.process_image(file_path, file_name)

            if result['success']:
                result['is_360'] = True
                result['projection_type'] = 'equirectangular'

            return result

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

# Endpoints de la API

@router.post("/albums", response={201: MediaAlbumResponseSchema, 400: dict})
def create_album(request, payload: MediaAlbumCreateSchema):
    """Crear nuevo álbum de medios"""

    if not request.user.is_authenticated:
        return 401, {"message": "Authentication required"}

    try:
        album = MediaAlbum.objects.create(
            title=payload.title,
            description=payload.description,
            visibility=payload.visibility,
            category=payload.category,
            tour_id=payload.tour_id,
            booking_id=payload.booking_id,
            created_by=request.user
        )

        return 201, MediaAlbumResponseSchema.from_orm(album)

    except Exception as e:
        return 400, {"message": "Error al crear álbum", "error": str(e)}

@router.get("/albums", response=List[MediaAlbumResponseSchema])
@paginate
def list_albums(request, visibility: str = "public", category: Optional[str] = None):
    """Listar álbumes de medios"""

    queryset = MediaAlbum.objects.filter(visibility=visibility, is_active=True)

    if category:
        queryset = queryset.filter(category=category)

    albums = queryset.order_by('-created_at')

    return [
        MediaAlbumResponseSchema(
            id=str(album.id),
            title=album.title,
            slug=album.slug,
            description=album.description,
            visibility=album.visibility,
            category=album.category,
            cover_image=album.cover_image.url if album.cover_image else None,
            total_files=album.files.count(),
            view_count=album.view_count,
            is_featured=album.is_featured,
            created_at=album.created_at.isoformat()
        )
        for album in albums
    ]

@router.get("/albums/{album_id}", response={200: MediaAlbumResponseSchema, 404: dict})
def get_album(request, album_id: str):
    """Obtener álbum específico"""

    try:
        album = get_object_or_404(MediaAlbum, id=album_id, is_active=True)

        # Incrementar contador de vistas
        album.view_count += 1
        album.save()

        return 200, MediaAlbumResponseSchema(
            id=str(album.id),
            title=album.title,
            slug=album.slug,
            description=album.description,
            visibility=album.visibility,
            category=album.category,
            cover_image=album.cover_image.url if album.cover_image else None,
            total_files=album.files.count(),
            view_count=album.view_count,
            is_featured=album.is_featured,
            created_at=album.created_at.isoformat()
        )

    except MediaAlbum.DoesNotExist:
        return 404, {"message": "Álbum no encontrado"}

@router.post("/albums/{album_id}/upload", response={201: MediaFileResponseSchema, 400: dict})
def upload_media_file(request, album_id: str, file: UploadedFile = File(...), metadata: str = Form(None)):
    """Subir archivo de medios a álbum"""

    if not request.user.is_authenticated:
        return 401, {"message": "Authentication required"}

    try:
        album = get_object_or_404(MediaAlbum, id=album_id)

        # Parsear metadatos si se proporcionan
        file_metadata = {}
        if metadata:
            try:
                file_metadata = json.loads(metadata)
            except:
                pass

        # Guardar archivo
        file_path = default_storage.save(
            f"media/{album_id}/{file.name}",
            ContentFile(file.read())
        )

        # Procesar archivo según tipo
        file_type = MediaProcessingService.get_file_type(file.content_type)

        if file_type == 'image':
            process_result = MediaProcessingService.process_image(
                os.path.join(settings.MEDIA_ROOT, file_path),
                file.name
            )
        elif file_type == '360_image':
            process_result = MediaProcessingService.process_360_image(
                os.path.join(settings.MEDIA_ROOT, file_path),
                file.name
            )
        else:
            process_result = {'success': True}

        # Crear registro en base de datos
        media_file = MediaFile.objects.create(
            name=file_metadata.get('name', file.name),
            description=file_metadata.get('description', ''),
            alt_text=file_metadata.get('alt_text', ''),
            album=album,
            uploaded_by=request.user,
            file=file_path,
            file_type=file_type,
            file_size=file.size,
            mime_type=file.content_type,
            width=process_result.get('width'),
            height=process_result.get('height'),
            thumbnail=process_result.get('thumbnails', {}).get('300x300'),
            is_processed=process_result.get('success', False),
            processing_error=process_result.get('error'),
            is_featured=file_metadata.get('is_featured', False),
            sort_order=file_metadata.get('sort_order', 0)
        )

        return 201, MediaFileResponseSchema(
            id=str(media_file.id),
            name=media_file.name,
            description=media_file.description,
            file_url=media_file.file.url,
            file_type=media_file.file_type,
            file_size=media_file.file_size,
            width=media_file.width,
            height=media_file.height,
            thumbnail_url=media_file.thumbnail.url if media_file.thumbnail else None,
            is_featured=media_file.is_featured,
            view_count=media_file.view_count,
            created_at=media_file.created_at.isoformat()
        )

    except Exception as e:
        return 400, {"message": "Error al subir archivo", "error": str(e)}

@router.get("/albums/{album_id}/files", response=List[MediaFileResponseSchema])
@paginate
def list_album_files(request, album_id: str):
    """Listar archivos de un álbum"""

    try:
        album = get_object_or_404(MediaAlbum, id=album_id, is_active=True)
        files = album.files.order_by('sort_order', 'created_at')

        return [
            MediaFileResponseSchema(
                id=str(file.id),
                name=file.name,
                description=file.description,
                file_url=file.file.url,
                file_type=file.file_type,
                file_size=file.file_size,
                width=file.width,
                height=file.height,
                thumbnail_url=file.thumbnail.url if file.thumbnail else None,
                is_featured=file.is_featured,
                view_count=file.view_count,
                created_at=file.created_at.isoformat()
            )
            for file in files
        ]

    except MediaAlbum.DoesNotExist:
        return []

@router.post("/projects/360", response={201: Project360ResponseSchema, 400: dict})
def create_360_project(request, payload: Project360CreateSchema):
    """Crear proyecto 360°"""

    if not request.user.is_authenticated:
        return 401, {"message": "Authentication required"}

    try:
        project = Media360Project.objects.create(
            title=payload.title,
            description=payload.description,
            project_type=payload.project_type,
            tour_id=payload.tour_id,
            location=payload.location,
            visibility=payload.visibility,
            created_by=request.user
        )

        return 201, Project360ResponseSchema.from_orm(project)

    except Exception as e:
        return 400, {"message": "Error al crear proyecto 360°", "error": str(e)}

@router.get("/projects/360", response=List[Project360ResponseSchema])
@paginate
def list_360_projects(request, project_type: Optional[str] = None):
    """Listar proyectos 360°"""

    queryset = Media360Project.objects.filter(status__in=['ready', 'published'])

    if project_type:
        queryset = queryset.filter(project_type=project_type)

    projects = queryset.order_by('-created_at')

    return [
        Project360ResponseSchema(
            id=str(project.id),
            title=project.title,
            slug=project.slug,
            description=project.description,
            project_type=project.project_type,
            status=project.status,
            visibility=project.visibility,
            preview_image_url=project.preview_image.url if project.preview_image else None,
            thumbnail_url=project.thumbnail.url if project.thumbnail else None,
            view_count=project.view_count,
            total_scenes=project.scenes.count(),
            created_at=project.created_at.isoformat()
        )
        for project in projects
    ]

@router.get("/projects/360/{project_id}", response={200: dict, 404: dict})
def get_360_project(request, project_id: str):
    """Obtener proyecto 360° completo"""

    try:
        project = get_object_or_404(
            Media360Project.objects.prefetch_related('scenes'),
            id=project_id,
            status__in=['ready', 'published']
        )

        # Incrementar contador de vistas
        project.view_count += 1
        project.save()

        return 200, {
            "id": str(project.id),
            "title": project.title,
            "description": project.description,
            "project_type": project.project_type,
            "status": project.status,
            "initial_view": project.initial_view,
            "hotspots": project.hotspots,
            "preview_image_url": project.preview_image.url if project.preview_image else None,
            "scenes": [
                {
                    "id": str(scene.id),
                    "name": scene.name,
                    "panorama_url": scene.panorama_file.url,
                    "preview_url": scene.preview_file.url if scene.preview_file else None,
                    "initial_yaw": scene.initial_yaw,
                    "initial_pitch": scene.initial_pitch,
                    "initial_fov": scene.initial_fov,
                    "hotspots": scene.hotspots
                }
                for scene in project.scenes.order_by('sort_order')
            ],
            "created_at": project.created_at.isoformat()
        }

    except Media360Project.DoesNotExist:
        return 404, {"message": "Proyecto 360° no encontrado"}

@router.post("/projects/360/{project_id}/scenes", response={201: dict, 400: dict})
def add_360_scene(request, project_id: str, panorama_file: UploadedFile = File(...), scene_data: str = Form(None)):
    """Agregar escena a proyecto 360°"""

    if not request.user.is_authenticated:
        return 401, {"message": "Authentication required"}

    try:
        project = get_object_or_404(Media360Project, id=project_id)

        # Parsear datos de escena
        scene_info = {}
        if scene_data:
            try:
                scene_info = json.loads(scene_data)
            except:
                pass

        # Guardar archivo panorámico
        file_path = default_storage.save(
            f"360/{project_id}/{panorama_file.name}",
            ContentFile(panorama_file.read())
        )

        # Crear escena
        scene = Media360Scene.objects.create(
            project=project,
            name=scene_info.get('name', f'Escena {project.scenes.count() + 1}'),
            description=scene_info.get('description', ''),
            panorama_file=file_path,
            initial_yaw=scene_info.get('initial_yaw', 0),
            initial_pitch=scene_info.get('initial_pitch', 0),
            initial_fov=scene_info.get('initial_fov', 75),
            width=scene_info.get('width', 4096),
            height=scene_info.get('height', 2048),
            file_size=panorama_file.size,
            sort_order=project.scenes.count()
        )

        return 201, {
            "message": "Escena agregada exitosamente",
            "scene_id": str(scene.id),
            "scene_name": scene.name
        }

    except Exception as e:
        return 400, {"message": "Error al agregar escena", "error": str(e)}

# Utilidades
@router.get("/utils/file-types", response=dict)
def get_supported_file_types(request):
    """Obtener tipos de archivo soportados"""

    return {
        "images": [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp"
        ],
        "videos": [
            "video/mp4",
            "video/webm",
            "video/ogg"
        ],
        "panoramas_360": [
            "image/jpeg",  # Para panoramas equirectangulares
            "image/png"
        ],
        "documents": [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ],
        "max_file_size": "100MB",
        "supported_formats": [
            "JPEG, PNG, GIF, WebP (imágenes)",
            "MP4, WebM (videos)",
            "PDF, DOC, DOCX (documentos)",
            "JPEG panorámico (360°)"
        ]
    }

# Estadísticas de medios
@router.get("/stats", response=dict)
def get_media_stats(request):
    """Obtener estadísticas de medios"""

    if not request.user.is_authenticated:
        return {}

    albums = MediaAlbum.objects.filter(is_active=True)
    files = MediaFile.objects.all()
    projects_360 = Media360Project.objects.filter(status__in=['ready', 'published'])

    return {
        "total_albums": albums.count(),
        "public_albums": albums.filter(visibility='public').count(),
        "total_files": files.count(),
        "total_size": files.aggregate(total=Sum('file_size'))['total'] or 0,
        "total_360_projects": projects_360.count(),
        "total_views": albums.aggregate(total=Sum('view_count'))['total'] or 0,
        "featured_albums": albums.filter(is_featured=True).count()
    }