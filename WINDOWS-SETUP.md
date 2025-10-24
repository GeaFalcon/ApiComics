# 🪟 Guía de Inicio para Windows

## 🚀 Inicio Rápido

### Requisitos Previos
- .NET 8.0 SDK: https://dotnet.microsoft.com/download
- PostgreSQL: https://www.postgresql.org/download/windows/

---

## Opción 1: Con Script de Inicio (Automático)

### Pasos

**Usando PowerShell:**
```powershell
.\start.ps1
```

El script automáticamente:
- ✅ Restaura paquetes NuGet
- ✅ Inicia la aplicación
- ✅ Aplica migraciones
- ✅ Crea usuario admin (admin / Admin123!)

---

## Opción 2: Manual

### 1. Instalar PostgreSQL

   - Descarga e instala PostgreSQL desde: https://www.postgresql.org/download/windows/
   - Durante la instalación, configura una contraseña para el usuario `postgres`
   - Asegúrate que el servicio PostgreSQL esté corriendo

### 2. Crear Base de Datos

   Abre `pgAdmin` o `psql` y ejecuta:
   ```sql
   CREATE DATABASE comicdb;
   ```

### 3. Actualizar Configuración

   Edita `appsettings.json` con tus credenciales de PostgreSQL:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Port=5432;Database=comicdb;Username=postgres;Password=TU_PASSWORD"
     }
   }
   ```

### 4. Ejecutar

   En PowerShell:
   ```powershell
   dotnet run
   ```

### 5. Acceder

   - **Aplicación:** http://localhost:5000
   - **Usuario:** admin
   - **Contraseña:** Admin123!

---

## 🐛 Solución de Problemas

### ❌ Error: "No se puede ejecutar scripts en este sistema"

**Causa:** PowerShell tiene restricciones de ejecución de scripts.

**Solución:**

Ejecuta PowerShell como **Administrador** y ejecuta:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Luego podrás ejecutar `.\start.ps1`

**Alternativa:** Ejecuta los comandos directamente:

```powershell
dotnet run
```

---

### ❌ Error: "Puerto 5000 ya en uso"

**Causa:** Otro programa está usando el puerto 5000.

**Solución:**

Encuentra y detén el proceso:
```powershell
netstat -ano | findstr :5000
taskkill /PID [número_del_proceso] /F
```

O cambia el puerto en `appsettings.json`

---

### ❌ Error: "No se puede conectar a la base de datos"

**Soluciones:**

1. **Verifica que PostgreSQL esté corriendo:**
   - Busca "services.msc" en el menú inicio
   - Busca "postgresql" en la lista
   - Debe estar "Running"

2. **Verifica las credenciales:**
   - Revisa `appsettings.json`
   - Confirma que el usuario, contraseña y puerto sean correctos

3. **Verifica el puerto:**
   - Puerto por defecto de PostgreSQL es 5432
   - Algunos instaladores usan 5433

---

### ✅ Verificar que todo funciona

En PowerShell, ejecuta:

```powershell
# Verificar .NET
dotnet --version

# Verificar PostgreSQL
pg_isready -h localhost -p 5432
```

---

## 📍 URLs Importantes

Después de iniciar:

- **Aplicación:** http://localhost:5000
- **Swagger API:** http://localhost:5000/swagger
- **Login:** http://localhost:5000/#/login

---

## 🛑 Detener la Aplicación

```powershell
# Presiona Ctrl+C en la terminal
```

---

## 💡 Consejos para Windows

1. **Usa PowerShell, no CMD**
   - PowerShell tiene mejor soporte para comandos modernos
   - CMD puede tener problemas con algunos comandos

2. **Ejecuta como Administrador cuando sea necesario**
   - Para cambiar políticas de ejecución
   - Para solucionar problemas de permisos

3. **Antivirus puede interferir**
   - Si la aplicación es muy lenta, añade excepciones en tu antivirus para:
     - Carpeta del proyecto
     - PostgreSQL

4. **Firewall de Windows**
   - La primera vez puede pedir permisos
   - Acepta para "Redes privadas" al menos

---

## 📚 Más Ayuda

- **.NET:** https://dotnet.microsoft.com/learn
- **PostgreSQL:** https://www.postgresql.org/docs/

---

## 🎊 ¿Todo Funcionó?

Si llegaste hasta aquí y todo funciona:

1. Abre http://localhost:5000
2. Inicia sesión con `admin` / `Admin123!`
3. ¡Disfruta tu plataforma de comics! 🎉

---

**¿Sigues teniendo problemas?** Revisa `INICIO-RAPIDO.md` o `README.md` para más información.
