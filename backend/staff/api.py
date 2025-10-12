"""
API Router para Gestión de Personal

Sistema completo para:
- Gestión de empleados
- Roles y permisos
- Horarios de trabajo
- Evaluaciones de desempeño
- Asistencia y control horario
"""

from typing import List, Optional
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count, Sum, Avg
from django.utils import timezone
from ninja import Router, Schema
from ninja.pagination import paginate
from .models import Staff, StaffRole, StaffSchedule, StaffPerformance, StaffAttendance

# Crear router para staff
router = Router(tags=["Staff"])

# Esquemas de entrada/salida
class StaffCreateSchema(Schema):
    """Esquema para crear empleado"""
    user_id: str
    employee_id: str
    position: str
    department: Optional[str] = None
    employment_type: str = "full_time"
    hire_date: str
    salary_info: Optional[dict] = None

class StaffResponseSchema(Schema):
    """Esquema de respuesta de empleado"""
    id: str
    employee_id: str
    user: dict
    position: str
    department: Optional[str] = None
    employment_status: str
    employment_type: str
    hire_date: str
    total_tours_assigned: int = 0
    performance_rating: Optional[float] = None

class StaffScheduleCreateSchema(Schema):
    """Esquema para crear horario"""
    staff_id: str
    schedule_type: str
    start_date: str
    end_date: str
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    notes: Optional[str] = None

class DashboardStatsSchema(Schema):
    """Esquema de estadísticas del dashboard"""
    total_staff: int
    active_staff: int
    on_leave_staff: int
    total_schedules: int
    upcoming_tours: int
    pending_evaluations: int

# Servicios para gestión de personal
class StaffServiceManager:
    """Servicio para gestión de personal"""

    @staticmethod
    def get_staff_performance_summary(staff_id: str) -> dict:
        """Obtener resumen de desempeño de empleado"""

        performance_records = StaffPerformance.objects.filter(staff_id=staff_id)

        if not performance_records.exists():
            return {"message": "No hay evaluaciones disponibles"}

        latest_performance = performance_records.order_by('-review_period_end').first()

        return {
            "overall_rating": latest_performance.overall_rating,
            "last_review_date": latest_performance.review_date.isoformat(),
            "review_period": f"{latest_performance.review_period_start} - {latest_performance.review_period_end}",
            "strengths": latest_performance.strengths,
            "areas_for_improvement": latest_performance.areas_for_improvement,
            "goals": latest_performance.goals
        }

    @staticmethod
    def get_staff_availability(staff_id: str, start_date: str, end_date: str) -> dict:
        """Verificar disponibilidad de empleado para fechas específicas"""

        schedules = StaffSchedule.objects.filter(
            staff_id=staff_id,
            start_date__lte=end_date,
            end_date__gte=start_date,
            status__in=['scheduled', 'confirmed']
        )

        conflicts = []
        for schedule in schedules:
            conflicts.append({
                "schedule_type": schedule.schedule_type,
                "start_date": schedule.start_date.isoformat(),
                "end_date": schedule.end_date.isoformat(),
                "notes": schedule.notes
            })

        return {
            "available": len(conflicts) == 0,
            "conflicts": conflicts
        }

# Endpoints de la API

@router.get("/dashboard", response=DashboardStatsSchema)
def get_staff_dashboard(request):
    """Dashboard de gestión de personal"""

    if not request.user.is_authenticated:
        return {"message": "Authentication required"}

    # Verificar permisos
    if not request.user.is_staff:
        return {"message": "Staff access required"}

    today = timezone.now().date()
    thirty_days_from_now = today + timezone.timedelta(days=30)

    return {
        "total_staff": Staff.objects.count(),
        "active_staff": Staff.objects.filter(employment_status='active').count(),
        "on_leave_staff": Staff.objects.filter(employment_status='on_leave').count(),
        "total_schedules": StaffSchedule.objects.filter(
            start_date__gte=today,
            status__in=['scheduled', 'confirmed']
        ).count(),
        "upcoming_tours": StaffSchedule.objects.filter(
            schedule_type='tour_assignment',
            start_date__lte=thirty_days_from_now,
            start_date__gte=today,
            status='confirmed'
        ).count(),
        "pending_evaluations": StaffPerformance.objects.filter(
            status__in=['draft', 'in_review']
        ).count()
    }

