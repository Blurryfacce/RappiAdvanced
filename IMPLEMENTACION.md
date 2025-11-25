# RappiAdvanced - Sistema de Gestión y Control de Inventario (SGCI)

## Descripción
Control de Inventario y Ventas para Pymes

## Historias de Usuario Implementadas

### HU-1: Registrar un nuevo producto ✅
**Como**: Administrador  
**Quiero**: Registrar un nuevo producto en el sistema  
**Para**: Mantener el catálogo de inventario actualizado

#### Criterios de Aceptación:
- ✅ **Registro exitoso**: Al ingresar código único, nombre, precio y cantidad en stock, el producto se guarda y aparece en la lista
- ✅ **Campos obligatorios**: El sistema valida que código, nombre y precio estén presentes
- ✅ **Código duplicado**: El sistema previene guardar productos con códigos duplicados
- ✅ **Stock no negativo**: El sistema valida que el stock no sea negativo

#### Correcciones Implementadas:
- ✅ **NO requiere login**: Se eliminaron las validaciones de autenticación
- ✅ **NO requiere rol Administrador**: Cualquier usuario puede registrar productos
- ✅ **Validación de stock negativo**: Se agregó validación para prevenir stock negativo

**Ruta**: `/productos/productos.html`

---

### HU-2: Registrar un nuevo proveedor ✅
**Como**: Administrador  
**Quiero**: Registrar la información básica de un nuevo proveedor  
**Para**: Gestionar mi red de abastecimiento

#### Criterios de Aceptación:
- ✅ **Registro exitoso**: Al ingresar razón social e información de contacto, el proveedor se guarda
- ✅ **Razón social obligatoria**: El sistema valida que la razón social esté presente
- ✅ **Validaciones adicionales**: Email, teléfono, dirección y contacto con formatos válidos

**Ruta**: `/proveedores/proveedores.html`

---

### HU-3: Registrar una salida de inventario ✅
**Como**: Jefe de bodega  
**Quiero**: Registrar una salida de productos del almacén  
**Para**: Mantener el conteo de stock preciso en tiempo real

#### Criterios de Aceptación:
- ✅ **Salida exitosa**: El stock se actualiza correctamente al registrar una salida
- ✅ **Stock insuficiente**: El sistema muestra error si no hay stock suficiente
- ✅ **Historial de movimientos**: Cada salida se registra en el historial con fecha, tipo y cantidad

#### Características:
- Tipos de salida: Venta, Ajuste, Devolución, Merma
- Validación de stock en tiempo real
- Historial completo de movimientos
- Las ventas se registran automáticamente para reportes

**Ruta**: `/salidas/salidas.html`

---

### HU-4: Consultar ingresos totales por rango de fechas ✅
**Como**: Administrador  
**Quiero**: Generar un reporte de ingresos en un periodo específico  
**Para**: Tomar decisiones financieras

#### Criterios de Aceptación:
- ✅ **Reporte con ventas**: Muestra el total de ingresos del periodo seleccionado
- ✅ **Reporte sin ventas**: Muestra $0 cuando no hay ventas en el rango
- ✅ **Rango personalizado**: Permite seleccionar cualquier rango de fechas

#### Características:
- Atajos rápidos: Hoy, Ayer, Esta Semana
- Detalle de cada venta en el periodo
- Total de ventas y ingresos totales
- Filtrado por rango de fechas personalizado

**Ruta**: `/reportes/reportes.html`

---

## Estructura del Proyecto

```
RappiAdvanced/
├── index.html              # Página principal
├── README.md              # Este archivo
├── css/
│   └── styles.css         # Estilos globales
├── images/                # Imágenes del sistema
├── js/
│   ├── auth.js           # Módulo de autenticación
│   ├── dataManager.js    # Gestión de datos (localStorage)
│   ├── login.js          # Lógica de login
│   └── main.js           # Script principal
├── productos/
│   ├── productos.html    # HU-1: Gestión de productos
│   ├── productos.css
│   └── productos.js
├── proveedores/
│   ├── proveedores.html  # HU-2: Gestión de proveedores
│   ├── proveedores.css
│   └── proveedores.js
├── salidas/
│   ├── salidas.html      # HU-3: Salidas de inventario
│   ├── salidas.css
│   └── salidas.js
└── reportes/
    ├── reportes.html     # HU-4: Reportes de ingresos
    ├── reportes.css
    └── reportes.js
```

## Tecnologías Utilizadas
- HTML5
- CSS3
- JavaScript (ES6 Modules)
- LocalStorage para persistencia de datos

## Instrucciones de Uso

1. **Abrir el sistema**: Abrir `index.html` en un navegador web
2. **Registrar productos**: Ir a Módulo de Productos y completar el formulario
3. **Registrar proveedores**: Ir a Módulo de Proveedores
4. **Registrar salidas**: Ir a Módulo de Salidas, seleccionar producto y cantidad
5. **Ver reportes**: Ir a Módulo de Reportes y seleccionar rango de fechas

## Validaciones Principales

### Productos:
- Código único (no duplicados)
- Nombre obligatorio
- Precio válido (≥ 0)
- Stock no negativo

### Proveedores:
- Razón social obligatoria (mínimo 3 caracteres)
- Email con formato válido
- Teléfono con formato ecuatoriano
- Dirección mínimo 5 caracteres

### Salidas:
- Producto seleccionado
- Cantidad > 0
- Stock suficiente disponible

### Reportes:
- Fecha inicio ≤ Fecha fin
- Ambas fechas requeridas

## Equipo de Desarrollo

**Grupo 6**
- Isaac Proaño
- Sergio Rodríguez
- Jhair Zambrano
- Daniel Moncayo

**Curso**: GR2SW  
**Periodo**: 2025B  
**Docente**: Prof. Cindy López

---

## Notas Importantes

- Todos los datos se almacenan en LocalStorage del navegador
- Las ventas (tipo "venta" en salidas) se registran automáticamente para los reportes
- El stock se actualiza en tiempo real al registrar salidas
- No se requiere autenticación para usar el sistema (según corrección HU-1)
