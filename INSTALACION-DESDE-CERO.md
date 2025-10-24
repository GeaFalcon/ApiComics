# 📦 Instalación Desde Cero - Guía Completa

Esta guía te ayudará a instalar TODO lo necesario para ejecutar el proyecto, incluso si no tienes nada instalado.

## 📋 Índice

- [🪟 Windows](#-windows)
- [🐧 Linux (Ubuntu/Debian)](#-linux-ubuntudebian)
- [🍎 macOS](#-macos)

---

# 🪟 Windows

## Instalación Manual

### Paso 1: Instalar .NET 8.0 SDK

1. **Descargar .NET 8.0 SDK**

   Ve a: https://dotnet.microsoft.com/download/dotnet/8.0

   Descarga el "SDK 8.0.x" para Windows (x64)

2. **Instalar**

   - Ejecuta el instalador descargado
   - Sigue las instrucciones
   - Instalación por defecto está bien

3. **Verificar**

   Abre una nueva PowerShell y ejecuta:
   ```powershell
   dotnet --version
   ```

   Debe mostrar: `8.0.x`

### Paso 2: Instalar PostgreSQL

1. **Descargar PostgreSQL**

   Ve a: https://www.postgresql.org/download/windows/

   O descarga directamente el instalador:
   https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

   Descarga PostgreSQL 15 o 16 para Windows x86-64

2. **Instalar PostgreSQL**

   - Ejecuta el instalador
   - Puerto: deja el `5433` por defecto
   - **Contraseña:** Elige una contraseña y RECUÉRDALA (ej: `postgres123`)
   - Componentes: marca todos
   - Locale: Default

3. **Verificar**

   Busca "pgAdmin 4" en el menú inicio y ábrelo.

### Paso 3: Crear la Base de Datos

1. Abre **pgAdmin 4**

2. Conéctate al servidor:
   - Password: la que pusiste al instalar

3. Clic derecho en "Databases" → "Create" → "Database"

4. Nombre: `comicdb`

5. Clic en "Save"

### Paso 4: Configurar el Proyecto

1. **Descargar el proyecto** (igual que en Opción A del Docker)

2. **Editar configuración**

   Abre el archivo `appsettings.json` con el Bloc de notas

   Busca esta línea:
   ```json
   "DefaultConnection": "Host=localhost;Port=5433;Database=comicdb;Username=postgres;Password=6469"
   ```

   Cámbiala por:
   ```json
   "DefaultConnection": "Host=localhost;Port=5433;Database=comicdb;Username=postgres;Password=TU_CONTRASEÑA"
   ```

   Reemplaza `TU_CONTRASEÑA` con la contraseña que pusiste al instalar PostgreSQL.

### Paso 5: Ejecutar el Proyecto

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
dotnet run
```

O ejecuta:
```powershell
.\start.ps1
```
Y selecciona opción `2`

### Paso 6: Acceder

1. Espera a que termine de iniciar
2. Abre: http://localhost:5000
3. Login:
   - Usuario: `admin`
   - Contraseña: `Admin123!`

---

# 🐧 Linux (Ubuntu/Debian)

## Instalación Manual

### Paso 1: Instalar .NET 8.0 SDK

```bash
# Agregar repositorio de Microsoft
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

# Instalar .NET 8.0
sudo apt update
sudo apt install -y dotnet-sdk-8.0
```

**Verificar:**
```bash
dotnet --version
```

### Paso 2: Instalar PostgreSQL

```bash
# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Iniciar servicio
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verificar
sudo systemctl status postgresql
```

### Paso 3: Configurar PostgreSQL

```bash
# Cambiar a usuario postgres
sudo -u postgres psql

# Dentro de psql, ejecuta:
CREATE DATABASE comicdb;
CREATE USER comicuser WITH PASSWORD 'comicpass123';
GRANT ALL PRIVILEGES ON DATABASE comicdb TO comicuser;
\q
```

### Paso 4: Configurar el Proyecto

```bash
# Clonar proyecto
git clone https://github.com/GeaFalcon/ApiComics.git
cd ApiComics

# Editar configuración
nano appsettings.json
```

Cambia la línea de conexión a:
```json
"DefaultConnection": "Host=localhost;Port=5432;Database=comicdb;Username=comicuser;Password=comicpass123"
```

Guarda con `Ctrl+O`, Enter, `Ctrl+X`

### Paso 5: Ejecutar

```bash
dotnet run
```

### Paso 6: Acceder

Abre: http://localhost:5000

---

# 🍎 macOS

## Instalación Manual

### Paso 1: Instalar Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Paso 2: Instalar .NET 8.0 SDK

```bash
brew install --cask dotnet-sdk
```

**Verificar:**
```bash
dotnet --version
```

### Paso 3: Instalar PostgreSQL

```bash
# Instalar
brew install postgresql@15

# Iniciar servicio
brew services start postgresql@15

# Crear base de datos
createdb comicdb
```

### Paso 4: Configurar PostgreSQL

```bash
# Entrar a psql
psql comicdb

# Crear usuario
CREATE USER comicuser WITH PASSWORD 'comicpass123';
GRANT ALL PRIVILEGES ON DATABASE comicdb TO comicuser;
\q
```

### Paso 5: Descargar y Configurar Proyecto

```bash
# Clonar
git clone https://github.com/GeaFalcon/ApiComics.git
cd ApiComics

# Editar configuración
nano appsettings.json
```

Cambia la conexión a:
```json
"DefaultConnection": "Host=localhost;Port=5432;Database=comicdb;Username=comicuser;Password=comicpass123"
```

### Paso 6: Ejecutar

```bash
dotnet run
```

---

# 📊 Resumen de Comandos Rápidos

## Windows (PowerShell)

```powershell
# Después de instalar .NET y PostgreSQL:
cd C:\Users\TuUsuario\Desktop
git clone https://github.com/GeaFalcon/ApiComics.git
cd ApiComics
# Editar appsettings.json con tu contraseña de PostgreSQL
dotnet run
```

## Linux (Ubuntu)

```bash
# Instalar dependencias
sudo apt update
sudo apt install -y dotnet-sdk-8.0 postgresql git

# Configurar PostgreSQL
sudo -u postgres psql -c "CREATE DATABASE comicdb;"
sudo -u postgres psql -c "CREATE USER comicuser WITH PASSWORD 'comicpass123';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE comicdb TO comicuser;"

# Ejecutar proyecto
git clone https://github.com/GeaFalcon/ApiComics.git
cd ApiComics
dotnet run
```

## macOS

```bash
# Instalar dependencias
brew install --cask dotnet-sdk
brew install postgresql@15
brew services start postgresql@15

# Configurar PostgreSQL
createdb comicdb

# Ejecutar proyecto
git clone https://github.com/GeaFalcon/ApiComics.git
cd ApiComics
dotnet run
```

---

# ✅ Verificar que Todo Funciona

Después de iniciar con cualquier método:

1. **Abre tu navegador** en: http://localhost:5000

2. **Deberías ver** la página de login

3. **Inicia sesión** con:
   - Usuario: `admin`
   - Contraseña: `Admin123!`

4. **Si funciona**, verás el dashboard con comics

---

# 🆘 ¿Problemas?

## Error: "Puerto 5000 ya en uso"

**Windows:**
```powershell
netstat -ano | findstr :5000
taskkill /PID [número_del_proceso] /F
```

**Linux/Mac:**
```bash
lsof -ti:5000 | xargs kill -9
```

## PostgreSQL no conecta

**Verificar que está corriendo:**

Windows:
```powershell
# Busca "services.msc"
# Busca "postgresql" en la lista
# Debe estar "Running"
```

Linux:
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

Mac:
```bash
brew services list
brew services start postgresql@15
```

---

# 📚 Recursos Adicionales

- **.NET 8.0:** https://dotnet.microsoft.com/learn
- **PostgreSQL:** https://www.postgresql.org/docs/
- **Git:** https://git-scm.com/doc

---

# 🎉 ¡Todo Listo!

Ahora tienes todo instalado y funcionando. Disfruta de tu plataforma de comics!

Para más información, revisa:
- `README.md` - Documentación completa
- `INICIO-RAPIDO.md` - Guía de inicio rápido
- `WINDOWS-SETUP.md` - Guía específica para Windows
