# RappiAdvanced - Sistema de Gestión y Control de Inventario (SGCI)

## 📋 Descripción

Sistema integral de gestión empresarial diseñado para Pymes. Permite administrar productos, proveedores, controlar salidas de inventario y generar reportes financieros, optimizando los procesos de negocio mediante una interfaz web moderna y responsiva.

---

## 🌐 Despliegue en Vivo

Este proyecto se encuentra desplegado y funcionando en **GitHub Pages**.
Puedes acceder a la versión en línea aquí:

👉 **[COLOCA AQUÍ TU ENLACE DE GITHUB PAGES](https://blurryfacce.github.io/RappiAdvanced/)** 👈

---

## 🚀 Características Principales (Historias de Usuario)

El sistema cumple con las 4 Historias de Usuario definidas por el Grupo 6:

### 1. Gestión de Productos (HU-1)

- **Administrador:** Puede registrar nuevos productos (con validación de código único, stock no negativo y campos obligatorios) y eliminarlos.
- **Empleado:** Tiene acceso de **solo lectura** al catálogo de inventario.

### 2. Gestión de Proveedores (HU-2)

- **Administrador:** Registro y eliminación de proveedores con validaciones de formato (RUC/ID, Teléfono ecuatoriano, Email).
- **Empleado:** Acceso de **solo lectura** a la lista de contactos.

### 3. Salidas de Inventario (HU-3)

- **Todos los roles:** Registro de salidas por venta, ajuste, devolución o merma.
- **Validaciones:** Control de stock en tiempo real (impide sacar más de lo existente).
- **Historial:** Tabla detallada con fechas y tipos de movimiento.

### 4. Reportes de Ingresos (HU-4)

- **Administrador:** Generación de reportes financieros por rango de fechas (Hoy, Ayer, Personalizado).
- **Cálculo:** Suma automática de ingresos basada en las salidas tipo "Venta".
- **Empleado:** **Acceso Denegado** (Seguridad por rol).

---

## 🔐 Seguridad y Roles

El sistema cuenta con un módulo de autenticación que protege las vistas sensibles.

| Funcionalidad | 🛡️ Administrador | 👤 Empleado |
| :--- | :---: | :---: |
| **Ver Módulos** | Todos | Solo básicos |
| **Crear Productos** | ✅ Sí | ❌ No |
| **Eliminar Datos** | ✅ Sí | ❌ No |
| **Ver Reportes Financieros** | ✅ Sí | ❌ Bloqueado |
| **Registrar Salidas** | ✅ Sí | ✅ Sí |

---

## 🛠️ Instalación Local (Opcional)

Si deseas ejecutar el proyecto localmente en lugar de usar la versión web:

⚠️ **IMPORTANTE:** Este proyecto utiliza **Módulos de JavaScript (ES6)**. Para que funcione correctamente, **NO** debes abrir el archivo `index.html` directamente haciendo doble clic.

### Pasos para ejecutar:

1. Asegúrate de tener **Visual Studio Code** instalado.
2. Instala la extensión **"Live Server"** (Ritwick Dey).
3. Haz clic derecho sobre el archivo `index.html`.
4. Selecciona **"Open with Live Server"**.
5. El navegador se abrirá automáticamente (usualmente en `http://127.0.0.1:5500`).

---

## 🔑 Credenciales de Acceso

El sistema **detecta automáticamente** si es la primera vez que se ejecuta y crea los usuarios por defecto. No necesitas registrarte manualmente.

Usa estas credenciales para probar los diferentes roles:

| Rol | Usuario | Contraseña | Descripción |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin` | *(vacío)* | Acceso total al sistema. |
| **Empleado** | `empleado` | *(vacío)* | Modo restringido / Solo lectura. |

> **Nota:** Para cambiar de usuario, haz clic en el botón **"Cerrar Sesión"** en la barra de navegación.

---

## 💻 Tecnologías Utilizadas

- **HTML5:** Estructura semántica.
- **CSS3:** Diseño responsivo, variables CSS y Flexbox/Grid.
- **JavaScript (ES6+):** Lógica de negocio modular (`import`/`export`).
- **LocalStorage:** Persistencia de datos en el navegador (Base de datos local).

---

## 👥 Equipo de Desarrollo (Grupo 6)

| Integrante | Rol |
| :--- | :--- |
| **Isaac Proaño** | Frontend Developer |
| **Sergio Rodríguez** | Frontend Developer |
| **Jhair Zambrano** | Backend / Logic Developer |
| **Daniel Moncayo** | QA / Product Owner |

**Curso:** GR2SW - Calidad de Software
**Periodo:** 2025B
**Docente:** Prof. Cindy López
