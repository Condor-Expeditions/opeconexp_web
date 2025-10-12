"""
URLs específicas para la aplicación de gestión de medios
"""

from django.urls import path
from .api import router

urlpatterns = [
    path("", router.urls),  # Todas las rutas del router de medios
]