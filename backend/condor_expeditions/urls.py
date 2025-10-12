"""
URL configuration for condor_expeditions project.

Condor Expeditions - API URLs configuration
"""

from django.contrib import admin
from django.urls import path, include
from .admin import admin_site
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Admin interface personalizado
    path("admin/", admin_site.urls),

    # Django Ninja API (includes all API routes and documentation)
    path("api/", include("api.urls")),

    # Legacy API v1 routes (to be migrated to Django Ninja)
    # path("api/v1/", include([
    #     # Tours and expeditions
    #     path("tours/", include("tours.api_urls")),
    #
    #     # Bookings and reservations
    #     path("bookings/", include("bookings.api_urls")),
    #
    #     # Media management
    #     path("media/", include("media_manager.api_urls")),
    #
    #     # Communities
    #     path("communities/", include("communities.api_urls")),
    #
    #     # Staff management
    #     path("staff/", include("staff.api_urls")),
    #
    #     # Payments
    #     path("payments/", include("payments.api_urls")),
    # ])),

    # Health check endpoint (if exists)
    # path("health/", include("core.urls")),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
