# 📚 Índice de Documentación

Guía para encontrar rápidamente la documentación que necesitas.

---

## 🚀 Quiero Empezar YA

**No tengo nada instalado:**
- 👉 [INSTALACION-DESDE-CERO.md](INSTALACION-DESDE-CERO.md) - Guía completa paso a paso
- 👉 [LINKS-DESCARGA.md](LINKS-DESCARGA.md) - Links de descarga directos

**Ya tengo Docker instalado:**
- 👉 [INICIO-RAPIDO.md](INICIO-RAPIDO.md) - Ejecuta en 1 minuto
- 👉 [COMO-INICIAR.txt](COMO-INICIAR.txt) - Guía visual rápida

**Uso Windows:**
- 👉 [WINDOWS-SETUP.md](WINDOWS-SETUP.md) - Guía específica para Windows
- 👉 [INICIO-WINDOWS.bat](INICIO-WINDOWS.bat) - Script de doble clic

---

## 📖 Por Tema

### Instalación

| Archivo | Descripción | ¿Cuándo usarlo? |
|---------|-------------|-----------------|
| [INSTALACION-DESDE-CERO.md](INSTALACION-DESDE-CERO.md) | Guía completa para instalar TODO | No tienes nada instalado |
| [CHECKLIST-INSTALACION.md](CHECKLIST-INSTALACION.md) | Lista de verificación paso a paso | Quieres seguir un checklist |
| [LINKS-DESCARGA.md](LINKS-DESCARGA.md) | Todos los links de descarga | Necesitas descargar software |
| [WINDOWS-SETUP.md](WINDOWS-SETUP.md) | Guía específica para Windows | Usas Windows |

### Inicio Rápido

| Archivo | Descripción | ¿Cuándo usarlo? |
|---------|-------------|-----------------|
| [INICIO-RAPIDO.md](INICIO-RAPIDO.md) | Guía de inicio rápido | Ya tienes todo instalado |
| [COMO-INICIAR.txt](COMO-INICIAR.txt) | Guía visual simplificada | Quieres instrucciones visuales |
| [INICIO-WINDOWS.bat](INICIO-WINDOWS.bat) | Script de inicio para Windows | Windows, solo doble clic |
| [start.ps1](start.ps1) | Script PowerShell | Windows, inicio automático |
| [start.sh](start.sh) | Script Bash | Linux/Mac, inicio automático |

### Documentación del Proyecto

| Archivo | Descripción | ¿Cuándo usarlo? |
|---------|-------------|-----------------|
| [README.md](README.md) | Documentación principal | Información general del proyecto |
| [PR-DESCRIPTION.md](PR-DESCRIPTION.md) | Descripción del Pull Request | Crear o revisar PR |
| [CREAR-PR.md](CREAR-PR.md) | Cómo crear el Pull Request | Contribuir al proyecto |

### Configuración

| Archivo | Descripción | ¿Cuándo usarlo? |
|---------|-------------|-----------------|
| [appsettings.json](appsettings.json) | Configuración de la aplicación | Cambiar BD, JWT, etc. |
| [docker-compose.yml](docker-compose.yml) | Configuración de Docker | Personalizar Docker |
| [Dockerfile](Dockerfile) | Imagen de Docker | Modificar contenedor |

---

## 🎯 Por Escenario

### "No sé nada de programación"

1. [INSTALACION-DESDE-CERO.md](INSTALACION-DESDE-CERO.md)
2. [CHECKLIST-INSTALACION.md](CHECKLIST-INSTALACION.md)
3. [COMO-INICIAR.txt](COMO-INICIAR.txt)

### "Soy desarrollador, quiero empezar rápido"

1. [README.md](README.md) - Sección "Inicio Rápido"
2. Ejecuta: `docker compose up --build`

### "Tengo problemas con Windows"

1. [WINDOWS-SETUP.md](WINDOWS-SETUP.md)
2. [INICIO-RAPIDO.md](INICIO-RAPIDO.md) - Sección "Solución de Problemas"

### "No quiero usar Docker"

1. [INSTALACION-DESDE-CERO.md](INSTALACION-DESDE-CERO.md) - Sección "Opción Manual"
2. [README.md](README.md) - Sección "Configuración e Instalación"

### "Quiero contribuir al proyecto"

1. [README.md](README.md)
2. [CREAR-PR.md](CREAR-PR.md)
3. [PR-DESCRIPTION.md](PR-DESCRIPTION.md)

---

## 📱 Por Sistema Operativo

### 🪟 Windows

**Orden recomendado:**
1. [INSTALACION-DESDE-CERO.md](INSTALACION-DESDE-CERO.md) → Sección Windows
2. [WINDOWS-SETUP.md](WINDOWS-SETUP.md)
3. [INICIO-WINDOWS.bat](INICIO-WINDOWS.bat) o [start.ps1](start.ps1)

**Links útiles:**
- [LINKS-DESCARGA.md](LINKS-DESCARGA.md) → Sección Windows

### 🐧 Linux

**Orden recomendado:**
1. [INSTALACION-DESDE-CERO.md](INSTALACION-DESDE-CERO.md) → Sección Linux
2. [start.sh](start.sh)

**Comandos rápidos:**
Ver [INSTALACION-DESDE-CERO.md](INSTALACION-DESDE-CERO.md) → "Resumen de Comandos Rápidos"

### 🍎 macOS

