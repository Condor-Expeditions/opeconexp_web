"""
URLs específicas para la aplicación de pagos
"""

from django.urls import path
from .api import router

urlpatterns = [
    path("", router.urls),  # Todas las rutas del router de pagos
]