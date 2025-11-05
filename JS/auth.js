// js/auth.js
import { initDB } from "/JS/BD.js";
// Abrir base de datos
export function openDB() {
  return initDB();
}

// Verificar si usuario o correo ya existen
export function userExists(db, username, email) {
    return new Promise((resolve, reject) => {
        console.log("Verificando existencia de:", { username, email });
        
        try {
            const tx = db.transaction("Usuario", "readonly");
            const store = tx.objectStore("Usuario");
            
            // Buscar por usuario
            const usernameIndex = store.index("usuario");
            const usernameRequest = usernameIndex.get(username);
            
            usernameRequest.onsuccess = () => {
                if (usernameRequest.result) {
                    console.log("Usuario ya existe:", usernameRequest.result);
                    resolve(true);
                    return;
                }
                
                console.log("Usuario disponible");
                
                // Buscar por email
                const emailIndex = store.index("email");
                const emailRequest = emailIndex.get(email);
                
                emailRequest.onsuccess = () => {
                    const existe = emailRequest.result !== undefined;
                    if (existe) {
                        console.log("Email ya existe:", emailRequest.result);
                    } else {
                        console.log("Email disponible");
                    }
                    resolve(existe);
                };
                
                emailRequest.onerror = () => {
                    console.error("Error buscando email:", emailRequest.error);
                    reject(emailRequest.error);
                };
            };
            
            usernameRequest.onerror = () => {
                console.error("Error buscando usuario:", usernameRequest.error);
                reject(usernameRequest.error);
            };
        } catch (error) {
            console.error("Error en userExists:", error);
            reject(error);
        }
    });
}

// Agregar nuevo usuario
export function addUser(db, user) {
    return new Promise((resolve, reject) => {
        console.log("addUser llamada con:", user);
        
        // Validar campos
        if (!user.nombre || !user.email || !user.usuario || !user.contraseña) {
            const error = new Error("Faltan campos requeridos");
            console.error("❌ Validación fallida:", error);
            return reject(error);
        }

        console.log("Validación pasada");

        try {
            const tx = db.transaction("Usuario", "readwrite");
            console.log("Transacción creada");
            
            const store = tx.objectStore("Usuario");
            console.log("Object Store obtenido");
            
            const nuevoUsuario = {
                nombre: user.nombre,
                email: user.email,
                usuario: user.usuario,
                contraseña: user.contraseña,
                edad: user.edad || null,
                peso: user.peso || null,
                altura: user.altura || null,
            };
            console.log("Objeto usuario creado:", nuevoUsuario);

            const request = store.add(nuevoUsuario);
            console.log("Request add() creado");

            request.onsuccess = () => {
                console.log("Usuario agregado con ID:", request.result);
                resolve(true);
            };
            
            request.onerror = (e) => {
                console.error("Error en request.add():", e.target.error);
                reject(new Error("Error al agregar: " + e.target.error));
            };

            tx.oncomplete = () => {
                console.log("Transacción completada exitosamente");
            };

            tx.onerror = (e) => {
                console.error("Error en transacción:", e.target.error);
                reject(new Error("Error en transacción: " + e.target.error));
            };

        } catch (error) {
            console.error("Error en try/catch:", error);
            reject(error);
        }
    });
}
// Iniciar sesión
export function loginUser(db, username, password) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction("Usuario", "readonly");
        const store = tx.objectStore("Usuario");
        const index = store.index("usuario");
        const request = index.get(username);

        request.onsuccess = () => {
            const user = request.result;
            
            if (user && user.contraseña === password) {
                const userSession = {
                    id_usuario: user.id_usuario,
                    nombre: user.nombre,
                    email: user.email,
                    usuario: user.usuario,
                    edad: user.edad,
                    peso: user.peso,
                    altura: user.altura,
                };
                
                localStorage.setItem("currentUser", JSON.stringify(userSession));
                localStorage.setItem("id_usuario", userSession.id_usuario);
                resolve(userSession);
            } else {
                reject(new Error("Credenciales incorrectas"));
            }
        };

        request.onerror = () => reject(new Error("Error al iniciar sesión"));
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