**Orden recomendado:**
1. [INSTALACION-DESDE-CERO.md](INSTALACION-DESDE-CERO.md) → Sección macOS
2. [start.sh](start.sh)

---

## 🔍 Por Pregunta

### "¿Qué necesito instalar?"

👉 [LINKS-DESCARGA.md](LINKS-DESCARGA.md) - Sección "¿Qué Necesito Realmente?"

### "¿Cómo inicio el proyecto?"

👉 [INICIO-RAPIDO.md](INICIO-RAPIDO.md) - 3 opciones simples

### "¿Cuánto tarda la instalación?"

👉 [CHECKLIST-INSTALACION.md](CHECKLIST-INSTALACION.md) - Sección "Tiempos Estimados"

### "¿Cuánto pesa todo?"

👉 [LINKS-DESCARGA.md](LINKS-DESCARGA.md) - Sección "Tamaños de Descarga"

### "Tengo un error, ¿qué hago?"

👉 [WINDOWS-SETUP.md](WINDOWS-SETUP.md) - Sección "Solución de Problemas"
👉 [INICIO-RAPIDO.md](INICIO-RAPIDO.md) - Sección "Solución de Problemas"

### "¿Cómo funciona el proyecto?"

👉 [README.md](README.md) - Documentación completa

### "¿Qué hace este comando?"

👉 [INSTALACION-DESDE-CERO.md](INSTALACION-DESDE-CERO.md) - Comandos explicados

---

## ⚡ Atajos Rápidos

### Iniciar proyecto (ya instalado)

```bash
# Docker
docker compose up --build

# Sin Docker
dotnet run
```

### Detener proyecto

```bash
# Docker
docker compose down

# Sin Docker
Ctrl+C en la terminal
```

### Acceder a la aplicación

http://localhost:5000

**Login:**
- Usuario: `admin`
- Contraseña: `Admin123!`

---

## 📊 Flujo de Documentación

```
┌─────────────────────────────────────┐
│   ¿Tienes algo instalado?           │
└───────────┬─────────────────────────┘
            │
    ┌───────┴────────┐
    │                │
   NO               SI
    │                │
    ▼                ▼
INSTALACION    INICIO-RAPIDO.md
-DESDE-
-CERO.md
    │                │
    │                │
    └────────┬───────┘
             │
             ▼
     ¿Funciona todo?
             │
    ┌────────┴────────┐
   SI                NO
    │                 │
    ▼                 ▼
¡LISTO!      WINDOWS-SETUP.md
              (Solución de
               Problemas)
```

---

## 📑 Documentos Técnicos

Para desarrolladores que quieren entender el código:

| Archivo | Qué contiene |
|---------|--------------|
| [Controllers/](Controllers/) | Lógica de la API |
| [Models/](Models/) | Modelos de datos |
| [Services/](Services/) | Servicios (JWT, etc.) |
| [DTOs/](DTOs/) | Data Transfer Objects |
| [Data/](Data/) | DbContext y migraciones |
| [wwwroot/js/](wwwroot/js/) | Frontend React |

---

## 🎓 Niveles de Documentación

### Principiante (Nunca usé estas tecnologías)

1. [INSTALACION-DESDE-CERO.md](INSTALACION-DESDE-CERO.md)
2. [CHECKLIST-INSTALACION.md](CHECKLIST-INSTALACION.md)
3. [LINKS-DESCARGA.md](LINKS-DESCARGA.md)
4. [COMO-INICIAR.txt](COMO-INICIAR.txt)

### Intermedio (Sé algo de programación)

1. [INICIO-RAPIDO.md](INICIO-RAPIDO.md)
2. [WINDOWS-SETUP.md](WINDOWS-SETUP.md) (si usas Windows)
3. [README.md](README.md)

### Avanzado (Soy desarrollador)

1. [README.md](README.md)
2. Código fuente directamente
3. [docker-compose.yml](docker-compose.yml)

---

## 🆘 Ayuda Rápida

| Problema | Solución |
|----------|----------|
| No sé por dónde empezar | [INSTALACION-DESDE-CERO.md](INSTALACION-DESDE-CERO.md) |
| Error en Windows | [WINDOWS-SETUP.md](WINDOWS-SETUP.md) |
| Docker no funciona | [INICIO-RAPIDO.md](INICIO-RAPIDO.md) → Problemas |
| Necesito links | [LINKS-DESCARGA.md](LINKS-DESCARGA.md) |
| Quiero un checklist | [CHECKLIST-INSTALACION.md](CHECKLIST-INSTALACION.md) |

---

## 📞 Contacto y Soporte

- **Repositorio:** https://github.com/GeaFalcon/ApiComics
- **Issues:** https://github.com/GeaFalcon/ApiComics/issues

---

## ✅ TL;DR (Muy Resumido)

**Opción 1 (Más fácil):**
1. Instala Docker Desktop
2. Clona el proyecto
3. `docker compose up --build`
4. Abre http://localhost:5000

**Opción 2 (Sin Docker):**
1. Instala .NET 8.0 + PostgreSQL
2. Clona el proyecto
3. `dotnet run`
4. Abre http://localhost:5000

**¿Necesitas más ayuda?** → [INSTALACION-DESDE-CERO.md](INSTALACION-DESDE-CERO.md)

---

**Última actualización:** 2025

**Versión del proyecto:** 1.0

**Compatibilidad:** Windows 10/11, Linux (Ubuntu 20.04+), macOS 11+
