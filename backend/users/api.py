"""
API Router para Autenticación y Gestión de Usuarios

Sistema completo de autenticación con registro, login, recuperación de contraseña,
gestión de perfiles y permisos.
"""

import uuid
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import jwt
import bcrypt
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.crypto import get_random_string
from django.utils import timezone
from ninja import Router, Schema, Form
from ninja.security import django_auth
from django.shortcuts import get_object_or_404
from .models import User, UserProfile, UserPreference, UserActivity

# Crear router para usuarios y autenticación
router = Router(tags=["Authentication"])

# Esquemas de entrada/salida
class UserRegisterSchema(Schema):
    """Esquema para registro de usuarios"""
    email: str
    password: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    nationality: Optional[str] = None

class UserLoginSchema(Schema):
    """Esquema para login de usuarios"""
    email: str
    password: str

class UserResponseSchema(Schema):
    """Esquema de respuesta de usuario"""
    id: str
    email: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    is_active: bool
    is_staff: bool
    date_joined: str
    last_login: Optional[str] = None

class TokenResponseSchema(Schema):
    """Esquema de respuesta de token"""
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    expires_in: int = 3600  # 1 hora
    user: UserResponseSchema

class PasswordResetRequestSchema(Schema):
    """Esquema para solicitar recuperación de contraseña"""
    email: str

class PasswordResetConfirmSchema(Schema):
    """Esquema para confirmar recuperación de contraseña"""
    token: str
    new_password: str

class ProfileUpdateSchema(Schema):
    """Esquema para actualizar perfil"""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    nationality: Optional[str] = None
    bio: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    occupation: Optional[str] = None
    website: Optional[str] = None

class ChangePasswordSchema(Schema):
    """Esquema para cambiar contraseña"""
    current_password: str
    new_password: str

# Utilidades para manejo de tokens JWT
class JWTHandler:
    """Manejador de tokens JWT"""

    @staticmethod
    def create_access_token(user_id: str) -> str:
        """Crear token de acceso"""
        payload = {
            'user_id': user_id,
            'type': 'access',
            'exp': datetime.utcnow() + timedelta(hours=1),
            'iat': datetime.utcnow()
        }
        return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

    @staticmethod
    def create_refresh_token(user_id: str) -> str:
        """Crear token de refresco"""
        payload = {
            'user_id': user_id,
            'type': 'refresh',
            'exp': datetime.utcnow() + timedelta(days=7),
            'iat': datetime.utcnow()
        }
        return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

    @staticmethod
    def verify_token(token: str) -> Optional[Dict]:
        """Verificar y decodificar token"""
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

