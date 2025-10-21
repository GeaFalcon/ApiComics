# Comic Reader Platform

Plataforma web completa para lectura y gestión de comics, desarrollada con **ASP.NET Core 8.0** y **React 18**.

## 🚀 Inicio Rápido

### Opción 1: Docker (Recomendado - Un Solo Comando)

```bash
docker-compose up --build
```

Accede a http://localhost:5000 y usa:
- **Usuario:** admin
- **Contraseña:** Admin123!

### Opción 2: Script de Inicio

**Linux/Mac:**
```bash
./start.sh
```

**Windows:**
```powershell
.\start.ps1
```

### Opción 3: Ejecutar Directamente

```bash
dotnet run
```

> **Nota:** Con cualquier opción, la aplicación automáticamente:
> - ✅ Aplica migraciones de base de datos
> - ✅ Crea usuario administrador por defecto
> - ✅ Configura todo lo necesario
>
> Ver [INICIO-RAPIDO.md](INICIO-RAPIDO.md) para más detalles.

---

## Características Principales

### Funcionalidades de Usuario
- ✅ **Registro y Login** con autenticación JWT (sesión de 30 días)
- ✅ **Explorar comics** aprobados por administradores
- ✅ **Leer comics** en formatos PDF, CBZ, CBR, JPG, PNG
- ✅ **Subir comics** para revisión de administradores
- ✅ **Agregar a favoritos** los comics preferidos
- ✅ **Votar** por los comics favoritos
- ✅ **Historial de lectura** con registro automático
- ✅ **Perfil de usuario** con estadísticas personales

### Funcionalidades de Administrador
- ✅ **Panel de administración** para aprobar/rechazar comics
- ✅ **Gestión de usuarios** y contenido
- ✅ **Sistema de aprobación** de comics subidos

## Tecnologías Utilizadas

### Backend
- ASP.NET Core 8.0
- Entity Framework Core 9.0
- PostgreSQL (Base de datos)
- JWT Bearer Authentication
- BCrypt.Net (Hashing de contraseñas)

### Frontend
- React 18
- Vanilla JavaScript (sin bundler)
- CSS-in-JS para estilos
- Babel Standalone para transpilación

## Estructura del Proyecto

```
ApiComics/
├── Controllers/
│   ├── UsersControlles.cs         # Autenticación y gestión de usuarios
│   ├── ComicsController.cs        # CRUD y gestión de comics
│   └── UserInteractionsController.cs  # Favoritos, votos, historial
├── Models/
│   ├── User.cs                    # Modelo de usuario
│   ├── Comic.cs                   # Modelo de comic
│   ├── Favorito.cs               # Modelo de favoritos
│   ├── Voto.cs                   # Modelo de votos
│   └── HistorialLectura.cs       # Modelo de historial
├── DTOs/
│   ├── RegisterDto.cs
│   ├── LoginDto.cs
│   ├── AuthResponseDto.cs
│   └── ComicUploadDto.cs
├── Services/
│   ├── IJwtService.cs
│   └── JwtService.cs
├── Data/
│   └── ApplicationDbContext.cs
├── wwwroot/                       # Frontend React
│   ├── index.html
│   ├── js/
│   │   ├── config.js
│   │   ├── utils/
│   │   │   ├── auth.js
│   │   │   └── api.js
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── ComicList.js
│   │   │   ├── ComicUpload.js
│   │   │   ├── ComicDetail.js
│   │   │   ├── AdminPanel.js
│   │   │   ├── Favorites.js
│   │   │   ├── ReadingHistory.js
│   │   │   └── UserProfile.js
│   │   └── App.js
│   └── uploads/                   # Archivos de comics subidos
└── Program.cs
```

## Configuración e Instalación

### Requisitos Previos
- .NET 8.0 SDK
- PostgreSQL 12+
- Editor de código (VS Code, Visual Studio, etc.)

### Paso 1: Configurar Base de Datos

1. Crea una base de datos PostgreSQL:
```sql
CREATE DATABASE comicdb;
```

2. Actualiza la cadena de conexión en `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=comicdb;Username=tu_usuario;Password=tu_contraseña"
  }
}
```

3. **IMPORTANTE**: Actualiza el `SecretKey` en `appsettings.json` con una clave segura de tu elección:
```json
{
  "JwtSettings": {
    "SecretKey": "TU_CLAVE_SECRETA_SUPER_SEGURA_DE_AL_MENOS_32_CARACTERES",
    "Issuer": "ComicReaderBackend",
    "Audience": "ComicReaderFrontend",
    "ExpirationDays": "30"
  }
}
```

### Paso 2: Aplicar Migraciones

Ejecuta los siguientes comandos en la terminal:

```bash
# Eliminar migraciones antiguas (si existen)
dotnet ef migrations remove --force

# Crear nueva migración
dotnet ef migrations add InitialMigration

# Aplicar migración a la base de datos
dotnet ef database update
```

### Paso 3: Crear Usuario Administrador

Puedes crear el primer usuario administrador de dos formas:

#### Opción 1: Usar Swagger/Postman

1. Ejecuta la aplicación:
```bash
dotnet run
```

2. Navega a `https://localhost:5001/swagger` (o `http://localhost:5000/swagger`)

3. Usa el endpoint `POST /api/auth/register` para crear un usuario

4. Conéctate a la base de datos y actualiza el rol:
```sql
UPDATE "Users" SET "Role" = 'Admin' WHERE "Username" = 'tu_usuario';
```

#### Opción 2: Directamente en la Base de Datos

