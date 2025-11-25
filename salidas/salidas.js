import { getProductosVisibles, registrarSalida, getMovimientos } from "../js/dataManager.js";

const form = document.getElementById("salidaForm");
const messageEl = document.getElementById("message");
const productoSelect = document.getElementById("producto");
const stockActualInput = document.getElementById("stockActual");
const cantidadInput = document.getElementById("cantidad");
const movimientosTableBody = document.querySelector("#movimientosTable tbody");

function showMessage(type, text) {
  messageEl.className = `message ${type}`;
  messageEl.textContent = text;
}

function clearMessage(){
  messageEl.className = "message";
  messageEl.textContent = "";
}

function escapeHtml(str = "") {
  return String(str).replace(/[&<>\"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function loadProductos() {
  const productos = getProductosVisibles();
  productoSelect.innerHTML = '<option value="">-- Seleccione un producto --</option>';
  
  productos.forEach(p => {
    const option = document.createElement("option");
    option.value = p.codigo;
    option.textContent = `${p.nombre} (${p.codigo}) - Stock: ${p.stock || 0}`;
    option.dataset.stock = p.stock || 0;
    option.dataset.nombre = p.nombre;
    productoSelect.appendChild(option);
  });
}

function renderMovimientos() {
  const movimientos = getMovimientos();
  movimientosTableBody.innerHTML = "";
  
  if (!movimientos || movimientos.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="6" style="text-align:center;color:#999">No hay movimientos registrados</td>`;
    movimientosTableBody.appendChild(tr);
    return;
  }
  
  // Mostrar los más recientes primero
  movimientos.reverse().forEach(m => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td data-label="Fecha">${escapeHtml(m.fecha)}</td>
      <td data-label="Producto">${escapeHtml(m.nombreProducto)}</td>
      <td data-label="Tipo">${escapeHtml(m.tipo)}</td>
      <td data-label="Cantidad">${m.cantidad}</td>
      <td data-label="Stock Anterior">${m.stockAnterior}</td>
      <td data-label="Stock Nuevo">${m.stockNuevo}</td>
    `;
    movimientosTableBody.appendChild(tr);
  });
}

// Actualizar stock actual cuando se selecciona un producto
productoSelect.addEventListener("change", () => {
  const selectedOption = productoSelect.options[productoSelect.selectedIndex];
  if (selectedOption.value) {
    stockActualInput.value = selectedOption.dataset.stock || 0;
  } else {
    stockActualInput.value = "";
  }
  clearMessage();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessage();

  const selectedOption = productoSelect.options[productoSelect.selectedIndex];
  if (!selectedOption.value) {
    return showMessage("error", "Debe seleccionar un producto.");
  }

  const salida = {
    codigoProducto: selectedOption.value,
    nombreProducto: selectedOption.dataset.nombre,
    cantidad: parseInt(cantidadInput.value, 10),
    tipo: form.tipo.value,
    stockAnterior: parseInt(selectedOption.dataset.stock, 10)
  };

  if (!salida.cantidad || salida.cantidad <= 0) {
    return showMessage("error", "La cantidad debe ser mayor a 0.");
  }

  try {
    const res = await Promise.resolve(registrarSalida(salida));
    if (res && res.success) {
      showMessage("success", `Salida registrada correctamente. Stock actualizado a ${res.stockNuevo} unidades.`);
      form.reset();
      stockActualInput.value = "";
      loadProductos();
      renderMovimientos();
    } else {
      showMessage("error", res && res.error ? res.error : "Error al registrar salida.");
    }
  } catch (err) {
    showMessage("error", "Error inesperado al registrar salida.");
    console.error(err);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  loadProductos();
  renderMovimientos();
});
