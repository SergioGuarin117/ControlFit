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
export function userExists(db, email, password) {
  return new Promise((resolve) => {
    const tx = db.transaction("Usuario", "readonly");
    const store = tx.objectStore("Usuario");
    const request = store.get(email,password);

    request.onsuccess = () => {
      const exists = request.result.some(
        (u) => u.email === email || u.password === password
      );
      resolve(exists);
    };
    request.onerror = () => reject("Error! Correo no fue encontrado.");
  });
}

// Agregar nuevo usuario
export function addUser(db, user) {
  if (!user.nombre || !user.email || !user.usuario || !user.password) {
    return reject(new Error("Faltan campos requeridos."));}
    
    const tx = db.transaction("Usuario", "readwrite");
    const store = tx.objectStore("Usuario");
    
    const nuevoUsuario = {
      nombre: user.nombre,
      email: user.email,
      usuario: user.usuario,
      password: user.password,
      edad: user.edad || null,
      peso: user.peso || null,
      altura: user.altura || null,
    };
    const request = store.add(nuevoUsuario);
    request.onsuccess = () => resolve(true);  
    request.onerror = () => reject("Error al registrar usuario");
    
  };
// Iniciar sesión
export function loginUser(db, username, password) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("Usuario", "readonly");
    const store = tx.objectStore("Usuario");
    const index = store.index("usuario");
    const request = index.get(username);

    request.onsuccess = () => {
      const user = request.result;
      if (user && user.password === password) {

        const userSession = {
          id_usuario: user.id_usuario,
          nombre: user.nombre,
          email: user.email,
          usuario: user.usuario,
          edad: user.edad,
          peso: user.peso,
          altura: user.altura,
          genero: user.genero
        };
        // Se guarda en localStorage para mantener sesion
        localStorage.setItem("currentUser", JSON.stringify(userSession));
        resolve(userSession);
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