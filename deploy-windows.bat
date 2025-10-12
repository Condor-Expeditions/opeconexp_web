@echo off
setlocal enabledelayedexpansion

REM =================================================================
REM Script de Despliegue para Windows - Condor Expeditions
REM =================================================================
REM Uso: deploy-windows.bat [dev|prod|staging]
REM Ejemplo: deploy-windows.bat dev

set "ENVIRONMENT=%~1"
if "%ENVIRONMENT%"=="" set "ENVIRONMENT=dev"

echo 🚀 Desplegando Condor Expeditions - Entorno: %ENVIRONMENT%
echo 📍 Directorio: %~dp0

REM Función para mostrar ayuda
:show_help
if "%ENVIRONMENT%"=="--help" goto :help
if "%ENVIRONMENT%"=="-h" goto :help
goto :main

:help
echo Uso: %0 [environment]
echo.
echo Entornos disponibles:
echo   dev     - Desarrollo (por defecto)
echo   prod    - Producción
echo   staging - Staging
echo.
echo Ejemplos:
echo   %0 dev
echo   %0 prod
pause
exit /b 1

:main
echo 🏁 Iniciando proceso de despliegue...

if "%ENVIRONMENT%"=="dev" (
    call :setup_dev
    call :build_images
    call :deploy_services
    call :run_migrations
    call :verify_deployment
    call :show_info
) else if "%ENVIRONMENT%"=="prod" (
    call :setup_prod
    call :build_images
    call :deploy_services
    call :run_migrations
    call :verify_deployment
    call :show_info
) else if "%ENVIRONMENT%"=="staging" (
    echo 🚧 Despliegue en staging...
    call :setup_prod
    call :build_images
    call :deploy_services
    call :run_migrations
    call :verify_deployment
    call :show_info
) else (
    echo ❌ Entorno no reconocido: %ENVIRONMENT%
    goto :help
)

goto :end

REM =================================================================
REM FUNCIONES DE CONFIGURACIÓN
REM =================================================================

:setup_dev
echo 🔧 Configurando entorno de desarrollo...

REM Crear archivo .env si no existe
if not exist ".env" (
    copy ".env.example" ".env" >nul
    echo ✅ Archivo .env creado desde .env.example
)

REM Crear directorios necesarios
if not exist "logs" mkdir logs
if not exist "ssl" mkdir ssl

REM Generar certificados SSL auto-firmados para desarrollo
if not exist "ssl\server.crt" (
    echo 🔐 Generando certificados SSL para desarrollo...
    openssl req -x509 -newkey rsa:4096 -keyout ssl/server.key -out ssl/server.crt -days 365 -nodes -subj "/CN=localhost" 2>nul
    if errorlevel 1 (
        echo ⚠️ OpenSSL no disponible, omitiendo certificados SSL
    ) else (
        echo ✅ Certificados SSL generados
    )
)

echo ✅ Entorno de desarrollo configurado
goto :eof

:setup_prod
echo 🔧 Configurando entorno de producción...

REM Verificar variables de entorno requeridas
set "required_vars=SECRET_KEY DB_PASSWORD MONGODB_PASSWORD EMAIL_HOST_PASSWORD STRIPE_SECRET_KEY STRIPE_WEBHOOK_SECRET"
for %%v in (%required_vars%) do (
    if "!%%v!"=="" (
        echo ❌ Variable de entorno requerida no definida: %%v
        echo 💡 Configure las variables de entorno antes de desplegar en producción
        pause
        exit /b 1
    )
)

REM Crear archivo .env desde variables de entorno
echo SECRET_KEY=!SECRET_KEY! > .env
echo DEBUG=False >> .env
echo DB_ENGINE=django.db.backends.postgresql >> .env
echo DB_NAME=condor_expeditions >> .env
echo DB_USER=condor_user >> .env
echo DB_PASSWORD=!DB_PASSWORD! >> .env
echo DB_HOST=db >> .env
echo DB_PORT=5432 >> .env
echo MONGODB_HOST=mongodb >> .env
echo MONGODB_PORT=27017 >> .env
echo MONGODB_NAME=condor_expeditions >> .env
echo MONGODB_USER=!MONGODB_USER! >> .env
echo MONGODB_PASSWORD=!MONGODB_PASSWORD! >> .env
echo REDIS_URL=redis://redis:6379/0 >> .env
echo EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend >> .env
echo EMAIL_HOST=!EMAIL_HOST! >> .env
echo EMAIL_PORT=!EMAIL_PORT! >> .env
echo EMAIL_USE_TLS=True >> .env
echo EMAIL_HOST_USER=!EMAIL_HOST_USER! >> .env
echo EMAIL_HOST_PASSWORD=!EMAIL_HOST_PASSWORD! >> .env
echo STRIPE_PUBLIC_KEY=!STRIPE_PUBLIC_KEY! >> .env
echo STRIPE_SECRET_KEY=!STRIPE_SECRET_KEY! >> .env
echo STRIPE_WEBHOOK_SECRET=!STRIPE_WEBHOOK_SECRET! >> .env
echo PAYPAL_CLIENT_ID=!PAYPAL_CLIENT_ID! >> .env
echo PAYPAL_CLIENT_SECRET=!PAYPAL_CLIENT_SECRET! >> .env
echo PAYPAL_MODE=live >> .env
echo AWS_ACCESS_KEY_ID=!AWS_ACCESS_KEY_ID! >> .env
echo AWS_SECRET_ACCESS_KEY=!AWS_SECRET_ACCESS_KEY! >> .env
echo AWS_STORAGE_BUCKET_NAME=!AWS_STORAGE_BUCKET_NAME! >> .env
echo AWS_S3_REGION_NAME=!AWS_S3_REGION_NAME! >> .env
echo FRONTEND_URL=!FRONTEND_URL! >> .env
echo ALLOWED_HOSTS=!ALLOWED_HOSTS! >> .env
echo CORS_ALLOWED_ORIGINS=!CORS_ALLOWED_ORIGINS! >> .env
echo LANGUAGE_CODE=es >> .env
echo TIME_ZONE=America/Guayaquil >> .env

