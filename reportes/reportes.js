import { generarReporteIngresos } from "../js/dataManager.js";

const form = document.getElementById("reporteForm");
const messageEl = document.getElementById("message");
const fechaInicioInput = document.getElementById("fechaInicio");
const fechaFinInput = document.getElementById("fechaFin");
const resultadoDiv = document.getElementById("resultadoReporte");
const cantidadVentasEl = document.getElementById("cantidadVentas");
const totalIngresosEl = document.getElementById("totalIngresos");
const ventasTableBody = document.querySelector("#ventasTable tbody");

// Botones de atajos
const btnHoy = document.getElementById("btnHoy");
const btnAyer = document.getElementById("btnAyer");
const btnSemana = document.getElementById("btnSemana");

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

function formatFecha(fecha) {
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
}

// Configurar fecha de hoy por defecto
document.addEventListener("DOMContentLoaded", () => {
  const hoy = new Date();
  fechaFinInput.value = formatFecha(hoy);
  fechaInicioInput.value = formatFecha(hoy);
});

// Atajos de fechas
btnHoy.addEventListener("click", () => {
  const hoy = new Date();
  fechaInicioInput.value = formatFecha(hoy);
  fechaFinInput.value = formatFecha(hoy);
  clearMessage();
});

btnAyer.addEventListener("click", () => {
  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  fechaInicioInput.value = formatFecha(ayer);
  fechaFinInput.value = formatFecha(ayer);
  clearMessage();
});

btnSemana.addEventListener("click", () => {
  const hoy = new Date();
  const primerDia = new Date(hoy);
  primerDia.setDate(hoy.getDate() - hoy.getDay()); // Domingo de esta semana
  fechaInicioInput.value = formatFecha(primerDia);
  fechaFinInput.value = formatFecha(hoy);
  clearMessage();
});

function renderVentas(ventas) {
  ventasTableBody.innerHTML = "";
  
  if (!ventas || ventas.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="5" style="text-align:center;color:#999">No hay ventas en el rango seleccionado</td>`;
    ventasTableBody.appendChild(tr);
    return;
  }
  
  ventas.forEach(v => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td data-label="Fecha">${escapeHtml(v.fechaFormato)}</td>
      <td data-label="Producto">${escapeHtml(v.nombreProducto)}</td>
      <td data-label="Cantidad">${v.cantidad}</td>
      <td data-label="Precio Unitario">$${parseFloat(v.precioUnitario).toFixed(2)}</td>
      <td data-label="Total">$${parseFloat(v.total).toFixed(2)}</td>
    `;
    ventasTableBody.appendChild(tr);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessage();

  const fechaInicio = fechaInicioInput.value;
  const fechaFin = fechaFinInput.value;

  if (!fechaInicio || !fechaFin) {
    return showMessage("error", "Debe seleccionar ambas fechas.");
  }

  try {
    const res = await Promise.resolve(generarReporteIngresos(fechaInicio, fechaFin));
    
    if (res && res.success) {
      // Mostrar resultados
      resultadoDiv.style.display = "block";
      cantidadVentasEl.textContent = res.cantidad;
      totalIngresosEl.textContent = `$${res.total.toFixed(2)}`;
      renderVentas(res.ventas);
      
      if (res.cantidad === 0) {
        showMessage("info", "No se encontraron ventas en el rango de fechas seleccionado.");
      } else {
        showMessage("success", `Reporte generado: ${res.cantidad} venta(s) encontrada(s).`);
      }
    } else {
      resultadoDiv.style.display = "none";
      showMessage("error", res && res.error ? res.error : "Error al generar reporte.");
    }
  } catch (err) {
    showMessage("error", "Error inesperado al generar reporte.");
    console.error(err);
  }
});
