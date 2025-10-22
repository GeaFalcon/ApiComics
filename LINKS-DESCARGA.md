# 🔗 Links de Descarga Directos

Todos los links que necesitas para instalar el proyecto desde cero.

---

## 🪟 Windows

### Opción Docker (Recomendada)

| Software | Link de Descarga | Notas |
|----------|-----------------|-------|
| **Docker Desktop** | https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe | Incluye Docker Compose |
| **Git** (opcional) | https://github.com/git-for-windows/git/releases/latest | Para clonar el repositorio |

### Opción Manual

| Software | Link de Descarga | Versión Recomendada |
|----------|-----------------|---------------------|
| **.NET 8.0 SDK** | https://dotnet.microsoft.com/download/dotnet/8.0 | Latest 8.0.x |
| **PostgreSQL** | https://www.enterprisedb.com/downloads/postgres-postgresql-downloads | PostgreSQL 15 o 16 |
| **Git** | https://github.com/git-for-windows/git/releases/latest | Latest |

---

## 🐧 Linux (Ubuntu/Debian)

### Comandos de Instalación

No requiere descargas manuales. Usa estos comandos:

#### Docker:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

#### Manual (.NET + PostgreSQL):
```bash
# .NET 8.0
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt update
sudo apt install -y dotnet-sdk-8.0

# PostgreSQL
sudo apt install -y postgresql postgresql-contrib
```

---

## 🍎 macOS

### Opción Docker

| Software | Link de Descarga | Versión |
|----------|-----------------|---------|
| **Docker Desktop (Intel)** | https://desktop.docker.com/mac/main/amd64/Docker.dmg | Para Macs Intel |
| **Docker Desktop (Apple Silicon)** | https://desktop.docker.com/mac/main/arm64/Docker.dmg | Para M1/M2/M3 |

### Opción Manual (Homebrew)

| Software | Comando | Notas |
|----------|---------|-------|
| **Homebrew** | `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"` | Gestor de paquetes |
| **.NET 8.0** | `brew install --cask dotnet-sdk` | Después de instalar Homebrew |
| **PostgreSQL** | `brew install postgresql@15` | Después de instalar Homebrew |
| **Git** | `brew install git` | Después de instalar Homebrew |

---

## 📦 El Proyecto

| Método | Comando/Link |
|--------|--------------|
| **Git Clone** | `git clone https://github.com/GeaFalcon/ApiComics.git` |
| **Descarga ZIP** | https://github.com/GeaFalcon/ApiComics/archive/refs/heads/master.zip |
| **Repositorio** | https://github.com/GeaFalcon/ApiComics |

---

## 🔧 Herramientas Adicionales (Opcionales)

### Windows

| Herramienta | Link | Uso |
|-------------|------|-----|
| **Visual Studio Code** | https://code.visualstudio.com/download | Editor de código |
| **PowerShell 7** | https://github.com/PowerShell/PowerShell/releases | Terminal mejorada |
| **Windows Terminal** | https://aka.ms/terminal | Terminal moderna |
| **pgAdmin 4** | Incluido con PostgreSQL | Gestor de PostgreSQL |

### Linux

```bash
# Visual Studio Code
sudo snap install code --classic

# pgAdmin 4
sudo apt install -y pgadmin4
```

### macOS

```bash
# Visual Studio Code
brew install --cask visual-studio-code

# pgAdmin 4
brew install --cask pgadmin4
```

---

## 📋 Orden Recomendado de Instalación

### Windows (Docker)

1. ✅ Docker Desktop
2. ✅ WSL 2 (si te lo pide Docker)
3. ✅ Git (opcional)
4. ✅ Proyecto (clone o descarga)
5. ✅ Ejecutar: `docker compose up --build`

### Windows (Manual)

1. ✅ .NET 8.0 SDK
2. ✅ PostgreSQL
3. ✅ Git (opcional)
4. ✅ Proyecto
5. ✅ Configurar `appsettings.json`
6. ✅ Ejecutar: `dotnet run`

