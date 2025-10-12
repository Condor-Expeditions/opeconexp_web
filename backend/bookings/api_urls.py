"""
URLs específicas para la aplicación de reservas
"""

from django.urls import path
from .api import router

urlpatterns = [
    path("", router.urls),  # Todas las rutas del router de reservas
]