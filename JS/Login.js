// js/Login.js

import { initDB, getUserById } from "./BD.js";
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
    console.error("Error al inicializar BD:", error);
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

      // Verificar si el usuario tiene datos de salud registrados
      console.log("Verificando datos de salud del usuario...");
      
      // Obtener el usuario completo de la BD
      const usuarioCompleto = await getUserById(user.id_usuario);
      console.log("Usuario completo:", usuarioCompleto);
      
      // Verificar si tiene datos de salud básicos (altura y peso son obligatorios)
      const tieneDatosSalud = usuarioCompleto.altura && usuarioCompleto.peso;
      
      console.log("¿Tiene datos de salud?", tieneDatosSalud);

      setTimeout(() => {
        if (tieneDatosSalud) {
          // Si ya tiene datos de salud, ir directamente al dashboard
          console.log("Usuario tiene datos de salud, redirigiendo a dashboard");
          window.location.href = "dashboard.html";
        } else {
          // Si NO tiene datos de salud, ir a registrar datos de salud
          console.log("Usuario NO tiene datos de salud, redirigiendo a healthData");
          window.location.href = "healthData.html";
        }
      }, 1200);

    } catch (err) {
      console.error("Error en login:", err);
      message.textContent = `${err.message}`;
      message.style.color = "red";
    }
  });
});