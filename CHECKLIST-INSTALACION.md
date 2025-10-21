# ✅ Checklist de Instalación

Usa esta lista para verificar que tienes todo instalado correctamente.

## 🪟 Windows

### Opción Docker (Recomendada)

- [ ] **Paso 1: Instalar Docker Desktop**
  - [ ] Descargar desde https://www.docker.com/products/docker-desktop
  - [ ] Ejecutar instalador
  - [ ] Marcar "Use WSL 2"
  - [ ] Reiniciar computadora
  - [ ] Abrir Docker Desktop
  - [ ] Verificar: `docker --version` en PowerShell

- [ ] **Paso 2: Instalar WSL 2** (si es necesario)
  - [ ] Abrir PowerShell como Administrador
  - [ ] Ejecutar: `wsl --install`
  - [ ] Reiniciar computadora

- [ ] **Paso 3: Instalar Git** (opcional pero recomendado)
  - [ ] Descargar desde https://git-scm.com/download/win
  - [ ] Instalar con opciones por defecto
  - [ ] Verificar: `git --version`

- [ ] **Paso 4: Descargar Proyecto**
  - [ ] Con Git: `git clone https://github.com/GeaFalcon/ApiComics.git`
  - [ ] O descargar ZIP desde GitHub

- [ ] **Paso 5: Iniciar Proyecto**
  - [ ] Abrir PowerShell en carpeta del proyecto
  - [ ] Ejecutar: `docker compose up --build`
  - [ ] O doble clic en `INICIO-WINDOWS.bat`

- [ ] **Paso 6: Verificar**
  - [ ] Abrir http://localhost:5000
  - [ ] Login con `admin` / `Admin123!`

### Opción Manual (Sin Docker)

- [ ] **Paso 1: Instalar .NET 8.0 SDK**
  - [ ] Descargar desde https://dotnet.microsoft.com/download/dotnet/8.0
  - [ ] Instalar
  - [ ] Verificar: `dotnet --version`

- [ ] **Paso 2: Instalar PostgreSQL**
  - [ ] Descargar desde https://www.postgresql.org/download/windows/
  - [ ] Instalar (recordar contraseña)
  - [ ] Verificar abriendo pgAdmin 4

- [ ] **Paso 3: Crear Base de Datos**
  - [ ] Abrir pgAdmin 4
  - [ ] Crear database llamada `comicdb`

- [ ] **Paso 4: Configurar Proyecto**
  - [ ] Descargar proyecto
  - [ ] Editar `appsettings.json`
  - [ ] Actualizar contraseña de PostgreSQL

- [ ] **Paso 5: Ejecutar**
  - [ ] `dotnet run` en PowerShell
  - [ ] Abrir http://localhost:5000

---

## 🐧 Linux (Ubuntu/Debian)

### Opción Docker (Recomendada)

- [ ] **Paso 1: Actualizar Sistema**
  - [ ] `sudo apt update && sudo apt upgrade -y`

- [ ] **Paso 2: Instalar Docker**
  - [ ] Ejecutar comandos de instalación de Docker
  - [ ] Agregar usuario a grupo docker: `sudo usermod -aG docker $USER`
  - [ ] `newgrp docker`
  - [ ] Verificar: `docker --version`

- [ ] **Paso 3: Instalar Git**
  - [ ] `sudo apt install -y git`

- [ ] **Paso 4: Descargar Proyecto**
  - [ ] `git clone https://github.com/GeaFalcon/ApiComics.git`
  - [ ] `cd ApiComics`

- [ ] **Paso 5: Iniciar**
  - [ ] `docker compose up --build`
  - [ ] O `./start.sh`

- [ ] **Paso 6: Verificar**
  - [ ] Abrir http://localhost:5000

### Opción Manual

- [ ] **Paso 1: Instalar .NET 8.0**
  - [ ] Agregar repositorio de Microsoft
  - [ ] `sudo apt install -y dotnet-sdk-8.0`
  - [ ] Verificar: `dotnet --version`

- [ ] **Paso 2: Instalar PostgreSQL**
  - [ ] `sudo apt install -y postgresql postgresql-contrib`
  - [ ] `sudo systemctl start postgresql`
  - [ ] Verificar: `sudo systemctl status postgresql`

- [ ] **Paso 3: Configurar PostgreSQL**
  - [ ] `sudo -u postgres psql`
  - [ ] Crear database y usuario
  - [ ] `\q` para salir

