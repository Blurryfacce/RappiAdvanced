import { isAdmin, isLoggedIn } from "../js/auth.js"; // Importamos las funciones de seguridad
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

function escapeHtml(str = "") {
  return String(str).replace(/[&<>\"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

// --- FUNCIÓN RENDERIZAR (Modificada para roles) ---
function renderProductos(list = []) {
  tableBody.innerHTML = "";
  
  if (!Array.isArray(list) || list.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="5" style="text-align:center;color:var(--muted)">No hay productos registrados</td>`;
    tableBody.appendChild(tr);
    return;
  }

  // Verificamos si es administrador
  const esAdmin = isAdmin();

  list.forEach(p => {
    const tr = document.createElement("tr");
    
    // Si es admin mostramos el botón, si no, texto informativo
    const accionHtml = esAdmin 
        ? `<button class="btn btn-danger btn-small btn-delete" data-codigo="${escapeHtml(p.codigo)}">Eliminar</button>`
        : `<span style="color: grey; font-size: 0.9em;">Solo lectura</span>`;

    tr.innerHTML = `
      <td data-label="Código">${escapeHtml(p.codigo)}</td>
      <td data-label="Nombre">${escapeHtml(p.nombre)}</td>
      <td data-label="Precio">${Number(p.precio).toFixed(2)}</td>
      <td data-label="Stock">${Number(p.stock || 0)}</td>
      <td data-label="Acciones">${accionHtml}</td>
    `;
    tableBody.appendChild(tr);
  });
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

// --- EVENTOS Y CARGA INICIAL ---

document.addEventListener("DOMContentLoaded", function () {
  // 1. Verificar si está logueado
  if (!isLoggedIn()) {
      window.location.href = '../login.html';
      return;
  }
  
  // 2. Si NO es administrador, ocultamos el formulario de crear
  if (!isAdmin()) {
      if(form) {
          form.style.display = 'none';
          // Opcional: Mostrar mensaje de aviso
          const aviso = document.createElement('div');
          aviso.style.padding = '1rem';
          aviso.style.marginBottom = '1rem';
          aviso.style.backgroundColor = '#f8f9fa';
          aviso.style.color = '#666';
          aviso.style.textAlign = 'center';
          aviso.innerHTML = '🔒 <strong>Modo Vista:</strong> Solo los administradores pueden registrar o eliminar productos.';
          form.parentNode.insertBefore(aviso, form);
      }
      // También ocultamos el título "Nuevo Producto" si quieres
      const tituloForm = document.querySelector('h2'); 
      if(tituloForm && tituloForm.textContent.includes('Nuevo Producto')) {
          tituloForm.style.display = 'none';
      }
  }

  loadProductos();
});

// Lógica del Formulario (Solo funcionará si el form es visible/existe)
if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearMessage();

      // Doble chequeo de seguridad
      if (!isAdmin()) return;

      const producto = {
        codigo: form.codigo.value.trim(),
        nombre: form.nombre.value.trim(),
        precio: parseFloat(form.precio.value),
        stock: (function(){ const v = form.stock.value; return v === '' ? 0 : parseInt(v, 10); })()
      };

      if (!producto.codigo) return showMessage("error", "El código es obligatorio.");
      if (!producto.nombre) return showMessage("error", "El nombre es obligatorio.");
      if (Number.isNaN(producto.precio) || producto.precio < 0) return showMessage("error", "Precio inválido.");
      if (Number.isNaN(producto.stock) || producto.stock < 0) return showMessage("error", "El stock no puede ser negativo");

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
}

// Delegación de eventos para el botón eliminar
tableBody.addEventListener('click', async (evt) => {
  const btn = evt.target.closest('.btn-delete');
  if (!btn) return;

  // Seguridad extra: Si no es admin, no hacemos nada
  if (!isAdmin()) return;

  const codigo = btn.dataset.codigo;
  if (!codigo) return;
  
  const confirmMsg = `¿Eliminar producto con código "${codigo}"?`;
  if (!confirm(confirmMsg)) return;

  try {
    const row = btn.closest('tr');
    if (row) {
      row.classList.add('row-removing');
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