@router.get("", response=List[StaffResponseSchema])
@paginate
def list_staff(request, employment_status: str = "active", department: Optional[str] = None):
    """Listar empleados"""

    queryset = Staff.objects.select_related('user').filter(employment_status=employment_status)

    if department:
        queryset = queryset.filter(department=department)

    staff_members = queryset.order_by('user__first_name', 'user__last_name')

    return [
        StaffResponseSchema(
            id=str(staff.id),
            employee_id=staff.employee_id,
            user={
                "id": str(staff.user.id),
                "name": staff.user.get_full_name(),
                "email": staff.user.email,
                "phone": staff.user.phone
            },
            position=staff.position,
            department=staff.department,
            employment_status=staff.employment_status,
            employment_type=staff.employment_type,
            hire_date=staff.hire_date.isoformat(),
            total_tours_assigned=staff.schedules.filter(schedule_type='tour_assignment').count(),
            performance_rating=None  # Implementar cálculo de promedio
        )
        for staff in staff_members
    ]

@router.get("/{staff_id}", response={200: dict, 404: dict})
def get_staff_detail(request, staff_id: str):
    """Obtener detalles completos de empleado"""

    try:
        staff = get_object_or_404(
            Staff.objects.select_related('user').prefetch_related('schedules', 'performance_reviews'),
            id=staff_id
        )

        # Obtener resumen de desempeño
        performance_summary = StaffServiceManager.get_staff_performance_summary(staff_id)

        # Obtener horarios recientes
        recent_schedules = staff.schedules.filter(
            start_date__gte=timezone.now() - timezone.timedelta(days=30)
        ).order_by('-start_date')[:5]

        return 200, {
            "id": str(staff.id),
            "employee_id": staff.employee_id,
            "personal_info": {
                "name": staff.user.get_full_name(),
                "email": staff.user.email,
                "phone": staff.user.phone,
                "birth_date": staff.birth_date.isoformat() if staff.birth_date else None
            },
            "employment_info": {
                "position": staff.position,
                "department": staff.department,
                "employment_status": staff.employment_status,
                "employment_type": staff.employment_type,
                "hire_date": staff.hire_date.isoformat(),
                "manager": staff.manager.user.get_full_name() if staff.manager else None
            },
            "contact_info": {
                "personal_email": staff.personal_email,
                "work_phone": staff.work_phone,
                "work_email": staff.work_email,
                "emergency_contact": {
                    "name": staff.emergency_contact_name,
                    "phone": staff.emergency_contact_phone,
                    "relationship": staff.emergency_contact_relationship
                }
            },
            "performance": performance_summary,
            "recent_schedules": [
                {
                    "id": str(schedule.id),
                    "schedule_type": schedule.schedule_type,
                    "start_date": schedule.start_date.isoformat(),
                    "end_date": schedule.end_date.isoformat(),
                    "status": schedule.status,
                    "notes": schedule.notes
                }
                for schedule in recent_schedules
            ],
            "statistics": {
                "total_schedules": staff.schedules.count(),
                "completed_schedules": staff.schedules.filter(status='completed').count(),
                "tours_assigned": staff.schedules.filter(schedule_type='tour_assignment').count(),
                "training_sessions": staff.trainings.count()
            }
        }

    except Staff.DoesNotExist:
        return 404, {"message": "Empleado no encontrado"}

@router.post("/schedules", response={201: dict, 400: dict})
def create_staff_schedule(request, payload: StaffScheduleCreateSchema):
    """Crear horario para empleado"""

    if not request.user.is_authenticated or not request.user.is_staff:
        return 401, {"message": "Staff access required"}

    try:
        staff = get_object_or_404(Staff, id=payload.staff_id)

        schedule = StaffSchedule.objects.create(
            staff=staff,
            schedule_type=payload.schedule_type,
            start_date=payload.start_date,
            end_date=payload.end_date,
            start_time=payload.start_time,
            end_time=payload.end_time,
            notes=payload.notes
        )

        return 201, {
            "message": "Horario creado exitosamente",
            "schedule_id": str(schedule.id)
        }

    except Exception as e:
        return 400, {"message": "Error al crear horario", "error": str(e)}

