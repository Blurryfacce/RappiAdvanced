import { eliminarProveedor, getProveedoresVisibles, guardarProveedor } from "../js/dataManager.js";

const form = document.getElementById("proveedorForm");
const messageEl = document.getElementById("message");
const tableBody = document.querySelector("#proveedoresTable tbody");

function showMessage(type, text) {
  messageEl.className = `message ${type}`;
  messageEl.textContent = text;
}

function clearMessage(){
  messageEl.className = "message";
  messageEl.textContent = "";
}

function renderProveedores(list = []) {
  tableBody.innerHTML = "";
  if (!Array.isArray(list) || list.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="6" style="text-align:center;color:var(--muted)">No hay proveedores registrados</td>`;
    tableBody.appendChild(tr);
    return;
  }
  list.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td data-label="Razón Social">${escapeHtml(p.razonSocial)}</td>
      <td data-label="Contacto">${escapeHtml(p.contacto || '-')}</td>
      <td data-label="Teléfono">${escapeHtml(p.telefono || '-')}</td>
      <td data-label="Email">${escapeHtml(p.email || '-')}</td>
      <td data-label="Dirección">${escapeHtml(p.direccion || '-')}</td>
      <td data-label="Acciones"><button class="btn btn-danger btn-small btn-delete" data-razon="${escapeHtml(p.razonSocial)}">Eliminar</button></td>
    `;
    tableBody.appendChild(tr);
  });
}

function escapeHtml(str = "") {
  return String(str).replace(/[&<>\"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

async function loadProveedores() {
  try {
    const list = await Promise.resolve(getProveedoresVisibles());
    renderProveedores(list);
  } catch (err) {
    showMessage("error", "Error al leer proveedores");
    console.error(err);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessage();

  const proveedor = {
    razonSocial: form.razonSocial.value.trim(),
    contacto: form.contacto.value.trim(),
    telefono: form.telefono.value.trim(),
    email: form.email.value.trim(),
    direccion: form.direccion.value.trim()
  };

  // Validación del campo obligatorio
  if (!proveedor.razonSocial) {
    return showMessage("error", "La Razón Social es obligatoria.");
  }

  try {
    const res = await Promise.resolve(guardarProveedor(proveedor));
    if (res && res.success) {
      showMessage("success", "Proveedor guardado correctamente.");
      form.reset();
      loadProveedores();
    } else {
      showMessage("error", res && res.error ? res.error : "Error al guardar proveedor.");
    }
  } catch (err) {
    showMessage("error", "Error inesperado al guardar.");
    console.error(err);
  }
});

document.addEventListener("DOMContentLoaded", loadProveedores);

// Delegación de eventos para el botón eliminar
tableBody.addEventListener('click', async (evt) => {
  const btn = evt.target.closest('.btn-delete');
  if (!btn) return;
  const razonSocial = btn.dataset.razon;
  if (!razonSocial) return;
  const confirmMsg = `¿Eliminar proveedor "${razonSocial}"?`;
  if (!confirm(confirmMsg)) return;
  
  try {
    const res = await Promise.resolve(eliminarProveedor(razonSocial));
    if (res && res.success) {
      showMessage("success", "Proveedor eliminado correctamente.");
      loadProveedores();
    } else {
      showMessage("error", res && res.error ? res.error : "Error al eliminar proveedor.");
    }
  } catch (err) {
    showMessage("error", "Error inesperado al eliminar.");
    console.error(err);
  }
});
