#Requires -Version 5.1

<#
.SYNOPSIS
    Script de despliegue para Windows - Condor Expeditions

.DESCRIPTION
    Script completo de despliegue para la plataforma Condor Expeditions
    Compatible con Windows PowerShell 5.1+

.PARAMETER Environment
    Entorno de despliegue: dev, prod, staging

.EXAMPLE
    .\deploy-windows.ps1 -Environment dev

.EXAMPLE
    .\deploy-windows.ps1 -Environment prod
#>

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('dev', 'prod', 'staging')]
    [string]$Environment = 'dev',

    [Parameter(Mandatory=$false)]
    [switch]$SkipBuild,

    [Parameter(Mandatory=$false)]
    [switch]$SkipMigrations
)

# Configuración
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = $ScriptDir

# Colores para output
$ColorInfo = "Cyan"
$ColorSuccess = "Green"
$ColorWarning = "Yellow"
$ColorError = "Red"

function Write-ColoredOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Test-Prerequisites {
    Write-ColoredOutput "🔍 Verificando prerrequisitos..." $ColorInfo

    # Verificar Docker
    try {
        $dockerVersion = docker --version
        Write-ColoredOutput "✅ Docker detectado: $dockerVersion" $ColorSuccess
    }
    catch {
        Write-ColoredOutput "❌ Docker no está instalado o no está en el PATH" $ColorError
        exit 1
    }

    # Verificar Docker Compose
    try {
        $composeVersion = docker-compose --version
        Write-ColoredOutput "✅ Docker Compose detectado: $composeVersion" $ColorSuccess
    }
    catch {
        Write-ColoredOutput "❌ Docker Compose no está instalado o no está en el PATH" $ColorError
        exit 1
    }

    # Verificar curl
    try {
        $curlVersion = curl --version
        Write-ColoredOutput "✅ curl disponible" $ColorSuccess
    }
    catch {
        Write-ColoredOutput "❌ curl no está disponible" $ColorError
        exit 1
    }
}

function Setup-DevEnvironment {
    Write-ColoredOutput "🔧 Configurando entorno de desarrollo..." $ColorInfo

    # Crear archivo .env si no existe
    if (-not (Test-Path ".env")) {
        Copy-Item ".env.example" ".env"
        Write-ColoredOutput "✅ Archivo .env creado desde .env.example" $ColorSuccess
    }

    # Crear directorios necesarios
    $directories = @("logs", "ssl")
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir | Out-Null
        }
    }

    # Generar certificados SSL auto-firmados para desarrollo
    if (-not (Test-Path "ssl\server.crt")) {
        Write-ColoredOutput "🔐 Generando certificados SSL para desarrollo..." $ColorInfo
        try {
            & openssl req -x509 -newkey rsa:4096 -keyout ssl/server.key -out ssl/server.crt -days 365 -nodes -subj "/CN=localhost" 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-ColoredOutput "✅ Certificados SSL generados" $ColorSuccess
            }
        }
        catch {
            Write-ColoredOutput "⚠️ OpenSSL no disponible, omitiendo certificados SSL" $ColorWarning
        }
    }

    Write-ColoredOutput "✅ Entorno de desarrollo configurado" $ColorSuccess
}

