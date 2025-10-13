// js/login.js
import { openDB, loginUser } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const message = document.getElementById("message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const db = await openDB();
      const user = await loginUser(db, username, password);
      message.textContent = `✅ Bienvenido, ${user.nombre}`;
      message.style.color = "green";

      setTimeout(() => {
        window.location.href = "profile.html"; // o dashboard.html
      }, 1200);
    } catch (err) {
      message.textContent = `❌ ${err}`;
      message.style.color = "red";
    }
  });
});