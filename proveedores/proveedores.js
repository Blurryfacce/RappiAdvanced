import { eliminarProveedor, getProveedoresVisibles, guardarProveedor } from "../js/dataManager.js";

const form = document.getElementById("proveedorForm");
const messageEl = document.getElementById("message");
const tableBody = document.querySelector("#proveedoresTable tbody");

// Elementos del formulario
const razonSocialInput = document.getElementById("razonSocial");
const contactoInput = document.getElementById("contacto");
const telefonoInput = document.getElementById("telefono");
const emailInput = document.getElementById("email");
const direccionInput = document.getElementById("direccion");

function showMessage(type, text) {
  messageEl.className = `message ${type}`;
  messageEl.textContent = text;
}

function clearMessage(){
  messageEl.className = "message";
  messageEl.textContent = "";
}

// Función para validar campos en tiempo real
function validateInput(input, validationFn, errorMessage) {
  const value = input.value.trim();
  if (value && !validationFn(value)) {
    input.classList.add('invalid');
    input.classList.remove('valid');
    return false;
  } else if (value) {
    input.classList.remove('invalid');
    input.classList.add('valid');
    return true;
  } else {
    input.classList.remove('invalid', 'valid');
    return true;
  }
}

// Validaciones específicas
function validarRazonSocial(valor) {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,&\-()]+$/;
  return valor.length >= 3 && regex.test(valor);
}

function validarContacto(valor) {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.'-]+$/;
  return regex.test(valor);
}

function validarTelefono(valor) {
  const regex = /^(\+593|0)[0-9\s\-()]{8,12}$/;
  const limpioNumeros = valor.replace(/[\s\-()]/g, '');
  return regex.test(valor) && limpioNumeros.length >= 9 && limpioNumeros.length <= 13;
}

function validarEmail(valor) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(valor);
}

function validarDireccion(valor) {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,#\-°/]+$/;
  return valor.length >= 5 && regex.test(valor);
}

// Event listeners para validación en tiempo real
razonSocialInput.addEventListener('input', () => {
  validateInput(razonSocialInput, validarRazonSocial, 'Razón Social inválida');
});

contactoInput.addEventListener('input', () => {
  validateInput(contactoInput, validarContacto, 'Nombre de contacto inválido');
});

telefonoInput.addEventListener('input', () => {
  validateInput(telefonoInput, validarTelefono, 'Teléfono inválido');
});

emailInput.addEventListener('input', () => {
  validateInput(emailInput, validarEmail, 'Email inválido');
});

direccionInput.addEventListener('input', () => {
  validateInput(direccionInput, validarDireccion, 'Dirección inválida');
});

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

  // Validaciones adicionales del lado del cliente
  if (proveedor.razonSocial && !validarRazonSocial(proveedor.razonSocial)) {
    return showMessage("error", "La Razón Social debe tener al menos 3 caracteres y solo caracteres válidos.");
  }

  if (proveedor.contacto && !validarContacto(proveedor.contacto)) {
    return showMessage("error", "El nombre de contacto contiene caracteres no válidos.");
  }

  if (proveedor.telefono && !validarTelefono(proveedor.telefono)) {
    return showMessage("error", "El teléfono debe tener un formato válido ecuatoriano.");
  }

  if (proveedor.email && !validarEmail(proveedor.email)) {
    return showMessage("error", "El email debe tener un formato válido.");
  }

  if (proveedor.direccion && !validarDireccion(proveedor.direccion)) {
    return showMessage("error", "La dirección debe tener al menos 5 caracteres y solo caracteres válidos.");
  }

  try {
    const res = await Promise.resolve(guardarProveedor(proveedor));
    if (res && res.success) {
      showMessage("success", "Proveedor guardado correctamente.");
      form.reset();
      // Limpiar clases de validación
      document.querySelectorAll('.valid, .invalid').forEach(el => {
        el.classList.remove('valid', 'invalid');
      });
      loadProveedores();
    } else {
      showMessage("error", res && res.error ? res.error : "Error al guardar proveedor.");
    }
  } catch (err) {
    showMessage("error", "Error inesperado al guardar.");
    console.error(err);
  }
});

// Limpiar clases de validación al resetear el formulario
form.addEventListener('reset', () => {
  clearMessage();
  document.querySelectorAll('.valid, .invalid').forEach(el => {
    el.classList.remove('valid', 'invalid');
  });
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
