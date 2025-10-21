# 🚀 Plataforma completa de Comics con React y ASP.NET Core

## 📋 Resumen

Implementación completa de una plataforma web para lectura y gestión de comics con **React 18** y **ASP.NET Core 8.0**.

## ✨ Características Implementadas

### Backend (ASP.NET Core)
- ✅ **Autenticación JWT** con sesión de 30 días
- ✅ **Hash de contraseñas** con BCrypt
- ✅ **Sistema de roles** (Administrador/Usuario)
- ✅ **Modelos completos**: User, Comic, Favorito, Voto, HistorialLectura
- ✅ **API RESTful** con 3 controladores principales
- ✅ **Sistema de aprobación** de comics por administradores
- ✅ **Entity Framework Core** con PostgreSQL

### Frontend (React)
- ✅ **SPA completa** con React 18 (vanilla JS, sin bundler)
- ✅ **Autenticación** (Login, Registro)
- ✅ **Explorar y listar** comics aprobados
- ✅ **Subida de comics** con validación
- ✅ **Panel de administración** para aprobar/rechazar comics
- ✅ **Sistema de favoritos** y votación
- ✅ **Historial de lectura** automático
- ✅ **Perfil de usuario** con estadísticas
- ✅ **Visor de comics** (PDF, CBZ, CBR, imágenes)

### 🚀 Inicio Automático
- ✅ **Docker Compose** - Levantar TODO con un comando
- ✅ **Inicialización automática** de base de datos
- ✅ **Creación automática** de usuario admin
- ✅ **Scripts de inicio** para Linux/Mac/Windows

## 🎯 Funcionalidades de Usuario

- Registro e inicio de sesión seguro
- Explorar comics aprobados
- Leer comics en múltiples formatos (PDF, CBZ, CBR, JPG, PNG)
- Subir comics (requiere aprobación de admin)
- Agregar comics a favoritos
- Votar por comics
- Historial de lectura automático
- Perfil con estadísticas personales

## 🛡️ Funcionalidades de Administrador

- Panel de administración
- Aprobar/Rechazar comics pendientes
- Ver todos los usuarios registrados
- Gestión completa de contenido

## 🚀 Cómo Iniciar

### Con Docker (Recomendado):
```bash
docker-compose up --build
```

### Con Scripts:
```bash
./start.sh        # Linux/Mac
.\start.ps1       # Windows
```

### Directo:
```bash
dotnet run
```

**Accede a:** http://localhost:5000

**Credenciales por defecto:**
- Usuario: `admin`
- Contraseña: `Admin123!`

## 📁 Archivos Importantes

- `README.md` - Documentación completa
- `INICIO-RAPIDO.md` - Guía de inicio rápido
- `COMO-INICIAR.txt` - Guía visual paso a paso
- `docker-compose.yml` - Configuración Docker
- `Data/DbInitializer.cs` - Inicialización automática

## 🔐 Seguridad

- Autenticación JWT con tokens seguros
- Hashing de contraseñas con BCrypt
- Autorización basada en roles
- Validación de datos en backend
- Sistema de aprobación de contenido

## 🧪 Testing

La aplicación está lista para probar inmediatamente después de ejecutar `docker-compose up --build`.

## 📝 Endpoints de la API

### Autenticación (`/api/auth`)
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Usuario actual
- `GET /api/auth/users` - Listar usuarios (Admin)

### Comics (`/api/comics`)
- `GET /api/comics` - Listar comics aprobados
- `GET /api/comics/pending` - Comics pendientes (Admin)
- `POST /api/comics/upload` - Subir comic
- `PUT /api/comics/{id}/approve` - Aprobar comic (Admin)
- `DELETE /api/comics/{id}/reject` - Rechazar comic (Admin)
- `GET /api/comics/view/{id}` - Ver comic
- `GET /api/comics/download/{id}` - Descargar comic
- Y más...

### Interacciones (`/api/user`)
- `POST /api/user/favorites/{id}` - Agregar a favoritos
- `DELETE /api/user/favorites/{id}` - Quitar de favoritos
- `GET /api/user/favorites` - Listar favoritos
- `POST /api/user/votes/{id}` - Votar
- `DELETE /api/user/votes/{id}` - Quitar voto
- `GET /api/user/votes` - Listar votos
- `POST /api/user/history/{id}` - Registrar lectura
- `GET /api/user/history` - Ver historial
- `GET /api/user/stats` - Estadísticas del usuario

## 🔄 Cambios en esta PR

### Commits principales:
1. **Implementación completa del backend** (146e5e7)
   - Autenticación JWT
   - Sistema de roles
   - Modelos y controladores
   - Servicios y DTOs

2. **Frontend React completo** (7097f4a)
   - Todos los componentes
   - Sistema de autenticación
   - Integración con API

3. **Sistema de inicio automático** (48fc0d3)
   - Docker Compose
   - Inicialización automática
   - Scripts multiplataforma

### Archivos modificados:
- Backend: 19 archivos (Controllers, Models, DTOs, Services, Data)
- Frontend: 16 archivos (Components, Utils, Config)
- Docker: 5 archivos (Dockerfile, docker-compose, scripts)
- Documentación: 4 archivos (README, guías)

## ✅ Checklist

- [x] Backend completamente funcional
- [x] Frontend completamente funcional
- [x] Autenticación y autorización implementadas
- [x] Sistema de roles funcionando
- [x] Base de datos configurada
- [x] Docker Compose funcionando
- [x] Documentación completa
- [x] Scripts de inicio creados
- [x] Usuario admin por defecto
- [x] Inicialización automática de BD
- [x] Migraciones automáticas

## 🎊 Resultado

Una plataforma completamente funcional que se puede iniciar con un solo comando (`docker-compose up --build`) y está lista para usar inmediatamente con usuario admin preconfigurado.

## 📸 Screenshots

*La aplicación incluye:*
- Página de login/registro
- Dashboard con listado de comics
- Visor de comics
- Panel de administración
- Perfil de usuario con estadísticas
- Sistema de favoritos y votos
- Historial de lectura

## 🚀 Deploy

La aplicación está lista para deploy con Docker en cualquier plataforma que soporte Docker Compose (AWS, Azure, DigitalOcean, etc.)

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
