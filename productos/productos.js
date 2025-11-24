import { eliminarProducto, getProductosVisibles, guardarProducto } from "../js/dataManager.js";

const form = document.getElementById("productoForm");
const messageEl = document.getElementById("message");
const tableBody = document.querySelector("#productosTable tbody");

function showMessage(type, text) {
  messageEl.className = `message ${type}`;
  messageEl.textContent = text;
}

function clearMessage(){
  messageEl.className = "message";
  messageEl.textContent = "";
}

function renderProductos(list = []) {
  tableBody.innerHTML = "";
  if (!Array.isArray(list) || list.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="4" style="text-align:center;color:var(--muted)">No hay productos registrados</td>`;
    tableBody.appendChild(tr);
    return;
  }
  list.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td data-label="Código">${escapeHtml(p.codigo)}</td>
      <td data-label="Nombre">${escapeHtml(p.nombre)}</td>
      <td data-label="Precio">${Number(p.precio).toFixed(2)}</td>
      <td data-label="Stock">${Number(p.stock || 0)}</td>
      <td data-label="Acciones"><button class="btn btn-danger btn-small btn-delete" data-codigo="${escapeHtml(p.codigo)}">Eliminar</button></td>
    `;
    tableBody.appendChild(tr);
  });
}

function escapeHtml(str = "") {
  return String(str).replace(/[&<>\"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

async function loadProductos() {
  try {
    const list = await Promise.resolve(getProductosVisibles());
    renderProductos(list);
  } catch (err) {
    showMessage("error", "Error al leer productos");
    console.error(err);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessage();

  const producto = {
    codigo: form.codigo.value.trim(),
    nombre: form.nombre.value.trim(),
    precio: parseFloat(form.precio.value),
    stock: parseInt(form.stock.value) || 0
  };

  if (!producto.codigo) return showMessage("error", "El código es obligatorio.");
  if (!producto.nombre) return showMessage("error", "El nombre es obligatorio.");
  if (Number.isNaN(producto.precio) || producto.precio < 0) return showMessage("error", "Precio inválido.");

  try {
    const res = await Promise.resolve(guardarProducto(producto));
    if (res && res.success) {
      showMessage("success", "Producto guardado correctamente.");
      form.reset();
      loadProductos();
    } else {
      showMessage("error", res && res.error ? res.error : "Error al guardar producto.");
    }
  } catch (err) {
    showMessage("error", "Error inesperado al guardar.");
    console.error(err);
  }
});

document.addEventListener("DOMContentLoaded", loadProductos);

// Delegación de eventos para el botón eliminar
tableBody.addEventListener('click', async (evt) => {
  const btn = evt.target.closest('.btn-delete');
  if (!btn) return;
  const codigo = btn.dataset.codigo;
  if (!codigo) return;
  const confirmMsg = `¿Eliminar producto con código "${codigo}"?`;
  if (!confirm(confirmMsg)) return;
  try {
    const row = btn.closest('tr');
    // Animación: agregar clase, esperar y luego llamar al backend
    if (row) {
      row.classList.add('row-removing');
      // esperar el tiempo de la transición CSS antes de borrar del storage
      await new Promise(r => setTimeout(r, 280));
    }

    const res = await Promise.resolve(eliminarProducto(codigo));
    if (res && res.success) {
      showMessage('success', 'Producto eliminado.');
      loadProductos();
    } else {
      showMessage('error', res && res.error ? res.error : 'No se pudo eliminar el producto.');
    }
  } catch (err) {
    console.error(err);
    showMessage('error', 'Error inesperado al eliminar.');
  }
});
