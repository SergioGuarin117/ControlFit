

import { initDB } from "/JS/BD.js";
import { addUser, userExists } from "/JS/auth.js";


let dbInstance = null;

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("registerForm");
  const message = document.getElementById("message");

  try {
    console.log("Inicializando base de datos...");
    dbInstance = await initDB();
    console.log("Base de datos inicializada:", dbInstance.name);
    console.log("Tablas disponibles:", Array.from(dbInstance.objectStoreNames));
  } catch (error) {
    console.error("Error al inicializar BD:", error);
    message.textContent = "Error al conectar con la base de datos";
    message.style.color = "red";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    // Validaciones
    if (!fullname || !email || !username || !password) {
      message.textContent = "Todos los campos son obligatorios.";
      message.style.color = "red";
      return;
    }

    if (password !== confirmPassword) {
      message.textContent = "Las contraseñas no coinciden.";
      message.style.color = "red";
      return;
    }

    if (password.length < 6) {
      message.textContent = "La contraseña debe tener al menos 6 caracteres.";
      message.style.color = "red";
      return;
    }

    try {
      console.log("Verificando si usuario existe...");
      const existe = await userExists(dbInstance, username, email);
      console.log("Resultado verificación:", existe);
      
      if (existe) {
        message.textContent = "El usuario o correo ya está registrado.";
        message.style.color = "orange";
        return;
      }

      const user = {
        nombre: fullname,
        email: email,
        usuario: username,
        contraseña: password,
      };

      console.log("Intentando agregar usuario:", { ...user, contraseña: "***" });
      await addUser(dbInstance, user);
      console.log("Usuario agregado exitosamente");
      
      message.textContent = "Usuario registrado con éxito. Redirigiendo...";
      message.style.color = "green";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
      
    } catch (error) {
      message.textContent = `Error: ${error.message}`;
      message.style.color = "red";
      console.error("Error completo:", error);
    }
  });
});