@router.get("/{staff_id}/availability", response=dict)
def check_staff_availability(request, staff_id: str, start_date: str, end_date: str):
    """Verificar disponibilidad de empleado"""

    availability = StaffServiceManager.get_staff_availability(staff_id, start_date, end_date)

    return availability

@router.get("/roles", response=list)
def list_staff_roles(request):
    """Listar roles disponibles"""

    roles = StaffRole.objects.filter(is_active=True).order_by('level', 'name')

    return [
        {
            "id": str(role.id),
            "name": role.name,
            "description": role.description,
            "level": role.level,
            "permissions": {
                "can_manage_users": role.can_manage_users,
                "can_manage_bookings": role.can_manage_bookings,
                "can_manage_tours": role.can_manage_tours,
                "can_manage_staff": role.can_manage_staff,
                "can_view_reports": role.can_view_reports,
                "can_manage_finances": role.can_manage_finances
            }
        }
        for role in roles
    ]

# Estadísticas y reportes

@router.get("/reports/performance", response=dict)
def get_performance_report(request, staff_id: Optional[str] = None, period_days: int = 90):
    """Reporte de desempeño de personal"""

    if not request.user.is_authenticated or not request.user.is_staff:
        return {}

    start_date = timezone.now() - timezone.timedelta(days=period_days)

    queryset = StaffPerformance.objects.filter(review_date__gte=start_date)

    if staff_id:
        queryset = queryset.filter(staff_id=staff_id)

    # Estadísticas generales
    performance_stats = queryset.aggregate(
        avg_overall_rating=Avg('overall_rating'),
        total_evaluations=Count('id'),
        excellent_performers=Count('id', filter=Q(overall_rating__gte=4)),
        needs_improvement=Count('id', filter=Q(overall_rating__lte=2))
    )

    return {
        "period_days": period_days,
        "total_evaluations": performance_stats['total_evaluations'],
        "average_rating": float(performance_stats['avg_overall_rating'] or 0),
        "excellent_performers": performance_stats['excellent_performers'],
        "needs_improvement": performance_stats['needs_improvement'],
        "performance_distribution": {
            "5_stars": queryset.filter(overall_rating=5).count(),
            "4_stars": queryset.filter(overall_rating=4).count(),
            "3_stars": queryset.filter(overall_rating=3).count(),
            "2_stars": queryset.filter(overall_rating=2).count(),
            "1_star": queryset.filter(overall_rating=1).count()
        }
    }

@router.get("/reports/attendance", response=dict)
def get_attendance_report(request, staff_id: Optional[str] = None, month: Optional[str] = None):
    """Reporte de asistencia de personal"""

    if not request.user.is_authenticated or not request.user.is_staff:
        return {}

    # Si no se especifica mes, usar mes actual
    if month:
        year, month_num = map(int, month.split('-'))
        start_date = timezone.datetime(year, month_num, 1).date()
        if month_num == 12:
            end_date = timezone.datetime(year + 1, 1, 1).date()
        else:
            end_date = timezone.datetime(year, month_num + 1, 1).date()
    else:
        today = timezone.now().date()
        start_date = today.replace(day=1)
        if today.month == 12:
            end_date = today.replace(year=today.year + 1, month=1, day=1)
        else:
            end_date = today.replace(month=today.month + 1, day=1)

    queryset = StaffAttendance.objects.filter(date__gte=start_date, date__lt=end_date)

    if staff_id:
        queryset = queryset.filter(staff_id=staff_id)

    # Estadísticas de asistencia
    attendance_stats = queryset.aggregate(
        total_records=Count('id'),
        present_days=Count('id', filter=Q(status='present')),
        absent_days=Count('id', filter=Q(status='absent')),
        late_days=Count('id', filter=Q(status='late'))
    )

    return {
        "period": f"{start_date} to {end_date - timezone.timedelta(days=1)}",
        "total_records": attendance_stats['total_records'],
        "present_days": attendance_stats['present_days'],
        "absent_days": attendance_stats['absent_days'],
        "late_days": attendance_stats['late_days'],
        "attendance_rate": (attendance_stats['present_days'] / attendance_stats['total_records'] * 100) if attendance_stats['total_records'] > 0 else 0
    }