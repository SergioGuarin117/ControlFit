// registro.js - ControlFit

import { openDB, addUser, userExists } from "/JS/auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const message = document.getElementById("message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (password !== confirmPassword) {
      message.textContent = "❌ Las contraseñas no coinciden.";
      message.style.color = "red";
      return;
    }

    const db = await openDB();

    if (await userExists(db, username, email)) {
      message.textContent = "⚠️ El usuario o correo ya está registrado.";
      message.style.color = "orange";
      return;
    }

    const user = {
      nombre: fullname,
      usuario: username,
      email: email,
      password: password,
      fecha_registro: new Date().toLocaleString(),
    };

    await addUser(db, user);
    message.textContent = "✅ Usuario registrado con éxito. Redirigiendo...";
    message.style.color = "green";

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  });
});