### Linux (Docker)

1. ✅ Docker + Docker Compose
2. ✅ Git
3. ✅ Proyecto
4. ✅ Ejecutar: `docker compose up --build`

### macOS (Docker)

1. ✅ Docker Desktop
2. ✅ Homebrew
3. ✅ Git
4. ✅ Proyecto
5. ✅ Ejecutar: `docker compose up --build`

---

## ⚡ Instalación Ultra Rápida

### Windows PowerShell (con Docker):

```powershell
# Instalar después de instalar Docker Desktop
git clone https://github.com/GeaFalcon/ApiComics.git
cd ApiComics
docker compose up --build
```

### Linux (una línea):

```bash
curl -fsSL https://get.docker.com | sh && sudo usermod -aG docker $USER && newgrp docker && git clone https://github.com/GeaFalcon/ApiComics.git && cd ApiComics && docker compose up --build
```

### macOS (después de instalar Docker Desktop):

```bash
git clone https://github.com/GeaFalcon/ApiComics.git && cd ApiComics && docker compose up --build
```

---

## 🆘 Links de Ayuda

| Recurso | Link |
|---------|------|
| **Documentación Docker** | https://docs.docker.com/ |
| **Documentación .NET** | https://learn.microsoft.com/dotnet/ |
| **Documentación PostgreSQL** | https://www.postgresql.org/docs/ |
| **Documentación Git** | https://git-scm.com/doc |
| **WSL 2 (Windows)** | https://learn.microsoft.com/windows/wsl/ |

---

## 📞 Soporte del Proyecto

- **Repositorio:** https://github.com/GeaFalcon/ApiComics
- **Issues:** https://github.com/GeaFalcon/ApiComics/issues
- **Documentación:** Ver archivos README.md, INSTALACION-DESDE-CERO.md

---

## ✅ Verificar Instalaciones

Después de instalar cada componente, verifica:

### Docker
```bash
docker --version
docker compose version
```

### .NET
```bash
dotnet --version
```

### PostgreSQL (Windows)
- Busca "pgAdmin 4" en el menú inicio
- Debe abrirse sin error

### PostgreSQL (Linux/Mac)
```bash
psql --version
```

### Git
```bash
git --version
```

---

## 🎯 ¿Qué Necesito Realmente?

### Mínimo (con Docker):
- ✅ Docker Desktop
- ✅ El proyecto (descargado)

### Mínimo (sin Docker):
- ✅ .NET 8.0 SDK
- ✅ PostgreSQL
- ✅ El proyecto (descargado)

### Recomendado:
- ✅ Todo lo anterior +
- ✅ Git (para clonar fácilmente)
- ✅ Visual Studio Code (para editar)

---

## 📊 Tamaños de Descarga

| Software | Tamaño Aproximado |
|----------|------------------|
| Docker Desktop (Windows) | ~500 MB |
| Docker Desktop (Mac) | ~500 MB |
| .NET 8.0 SDK | ~200 MB |
| PostgreSQL | ~250 MB |
| Git | ~50 MB |
| El Proyecto | ~5 MB |

**Total con Docker:** ~550 MB
**Total sin Docker:** ~505 MB

---

## ⏱️ Tiempos de Instalación

| Componente | Tiempo Estimado |
|------------|----------------|
| Docker Desktop | 5-10 minutos |
| .NET 8.0 SDK | 3-5 minutos |
| PostgreSQL | 5-10 minutos |
| Git | 2-3 minutos |
| Primera ejecución del proyecto | 3-5 minutos |

**Total:** 15-30 minutos para primera vez

---

## 🚀 Próximo Paso

Después de descargar e instalar todo, ve a:

- **Guía paso a paso:** `INSTALACION-DESDE-CERO.md`
- **Inicio rápido:** `INICIO-RAPIDO.md`
- **Windows específico:** `WINDOWS-SETUP.md`
- **Checklist:** `CHECKLIST-INSTALACION.md`