- [ ] **Paso 4: Configurar Proyecto**
  - [ ] Clonar proyecto
  - [ ] Editar `appsettings.json`

- [ ] **Paso 5: Ejecutar**
  - [ ] `dotnet run`

---

## 🍎 macOS

### Opción Docker (Recomendada)

- [ ] **Paso 1: Instalar Docker Desktop**
  - [ ] Descargar desde https://www.docker.com/products/docker-desktop
  - [ ] Elegir versión correcta (M1/M2/M3 o Intel)
  - [ ] Instalar arrastrando a Aplicaciones
  - [ ] Abrir Docker Desktop
  - [ ] Verificar: `docker --version`

- [ ] **Paso 2: Instalar Homebrew**
  - [ ] Ejecutar script de instalación
  - [ ] Verificar: `brew --version`

- [ ] **Paso 3: Instalar Git**
  - [ ] `brew install git`

- [ ] **Paso 4: Descargar Proyecto**
  - [ ] `git clone https://github.com/GeaFalcon/ApiComics.git`
  - [ ] `cd ApiComics`

- [ ] **Paso 5: Iniciar**
  - [ ] `docker compose up --build`

- [ ] **Paso 6: Verificar**
  - [ ] Abrir http://localhost:5000

### Opción Manual

- [ ] **Paso 1: Instalar Homebrew**
  - [ ] Ejecutar script de instalación

- [ ] **Paso 2: Instalar .NET 8.0**
  - [ ] `brew install --cask dotnet-sdk`
  - [ ] Verificar: `dotnet --version`

- [ ] **Paso 3: Instalar PostgreSQL**
  - [ ] `brew install postgresql@15`
  - [ ] `brew services start postgresql@15`

- [ ] **Paso 4: Configurar PostgreSQL**
  - [ ] `createdb comicdb`
  - [ ] Crear usuario

- [ ] **Paso 5: Configurar Proyecto**
  - [ ] Clonar proyecto
  - [ ] Editar `appsettings.json`

- [ ] **Paso 6: Ejecutar**
  - [ ] `dotnet run`

---

## ✅ Verificación Final

Una vez que hayas completado todos los pasos, verifica:

- [ ] Docker está corriendo (si usas Docker)
  - [ ] Ícono verde en barra de tareas/menú
  - [ ] `docker ps` no da error

- [ ] PostgreSQL está corriendo (si no usas Docker)
  - [ ] Servicio activo
  - [ ] Puedes conectarte con pgAdmin/psql

- [ ] El proyecto se ejecuta
  - [ ] No hay errores en consola
  - [ ] Mensaje "Application started" visible

- [ ] Puedes acceder a la aplicación
  - [ ] http://localhost:5000 abre
  - [ ] Página de login se muestra
  - [ ] Puedes hacer login con admin/Admin123!

- [ ] Funcionalidades básicas funcionan
  - [ ] Puedes ver el dashboard
  - [ ] Puedes acceder al perfil
  - [ ] (Admin) Puedes ver panel de administración

---

## 🎯 Si Todo Está Marcado

¡Felicidades! 🎉 Tu instalación está completa y funcionando.

Ahora puedes:
- Explorar la aplicación
- Subir comics
- Probar todas las funcionalidades
- Leer la documentación en `README.md`

---

## ❌ Si Algo Falla

Revisa estos archivos según tu caso:

- **Windows:** `WINDOWS-SETUP.md`
- **Problemas generales:** `INICIO-RAPIDO.md`
- **Instalación detallada:** `INSTALACION-DESDE-CERO.md`
- **Documentación completa:** `README.md`

O busca el error específico en la sección de "Solución de Problemas" de cada guía.

---

## 📊 Tiempos Estimados

| Opción | Primera Instalación | Siguiente Inicio |
|--------|-------------------|------------------|
| Docker | 15-20 minutos | 30-60 segundos |
| Manual | 20-30 minutos | 10-20 segundos |

**Nota:** Primera vez con Docker tarda más por la descarga de imágenes.

---

## 💡 Consejos

- ✅ **Con Docker es más fácil** - No necesitas configurar PostgreSQL
- ✅ **Manual da más control** - Puedes ver exactamente qué hace
- ✅ **Guarda las contraseñas** - Especialmente la de PostgreSQL
- ✅ **Lee los mensajes de error** - Usualmente indican qué falta
- ✅ **Reinicia si hay dudas** - A veces Docker o PostgreSQL necesitan reinicio
