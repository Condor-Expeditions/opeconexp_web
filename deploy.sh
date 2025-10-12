#!/bin/bash

# Script de despliegue para Condor Expeditions
# Uso: ./deploy.sh [environment]
# Ejemplos: ./deploy.sh dev, ./deploy.sh prod

set -e  # Detener en caso de error

ENVIRONMENT=${1:-dev}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Desplegando Condor Expeditions - Entorno: $ENVIRONMENT"
echo "📍 Directorio: $SCRIPT_DIR"

# Función para mostrar ayuda
show_help() {
    echo "Uso: $0 [environment]"
    echo ""
    echo "Entornos disponibles:"
    echo "  dev     - Desarrollo (por defecto)"
    echo "  prod    - Producción"
    echo "  staging - Staging"
    echo ""
    echo "Ejemplos:"
    echo "  $0 dev"
    echo "  $0 prod"
    exit 1
}

# Verificar argumentos
if [[ "$ENVIRONMENT" == "--help" || "$ENVIRONMENT" == "-h" ]]; then
    show_help
fi

# Función para configurar entorno de desarrollo
setup_dev() {
    echo "🔧 Configurando entorno de desarrollo..."

    # Crear archivo .env si no existe
    if [[ ! -f .env ]]; then
        cp .env.example .env
        echo "✅ Archivo .env creado desde .env.example"
    fi

    # Crear directorios necesarios
    mkdir -p logs ssl

    # Generar claves SSL auto-firmadas para desarrollo
    if [[ ! -f ssl/server.crt ]]; then
        echo "🔐 Generando certificados SSL para desarrollo..."
        openssl req -x509 -newkey rsa:4096 -keyout ssl/server.key -out ssl/server.crt -days 365 -nodes -subj "/CN=localhost"
        echo "✅ Certificados SSL generados"
    fi

    echo "✅ Entorno de desarrollo configurado"
}

