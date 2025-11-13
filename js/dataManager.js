const KEY_PRODUCTOS = "rappi_productos_v1";
const KEY_PROVEEDORES = "rappi_proveedores_v1";

function initIfNeeded() {
  if (!localStorage.getItem(KEY_PRODUCTOS)) {
    localStorage.setItem(KEY_PRODUCTOS, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEY_PROVEEDORES)) {
    localStorage.setItem(KEY_PROVEEDORES, JSON.stringify([]));
  }
}

function readProductos(){
  initIfNeeded();
  try {
    return JSON.parse(localStorage.getItem(KEY_PRODUCTOS)) || [];
  } catch {
    return [];
  }
}

function writeProductos(list){
  localStorage.setItem(KEY_PRODUCTOS, JSON.stringify(list));
}

export function guardarProducto(producto){
  initIfNeeded();
  const list = readProductos();

  if (!producto.codig && !producto.codigo) {
    return { success:false, error: "Código faltante" };
  }
  const codigo = String(producto.codigo).trim();
  if (!codigo) return { success:false, error: "Código faltante" };
  if (!producto.nombre || String(producto.nombre).trim() === "") {
    return { success:false, error: "Nombre del producto obligatorio" };
  }
  if (producto.precio === undefined || producto.precio === null || Number.isNaN(Number(producto.precio))) {
    return { success:false, error: "Precio inválido" };
  }

  const exists = list.find(p => String(p.codigo) === codigo);
  if (exists) return { success:false, error: "Código duplicado" };

  const nuevo = {
    codigo,
    nombre: String(producto.nombre).trim(),
    precio: Number(producto.precio),
    stock: Number(producto.stock) || 0,
    createdAt: new Date().toISOString()
  };
  list.push(nuevo);
  writeProductos(list);
  return { success:true };
}

export function getProductos(){
  initIfNeeded();
  return readProductos();
}

export function eliminarProducto(codigo){
  initIfNeeded();
  const list = readProductos();
  const idx = list.findIndex(p => String(p.codigo) === String(codigo));
  if (idx === -1) return { success:false, error: 'Producto no encontrado' };
  list.splice(idx, 1);
  writeProductos(list);
  return { success:true };
}

export function guardarProveedor(proveedor){
  initIfNeeded();
  const list = JSON.parse(localStorage.getItem(KEY_PROVEEDORES) || "[]");
  if (!proveedor || !proveedor.razonSocial || proveedor.razonSocial.trim() === "") {
    return { success:false, error: "Razón social faltante" };
  }
  list.push({
    razonSocial: proveedor.razonSocial.trim(),
    contacto: proveedor.contacto || "",
    createdAt: new Date().toISOString()
  });
  localStorage.setItem(KEY_PROVEEDORES, JSON.stringify(list));
  return { success:true };
}

export function getProveedores(){
  initIfNeeded();
  try {
    return JSON.parse(localStorage.getItem(KEY_PROVEEDORES)) || [];
  } catch {
    return [];
  }
}
