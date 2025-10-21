# PowerShell script para Windows

Write-Host "🚀 Iniciando Comic Reader Platform..." -ForegroundColor Cyan
Write-Host ""

# Verificar si Docker está disponible
$dockerAvailable = Get-Command docker -ErrorAction SilentlyContinue
$dockerComposeAvailable = Get-Command docker-compose -ErrorAction SilentlyContinue

if ($dockerAvailable -and $dockerComposeAvailable) {
    Write-Host "🐳 Docker detectado. ¿Deseas usar Docker? (Recomendado)" -ForegroundColor Yellow
    Write-Host "1) Sí - Usar Docker (automático, incluye PostgreSQL)"
    Write-Host "2) No - Ejecutar localmente (requiere PostgreSQL instalado)"
    $choice = Read-Host "Selecciona una opción (1/2)"

    if ($choice -eq "1") {
        Write-Host ""
        Write-Host "🐳 Iniciando con Docker Compose..." -ForegroundColor Cyan
        Write-Host "📦 Esto creará automáticamente:" -ForegroundColor Green
        Write-Host "   - Base de datos PostgreSQL"
        Write-Host "   - Aplicación ASP.NET Core"
        Write-Host "   - Usuario admin por defecto (admin / Admin123!)"
        Write-Host ""

        docker-compose up --build
        exit 0
    }
}

Write-Host ""
Write-Host "⚙️  Iniciando localmente..." -ForegroundColor Cyan
Write-Host ""

# Verificar si .NET está instalado
$dotnetAvailable = Get-Command dotnet -ErrorAction SilentlyContinue
if (-not $dotnetAvailable) {
    Write-Host "❌ Error: .NET 8.0 SDK no está instalado" -ForegroundColor Red
    Write-Host "   Descárgalo desde: https://dotnet.microsoft.com/download"
    exit 1
}

Write-Host "📦 Restaurando paquetes NuGet..." -ForegroundColor Yellow
dotnet restore

Write-Host ""
Write-Host "🔄 La aplicación aplicará migraciones automáticamente al iniciar" -ForegroundColor Green
Write-Host "👤 Se creará un usuario admin por defecto si no existe:" -ForegroundColor Green
Write-Host "   Usuario: admin"
Write-Host "   Contraseña: Admin123!"
Write-Host ""

Write-Host "🚀 Iniciando aplicación..." -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 La aplicación estará disponible en:" -ForegroundColor Yellow
Write-Host "   🌐 http://localhost:5000"
Write-Host "   📚 Swagger: http://localhost:5000/swagger"
Write-Host ""

dotnet run