function Setup-ProdEnvironment {
    Write-ColoredOutput "🔧 Configurando entorno de producción..." $ColorInfo

    # Verificar variables de entorno requeridas
    $requiredVars = @(
        "SECRET_KEY",
        "DB_PASSWORD",
        "MONGODB_PASSWORD",
        "EMAIL_HOST_PASSWORD",
        "STRIPE_SECRET_KEY",
        "STRIPE_WEBHOOK_SECRET"
    )

    foreach ($var in $requiredVars) {
        if (-not (Test-Variable $var)) {
            Write-ColoredOutput "❌ Variable de entorno requerida no definida: $var" $ColorError
            Write-ColoredOutput "💡 Configure las variables de entorno antes de desplegar en producción" $ColorWarning
            exit 1
        }
    }

    # Crear archivo .env desde variables de entorno
    $envContent = @"
SECRET_KEY=$env:SECRET_KEY
DEBUG=False
DB_ENGINE=django.db.backends.postgresql
DB_NAME=condor_expeditions
DB_USER=condor_user
DB_PASSWORD=$env:DB_PASSWORD
DB_HOST=db
DB_PORT=5432
MONGODB_HOST=mongodb
MONGODB_PORT=27017
MONGODB_NAME=condor_expeditions
MONGODB_USER=$env:MONGODB_USER
MONGODB_PASSWORD=$env:MONGODB_PASSWORD
REDIS_URL=redis://redis:6379/0
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=$env:EMAIL_HOST
EMAIL_PORT=$env:EMAIL_PORT
EMAIL_USE_TLS=True
EMAIL_HOST_USER=$env:EMAIL_HOST_USER
EMAIL_HOST_PASSWORD=$env:EMAIL_HOST_PASSWORD
STRIPE_PUBLIC_KEY=$env:STRIPE_PUBLIC_KEY
STRIPE_SECRET_KEY=$env:STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=$env:STRIPE_WEBHOOK_SECRET
PAYPAL_CLIENT_ID=$env:PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET=$env:PAYPAL_CLIENT_SECRET
PAYPAL_MODE=live
AWS_ACCESS_KEY_ID=$env:AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=$env:AWS_SECRET_ACCESS_KEY
AWS_STORAGE_BUCKET_NAME=$env:AWS_STORAGE_BUCKET_NAME
AWS_S3_REGION_NAME=$env:AWS_S3_REGION_NAME
FRONTEND_URL=$env:FRONTEND_URL
ALLOWED_HOSTS=$env:ALLOWED_HOSTS
CORS_ALLOWED_ORIGINS=$env:CORS_ALLOWED_ORIGINS
LANGUAGE_CODE=es
TIME_ZONE=America/Guayaquil
"@

    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-ColoredOutput "✅ Archivo .env de producción creado" $ColorSuccess
}

function Build-Images {
    Write-ColoredOutput "🏗️ Construyendo imágenes Docker..." $ColorInfo

    # Construir backend
    Write-ColoredOutput "📦 Construyendo imagen del backend..." $ColorInfo
    & docker build -f backend/Dockerfile -t condor-expeditions-backend:latest ./backend
    if ($LASTEXITCODE -ne 0) {
        Write-ColoredOutput "❌ Error construyendo imagen del backend" $ColorError
        exit 1
    }

    # Construir frontend
    Write-ColoredOutput "🎨 Construyendo imagen del frontend..." $ColorInfo
    & docker build -f frontend/Dockerfile -t condor-expeditions-frontend:latest ./frontend
    if ($LASTEXITCODE -ne 0) {
        Write-ColoredOutput "❌ Error construyendo imagen del frontend" $ColorError
        exit 1
    }

    Write-ColoredOutput "✅ Imágenes construidas exitosamente" $ColorSuccess
}

function Deploy-Services {
    Write-ColoredOutput "🚀 Desplegando servicios..." $ColorInfo

    # Detener servicios existentes
    Write-ColoredOutput "🛑 Deteniendo servicios existentes..." $ColorInfo
    & docker-compose down

    # Iniciar servicios
    Write-ColoredOutput "▶️ Iniciando servicios..." $ColorInfo
    & docker-compose up -d

    # Esperar a que los servicios estén listos
    Write-ColoredOutput "⏳ Esperando a que los servicios estén listos..." $ColorInfo
    Start-Sleep -Seconds 30

    # Verificar estado de servicios
    Write-ColoredOutput "🔍 Verificando estado de servicios..." $ColorInfo
    & docker-compose ps

    Write-ColoredOutput "✅ Servicios desplegados exitosamente" $ColorSuccess
}

function Run-Migrations {
    Write-ColoredOutput "🗄️ Ejecutando migraciones de base de datos..." $ColorInfo

    & docker-compose exec backend uv run python manage.py migrate
    if ($LASTEXITCODE -ne 0) {
        Write-ColoredOutput "❌ Error ejecutando migraciones" $ColorError
        exit 1
    }

    & docker-compose exec backend uv run python manage.py setup_initial_data
    if ($LASTEXITCODE -ne 0) {
        Write-ColoredOutput "⚠️ Error ejecutando datos iniciales (puede ser normal en primera ejecución)" $ColorWarning
    }

    Write-ColoredOutput "✅ Migraciones ejecutadas" $ColorSuccess
}

