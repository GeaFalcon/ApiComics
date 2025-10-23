# 🪟 Guía de Inicio para Windows

## 🚀 Inicio Rápido (3 opciones)

### Opción 1: Con Docker Desktop (Recomendado ⭐)

#### 1. Instalar Docker Desktop

Si no tienes Docker Desktop instalado:

1. Descarga desde: https://www.docker.com/products/docker-desktop
2. Instala Docker Desktop
3. Reinicia tu computadora si te lo pide
4. Abre Docker Desktop y espera a que inicie completamente
5. Verifica que Docker está corriendo (ícono de Docker en la barra de tareas)

#### 2. Ejecutar el Proyecto

Opción A - **Con PowerShell (Recomendado):**

```powershell
.\start.ps1
```

Selecciona opción `1` cuando te pregunte.

Opción B - **Comando directo:**

```powershell
docker compose up --build
```

> **Nota:** En versiones modernas de Docker Desktop es `docker compose` (con espacio), no `docker-compose`

#### 3. Acceder

Abre tu navegador en: http://localhost:5000

**Credenciales:**
- Usuario: `admin`
- Contraseña: `Admin123!`

---

### Opción 2: Sin Docker (Manual)

#### Requisitos:
- .NET 8.0 SDK: https://dotnet.microsoft.com/download
- PostgreSQL: https://www.postgresql.org/download/windows/

#### Pasos:

1. **Instalar PostgreSQL**
   - Descarga e instala PostgreSQL
   - Durante la instalación, configura una contraseña para el usuario `postgres`
   - Asegúrate que el servicio PostgreSQL esté corriendo

2. **Crear Base de Datos**

   Abre `pgAdmin` o `psql` y ejecuta:
   ```sql
   CREATE DATABASE comicdb;
   ```

3. **Actualizar Configuración**

   Edita `appsettings.json` con tus credenciales de PostgreSQL:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Port=5433;Database=comicdb;Username=postgres;Password=TU_PASSWORD"
     }
   }
   ```

4. **Ejecutar**

   En PowerShell:
   ```powershell
   dotnet run
   ```

   O ejecuta:
   ```powershell
   .\start.ps1
   ```
   Y selecciona opción `2`

---

## 🐛 Solución de Problemas

### ❌ Error: "docker-compose no se reconoce"

**Causa:** Estás usando una versión moderna de Docker Desktop.

**Solución:** Usa `docker compose` (con espacio) en lugar de `docker-compose`:

```powershell
# ❌ Antiguo (no funciona en Docker Desktop moderno)
docker-compose up --build

# ✅ Nuevo (correcto)
docker compose up --build
```

O simplemente usa el script:
```powershell
.\start.ps1
```

---

### ❌ Error: "Cannot connect to Docker daemon"

**Soluciones:**

1. **Verifica que Docker Desktop esté corriendo:**
   - Busca el ícono de Docker en la barra de tareas (esquina inferior derecha)
   - Si no está, abre Docker Desktop manualmente
   - Espera a que el ícono se ponga verde

2. **Reinicia Docker Desktop:**
   - Clic derecho en el ícono de Docker
   - "Restart Docker Desktop"

3. **Reinstala Docker Desktop si persiste el problema**

---

### ❌ Error: "Port 5000 is already allocated"

**Causa:** Otro programa está usando el puerto 5000.

**Solución:** Cambia el puerto en `docker-compose.yml`:

```yaml
services:
  app:
    ports:
      - "5001:5000"  # Cambia 5001 al puerto que prefieras
```

Luego accede a: http://localhost:5001

---

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
docker compose up --build
```

---

### ❌ WSL 2 installation is incomplete

**Causa:** Docker Desktop en Windows usa WSL 2 que no está completamente configurado.

**Solución:**

1. Abre PowerShell como **Administrador**
2. Ejecuta:
   ```powershell
   wsl --install
   ```
3. Reinicia tu computadora
4. Abre Docker Desktop de nuevo

**Referencia:** https://docs.microsoft.com/en-us/windows/wsl/install

---

### ✅ Verificar que todo funciona

En PowerShell, ejecuta:

```powershell
# Verificar Docker
docker --version

# Verificar Docker Compose
docker compose version

# Verificar .NET (si no usas Docker)
dotnet --version
```

---

## 📍 URLs Importantes

Después de iniciar:

- **Aplicación:** http://localhost:5000
- **Swagger API:** http://localhost:5000/swagger
- **Login:** http://localhost:5000/#/login

---

## 🛑 Detener la Aplicación

Con Docker:
```powershell
# Presiona Ctrl+C en la terminal

# O ejecuta:
docker compose down
```

Sin Docker:
```powershell
# Presiona Ctrl+C en la terminal
```

---

## 🔄 Reiniciar desde Cero (Docker)

Si quieres empezar limpio:

```powershell
docker compose down -v
docker compose up --build
```

Esto elimina la base de datos y la vuelve a crear con el usuario admin por defecto.

---

## 💡 Consejos para Windows

1. **Usa PowerShell, no CMD**
   - PowerShell tiene mejor soporte para comandos modernos
   - CMD puede tener problemas con algunos comandos

2. **Ejecuta como Administrador cuando sea necesario**
   - Para instalar Docker Desktop
   - Para cambiar políticas de ejecución
   - Para solucionar problemas de permisos

3. **Antivirus puede interferir**
   - Si Docker es muy lento, añade excepciones en tu antivirus para:
     - Docker Desktop
     - WSL 2
     - Carpeta del proyecto

4. **Firewall de Windows**
   - La primera vez Docker puede pedir permisos
   - Acepta para "Redes privadas" al menos

---

## 📚 Más Ayuda

- **Docker Desktop:** https://docs.docker.com/desktop/windows/
- **WSL 2:** https://docs.microsoft.com/en-us/windows/wsl/
- **.NET:** https://dotnet.microsoft.com/learn

---

## 🎊 ¿Todo Funcionó?

Si llegaste hasta aquí y todo funciona:

1. Abre http://localhost:5000
2. Inicia sesión con `admin` / `Admin123!`
3. ¡Disfruta tu plataforma de comics! 🎉

---

**¿Sigues teniendo problemas?** Revisa `INICIO-RAPIDO.md` o `README.md` para más información.
