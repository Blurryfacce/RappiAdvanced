/*
 * Archivo: js/dataManager.js
 * Responsable: Jhair Zambrano
 * Misión: Gestionar la lectura y escritura de datos en localStorage,
 * aplicando las reglas de negocio (validaciones) de las HU.
 */

// --- 1. INICIALIZACIÓN ---
// Esta función se asegura de que localStorage tenga las "tablas" (listas)
// creadas, aunque estén vacías, para evitar errores al leerlas.
function init() {
    if (!localStorage.getItem('productos')) {
        localStorage.setItem('productos', JSON.stringify([]));
    }
    if (!localStorage.getItem('proveedores')) {
        localStorage.setItem('proveedores', JSON.stringify([]));
    }
    console.log("Data Manager inicializado. Listo para operar.");
}

// --- 2. FUNCIONES DE PRODUCTOS (HU-1) ---

/**
 * (PRIVADA) Obtiene la lista actual de productos desde localStorage.
 * Nadie más necesita esta función, solo tú dentro of este archivo.
 * @returns {Array} Un array de objetos de producto.
 */
function getProductos() {
    // JSON.parse() convierte el texto de localStorage de nuevo a un objeto/array de JS
    return JSON.parse(localStorage.getItem('productos'));
}

/**
 * (PÚBLICA) Intenta guardar un nuevo producto.
 * Esta es la función que Sergio usará.
 * Debe validar ANTES de guardar.
 * @param {object} producto - El objeto con datos {codigo, nombre, precio, stock}
 * @returns {object} - {success: true} o {success: false, error: "Mensaje de error"}
 */
export function guardarProducto(producto) {
    
    // --- Validación 1: Campos obligatorios (CA de Tarea4-G6) ---
    // Nombre obligatorio. Precio puede ser 0 pero no puede ser undefined o NaN
    if (!producto.nombre || String(producto.nombre).trim() === '') {
        console.error("Error de validación: Nombre es obligatorio.");
        return { 
            success: false, 
            error: "Campo obligatorio faltante: Nombre." 
        };
    }
    if (producto.precio === undefined || producto.precio === null || Number.isNaN(Number(producto.precio))) {
        console.error("Error de validación: Precio inválido o faltante.");
        return {
            success: false,
            error: "Precio inválido o faltante. Debe ser un número (0 permitido)."
        };
    }

    const productosActuales = getProductos(); // Obtiene la "BD" actual

    // --- Validación 2: Código duplicado (CA de Tarea4-G6) ---
    // .some() es una forma rápida de ver si AL MENOS UN elemento cumple la condición
    const yaExisteCodigo = productosActuales.some(p => p.codigo === producto.codigo);
    
    if (yaExisteCodigo) {
        console.error("Error de validación: Código de producto duplicado.");
        return { 
            success: false, 
            error: "Error de duplicidad: El código de producto ya existe." 
        };
    }

    // --- ¡Éxito! Todas las validaciones pasaron ---
    console.log("Guardando nuevo producto:", producto);
    productosActuales.push(producto); // Agrega el nuevo producto a la lista
    
    // Vuelve a guardar la lista COMPLETA en localStorage
    // JSON.stringify() convierte el array de JS en un string para guardarlo
    localStorage.setItem('productos', JSON.stringify(productosActuales));

    return { success: true };
}

/**
 * (PÚBLICA) Devuelve la lista de productos para que Sergio la "pinte" en la tabla.
 * @returns {Array} Un array de objetos de producto.
 */
export function getProductosVisibles() {
    // Simplemente llamamos a la función privada
    return getProductos();
}

/**
 * (PÚBLICA) Elimina un producto por su código.
 * @param {string} codigo - El código del producto a eliminar
 * @returns {object} - {success: true} o {success: false, error: "Mensaje de error"}
 */
export function eliminarProducto(codigo) {
    if (!codigo) {
        console.error("Error: Código de producto no proporcionado.");
        return {
            success: false,
            error: "Código de producto requerido."
        };
    }

    const productosActuales = getProductos();
    const indice = productosActuales.findIndex(p => p.codigo === codigo);

    if (indice === -1) {
        console.error("Error: Producto no encontrado.");
        return {
            success: false,
            error: "Producto no encontrado."
        };
    }

    // Eliminar el producto del array
    productosActuales.splice(indice, 1);
    
    // Guardar la lista actualizada
    localStorage.setItem('productos', JSON.stringify(productosActuales));
    
    console.log("Producto eliminado exitosamente:", codigo);
    return { success: true };
}

// --- 3. FUNCIONES DE PROVEEDORES (HU-2) ---

/**
 * (PRIVADA) Obtiene la lista actual de proveedores.
 * @returns {Array} Un array de objetos de proveedor.
 */
function getProveedores() {
    return JSON.parse(localStorage.getItem('proveedores'));
}

/**
 * (PÚBLICA) Intenta guardar un nuevo proveedor.
 * Esta es la función que Isaac usará.
 * @param {object} proveedor - El objeto con datos {razonSocial, contacto, ...}
 * @returns {object} - {success: true} o {success: false, error: "Mensaje de error"}
 */
