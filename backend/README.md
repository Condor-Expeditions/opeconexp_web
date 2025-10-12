# Condor Expeditions Backend

Backend API para la plataforma de turismo Condor Expeditions construido con Django + Django Ninja.

## 🚀 Características

- **API REST moderna** con Django Ninja
- **Arquitectura modular** con apps independientes
- **Base de datos híbrida** PostgreSQL + MongoDB
- **Sistema de autenticación** completo
- **Gestión de tours y reservas**
- **Galería de medios 360°**
- **CRM de comunidades**
- **Sistema de pagos integrado**
- **Dashboard administrativo**
- **Procesamiento asíncrono** con Celery
- **Documentación automática** con Swagger/OpenAPI

## 🛠 Stack Tecnológico

### Backend
- **Django 5.2** - Framework web principal
- **Django Ninja** - APIs REST modernas y tipadas
- **Django REST Framework** - APIs adicionales
- **PostgreSQL** - Base de datos relacional
- **MongoDB** - Base de datos NoSQL para contenido dinámico

### Herramientas de Desarrollo
- **uv** - Gestor de paquetes Python de alta velocidad
- **Celery** - Procesamiento de tareas asíncronas
- **Redis** - Message broker para Celery
- **Stripe** - Procesamiento de pagos
- **Pillow** - Procesamiento de imágenes

## 📁 Estructura del Proyecto

```
backend/
├── condor_expeditions/          # Configuración principal de Django
│   ├── settings.py             # Configuración completa del proyecto
│   ├── urls.py                 # Rutas principales
│   └── wsgi.py                 # Punto de entrada WSGI
├── users/                      # Gestión de usuarios y autenticación
│   ├── models.py              # Modelos de usuario extendidos
│   ├── api.py                 # API endpoints de usuarios
│   └── api_urls.py            # URLs específicas de usuarios
├── tours/                     # Gestión de tours y expediciones
│   ├── models.py              # Modelos de tours, categorías, horarios
│   ├── api.py                 # API endpoints de tours
│   └── api_urls.py            # URLs específicas de tours
├── bookings/                  # Sistema de reservas
│   ├── models.py              # Modelos de reservas y pagos
│   ├── api.py                 # API endpoints de reservas
│   └── api_urls.py            # URLs específicas de reservas
├── media_manager/             # Gestión de medios y contenido 360°
│   ├── models.py              # Modelos de medios y proyectos 360°
│   ├── api.py                 # API endpoints de medios
│   └── api_urls.py            # URLs específicas de medios
├── communities/               # CRM de comunidades
│   ├── models.py              # Modelos de comunidades y servicios
│   ├── api.py                 # API endpoints de comunidades
│   └── api_urls.py            # URLs específicas de comunidades
├── staff/                     # Gestión de personal
│   ├── models.py              # Modelos de empleados y roles
│   ├── api.py                 # API endpoints de staff
│   └── api_urls.py            # URLs específicas de staff
├── payments/                  # Sistema de pagos
│   ├── models.py              # Modelos de pagos y transacciones
│   ├── api.py                 # API endpoints de pagos
│   └── api_urls.py            # URLs específicas de pagos
├── api/                       # Configuración de API principal
│   ├── api.py                 # Router principal de Django Ninja
│   └── urls.py                # URLs de documentación
├── mongodb_models.py          # Modelos para MongoDB (Pydantic)
├── .env.example              # Variables de entorno de ejemplo
└── README.md                 # Esta documentación
```

## 🚀 Instalación y Configuración

### 1. Prerrequisitos

- **Python 3.12+**
- **uv** (gestor de paquetes)
- **PostgreSQL** (opcional, usa SQLite por defecto)
- **MongoDB** (opcional)
- **Redis** (opcional, para Celery)

### 2. Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd condor-expeditions/backend

# Instalar dependencias con uv
uv sync

# Copiar configuración de ejemplo
cp .env.example .env

# Editar configuración según tu entorno
# Configurar base de datos, claves API, etc.
```

### 3. Configuración de Base de Datos

#### SQLite (por defecto)
```bash
# Crear migraciones
uv run python manage.py makemigrations

# Aplicar migraciones
uv run python manage.py migrate
```

#### PostgreSQL (producción)
```bash
# Configurar en .env
DB_ENGINE=django.db.backends.postgresql
DB_NAME=condor_expeditions
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# Crear base de datos y aplicar migraciones
createdb condor_expeditions
uv run python manage.py migrate
```

### 4. Crear Superusuario

```bash
uv run python manage.py createsuperuser
```

### 5. Ejecutar Servidor de Desarrollo

```bash
uv run python manage.py runserver
```

La API estará disponible en:
- **API Documentation**: http://localhost:8000/api/docs
- **Admin Panel**: http://localhost:8000/admin

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env` basado en `.env.example`:

```env
# Django
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Base de datos
DB_ENGINE=django.db.backends.postgresql
DB_NAME=condor_expeditions
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=localhost

# MongoDB
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_NAME=condor_expeditions

# Redis
REDIS_URL=redis://localhost:6379/0

# Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Pagos (sandbox para desarrollo)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

## 📚 Uso de la API

### Documentación Automática

La API incluye documentación automática en Swagger/OpenAPI:
- **Swagger UI**: http://localhost:8000/api/docs
- **OpenAPI Schema**: http://localhost:8000/api/openapi.json

### Ejemplos de Endpoints

#### Tours
```bash
# Listar tours
GET /api/v1/tours/

# Obtener tour específico
GET /api/v1/tours/{tour_id}/

# Buscar tours
GET /api/v1/tours/search?q=galapagos

# Tours destacados
GET /api/v1/tours/featured
```

#### Reservas
```bash
# Crear reserva
POST /api/v1/bookings/
Content-Type: application/json
{
  "tour_id": "uuid",
  "schedule_id": "uuid",
  "participants": 2,
  "emergency_contact": "..."
}
```

#### Autenticación
```bash
# Obtener token
POST /api/v1/auth/login/
{
  "email": "user@example.com",
  "password": "password"
}
```

## 🧪 Testing

```bash
# Ejecutar tests
uv run python manage.py test

# Con cobertura
uv run coverage run manage.py test
uv run coverage report
```

## 🚢 Despliegue

### Docker (Recomendado)

```bash
# Construir imagen
docker build -t condor-expeditions-backend .

# Ejecutar con Docker Compose
docker-compose up -d
```

### Configuración de Producción

1. **Configurar variables de entorno**
2. **Configurar base de datos PostgreSQL**
3. **Configurar archivos estáticos**
4. **Configurar HTTPS/SSL**
5. **Configurar CORS para dominios de producción**
6. **Configurar logging apropiado**

## 🔒 Seguridad

- **CORS** configurado para dominios específicos
- **Rate limiting** implementado en endpoints críticos
- **Validación** estricta de datos de entrada
- **Sanitización** de contenido de usuarios
- **Logs de auditoría** para acciones importantes

## 📊 Monitoreo

- **Health checks** en `/health/`
- **Logs estructurados** con niveles apropiados
- **Métricas básicas** de uso de API
- **Alertas** para errores críticos

## 🤝 Contribución

1. Crear rama para nueva funcionalidad
2. Implementar cambios siguiendo el patrón establecido
3. Agregar tests correspondientes
4. Actualizar documentación
5. Crear Pull Request

## 📄 Licencia

Este proyecto es propiedad de Condor Expeditions.

## 🆘 Soporte

Para soporte técnico o preguntas:
- Crear issue en el repositorio
- Contactar al equipo de desarrollo
- Revisar la documentación en `/api/docs`