# Funciones auxiliares
def hash_password(password: str) -> str:
    """Hash de contraseña usando bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Verificar contraseña contra hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def generate_password_reset_token() -> str:
    """Generar token para recuperación de contraseña"""
    return get_random_string(length=64)

def log_user_activity(user: User, activity_type: str, description: str, ip_address: str = None, metadata: Dict = None):
    """Registrar actividad del usuario"""
    UserActivity.objects.create(
        user=user,
        activity_type=activity_type,
        description=description,
        ip_address=ip_address,
        metadata=metadata or {}
    )

# Endpoints de autenticación

@router.post("/register", response={201: UserResponseSchema, 400: dict})
def register_user(request, payload: UserRegisterSchema):
    """Registrar nuevo usuario"""

    # Verificar si el email ya existe
    if User.objects.filter(email=payload.email).exists():
        return 400, {"message": "El email ya está registrado"}

    try:
        # Crear usuario
        user = User.objects.create_user(
            email=payload.email,
            password=payload.password,
            first_name=payload.first_name,
            last_name=payload.last_name,
            phone=payload.phone,
            date_of_birth=payload.date_of_birth if payload.date_of_birth else None,
            nationality=payload.nationality
        )

        # Crear perfil básico
        UserProfile.objects.create(user=user)

        # Crear preferencias básicas
        UserPreference.objects.create(user=user)

        # Log de actividad
        log_user_activity(
            user=user,
            activity_type='registration',
            description='Usuario registrado exitosamente',
            ip_address=request.META.get('REMOTE_ADDR'),
            metadata={'registration_method': 'email'}
        )

        return 201, UserResponseSchema.from_orm(user)

    except Exception as e:
        return 400, {"message": "Error al crear usuario", "error": str(e)}

@router.post("/login", response={200: TokenResponseSchema, 401: dict})
def login_user(request, payload: UserLoginSchema):
    """Iniciar sesión de usuario"""

    try:
        user = User.objects.get(email=payload.email)

        if not user.is_active:
            return 401, {"message": "Cuenta desactivada"}

        if not verify_password(payload.password, user.password):
            return 401, {"message": "Credenciales inválidas"}

        # Actualizar último login
        user.last_login = timezone.now()
        user.save()

        # Crear tokens
        access_token = JWTHandler.create_access_token(str(user.id))
        refresh_token = JWTHandler.create_refresh_token(str(user.id))

        # Log de actividad
        log_user_activity(
            user=user,
            activity_type='login',
            description='Inicio de sesión exitoso',
            ip_address=request.META.get('REMOTE_ADDR'),
            metadata={'login_method': 'password'}
        )

        return 200, {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "Bearer",
            "expires_in": 3600,
            "user": UserResponseSchema.from_orm(user)
        }

    except User.DoesNotExist:
        return 401, {"message": "Credenciales inválidas"}

@router.post("/refresh", response={200: TokenResponseSchema, 401: dict})
def refresh_token(request, refresh_token: str = Form(...)):
    """Refrescar token de acceso"""

    # Verificar token de refresco
    payload = JWTHandler.verify_token(refresh_token)
    if not payload or payload.get('type') != 'refresh':
        return 401, {"message": "Token de refresco inválido"}

    try:
        user = User.objects.get(id=payload['user_id'], is_active=True)

        # Crear nuevos tokens
        access_token = JWTHandler.create_access_token(str(user.id))
        new_refresh_token = JWTHandler.create_refresh_token(str(user.id))

        return 200, {
            "access_token": access_token,
            "refresh_token": new_refresh_token,
            "token_type": "Bearer",
            "expires_in": 3600,
            "user": UserResponseSchema.from_orm(user)
        }

    except User.DoesNotExist:
        return 401, {"message": "Usuario no encontrado"}

@router.post("/logout")
def logout_user(request):
    """Cerrar sesión de usuario"""

    if request.user.is_authenticated:
        log_user_activity(
            user=request.user,
            activity_type='logout',
            description='Cierre de sesión',
            ip_address=request.META.get('REMOTE_ADDR')
        )

    return {"message": "Sesión cerrada exitosamente"}

@router.post("/password-reset-request", response={200: dict, 400: dict})
def request_password_reset(request, payload: PasswordResetRequestSchema):
    """Solicitar recuperación de contraseña"""

    try:
        user = User.objects.get(email=payload.email, is_active=True)

        # Generar token de recuperación
        reset_token = generate_password_reset_token()

        # Guardar token en el usuario (en producción usar tabla separada)
        user.userprofile.reset_token = reset_token
        user.userprofile.reset_token_expires = timezone.now() + timedelta(hours=1)
        user.userprofile.save()

        # Enviar email (simulado para desarrollo)
        try:
            send_mail(
                subject='Recuperación de contraseña - Condor Expeditions',
                message=f'Usa este código para recuperar tu contraseña: {reset_token}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=render_to_string('emails/password_reset.html', {
                    'user': user,
                    'reset_token': reset_token,
                    'reset_url': f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
                })
            )
        except Exception as e:
            # En desarrollo, solo loguear
            print(f"Email no enviado (desarrollo): {e}")

        return 200, {"message": "Email de recuperación enviado"}

    except User.DoesNotExist:
        # No revelar si el email existe o no por seguridad
        return 200, {"message": "Si el email existe, recibirás las instrucciones"}

@router.post("/password-reset-confirm", response={200: dict, 400: dict})
def confirm_password_reset(request, payload: PasswordResetConfirmSchema):
    """Confirmar recuperación de contraseña"""

    try:
        # Buscar usuario con token válido
        profile = UserProfile.objects.get(
            reset_token=payload.token,
            reset_token_expires__gt=timezone.now()
        )
        user = profile.user

        # Actualizar contraseña
        user.set_password(payload.new_password)
        user.save()

        # Limpiar token
        profile.reset_token = None
        profile.reset_token_expires = None
        profile.save()

        # Log de actividad
        log_user_activity(
            user=user,
            activity_type='password_reset',
            description='Contraseña recuperada exitosamente',
            ip_address=request.META.get('REMOTE_ADDR')
        )

        return 200, {"message": "Contraseña actualizada exitosamente"}

    except UserProfile.DoesNotExist:
        return 400, {"message": "Token inválido o expirado"}

# Endpoints de gestión de perfil

@router.get("/profile", response=dict)
def get_user_profile(request):
    """Obtener perfil completo del usuario"""

    if not request.user.is_authenticated:
        return {"message": "Authentication required"}, 401

    user = request.user
    profile = user.profile
    preferences = user.preferences

    return {
        "user": UserResponseSchema.from_orm(user),
        "profile": {
            "bio": profile.bio,
            "avatar": profile.avatar.url if profile.avatar else None,
            "address": profile.address,
            "city": profile.city,
            "country": profile.country,
            "occupation": profile.occupation,
            "website": profile.website,
            "social_media": {
                "facebook": profile.facebook,
                "instagram": profile.instagram,
                "twitter": profile.twitter,
                "linkedin": profile.linkedin
            }
        },
        "preferences": {
            "preferred_language": preferences.preferred_language,
            "timezone": preferences.timezone,
            "currency": preferences.currency,
            "email_notifications": preferences.email_notifications,
            "sms_notifications": preferences.sms_notifications,
            "marketing_emails": preferences.marketing_emails
        }
    }

@router.put("/profile", response={200: dict, 400: dict})
def update_user_profile(request, payload: ProfileUpdateSchema):
    """Actualizar perfil de usuario"""

    if not request.user.is_authenticated:
        return {"message": "Authentication required"}, 401

    try:
        user = request.user
        profile = user.profile

        # Actualizar campos del usuario
        for field, value in payload.dict(exclude_unset=True).items():
            if hasattr(user, field) and value is not None:
                setattr(user, field, value)

        # Actualizar campos del perfil
        profile_fields = ['bio', 'address', 'city', 'country', 'occupation', 'website']
        for field in profile_fields:
            if hasattr(payload, field) and getattr(payload, field) is not None:
                setattr(profile, field, getattr(payload, field))

        user.save()
        profile.save()

        # Log de actividad
        log_user_activity(
            user=user,
            activity_type='profile_update',
            description='Perfil actualizado',
            ip_address=request.META.get('REMOTE_ADDR')
        )

        return 200, {"message": "Perfil actualizado exitosamente"}

    except Exception as e:
        return 400, {"message": "Error al actualizar perfil", "error": str(e)}

@router.post("/change-password", response={200: dict, 400: dict})
def change_password(request, payload: ChangePasswordSchema):
    """Cambiar contraseña del usuario"""

    if not request.user.is_authenticated:
        return {"message": "Authentication required"}, 401

    user = request.user

    # Verificar contraseña actual
    if not verify_password(payload.current_password, user.password):
        return 400, {"message": "Contraseña actual incorrecta"}

    # Actualizar contraseña
    user.set_password(payload.new_password)
    user.save()

    # Log de actividad
    log_user_activity(
        user=user,
        activity_type='password_change',
        description='Contraseña cambiada exitosamente',
        ip_address=request.META.get('REMOTE_ADDR')
    )

    return 200, {"message": "Contraseña cambiada exitosamente"}

@router.get("/activity", response=list)
def get_user_activity(request, limit: int = 20):
    """Obtener actividad reciente del usuario"""

    if not request.user.is_authenticated:
        return {"message": "Authentication required"}, 401

    activities = UserActivity.objects.filter(
        user=request.user
    ).order_by('-created_at')[:limit]

    return [
        {
            "id": str(activity.id),
            "activity_type": activity.activity_type,
            "description": activity.description,
            "created_at": activity.created_at.isoformat(),
            "ip_address": activity.ip_address
        }
        for activity in activities
    ]

# Endpoint público para verificar si email existe
@router.get("/check-email", response=dict)
def check_email_exists(request, email: str):
    """Verificar si un email ya está registrado (endpoint público)"""

    exists = User.objects.filter(email=email).exists()
    return {"exists": exists}

# Middleware para verificar autenticación en endpoints protegidos
class JWTAuth:
    """Autenticación JWT personalizada"""

    def __call__(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return {"message": "Token de acceso requerido"}, 401

        token = auth_header.split(' ')[1]
        payload = JWTHandler.verify_token(token)

        if not payload or payload.get('type') != 'access':
            return {"message": "Token inválido"}, 401

        try:
            user = User.objects.get(id=payload['user_id'], is_active=True)
            request.user = user
            return None
        except User.DoesNotExist:
            return {"message": "Usuario no encontrado"}, 401

# Aplicar autenticación JWT a endpoints específicos
@router.get("/protected", auth=JWTAuth())
def protected_endpoint(request):
    """Endpoint protegido con JWT"""

    return {
        "message": "Acceso concedido",
        "user": request.user.email,
        "user_id": str(request.user.id)
    }