# Función para configurar entorno de producción
setup_prod() {
    echo "🔧 Configurando entorno de producción..."

    # Verificar que existan las variables de entorno necesarias
    required_vars=(
        "SECRET_KEY"
        "DB_PASSWORD"
        "MONGODB_PASSWORD"
        "EMAIL_HOST_PASSWORD"
        "STRIPE_SECRET_KEY"
        "STRIPE_WEBHOOK_SECRET"
    )

    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            echo "❌ Variable de entorno requerida no definida: $var"
            echo "💡 Configure las variables de entorno antes de desplegar en producción"
            exit 1
        fi
    done

    # Crear archivo .env desde variables de entorno
    cat > .env << EOF
SECRET_KEY=${SECRET_KEY}
DEBUG=False
DB_ENGINE=django.db.backends.postgresql
DB_NAME=condor_expeditions
DB_USER=condor_user
DB_PASSWORD=${DB_PASSWORD}
DB_HOST=db
DB_PORT=5432
MONGODB_HOST=mongodb
MONGODB_PORT=27017
MONGODB_NAME=condor_expeditions
MONGODB_USER=${MONGODB_USER:-admin}
MONGODB_PASSWORD=${MONGODB_PASSWORD}
REDIS_URL=redis://redis:6379/0
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=${EMAIL_HOST}
EMAIL_PORT=${EMAIL_PORT:-587}
EMAIL_USE_TLS=True
EMAIL_HOST_USER=${EMAIL_HOST_USER}
EMAIL_HOST_PASSWORD=${EMAIL_HOST_PASSWORD}
STRIPE_PUBLIC_KEY=${STRIPE_PUBLIC_KEY}
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
PAYPAL_CLIENT_ID=${PAYPAL_CLIENT_ID}
PAYPAL_CLIENT_SECRET=${PAYPAL_CLIENT_SECRET}
PAYPAL_MODE=live
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
AWS_STORAGE_BUCKET_NAME=${AWS_STORAGE_BUCKET_NAME}
AWS_S3_REGION_NAME=${AWS_S3_REGION_NAME:-us-east-1}
FRONTEND_URL=${FRONTEND_URL:-https://yourdomain.com}
ALLOWED_HOSTS=${ALLOWED_HOSTS:-yourdomain.com,www.yourdomain.com}
CORS_ALLOWED_ORIGINS=${CORS_ALLOWED_ORIGINS:-https://yourdomain.com}
LANGUAGE_CODE=es
TIME_ZONE=America/Guayaquil
EOF

    echo "✅ Archivo .env de producción creado"
}

# Función para construir imágenes
build_images() {
    echo "🏗️ Construyendo imágenes Docker..."

    # Construir backend
    echo "📦 Construyendo imagen del backend..."
    docker build -f backend/Dockerfile -t condor-expeditions-backend:latest ./backend

    # Construir frontend
    echo "🎨 Construyendo imagen del frontend..."
    docker build -f frontend/Dockerfile -t condor-expeditions-frontend:latest ./frontend

    echo "✅ Imágenes construidas exitosamente"
}

# Función para desplegar servicios
deploy_services() {
    echo "🚀 Desplegando servicios..."

    # Detener servicios existentes
    echo "🛑 Deteniendo servicios existentes..."
    docker-compose down

    # Iniciar servicios
    echo "▶️ Iniciando servicios..."
    docker-compose up -d

    # Esperar a que los servicios estén listos
    echo "⏳ Esperando a que los servicios estén listos..."
    sleep 30

    # Verificar estado de servicios
    echo "🔍 Verificando estado de servicios..."
    docker-compose ps

    echo "✅ Servicios desplegados exitosamente"
}

# Función para ejecutar migraciones
run_migrations() {
    echo "🗄️ Ejecutando migraciones de base de datos..."

    docker-compose exec -T backend uv run python manage.py migrate
    docker-compose exec -T backend uv run python manage.py setup_initial_data

    echo "✅ Migraciones ejecutadas"
}

# Función para verificar despliegue
verify_deployment() {
    echo "🔍 Verificando despliegue..."

    # Verificar health check del backend
    if curl -f http://localhost:8000/health/ > /dev/null 2>&1; then
        echo "✅ Backend responde correctamente"
    else
        echo "❌ Error: Backend no responde"
        exit 1
    fi

    # Verificar health check del frontend
    if curl -f http://localhost/health > /dev/null 2>&1; then
        echo "✅ Frontend responde correctamente"
    else
        echo "❌ Error: Frontend no responde"
        exit 1
    fi

    echo "✅ Despliegue verificado exitosamente"
}

# Función para mostrar información del despliegue
show_info() {
    echo ""
    echo "🎉 ¡Despliegue completado exitosamente!"
    echo ""
    echo "📊 Información del despliegue:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🌐 URLs de acceso:"
    echo "   • Sitio web: http://localhost"
    echo "   • API Documentation: http://localhost:8000/api/docs"
    echo "   • Admin Panel: http://localhost:8000/admin"
    echo ""
    echo "🛠️ Servicios disponibles:"
    echo "   • Backend API: http://localhost:8000"
    echo "   • Frontend: http://localhost"
    echo "   • Base de datos: PostgreSQL en puerto 5432"
    echo "   • MongoDB: En puerto 27017"
    echo "   • Redis: En puerto 6379"
    echo ""
    if [[ "$ENVIRONMENT" == "dev" ]]; then
        echo "🔧 Herramientas de desarrollo:"
        echo "   • PgAdmin: http://localhost:5050"
        echo "   • Mongo Express: http://localhost:8081"
        echo ""
        echo "📧 Credenciales de desarrollo:"
        echo "   • PgAdmin: admin@condorexpeditions.com / admin_password"
        echo "   • MongoDB: admin / admin_password"
    fi
    echo ""
    echo "📝 Comandos útiles:"
    echo "   • Ver logs: docker-compose logs -f [servicio]"
    echo "   • Reiniciar servicio: docker-compose restart [servicio]"
    echo "   • Detener todo: docker-compose down"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Función principal
main() {
    echo "🏁 Iniciando proceso de despliegue..."

    case $ENVIRONMENT in
        "dev")
            setup_dev
            build_images
            deploy_services
            run_migrations
            verify_deployment
            show_info
            ;;
        "prod")
            setup_prod
            build_images
            deploy_services
            run_migrations
            verify_deployment
            show_info
            ;;
        "staging")
            echo "🚧 Despliegue en staging (similar a producción pero con datos de prueba)"
            setup_prod
            build_images
            deploy_services
            run_migrations
            verify_deployment
            show_info
            ;;
        *)
            echo "❌ Entorno no reconocido: $ENVIRONMENT"
            show_help
            ;;
    esac
}

# Ejecutar función principal
main "$@"