# 🦅 Condor Expeditions - Plataforma de Turismo

[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://docker.com)
[![Django](https://img.shields.io/badge/Django-5.2-green.svg)](https://djangoproject.com)
[![Astro](https://img.shields.io/badge/Astro-3.0-orange.svg)](https://astro.build)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://postgresql.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-green.svg)](https://mongodb.com)

> Plataforma integral de turismo de aventura y naturaleza en Ecuador, especializada en experiencias auténticas con comunidades locales.

## 🌟 Características Principales

### 🏔️ Turismo de Aventura
- **Expediciones extremas** al Cotopaxi, Chimborazo y otros volcanes
- **Tours culturales** con comunidades indígenas
- **Experiencias 360°** para tours virtuales
- **Turismo sostenible** con impacto positivo

### 🛒 Ecommerce Completo
- **Sistema de reservas** con calendario interactivo
- **Pagos en línea** con Stripe y PayPal
- **Gestión de inventario** de tours y servicios
- **CRM integrado** para atención al cliente

### 👥 Gestión Comunitaria
- **Plataforma para comunidades** locales
- **Sistema de beneficios** compartidos
- **Seguimiento de impacto** social y económico
- **Comunicación directa** entre turistas y comunidades

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        🦅 Condor Expeditions                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Frontend  │  │   Backend   │  │  Base de    │              │
│  │   Astro +   │  │   Django +  │  │  Datos      │              │
│  │   Preact    │  │   Ninja     │  │             │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ PostgreSQL  │  │  MongoDB    │  │   Redis     │              │
│  │  Relacional │  │  Documentos │  │   Cache     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │    Nginx    │  │   Celery    │  │ Stripe/PayPal│             │
│  │ Proxy Reverso│  │   Tareas    │  │   Pagos      │             │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Inicio Rápido

### Prerrequisitos

- **Docker** y **Docker Compose**
- **Git**
- **Navegador web moderno**

### Despliegue con Docker (Recomendado)

#### Linux/macOS
```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd condor-expeditions

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 3. Desplegar con un solo comando
./deploy.sh dev

# 4. Acceder a la aplicación
# • Sitio web: http://localhost
# • API Docs: http://localhost:8000/api/docs
# • Admin: http://localhost:8000/admin
```

#### Windows
```cmd
REM 1. Clonar el repositorio
git clone <repository-url>
cd condor-expeditions

REM 2. Configurar variables de entorno
copy .env.example .env
REM Editar .env con tus configuraciones

REM 3. Desplegar con un solo comando (elige una opción)

REM Opción A: Usando PowerShell (recomendado)
powershell -ExecutionPolicy Bypass -File deploy-windows.ps1 -Environment dev

REM Opción B: Usando archivo .bat
deploy-windows.bat dev

REM 4. Acceder a la aplicación
REM • Sitio web: http://localhost
REM • API Docs: http://localhost:8000/api/docs
REM • Admin: http://localhost:8000/admin
```

### Despliegue Manual

#### Backend (Django)

```bash
cd backend

# Instalar dependencias
uv sync

# Configurar base de datos
cp .env.example .env
# Editar configuración

# Aplicar migraciones
uv run python manage.py migrate

# Crear datos iniciales
uv run python manage.py setup_initial_data

# Crear superusuario
uv run python manage.py createsuperuser

# Ejecutar servidor
uv run python manage.py runserver
```

#### Frontend (Astro)

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar desarrollo
npm run dev

# Construir producción
npm run build
```

## 📁 Estructura del Proyecto

```
condor-expeditions/
├── 📁 backend/                 # API Django + Ninja
│   ├── 📁 condor_expeditions/  # Configuración Django
│   ├── 📁 users/              # Gestión de usuarios
│   ├── 📁 tours/              # Gestión de tours
│   ├── 📁 bookings/           # Sistema de reservas
│   ├── 📁 payments/           # Procesamiento de pagos
│   ├── 📁 communities/       # CRM comunitario
│   ├── 📁 staff/             # Gestión de personal
│   ├── 📁 media_manager/     # Medios y 360°
│   ├── 📁 api/               # Configuración API
│   └── 📁 templates/         # Plantillas email
│
├── 📁 frontend/               # Aplicación Astro + Preact
│   ├── 📁 src/
│   │   ├── 📁 components/    # Componentes Preact
│   │   ├── 📁 layouts/       # Layouts Astro
│   │   ├── 📁 pages/         # Páginas
│   │   └── 📁 lib/           # Utilidades
│   ├── 📁 public/            # Archivos estáticos
│   └── 📁 dist/              # Build de producción
│
├── 📁 docs/                  # Documentación técnica
├── 📁 logs/                  # Logs de aplicación
├── 📁 ssl/                   # Certificados SSL
│
├── 🐳 docker-compose.yml     # Orquestación completa
├── 🐳 Dockerfile            # Imágenes de aplicación
├── 📜 .env.example          # Variables de entorno
├── 📜 deploy.sh             # Script de despliegue
├── 📜 LICENSE               # Licencia MIT
└── 📖 README.md             # Esta documentación
```

## 🔧 Configuración

### Variables de Entorno

```env
# Django Backend
SECRET_KEY=your-secret-key
DEBUG=False
DB_ENGINE=django.db.backends.postgresql
DB_NAME=condor_expeditions
DB_USER=condor_user
DB_PASSWORD=your-db-password

# MongoDB
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_NAME=condor_expeditions

# Redis
REDIS_URL=redis://localhost:6379/0

# Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Pagos
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
PAYPAL_CLIENT_ID=your_paypal_client_id

# Frontend
PUBLIC_API_URL=http://localhost:8000/api/v1
```

## 🌐 Servicios y URLs

### Desarrollo
| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost | Aplicación principal |
| **Backend API** | http://localhost:8000 | API REST |
| **API Docs** | http://localhost:8000/api/docs | Documentación automática |
| **Admin** | http://localhost:8000/admin | Panel administrativo |
| **PgAdmin** | http://localhost:5050 | Gestión PostgreSQL |
| **Mongo Express** | http://localhost:8081 | Gestión MongoDB |

### Producción
| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Sitio Web** | https://yourdomain.com | Aplicación principal |
| **API** | https://api.yourdomain.com | API REST |
| **Admin** | https://admin.yourdomain.com | Panel administrativo |

## 🛠️ Comandos Útiles

### Despliegue

#### Linux/macOS
```bash
# Desplegar en desarrollo
./deploy.sh dev

# Desplegar en producción
./deploy.sh prod

# Ver logs de servicios
docker-compose logs -f [servicio]

# Reiniciar servicio específico
docker-compose restart [servicio]

# Detener todos los servicios
docker-compose down
```

#### Windows
```cmd
REM Desplegar en desarrollo (elige una opción)

REM Opción A: Usando PowerShell (recomendado)
powershell -ExecutionPolicy Bypass -File deploy-windows.ps1 -Environment dev

REM Opción B: Usando archivo .bat
deploy-windows.bat dev

REM Ver logs de servicios
docker-compose logs -f [servicio]

REM Reiniciar servicio específico
docker-compose restart [servicio]

REM Detener todos los servicios
docker-compose down
```

### Desarrollo Backend
```bash
# Migraciones
python manage.py makemigrations
python manage.py migrate

# Datos iniciales
python manage.py setup_initial_data

# Crear superusuario
python manage.py createsuperuser

# Tests
python manage.py test

# Shell de Django
python manage.py shell
```

### Desarrollo Frontend
```bash
# Desarrollo
npm run dev

# Construir
npm run build

# Preview producción
npm run preview

# Type checking
npm run astro check
```

## 🔒 Seguridad

- **HTTPS obligatorio** en producción
- **CORS configurado** para dominios específicos
- **Validación estricta** de datos de entrada
- **Autenticación JWT** robusta
- **Logs de auditoría** para acciones importantes
- **Protección contra XSS** y ataques comunes

## 📊 Monitoreo y Logs

### Health Checks
- **Backend**: http://localhost:8000/health/
- **Frontend**: http://localhost/health

### Logs
```bash
# Ver logs en tiempo real
docker-compose logs -f

# Logs de servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Logs de errores
tail -f logs/django.log
```

## 🚀 Despliegue en Producción

### 1. Preparación
```bash
# Configurar variables de entorno
cp .env.example .env
# Editar .env con valores de producción

# Construir imágenes
docker-compose build

# Ejecutar migraciones
docker-compose run --rm backend uv run python manage.py migrate
```

### 2. Despliegue
```bash
# Desplegar servicios
docker-compose up -d

# Verificar estado
docker-compose ps

# Verificar health checks
curl http://localhost:8000/health/
curl http://localhost/health
```

### 3. Verificación
```bash
# Verificar servicios
docker-compose ps

# Ver logs iniciales
docker-compose logs

# Verificar aplicación
curl -I http://localhost
```

## 🤝 Contribución

### Guías de Desarrollo

1. **Backend**: Seguir patrón establecido en apps modulares
2. **Frontend**: Usar componentes Preact para interactividad
3. **Estilos**: Usar clases de Tailwind CSS
4. **API**: Usar Django Ninja para nuevos endpoints
5. **Tests**: Agregar tests para nuevas funcionalidades

### Proceso de Contribución

1. Crear rama para nueva funcionalidad
2. Implementar cambios siguiendo patrones establecidos
3. Agregar tests correspondientes
4. Actualizar documentación
5. Crear Pull Request

## 📚 Documentación Técnica

### Arquitectura
- **[Arquitectura del Sistema](./docs/arquitectura-sistema.md)** - Diseño técnico completo
- **[Backend README](./backend/README.md)** - Guía detallada del backend
- **[Frontend README](./frontend/README.md)** - Guía del frontend

### APIs
- **Documentación automática**: http://localhost:8000/api/docs
- **Esquemas de datos**: Definidos en modelos Django
- **Autenticación**: JWT tokens con refresh automático

## 🆘 Soporte y Ayuda

### Recursos
- **Issues**: Reportar bugs y solicitar funcionalidades
- **Wiki**: Documentación adicional y guías
- **Comunidad**: Foro de desarrolladores

### Contacto
- **Email**: soporte@condorexpeditions.com
- **Teléfono**: +593 999 999 999
- **Dirección**: Quito, Ecuador

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver archivo [LICENSE](LICENSE) para más detalles.

---

**¡Gracias por elegir Condor Expeditions para descubrir la magia de Ecuador! 🦅⛰️**

*Desarrollado con ❤️ para promover el turismo sostenible y responsable*