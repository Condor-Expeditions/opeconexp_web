"""
URLs específicas para la aplicación de gestión de personal
"""

from django.urls import path
from .api import router

urlpatterns = [
    path("", router.urls),  # Todas las rutas del router de staff
]