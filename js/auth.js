// Módulo de autenticación simple (cliente)
// Uso: guardar un objeto JSON en localStorage con la clave `currentUser`.
// Ejemplo de usuario: { "username": "juan", "role": "Administrador" }

export function getCurrentUser() {
  const raw = localStorage.getItem('currentUser');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.warn('currentUser inválido en localStorage');
    return null;
  }
}

export function isLoggedIn() {
  return !!getCurrentUser();
}

export function isAdmin() {
  const u = getCurrentUser();
  if (!u || !u.role) return false;
  return String(u.role).toLowerCase() === 'administrador' || String(u.role).toLowerCase() === 'admin';
}

// Helper para mostrar mensaje simple y opcionalmente redirigir
export function denyAccess(messageEl, options = {}) {
  const { redirect = false, redirectTo = '../index.html', hideFormSelector } = options;
  if (messageEl) {
    messageEl.className = 'message error';
    messageEl.textContent = 'Acceso denegado: ' + (messageEl.dataset && messageEl.dataset.custom ? messageEl.dataset.custom : 'credenciales insuficientes.');
  }
  if (hideFormSelector) {
    const f = document.querySelector(hideFormSelector);
    if (f) f.style.display = 'none';
  }
  if (redirect) {
    setTimeout(() => { window.location.href = redirectTo; }, 1200);
  }
}

const getUsers = () => {
    try {
        const users = JSON.parse(localStorage.getItem('users'));
        return Array.isArray(users) ? users : [];
    } catch (e) {
        console.error("Error al cargar usuarios:", e);
        return [];
    }
};

function saveUsers(list) {
  localStorage.setItem('users', JSON.stringify(list || []));
}

export function findUserByUsername(username) {
  if (!username) return null;
  const users = getUsers();
  return users.find(u => String(u.username).trim() === String(username).trim()) || null;
}

export function registerUser({ username, role }) {
  if (!username || String(username).trim() === '') {
    return { success: false, error: 'El nombre de usuario es obligatorio.' };
  }
  if (!role || String(role).trim() === '') {
    return { success: false, error: 'El rol es obligatorio.' };
  }

  const existing = findUserByUsername(username);
  if (existing) {
    return { success: false, error: 'Ya existe un usuario con ese nombre.' };
  }

  const users = getUsers();
  const user = { username: String(username).trim(), role: String(role).trim() };
  users.push(user);
  saveUsers(users);
  return { success: true };
}

export function loginUser(username) {
  const user = findUserByUsername(username);
  if (!user) return { success: false, error: 'Usuario no registrado.' };
  try {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true };
  } catch (e) {
    return { success: false, error: 'No se pudo iniciar sesión.' };
  }
}

export function logoutUser(){
  localStorage.removeItem('currentUser')
}

/**
 * Inicializa el sistema creando usuarios por defecto si no hay ninguno.
 */
function initializeUsers() {
    const users = getUsers();
    if (users.length === 0) {
        console.log("Creando usuarios por defecto: admin y empleado.");
        const defaultAdmin = {
            username: 'admin',
            role: 'Administrador'
        };
        const defaultEmployee = {
            username: 'empleado',
            role: 'Empleado'
        };
        
        saveUsers([defaultAdmin, defaultEmployee]);
    }
}

initializeUsers();

