# PowerShell script para Windows

Write-Host "🚀 Iniciando Comic Reader Platform..." -ForegroundColor Cyan
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
