#!/bin/bash

echo "🚀 Iniciando Comic Reader Platform..."
echo ""

# Verificar si .NET está instalado
if ! command -v dotnet &> /dev/null; then
    echo "❌ Error: .NET 8.0 SDK no está instalado"
    echo "   Descárgalo desde: https://dotnet.microsoft.com/download"
    exit 1
fi

# Verificar si PostgreSQL está corriendo
echo "🔍 Verificando PostgreSQL..."
if ! pg_isready -h localhost -p 5432 &> /dev/null && ! pg_isready -h localhost -p 5433 &> /dev/null; then
    echo "⚠️  PostgreSQL no está corriendo"
    echo "   Por favor, inicia PostgreSQL antes de continuar"
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
