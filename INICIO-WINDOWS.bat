@echo off
chcp 65001 >nul
echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                                                                  ║
echo ║       🚀 COMIC READER PLATFORM - INICIO AUTOMÁTICO              ║
echo ║                                                                  ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.
echo 🔍 Verificando Docker...
echo.

docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker no está instalado o no está en PATH
    echo.
    echo 📥 Descarga Docker Desktop desde:
    echo    https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

echo ✅ Docker encontrado
echo.
echo 🚀 Iniciando aplicación con Docker Compose...
echo.
echo 📦 Esto creará automáticamente:
echo    - Base de datos PostgreSQL
echo    - Aplicación ASP.NET Core + React
echo    - Usuario admin (admin / Admin123!)
echo.
echo ⏳ Primera vez puede tardar 2-3 minutos...
echo.

docker compose up --build

if errorlevel 1 (
    echo.
    echo ❌ Error al iniciar. Intenta:
    echo    1. Abre Docker Desktop manualmente
    echo    2. Espera a que esté completamente iniciado
    echo    3. Ejecuta este script de nuevo
    echo.
    echo 📚 O usa PowerShell: .\start.ps1
    pause
    exit /b 1
)
