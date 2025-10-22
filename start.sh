#!/bin/bash

echo "🚀 Iniciando Comic Reader Platform..."
echo ""

# Verificar si Docker está disponible
DOCKER_COMPOSE_CMD=""

if command -v docker &> /dev/null; then
    # Probar 'docker compose' (nuevo)
    if docker compose version &> /dev/null; then
        DOCKER_COMPOSE_CMD="docker compose"
    # Probar 'docker-compose' (antiguo)
    elif command -v docker-compose &> /dev/null; then
        DOCKER_COMPOSE_CMD="docker-compose"
    fi
fi

if [ -n "$DOCKER_COMPOSE_CMD" ]; then
    echo "🐳 Docker detectado. ¿Deseas usar Docker? (Recomendado)"
    echo "1) Sí - Usar Docker (automático, incluye PostgreSQL)"
    echo "2) No - Ejecutar localmente (requiere PostgreSQL instalado)"
    read -p "Selecciona una opción (1/2): " choice

    if [ "$choice" = "1" ]; then
        echo ""
        echo "🐳 Iniciando con Docker..."
        echo "📦 Esto creará automáticamente:"
        echo "   - Base de datos PostgreSQL"
        echo "   - Aplicación ASP.NET Core"
        echo "   - Usuario admin por defecto (admin / Admin123!)"
        echo ""

        $DOCKER_COMPOSE_CMD up --build
        exit 0
    fi
fi

echo ""
echo "⚙️  Iniciando localmente..."
echo ""

# Verificar si .NET está instalado
if ! command -v dotnet &> /dev/null; then
    echo "❌ Error: .NET 8.0 SDK no está instalado"
    echo "   Descárgalo desde: https://dotnet.microsoft.com/download"
    exit 1
fi

# Verificar si PostgreSQL está corriendo
echo "🔍 Verificando PostgreSQL..."
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    echo "⚠️  PostgreSQL no está corriendo en localhost:5432"
    echo "   Por favor, inicia PostgreSQL o usa Docker con la opción 1"
    echo ""
    read -p "¿Continuar de todas formas? (s/n): " continue
    if [ "$continue" != "s" ]; then
        exit 1
    fi
fi

echo ""
echo "📦 Restaurando paquetes NuGet..."
dotnet restore

echo ""
echo "🔄 La aplicación aplicará migraciones automáticamente al iniciar"
echo "👤 Se creará un usuario admin por defecto si no existe:"
echo "   Usuario: admin"
echo "   Contraseña: Admin123!"
echo ""

echo "🚀 Iniciando aplicación..."
echo ""
echo "📍 La aplicación estará disponible en:"
echo "   🌐 http://localhost:5000"
echo "   📚 Swagger: http://localhost:5000/swagger"
echo ""

dotnet run
