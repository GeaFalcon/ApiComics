# 🚀 Inicio Rápido

## Opción 1: Con Docker (Recomendado - TODO AUTOMÁTICO)

### Requisitos
- Docker Desktop (incluye Docker Compose)

### Comando único

**Linux/Mac:**
```bash
docker compose up --build
```

**Windows (PowerShell):**
```powershell
docker compose up --build
```

> **Nota:** En versiones modernas de Docker Desktop es `docker compose` (con espacio), no `docker-compose`

¡Eso es todo! Esto automáticamente:
- ✅ Levanta PostgreSQL
- ✅ Compila la aplicación
- ✅ Aplica migraciones
- ✅ Crea usuario admin (admin / Admin123!)
- ✅ Inicia la aplicación

**Accede a:** http://localhost:5000

Para detener:
```bash
docker compose down
```

---

## Opción 2: Con Script de Inicio (Automático)

### Linux/Mac
```bash
./start.sh
```

### Windows (PowerShell)
```powershell
.\start.ps1
```

El script detecta Docker automáticamente y te pregunta si quieres usarlo.

---

## Opción 3: Sin Docker (Manual)

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
    "DefaultConnection": "Host=localhost;Port=5432;Database=comicdb;Username=TU_USUARIO;Password=TU_PASSWORD"
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
**Con Docker:** Espera unos segundos y reintenta. PostgreSQL tarda en iniciar.
**Sin Docker:** Verifica que PostgreSQL esté corriendo:
```bash
# Linux/Mac
pg_isready -h localhost -p 5432

# Windows
pg_isready.exe -h localhost -p 5432
```

### Error: "Puerto 5000 ya en uso"
Cambia el puerto en `docker-compose.yml` o `appsettings.json`:
```yaml
# docker-compose.yml
ports:
  - "5001:5000"  # Cambia 5001 al puerto que prefieras
```

### Reiniciar desde cero (Docker)
```bash
docker compose down -v
docker compose up --build
```

---

## 📚 Más Información

Ver [README.md](README.md) para documentación completa.
