// js/auth.js

// Abrir base de datos
export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("controlFit", 1);

    request.onerror = () => reject("Error al abrir la base de datos");
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("Usuario")) {
        const store = db.createObjectStore("Usuario", {
          keyPath: "id_usuario",
          autoIncrement: true,
        });
        store.createIndex("usuario", "usuario", { unique: true });
        store.createIndex("email", "email", { unique: true });
        store.createIndex("password", "password", { unique: false });
        store.createIndex("nombre", "nombre", { unique: false });
      }
    };
  });
}

// Verificar si usuario o correo ya existen
export function userExists(db, username, email) {
  return new Promise((resolve) => {
    const tx = db.transaction("Usuario", "readonly");
    const store = tx.objectStore("Usuario");
    const request = store.getAll();

    request.onsuccess = () => {
      const exists = request.result.some(
        (u) => u.usuario === username || u.email === email
      );
      resolve(exists);
    };
  });
}

// Agregar nuevo usuario
export function addUser(db, user) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("Usuario", "readwrite");
    const store = tx.objectStore("Usuario");
    const request = store.add(user);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject("Error al registrar usuario");
  });
}

// Iniciar sesión
export function loginUser(db, username, password) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("Usuario", "readonly");
    const store = tx.objectStore("Usuario");
    const request = store.getAll();

    request.onsuccess = () => {
      const user = request.result.find(
        (u) => u.usuario === username && u.password === password
      );
      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        resolve(user);
      } else {
        reject("Credenciales incorrectas");
      }
    };

    request.onerror = () => reject("Error al iniciar sesión");
  });
}

// Cerrar sesión
export function logoutUser() {
  localStorage.removeItem("currentUser");
}

// Obtener usuario actual
export function getCurrentUser() {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
}