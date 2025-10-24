# 🚀 Inicio Rápido

## Opción 1: Con Script de Inicio (Automático)

### Linux/Mac
```bash
./start.sh
```

### Windows (PowerShell)
```powershell
.\start.ps1
```

---

## Opción 2: Manual

### Requisitos
- .NET 8.0 SDK
- PostgreSQL 12+

### Pasos

1. **Crea la base de datos en PostgreSQL:**
```sql
CREATE DATABASE comicdb;
```

2. **Actualiza `appsettings.json`** (si es necesario):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5433;Database=comicdb;Username=TU_USUARIO;Password=TU_PASSWORD"
  }
}
```

3. **Ejecuta:**
```bash
dotnet run
```

La aplicación automáticamente:
- ✅ Aplica migraciones
- ✅ Crea usuario admin (admin / Admin123!)
- ✅ Inicia el servidor

**Accede a:** http://localhost:5000

---

## 👤 Credenciales por Defecto

**Usuario:** admin
**Contraseña:** Admin123!

⚠️ **IMPORTANTE:** Cambia la contraseña después del primer inicio de sesión.

---

## 📍 URLs Importantes

- **Aplicación:** http://localhost:5000
- **Swagger (API Docs):** http://localhost:5000/swagger
- **Login:** http://localhost:5000/#/login

---

## 🐛 Solución de Problemas

### Error: "No se puede conectar a la base de datos"
Verifica que PostgreSQL esté corriendo:
```bash
# Linux/Mac
pg_isready -h localhost -p 5433

# Windows
pg_isready.exe -h localhost -p 5433
```

### Error: "Puerto 5000 ya en uso"
Cambia el puerto en `appsettings.json` o detén el proceso que está usando el puerto 5000.

---

## 📚 Más Información

Ver [README.md](README.md) para documentación completa.
