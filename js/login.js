import { isAdmin, isLoggedIn, loginUser } from "./auth.js";

// Si ya está logueado, redirigir al inicio para evitar que se loguee dos veces.
if (isLoggedIn()) {
    window.location.href = "./index.html";
}

const form = document.getElementById("loginForm");
const messageEl = document.getElementById("loginMessage");

if (form) {
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById("username");
    if (!usernameInput) {
        messageEl.textContent =
        "Error interno: No se encontró el campo de usuario.";
        return;
    }

    const username = usernameInput.value;

    // Intentar iniciar sesión
    const res = loginUser(username);

    if (res.success) {
        messageEl.textContent = `¡Bienvenido ${username}! Rol: ${
        isAdmin() ? "Administrador" : "Empleado"
    }.`;
    messageEl.className = "message success";

      // Redirigir al inicio después de un pequeño retraso
    setTimeout(() => {
        window.location.href = "./index.html";
    }, 500);
    } else {
      // Mostrar mensaje de error si las credenciales son incorrectas
        messageEl.textContent = res.error;
        messageEl.className = "message error";
    }
    });
}
