from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
import uuid


class User(AbstractUser):
    """Usuario personalizado que extiende el modelo base de Django"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone = models.CharField(_("Teléfono"), max_length=20, blank=True)
    date_of_birth = models.DateField(_("Fecha de nacimiento"), null=True, blank=True)
    nationality = models.CharField(_("Nacionalidad"), max_length=100, blank=True)
    emergency_contact_name = models.CharField(_("Contacto de emergencia"), max_length=200, blank=True)
    emergency_contact_phone = models.CharField(_("Teléfono de emergencia"), max_length=20, blank=True)
    medical_conditions = models.TextField(_("Condiciones médicas"), blank=True)
    dietary_restrictions = models.TextField(_("Restricciones alimentarias"), blank=True)

    # Información de perfil turístico
    preferred_activities = models.JSONField(_("Actividades preferidas"), default=list, blank=True)
    experience_level = models.CharField(_("Nivel de experiencia"), max_length=20,
                                       choices=[
                                           ('beginner', 'Principiante'),
                                           ('intermediate', 'Intermedio'),
                                           ('advanced', 'Avanzado'),
                                           ('expert', 'Experto')
                                       ], blank=True)
    languages_spoken = models.JSONField(_("Idiomas hablados"), default=list, blank=True)

    # Configuración de privacidad
    profile_visibility = models.CharField(_("Visibilidad del perfil"), max_length=20,
                                         choices=[
                                             ('public', 'Público'),
                                             ('friends', 'Solo contactos'),
                                             ('private', 'Privado')
                                         ], default='public')

    # Información de fidelización
    loyalty_points = models.IntegerField(_("Puntos de fidelidad"), default=0)
    total_trips = models.IntegerField(_("Total de viajes"), default=0)
    member_since = models.DateField(_("Miembro desde"), auto_now_add=True)

    # Configuración de notificaciones
    email_notifications = models.BooleanField(_("Notificaciones por email"), default=True)
    sms_notifications = models.BooleanField(_("Notificaciones por SMS"), default=False)
    marketing_emails = models.BooleanField(_("Emails de marketing"), default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Usuario")
        verbose_name_plural = _("Usuarios")
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"


class UserProfile(models.Model):
    """Perfil adicional del usuario con información detallada"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')

    # Información personal adicional
    bio = models.TextField(_("Biografía"), blank=True)
    avatar = models.ImageField(_("Avatar"), upload_to='avatars/', null=True, blank=True)
    cover_photo = models.ImageField(_("Foto de portada"), upload_to='covers/', null=True, blank=True)

    # Información de ubicación
    address = models.TextField(_("Dirección"), blank=True)
    city = models.CharField(_("Ciudad"), max_length=100, blank=True)
    country = models.CharField(_("País"), max_length=100, blank=True)
    postal_code = models.CharField(_("Código postal"), max_length=20, blank=True)

    # Información profesional
    occupation = models.CharField(_("Ocupación"), max_length=100, blank=True)
    company = models.CharField(_("Empresa"), max_length=100, blank=True)
    website = models.URLField(_("Sitio web"), blank=True)

    # Redes sociales
    facebook = models.URLField(_("Facebook"), blank=True)
    instagram = models.URLField(_("Instagram"), blank=True)
    twitter = models.URLField(_("Twitter"), blank=True)
    linkedin = models.URLField(_("LinkedIn"), blank=True)

    # Preferencias de viaje
    travel_style = models.JSONField(_("Estilo de viaje"), default=list, blank=True)
    budget_preference = models.CharField(_("Presupuesto preferido"), max_length=20,
                                       choices=[
                                           ('budget', 'Económico'),
                                           ('comfort', 'Confort'),
                                           ('luxury', 'Lujo')
                                       ], blank=True)

    # Información de emergencia adicional
    blood_type = models.CharField(_("Tipo de sangre"), max_length=5, blank=True)
    allergies = models.TextField(_("Alergias"), blank=True)
    medications = models.TextField(_("Medicamentos"), blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Perfil de usuario")
        verbose_name_plural = _("Perfiles de usuario")

    def __str__(self):
        return f"Perfil de {self.user.get_full_name()}"


class UserActivity(models.Model):
    """Registro de actividades del usuario en la plataforma"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')

    activity_type = models.CharField(_("Tipo de actividad"), max_length=50, choices=[
        ('login', 'Inicio de sesión'),
        ('booking', 'Reserva realizada'),
        ('review', 'Reseña publicada'),
        ('profile_update', 'Perfil actualizado'),
        ('password_change', 'Contraseña cambiada'),
        ('payment', 'Pago realizado'),
        ('cancellation', 'Cancelación'),
    ])

    description = models.TextField(_("Descripción"))
    metadata = models.JSONField(_("Metadatos"), default=dict, blank=True)
    ip_address = models.GenericIPAddressField(_("Dirección IP"), null=True, blank=True)
    user_agent = models.TextField(_("Agente de usuario"), blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("Actividad de usuario")
        verbose_name_plural = _("Actividades de usuario")
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.activity_type} - {self.created_at}"


class UserPreference(models.Model):
    """Preferencias específicas del usuario"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preferences')

    # Preferencias de comunicación
    preferred_language = models.CharField(_("Idioma preferido"), max_length=10, default='es')
    timezone = models.CharField(_("Zona horaria"), max_length=50, default='America/Guayaquil')
    currency = models.CharField(_("Moneda preferida"), max_length=3, default='USD')

    # Preferencias de notificación
    booking_reminders = models.BooleanField(_("Recordatorios de reserva"), default=True)
    promotional_emails = models.BooleanField(_("Emails promocionales"), default=True)
    sms_updates = models.BooleanField(_("Actualizaciones por SMS"), default=False)
    push_notifications = models.BooleanField(_("Notificaciones push"), default=True)

    # Preferencias de privacidad
    share_booking_history = models.BooleanField(_("Compartir historial de reservas"), default=False)
    allow_marketing_contact = models.BooleanField(_("Permitir contacto de marketing"), default=True)
    data_collection_consent = models.BooleanField(_("Consentimiento de recopilación de datos"), default=True)

    # Configuración de accesibilidad
    high_contrast = models.BooleanField(_("Alto contraste"), default=False)
    large_text = models.BooleanField(_("Texto grande"), default=False)
    reduced_motion = models.BooleanField(_("Movimiento reducido"), default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Preferencia de usuario")
        verbose_name_plural = _("Preferencias de usuario")

    def __str__(self):
        return f"Preferencias de {self.user.email}"