echo ✅ Archivo .env de producción creado
goto :eof

:build_images
echo 🏗️ Construyendo imágenes Docker...

REM Construir backend
echo 📦 Construyendo imagen del backend...
docker build -f backend/Dockerfile -t condor-expeditions-backend:latest ./backend
if errorlevel 1 (
    echo ❌ Error construyendo imagen del backend
    pause
    exit /b 1
)

REM Construir frontend
echo 🎨 Construyendo imagen del frontend...
docker build -f frontend/Dockerfile -t condor-expeditions-frontend:latest ./frontend
if errorlevel 1 (
    echo ❌ Error construyendo imagen del frontend
    pause
    exit /b 1
)

echo ✅ Imágenes construidas exitosamente
goto :eof

:deploy_services
echo 🚀 Desplegando servicios...

REM Detener servicios existentes
echo 🛑 Deteniendo servicios existentes...
docker-compose down

REM Iniciar servicios
echo ▶️ Iniciando servicios...
docker-compose up -d

REM Esperar a que los servicios estén listos
echo ⏳ Esperando a que los servicios estén listos...
timeout /t 30 /nobreak >nul

REM Verificar estado de servicios
echo 🔍 Verificando estado de servicios...
docker-compose ps

echo ✅ Servicios desplegados exitosamente
goto :eof

:run_migrations
echo 🗄️ Ejecutando migraciones de base de datos...

docker-compose exec backend uv run python manage.py migrate
if errorlevel 1 (
    echo ❌ Error ejecutando migraciones
    pause
    exit /b 1
)

docker-compose exec backend uv run python manage.py setup_initial_data
if errorlevel 1 (
    echo ⚠️ Error ejecutando datos iniciales (puede ser normal en primera ejecución)
)

echo ✅ Migraciones ejecutadas
goto :eof

:verify_deployment
echo 🔍 Verificando despliegue...

REM Verificar health check del backend
curl -f http://localhost:8000/health/ >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Backend no responde
    pause
    exit /b 1
) else (
    echo ✅ Backend responde correctamente
)

REM Verificar health check del frontend
curl -f http://localhost/health >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Frontend no responde
    pause
    exit /b 1
) else (
    echo ✅ Frontend responde correctamente
)

echo ✅ Despliegue verificado exitosamente
goto :eof

:show_info
echo.
echo 🎉 ¡Despliegue completado exitosamente!
echo.
echo 📊 Información del despliegue:
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🌐 URLs de acceso:
echo    • Sitio web: http://localhost
echo    • API Documentation: http://localhost:8000/api/docs
echo    • Admin Panel: http://localhost:8000/admin
echo.
echo 🛠️ Servicios disponibles:
echo    • Backend API: http://localhost:8000
echo    • Frontend: http://localhost
echo    • Base de datos: PostgreSQL en puerto 5432
echo    • MongoDB: En puerto 27017
echo    • Redis: En puerto 6379
echo.
if "%ENVIRONMENT%"=="dev" (
    echo 🔧 Herramientas de desarrollo:
    echo    • PgAdmin: http://localhost:5050
    echo    • Mongo Express: http://localhost:8081
    echo.
    echo 📧 Credenciales de desarrollo:
    echo    • PgAdmin: admin@condorexpeditions.com / admin_password
    echo    • MongoDB: admin / admin_password
)
echo.
echo 📝 Comandos útiles:
echo    • Ver logs: docker-compose logs -f [servicio]
echo    • Reiniciar servicio: docker-compose restart [servicio]
echo    • Detener todo: docker-compose down
echo    • Ver estado: docker-compose ps
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
goto :eof

:end
echo.
echo ¡Despliegue finalizado!
pause