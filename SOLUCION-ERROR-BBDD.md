# Solución al Error "relation Users does not exist"

## Problema Identificado

Las migraciones antiguas solo creaban la tabla `Comics`, faltaban todas las demás tablas necesarias:
- Users
- Favoritos
- Votos
- HistorialLecturas

## Solución Aplicada

Se eliminaron las migraciones desactualizadas y se actualizó el `DbInitializer` para usar `EnsureCreated()`, que crea automáticamente todas las tablas basándose en los modelos actuales.

## Pasos para Resolver el Error

### 1. Detener la aplicación

```bash
# Presiona Ctrl+C en la terminal donde está corriendo
```

### 2. Eliminar la base de datos y recrearla

**En PostgreSQL (psql o pgAdmin):**

```sql
DROP DATABASE comicdb;
CREATE DATABASE comicdb;
```

### 3. Reiniciar la aplicación

```bash
dotnet run
```

## Qué Esperar

Ahora deberías ver en los logs:

```
🔄 Iniciando configuración de base de datos...
📦 No se encontraron migraciones. Usando EnsureCreated...
✅ Base de datos y tablas creadas correctamente
👤 Creando usuario administrador por defecto...
✅ Usuario administrador creado:
   👤 Usuario: admin
   📧 Email: admin@comicreader.com
   🔑 Contraseña: Admin123!
✅ Base de datos configurada correctamente
```

## Usuario Administrador por Defecto

El sistema crea automáticamente un usuario administrador:

- **Usuario:** admin
- **Email:** admin@comicreader.com
- **Contraseña:** Admin123!

**⚠️ IMPORTANTE:** Cambia la contraseña del administrador después del primer inicio de sesión.

## Acceder a la Aplicación

Una vez que la aplicación esté corriendo sin errores:

1. Abre tu navegador
2. Ve a: http://localhost:5000
3. Inicia sesión con las credenciales de admin
4. ¡Comienza a usar la plataforma de comics!

## En Caso de Problemas

Si el problema persiste:

1. Verifica que PostgreSQL esté corriendo
2. Asegúrate de haber eliminado y recreado la base de datos
3. Revisa los logs en busca de otros errores
4. Verifica las credenciales en `appsettings.json`

## Cambios Técnicos Realizados

- ✅ Eliminadas migraciones desactualizadas
- ✅ Actualizado `DbInitializer.cs` con lógica mejorada
- ✅ Agregado manejo de errores en creación de admin
- ✅ Soporte para `EnsureCreated()` cuando no hay migraciones
- ✅ Todas las tablas se crean automáticamente en primer inicio
