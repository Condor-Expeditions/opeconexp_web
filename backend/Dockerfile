# Dockerfile multi-etapa para Condor Expeditions Backend

# Etapa 1: Builder para dependencias Python
FROM python:3.12-slim as python-builder

# Instalar uv para gestión rápida de dependencias
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY pyproject.toml ./

# Instalar dependencias en modo desarrollo
RUN uv sync --dev

# Etapa 2: Builder para frontend (si es necesario)
FROM node:18-alpine as node-builder

WORKDIR /frontend

# Copiar archivos de frontend si existen
COPY frontend/package*.json ./
COPY frontend/ ./

# Instalar dependencias y construir
RUN npm ci && npm run build

# Etapa 3: Imagen final de producción
FROM python:3.12-slim

# Instalar dependencias del sistema necesarias
RUN apt-get update && apt-get install -y \
    postgresql-client \
    redis-tools \
    nginx \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Crear usuario no-root para seguridad
RUN groupadd -r condor && useradd -r -g condor condor

# Instalar uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

WORKDIR /app

# Copiar código fuente
COPY --chown=condor:condor . .

# Copiar dependencias instaladas desde el builder
COPY --from=python-builder --chown=condor:condor /app/.venv /app/.venv

# Crear directorios necesarios
RUN mkdir -p /app/logs /app/staticfiles /app/media && \
    chown -R condor:condor /app

# Cambiar propietario de archivos críticos
RUN chown -R condor:condor /app

# Cambiar al usuario no-root
USER condor

# Crear enlace simbólico para uv
RUN ln -sf /app/.venv/bin/uv /usr/local/bin/uv

# Configurar variables de entorno para producción
ENV PYTHONPATH=/app
ENV DJANGO_SETTINGS_MODULE=condor_expeditions.settings
ENV PYTHONUNBUFFERED=1

# Exponer puerto
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health/ || exit 1

# Comando por defecto
CMD ["uv", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]