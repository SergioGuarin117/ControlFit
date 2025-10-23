// js/Login.js

import { initDB } from "./BD.js";
import { loginUser } from "./auth.js";

console.log("Script Login.js cargado");

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM cargado en login");
  
  const form = document.getElementById("loginForm");
  const message = document.getElementById("message");

  if (!form) {
    console.error("Formulario no encontrado");
    return;
  }

  
  let db;
  try {
    console.log("Inicializando BD...");
    db = await initDB();
    console.log("BD lista:", db.name);
  } catch (error) {
    console.error(" Error al inicializar BD:", error);
    message.textContent = "Error al conectar con la base de datos";
    message.style.color = "red";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Submit del formulario");

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    console.log("Datos capturados:", { username, password: "***" });

    if (!username || !password) {
      message.textContent = "Por favor completa todos los campos";
      message.style.color = "red";
      return;
    }

    try {
      console.log("Intentando login...");
      const user = await loginUser(db, username, password);
      console.log("Login exitoso:", user);
      
      message.textContent = `Bienvenido, ${user.nombre}`;
      message.style.color = "green";

      setTimeout(() => {
        window.location.href = "healthData.html"; // o dashboard.html
      }, 1200);

    } catch (err) {
      console.error("Error en login:", err);
      message.textContent = `${err.message}`;
      message.style.color = "red";
    }
  });
});