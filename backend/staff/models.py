from django.db import models
from django.utils.translation import gettext_lazy as _
import uuid
from users.models import User


class Staff(models.Model):
    """Personal de la empresa"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='staff_profile')

    # Información personal
    employee_id = models.CharField(_("ID de empleado"), max_length=20, unique=True)
    hire_date = models.DateField(_("Fecha de contratación"))
    birth_date = models.DateField(_("Fecha de nacimiento"), null=True, blank=True)

    # Información de contacto adicional
    personal_email = models.EmailField(_("Email personal"), blank=True)
    emergency_contact_name = models.CharField(_("Contacto de emergencia"), max_length=200, blank=True)
    emergency_contact_phone = models.CharField(_("Teléfono de emergencia"), max_length=20, blank=True)
    emergency_contact_relationship = models.CharField(_("Relación"), max_length=50, blank=True)

    # Información profesional
    position = models.CharField(_("Posición"), max_length=100)
    department = models.CharField(_("Departamento"), max_length=100, blank=True)
    manager = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subordinates')

    # Estado laboral
    employment_status = models.CharField(_("Estado laboral"), max_length=20, choices=[
        ('active', 'Activo'),
        ('inactive', 'Inactivo'),
        ('on_leave', 'De licencia'),
        ('terminated', 'Terminado')
    ], default='active')

    employment_type = models.CharField(_("Tipo de empleo"), max_length=20, choices=[
        ('full_time', 'Tiempo completo'),
        ('part_time', 'Medio tiempo'),
        ('contractor', 'Contratista'),
        ('seasonal', 'Temporal')
    ], default='full_time')

    # Información salarial (encriptada o hasheada)
    salary_info = models.JSONField(_("Información salarial"), default=dict, blank=True)

    # Ubicación de trabajo
    work_location = models.CharField(_("Ubicación de trabajo"), max_length=200, blank=True)
    is_remote = models.BooleanField(_("Trabajo remoto"), default=False)

    # Información de contacto profesional
    work_phone = models.CharField(_("Teléfono laboral"), max_length=20, blank=True)
    work_email = models.EmailField(_("Email laboral"), blank=True)

    # Documentos
    contract_file = models.FileField(_("Archivo de contrato"), upload_to='staff/contracts/', null=True, blank=True)
    id_document = models.FileField(_("Documento de identidad"), upload_to='staff/ids/', null=True, blank=True)
    certifications = models.JSONField(_("Certificaciones"), default=list, blank=True)

    # Información adicional
    bio = models.TextField(_("Biografía profesional"), blank=True)
    photo = models.ImageField(_("Foto profesional"), upload_to='staff/photos/', null=True, blank=True)
    notes = models.TextField(_("Notas internas"), blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Empleado")
        verbose_name_plural = _("Empleados")
        ordering = ['user__first_name', 'user__last_name']

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.employee_id})"


class StaffRole(models.Model):
    """Roles y permisos del personal"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Información básica
    name = models.CharField(_("Nombre del rol"), max_length=100, unique=True)
    description = models.TextField(_("Descripción"), blank=True)
    is_active = models.BooleanField(_("Activo"), default=True)

    # Nivel jerárquico
    level = models.IntegerField(_("Nivel"), default=1, help_text="1 = más bajo, 10 = más alto")

    # Permisos específicos
    permissions = models.JSONField(_("Permisos"), default=dict, blank=True)

    # Configuración
    can_manage_users = models.BooleanField(_("Puede gestionar usuarios"), default=False)
    can_manage_bookings = models.BooleanField(_("Puede gestionar reservas"), default=False)
    can_manage_tours = models.BooleanField(_("Puede gestionar tours"), default=False)
    can_manage_staff = models.BooleanField(_("Puede gestionar personal"), default=False)
    can_manage_communities = models.BooleanField(_("Puede gestionar comunidades"), default=False)
    can_manage_content = models.BooleanField(_("Puede gestionar contenido"), default=False)
    can_view_reports = models.BooleanField(_("Puede ver reportes"), default=False)
    can_manage_finances = models.BooleanField(_("Puede gestionar finanzas"), default=False)

    # Límites y restricciones
    max_discount_percent = models.DecimalField(_("Máximo descuento (%)"), max_digits=5, decimal_places=2, default=10.00)
    can_approve_bookings = models.BooleanField(_("Puede aprobar reservas"), default=False)
    can_cancel_bookings = models.BooleanField(_("Puede cancelar reservas"), default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Rol de empleado")
        verbose_name_plural = _("Roles de empleados")
        ordering = ['level', 'name']

    def __str__(self):
        return self.name


class StaffRoleAssignment(models.Model):
    """Asignación de roles a empleados"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='role_assignments')
    role = models.ForeignKey(StaffRole, on_delete=models.CASCADE, related_name='assignments')

    # Información de la asignación
    assigned_date = models.DateField(_("Fecha de asignación"), auto_now_add=True)
    assigned_by = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True, related_name='role_assignments_made')

    # Estado
    is_active = models.BooleanField(_("Activo"), default=True)
    start_date = models.DateField(_("Fecha de inicio"), null=True, blank=True)
    end_date = models.DateField(_("Fecha de fin"), null=True, blank=True)

    # Notas
    notes = models.TextField(_("Notas"), blank=True)

    class Meta:
        verbose_name = _("Asignación de rol")
        verbose_name_plural = _("Asignaciones de roles")
        unique_together = ['staff', 'role', 'is_active']

    def __str__(self):
        return f"{self.staff.user.get_full_name()} - {self.role.name}"


class StaffSchedule(models.Model):
    """Horarios de trabajo del personal"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='schedules')

    # Información del horario
    schedule_type = models.CharField(_("Tipo de horario"), max_length=20, choices=[
        ('regular', 'Regular'),
        ('tour_assignment', 'Asignación a tour'),
        ('vacation', 'Vacaciones'),
        ('sick_leave', 'Licencia médica'),
        ('personal_leave', 'Licencia personal'),
        ('training', 'Entrenamiento'),
        ('overtime', 'Tiempo extra')
    ])

    # Fechas y horas
    start_date = models.DateField(_("Fecha de inicio"))
    end_date = models.DateField(_("Fecha de fin"))
    start_time = models.TimeField(_("Hora de inicio"), null=True, blank=True)
    end_time = models.TimeField(_("Hora de fin"), null=True, blank=True)

    # Estado
    status = models.CharField(_("Estado"), max_length=20, choices=[
        ('scheduled', 'Programado'),
        ('confirmed', 'Confirmado'),
        ('in_progress', 'En progreso'),
        ('completed', 'Completado'),
        ('cancelled', 'Cancelado')
    ], default='scheduled')

    # Información adicional
    notes = models.TextField(_("Notas"), blank=True)
    location = models.CharField(_("Ubicación"), max_length=200, blank=True)

    # Tour específico (si aplica)
    assigned_tour = models.ForeignKey('tours.Tour', on_delete=models.SET_NULL, null=True, blank=True, related_name='staff_assignments')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Horario de empleado")
        verbose_name_plural = _("Horarios de empleados")

    def __str__(self):
        return f"{self.staff.user.get_full_name()} - {self.schedule_type} - {self.start_date}"


class StaffPerformance(models.Model):
    """Evaluación de desempeño del personal"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='performance_reviews')

    # Información de la evaluación
    review_period_start = models.DateField(_("Inicio del período"))
    review_period_end = models.DateField(_("Fin del período"))
    review_date = models.DateField(_("Fecha de evaluación"), auto_now_add=True)

    # Evaluadores
    reviewed_by = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True, related_name='performance_reviews_made')
    review_type = models.CharField(_("Tipo de evaluación"), max_length=20, choices=[
        ('annual', 'Anual'),
        ('quarterly', 'Trimestral'),
        ('project_based', 'Por proyecto'),
        ('incident_based', 'Por incidente')
    ])

    # Métricas de desempeño
    overall_rating = models.IntegerField(_("Calificación general"), choices=[(i, i) for i in range(1, 6)])
    punctuality_rating = models.IntegerField(_("Puntuación de puntualidad"), choices=[(i, i) for i in range(1, 6)], null=True, blank=True)
    customer_service_rating = models.IntegerField(_("Servicio al cliente"), choices=[(i, i) for i in range(1, 6)], null=True, blank=True)
    teamwork_rating = models.IntegerField(_("Trabajo en equipo"), choices=[(i, i) for i in range(1, 6)], null=True, blank=True)
    knowledge_rating = models.IntegerField(_("Conocimiento"), choices=[(i, i) for i in range(1, 6)], null=True, blank=True)

    # Comentarios
    strengths = models.TextField(_("Fortalezas"), blank=True)
    areas_for_improvement = models.TextField(_("Áreas de mejora"), blank=True)
    goals = models.TextField(_("Objetivos"), blank=True)
    manager_comments = models.TextField(_("Comentarios del gerente"), blank=True)
    employee_comments = models.TextField(_("Comentarios del empleado"), blank=True)

    # Estado
    status = models.CharField(_("Estado"), max_length=20, choices=[
        ('draft', 'Borrador'),
        ('in_review', 'En revisión'),
        ('completed', 'Completada'),
        ('acknowledged', 'Reconocida')
    ], default='draft')

    # Información adicional
    salary_adjustment = models.DecimalField(_("Ajuste salarial"), max_digits=10, decimal_places=2, null=True, blank=True)
    promotion_recommendation = models.BooleanField(_("Recomendación de promoción"), default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Evaluación de desempeño")
        verbose_name_plural = _("Evaluaciones de desempeño")

    def __str__(self):
        return f"Evaluación {self.staff.user.get_full_name()} - {self.review_period_end}"


class StaffTraining(models.Model):
    """Entrenamientos y certificaciones del personal"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='trainings')

    # Información del entrenamiento
    title = models.CharField(_("Título del entrenamiento"), max_length=200)
    description = models.TextField(_("Descripción"), blank=True)
    training_type = models.CharField(_("Tipo de entrenamiento"), max_length=50, choices=[
        ('certification', 'Certificación'),
        ('workshop', 'Taller'),
        ('course', 'Curso'),
        ('seminar', 'Seminario'),
        ('on_the_job', 'En el trabajo'),
        ('other', 'Otro')
    ])

    # Información del proveedor
    provider = models.CharField(_("Proveedor"), max_length=200, blank=True)
    instructor = models.CharField(_("Instructor"), max_length=200, blank=True)

    # Fechas
    start_date = models.DateField(_("Fecha de inicio"))
    end_date = models.DateField(_("Fecha de fin"))
    completion_date = models.DateField(_("Fecha de completación"), null=True, blank=True)

    # Estado y resultado
    status = models.CharField(_("Estado"), max_length=20, choices=[
        ('scheduled', 'Programado'),
        ('in_progress', 'En progreso'),
        ('completed', 'Completado'),
        ('cancelled', 'Cancelado'),
        ('expired', 'Expirado')
    ], default='scheduled')

    # Certificación
    certificate_number = models.CharField(_("Número de certificado"), max_length=100, blank=True)
    certificate_file = models.FileField(_("Archivo de certificado"), upload_to='staff/certificates/', null=True, blank=True)
    expiry_date = models.DateField(_("Fecha de expiración"), null=True, blank=True)

    # Información adicional
    cost = models.DecimalField(_("Costo"), max_digits=10, decimal_places=2, null=True, blank=True)
    location = models.CharField(_("Ubicación"), max_length=200, blank=True)
    notes = models.TextField(_("Notas"), blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Entrenamiento de empleado")
        verbose_name_plural = _("Entrenamientos de empleados")

    def __str__(self):
        return f"{self.title} - {self.staff.user.get_full_name()}"


class StaffAttendance(models.Model):
    """Registro de asistencia del personal"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='attendance_records')

    # Información de la fecha
    date = models.DateField(_("Fecha"))
    check_in_time = models.TimeField(_("Hora de entrada"), null=True, blank=True)
    check_out_time = models.TimeField(_("Hora de salida"), null=True, blank=True)

    # Estado
    status = models.CharField(_("Estado"), max_length=20, choices=[
        ('present', 'Presente'),
        ('absent', 'Ausente'),
        ('late', 'Tarde'),
        ('half_day', 'Medio día'),
        ('vacation', 'Vacaciones'),
        ('sick', 'Enfermo'),
        ('personal_leave', 'Licencia personal')
    ])

    # Información adicional
    notes = models.TextField(_("Notas"), blank=True)
    location = models.CharField(_("Ubicación"), max_length=200, blank=True)

    # Registro automático
    is_auto_generated = models.BooleanField(_("Generado automáticamente"), default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Registro de asistencia")
        verbose_name_plural = _("Registros de asistencia")
        unique_together = ['staff', 'date']
        ordering = ['-date']

    def __str__(self):
        return f"{self.staff.user.get_full_name()} - {self.date} - {self.status}"
