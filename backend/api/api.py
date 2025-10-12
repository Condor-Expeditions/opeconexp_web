"""
Django Ninja API router for Condor Expeditions
"""
from ninja import NinjaAPI

# Create the main API instance
api = NinjaAPI(
    title="Condor Expeditions API",
    version="1.0.0",
    description="API for Condor Expeditions tourism platform",
)

# Import and add routers from different apps
from users.api import router as users_router

# Add the users/auth router to the main API
api.add_router("/auth/", users_router)

# You can add more routers here as needed
# api.add_router("/tours/", tours_router)
# api.add_router("/bookings/", bookings_router)