export function guardarProveedor(proveedor) {
    
    // --- Validación 1: Razón Social (CA de Tarea4-G6) ---
    if (!proveedor.razonSocial) {
        console.error("Error de validación: Razón Social es obligatoria.");
        return { 
            success: false, 
            error: "La Razón Social es obligatoria." 
        };
    }

    // Validar formato de Razón Social: solo letras, números, espacios y caracteres básicos
    const razonSocialRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,&\-()]+$/;
    if (!razonSocialRegex.test(proveedor.razonSocial)) {
        console.error("Error de validación: Formato de Razón Social inválido.");
        return {
            success: false,
            error: "La Razón Social solo puede contener letras, números, espacios y caracteres básicos (.,&-())."
        };
    }

    // Validar longitud mínima de Razón Social
    if (proveedor.razonSocial.trim().length < 3) {
        console.error("Error de validación: Razón Social muy corta.");
        return {
            success: false,
            error: "La Razón Social debe tener al menos 3 caracteres."
        };
    }
    
    // --- Validación 2: Teléfono (si se proporciona) ---
    if (proveedor.telefono && proveedor.telefono.trim() !== '') {
        // Formato ecuatoriano: permite 09XXXXXXXX, +593XXXXXXXXX, o con guiones/espacios
        const telefonoRegex = /^(\+593|0)[0-9\s\-()]{8,12}$/;
        const telefonoLimpio = proveedor.telefono.replace(/[\s\-()]/g, '');
        
        if (!telefonoRegex.test(proveedor.telefono)) {
            console.error("Error de validación: Formato de teléfono inválido.");
            return {
                success: false,
                error: "El teléfono debe tener un formato válido ecuatoriano (ej: 0991234567, +593991234567)."
            };
        }

        // Validar longitud del teléfono sin formato
        if (telefonoLimpio.length < 9 || telefonoLimpio.length > 13) {
            console.error("Error de validación: Longitud de teléfono incorrecta.");
            return {
                success: false,
                error: "El teléfono debe tener entre 9 y 13 dígitos."
            };
        }
    }

    // --- Validación 3: Email (si se proporciona) ---
    if (proveedor.email && proveedor.email.trim() !== '') {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(proveedor.email)) {
            console.error("Error de validación: Formato de email inválido.");
            return {
                success: false,
                error: "El email debe tener un formato válido (ejemplo@dominio.com)."
            };
        }
    }

    // --- Validación 4: Dirección (si se proporciona) ---
    if (proveedor.direccion && proveedor.direccion.trim() !== '') {
        // Permitir caracteres alfanuméricos, espacios y símbolos comunes en direcciones
        const direccionRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,#\-°/]+$/;
        if (!direccionRegex.test(proveedor.direccion)) {
            console.error("Error de validación: Formato de dirección inválido.");
            return {
                success: false,
                error: "La dirección contiene caracteres no válidos."
            };
        }

        if (proveedor.direccion.trim().length < 5) {
            console.error("Error de validación: Dirección muy corta.");
            return {
                success: false,
                error: "La dirección debe tener al menos 5 caracteres."
            };
        }
    }

    // --- Validación 5: Contacto (si se proporciona) ---
    if (proveedor.contacto && proveedor.contacto.trim() !== '') {
        const contactoRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.'-]+$/;
        if (!contactoRegex.test(proveedor.contacto)) {
            console.error("Error de validación: Formato de contacto inválido.");
            return {
                success: false,
                error: "El nombre de contacto solo puede contener letras, espacios y caracteres básicos (.'-)."
            };
        }
    }
    
    const proveedoresActuales = getProveedores();
    
    // --- Validación 6: Razón Social duplicada ---
    const yaExisteRazonSocial = proveedoresActuales.some(
        p => p.razonSocial.toLowerCase().trim() === proveedor.razonSocial.toLowerCase().trim()
    );
    
    if (yaExisteRazonSocial) {
        console.error("Error de validación: Razón Social duplicada.");
        return { 
            success: false, 
            error: "Ya existe un proveedor con esta Razón Social." 
        };
    }

    // --- ¡Éxito! ---
    console.log("Guardando nuevo proveedor:", proveedor);
    proveedoresActuales.push(proveedor);
    localStorage.setItem('proveedores', JSON.stringify(proveedoresActuales));

    return { success: true };
}

/**
 * (PÚBLICA) Devuelve la lista de proveedores para que Isaac la "pinte".
 * @returns {Array} Un array de objetos de proveedor.
 */
export function getProveedoresVisibles() {
    return getProveedores();
}

/**
 * (PÚBLICA) Elimina un proveedor por su razón social.
 * @param {string} razonSocial - La razón social del proveedor a eliminar
 * @returns {object} - {success: true} o {success: false, error: "Mensaje de error"}
 */
export function eliminarProveedor(razonSocial) {
    if (!razonSocial) {
        console.error("Error: Razón Social no proporcionada.");
        return {
            success: false,
            error: "Razón Social requerida."
        };
    }

    const proveedoresActuales = getProveedores();
    const indice = proveedoresActuales.findIndex(p => p.razonSocial === razonSocial);

    if (indice === -1) {
        console.error("Error: Proveedor no encontrado.");
        return {
            success: false,
            error: "Proveedor no encontrado."
        };
    }

    // Eliminar el proveedor del array
    proveedoresActuales.splice(indice, 1);
    
    // Guardar la lista actualizada
    localStorage.setItem('proveedores', JSON.stringify(proveedoresActuales));
    
    console.log("Proveedor eliminado exitosamente:", razonSocial);
    return { success: true };
}


// --- 4. EJECUCIÓN INICIAL ---
// Esto ejecuta la función `init()` en cuanto el script es cargado por primera vez.
init();


// Temporal para pruebas en consola
window.testGuardarProducto = guardarProducto;
window.testGetProductos = getProductosVisibles;
window.testEliminarProducto = eliminarProducto;
window.testGuardarProveedor = guardarProveedor;
window.testGetProveedores = getProveedoresVisibles;
window.testEliminarProveedor = eliminarProveedor;