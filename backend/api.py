"""
API Router principal usando Django Ninja

Este archivo configura la API REST completa para Condor Expeditions
utilizando Django Ninja para una mejor experiencia de desarrollo.
"""

from ninja import NinjaAPI, Schema
from ninja.security import django_auth
from django.conf import settings
from django.http import JsonResponse
import logging

# Configurar logger
logger = logging.getLogger('condor_expeditions')

# Crear instancia principal de la API
api = NinjaAPI(
    title="Condor Expeditions API",
    description="API completa para la plataforma de turismo Condor Expeditions",
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json",
    auth=django_auth,  # Requiere autenticación por defecto
)

# Esquemas base para respuestas estándar
class SuccessResponse(Schema):
    success: bool = True
    message: str
    data: dict = None

class ErrorResponse(Schema):
    success: bool = False
    message: str
    errors: dict = None
    error_code: str = None

# Health check endpoint público
@api.get("/health", auth=None)
def health_check(request):
    """Endpoint público para verificar el estado de la API"""
    return JsonResponse({
        "status": "healthy",
        "service": "Condor Expeditions API",
        "version": "1.0.0",
        "timestamp": settings.CURRENT_TIME if hasattr(settings, 'CURRENT_TIME') else None
    })

# Información de la API
@api.get("/info", auth=None)
def api_info(request):
    """Información pública sobre la API"""
    return {
        "name": "Condor Expeditions API",
        "version": "1.0.0",
        "description": "Plataforma integral de turismo y ecommerce",
        "features": [
            "Sistema de reservas",
            "Gestión de tours",
            "Galería 360°",
            "CRM de comunidades",
            "Sistema de pagos",
            "Dashboard administrativo"
        ],
        "documentation": "/api/docs"
    }

# Middleware para logging de requests
@api.middleware("http")
async def log_requests(request, call_next):
    """Middleware para logging de todas las requests"""
    start_time = settings.CURRENT_TIME if hasattr(settings, 'CURRENT_TIME') else None

    # Log de la request
    logger.info(f"API Request: {request.method} {request.path} from {request.META.get('REMOTE_ADDR', 'unknown')}")

    response = await call_next(request)

    # Log de la response
    logger.info(f"API Response: {response.status_code} for {request.method} {request.path}")

    return response

# Manejo global de errores
@api.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Manejador global de excepciones"""
    logger.error(f"Unhandled exception in {request.path}: {str(exc)}", exc_info=True)

    return api.create_response(
        request,
        {"success": False, "message": "Error interno del servidor", "error_code": "INTERNAL_ERROR"},
        status=500
    )

# Importar y registrar todos los routers de las apps
def register_api_routers():
    """Registrar todos los routers de las aplicaciones"""

    try:
        # Importar routers de cada app
        from users.api import router as users_router
        from tours.api import router as tours_router
        from bookings.api import router as bookings_router
        from media_manager.api import router as media_router
        from communities.api import router as communities_router
        from staff.api import router as staff_router
        from payments.api import router as payments_router

        # Registrar routers con prefijos
        api.add_router("/auth", users_router, tags=["Authentication"])
        api.add_router("/tours", tours_router, tags=["Tours"])
        api.add_router("/bookings", bookings_router, tags=["Bookings"])
        api.add_router("/media", media_router, tags=["Media"])
        api.add_router("/communities", communities_router, tags=["Communities"])
        api.add_router("/staff", staff_router, tags=["Staff"])
        api.add_router("/payments", payments_router, tags=["Payments"])

        logger.info("All API routers registered successfully")

    except ImportError as e:
        logger.warning(f"Could not import some API routers: {e}")
    except Exception as e:
        logger.error(f"Error registering API routers: {e}")

# Registrar routers al importar
register_api_routers()

# Exportar la instancia de la API
__all__ = ['api']