function Test-Deployment {
    Write-ColoredOutput "🔍 Verificando despliegue..." $ColorInfo

    # Verificar health check del backend
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/health/" -UseBasicParsing
        Write-ColoredOutput "✅ Backend responde correctamente" $ColorSuccess
    }
    catch {
        Write-ColoredOutput "❌ Error: Backend no responde" $ColorError
        exit 1
    }

    # Verificar health check del frontend
    try {
        $response = Invoke-WebRequest -Uri "http://localhost/health" -UseBasicParsing
        Write-ColoredOutput "✅ Frontend responde correctamente" $ColorSuccess
    }
    catch {
        Write-ColoredOutput "❌ Error: Frontend no responde" $ColorError
        exit 1
    }

    Write-ColoredOutput "✅ Despliegue verificado exitosamente" $ColorSuccess
}

function Show-DeploymentInfo {
    Write-ColoredOutput "" $ColorInfo
    Write-ColoredOutput "🎉 ¡Despliegue completado exitosamente!" $ColorSuccess
    Write-ColoredOutput "" $ColorInfo

    Write-ColoredOutput "📊 Información del despliegue:" $ColorInfo
    Write-ColoredOutput "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" $ColorInfo

    Write-ColoredOutput "🌐 URLs de acceso:" $ColorInfo
    Write-ColoredOutput "   • Sitio web: http://localhost" $ColorSuccess
    Write-ColoredOutput "   • API Documentation: http://localhost:8000/api/docs" $ColorSuccess
    Write-ColoredOutput "   • Admin Panel: http://localhost:8000/admin" $ColorSuccess
    Write-ColoredOutput "" $ColorInfo

    Write-ColoredOutput "🛠️ Servicios disponibles:" $ColorInfo
    Write-ColoredOutput "   • Backend API: http://localhost:8000" $ColorSuccess
    Write-ColoredOutput "   • Frontend: http://localhost" $ColorSuccess
    Write-ColoredOutput "   • Base de datos: PostgreSQL en puerto 5432" $ColorSuccess
    Write-ColoredOutput "   • MongoDB: En puerto 27017" $ColorSuccess
    Write-ColoredOutput "   • Redis: En puerto 6379" $ColorSuccess
    Write-ColoredOutput "" $ColorInfo

    if ($Environment -eq 'dev') {
        Write-ColoredOutput "🔧 Herramientas de desarrollo:" $ColorInfo
        Write-ColoredOutput "   • PgAdmin: http://localhost:5050" $ColorSuccess
        Write-ColoredOutput "   • Mongo Express: http://localhost:8081" $ColorSuccess
        Write-ColoredOutput "" $ColorInfo

        Write-ColoredOutput "📧 Credenciales de desarrollo:" $ColorInfo
        Write-ColoredOutput "   • PgAdmin: admin@condorexpeditions.com / admin_password" $ColorSuccess
        Write-ColoredOutput "   • MongoDB: admin / admin_password" $ColorSuccess
        Write-ColoredOutput "" $ColorInfo
    }

    Write-ColoredOutput "📝 Comandos útiles:" $ColorInfo
    Write-ColoredOutput "   • Ver logs: docker-compose logs -f [servicio]" $ColorSuccess
    Write-ColoredOutput "   • Reiniciar servicio: docker-compose restart [servicio]" $ColorSuccess
    Write-ColoredOutput "   • Detener todo: docker-compose down" $ColorSuccess
    Write-ColoredOutput "   • Ver estado: docker-compose ps" $ColorSuccess
    Write-ColoredOutput "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" $ColorInfo
}

function Main {
    Write-ColoredOutput "🚀 Desplegando Condor Expeditions - Entorno: $Environment" $ColorInfo
    Write-ColoredOutput "📍 Directorio: $ProjectRoot" $ColorInfo

    # Cambiar al directorio del proyecto
    Set-Location $ProjectRoot

    # Verificar prerrequisitos
    Test-Prerequisites

    # Configurar entorno
    if ($Environment -eq 'dev') {
        Setup-DevEnvironment
    } elseif ($Environment -in 'prod', 'staging') {
        Setup-ProdEnvironment
    }

    # Construir imágenes (si no se omite)
    if (-not $SkipBuild) {
        Build-Images
    }

    # Desplegar servicios
    Deploy-Services

    # Ejecutar migraciones (si no se omiten)
    if (-not $SkipMigrations) {
        Run-Migrations
    }

    # Verificar despliegue
    Test-Deployment

    # Mostrar información
    Show-DeploymentInfo

    Write-ColoredOutput "¡Despliegue finalizado exitosamente!" $ColorSuccess
}

# Ejecutar función principal
Main