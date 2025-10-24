# ✅ Checklist de Instalación

Usa esta lista para verificar que tienes todo instalado correctamente.

## 🪟 Windows

### Instalación Manual

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

### Instalación Manual

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

### Instalación Manual

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

- [ ] PostgreSQL está corriendo
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

| Primera Instalación | Siguiente Inicio |
|---------------------|------------------|
| 20-30 minutos       | 10-20 segundos   |

---

## 💡 Consejos

- ✅ **Guarda las contraseñas** - Especialmente la de PostgreSQL
- ✅ **Lee los mensajes de error** - Usualmente indican qué falta
- ✅ **Reinicia si hay dudas** - A veces PostgreSQL necesita reinicio