```sql
INSERT INTO "Users" ("Username", "Email", "PasswordHash", "Role", "FechaRegistro")
VALUES (
  'admin',
  'admin@comicreader.com',
  '$2a$11$ejemplo.de.hash.bcrypt.generado',  -- Genera esto usando BCrypt
  'Admin',
  NOW()
);
```

> **Nota**: Para generar un hash BCrypt de una contraseña, puedes usar herramientas online o crear un pequeño script en C#.

### Paso 4: Ejecutar la Aplicación

```bash
dotnet run
```

La aplicación estará disponible en:
- HTTPS: https://localhost:5001
- HTTP: http://localhost:5000

## Endpoints de la API

### Autenticación (`/api/auth`)
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual (requiere autenticación)
- `GET /api/auth/users` - Listar todos los usuarios (solo Admin)

### Comics (`/api/comics`)
- `GET /api/comics` - Listar comics aprobados
- `GET /api/comics/{id}` - Obtener comic por ID
- `GET /api/comics/pending` - Listar comics pendientes (solo Admin)
- `GET /api/comics/my-uploads` - Listar mis comics subidos (requiere autenticación)
- `POST /api/comics/upload` - Subir nuevo comic (requiere autenticación)
- `PUT /api/comics/{id}/approve` - Aprobar comic (solo Admin)
- `DELETE /api/comics/{id}/reject` - Rechazar comic (solo Admin)
- `GET /api/comics/view/{id}` - Ver comic (requiere autenticación)
- `GET /api/comics/download/{id}` - Descargar comic (requiere autenticación)
- `DELETE /api/comics/{id}` - Eliminar comic (Admin o propietario)

### Interacciones de Usuario (`/api/user`)

#### Favoritos
- `POST /api/user/favorites/{comicId}` - Agregar a favoritos
- `DELETE /api/user/favorites/{comicId}` - Quitar de favoritos
- `GET /api/user/favorites` - Listar favoritos

#### Votos
- `POST /api/user/votes/{comicId}` - Votar por comic
- `DELETE /api/user/votes/{comicId}` - Quitar voto
- `GET /api/user/votes` - Listar comics votados
- `GET /api/user/votes/check/{comicId}` - Verificar si ha votado

#### Historial
- `POST /api/user/history/{comicId}` - Registrar lectura
- `GET /api/user/history` - Obtener historial de lectura
- `DELETE /api/user/history/{comicId}` - Eliminar del historial

#### Estadísticas
- `GET /api/user/stats` - Obtener estadísticas del usuario

## Uso de la Aplicación

### Como Usuario

1. **Registrarse**: Crea una cuenta con usuario, email y contraseña
2. **Explorar Comics**: Ve todos los comics aprobados en la página principal
3. **Leer Comics**: Haz clic en "Leer" para ver el comic
4. **Votar y Favoritos**: Interactúa con los comics que te gusten
5. **Subir Comics**: Sube tus propios comics para revisión
6. **Ver Perfil**: Revisa tus estadísticas y comics subidos

### Como Administrador

1. **Panel de Admin**: Accede al panel desde el menú
2. **Revisar Comics**: Ve todos los comics pendientes de aprobación
3. **Aprobar/Rechazar**: Decide qué comics se publican
4. **Gestionar Usuarios**: Ve la lista de todos los usuarios

## Formatos de Comics Soportados

- **CBZ** (Comic Book ZIP) - Recomendado
- **CBR** (Comic Book RAR)
- **PDF** (Portable Document Format)
- **JPG/JPEG** (Imágenes individuales)
- **PNG** (Imágenes individuales)

## Seguridad

### Implementado
- ✅ Autenticación JWT con tokens de 30 días
- ✅ Hashing de contraseñas con BCrypt
- ✅ Autorización basada en roles (Admin/Usuario)
- ✅ Validación de datos en backend
- ✅ Protección de endpoints con `[Authorize]`
- ✅ Sistema de aprobación para contenido subido

### Recomendaciones Adicionales
- 🔒 Usa HTTPS en producción
- 🔒 Cambia el `SecretKey` de JWT en `appsettings.json`
- 🔒 Configura CORS apropiadamente para producción
- 🔒 Implementa rate limiting para prevenir abuso
- 🔒 Agrega logs de auditoría

## Solución de Problemas

### Error de Migración
```bash
# Eliminar todas las migraciones y empezar de nuevo
dotnet ef database drop --force
dotnet ef migrations remove --force
dotnet ef migrations add InitialMigration
dotnet ef database update
```

### Error de Conexión a Base de Datos
- Verifica que PostgreSQL esté corriendo
- Verifica las credenciales en `appsettings.json`
- Verifica que el puerto sea el correcto (default: 5432)

### Error 401 Unauthorized
- Verifica que el token JWT sea válido
- Revisa que el `Authorization` header esté presente
- Verifica que el `SecretKey` en backend coincida

## Próximas Mejoras

- [ ] Implementar recuperación de contraseña por email
- [ ] Agregar categorías y etiquetas a los comics
- [ ] Sistema de comentarios y reseñas
- [ ] Búsqueda avanzada y filtros
- [ ] Soporte para leer comics por páginas (CBZ/CBR)
- [ ] Modo oscuro
- [ ] Notificaciones en tiempo real
- [ ] API REST completa con documentación OpenAPI

## Contribuciones

¡Las contribuciones son bienvenidas! Por favor:
1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## Contacto

Para preguntas o sugerencias, por favor abre un issue en el repositorio.

---

**Desarrollado con ❤️ usando ASP.NET Core y React**
