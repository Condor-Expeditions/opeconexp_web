"""
URLs específicas para la documentación de la API
"""

from django.urls import path
from .api import api

urlpatterns = [
    # Django Ninja API - includes all routes and automatic documentation
    # This will be available at /api/ and includes:
    # - /api/docs - Swagger UI documentation
    # - /api/openapi.json - OpenAPI schema
    # - /api/auth/* - Authentication endpoints
    path("", api.urls),
]