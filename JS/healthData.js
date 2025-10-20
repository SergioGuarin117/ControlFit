import { initDB, updateUser, getUserById } from "/JS/BD.js";

let dbInstance = null;

document.addEventListener("DOMContentLoaded", async () => {
  console.log("========== INICIANDO HEALTHDATA ==========");

  const form = document.getElementById("healthForm");
  const successMessage = document.getElementById("successMessage");
  const errorMessage = document.getElementById("errorMessage");

  console.log("Elementos encontrados:", { form: !!form, successMessage: !!successMessage, errorMessage: !!errorMessage });

  if (!form) {
    console.error("No se encontró formulario");
    return;
  }

  if (!successMessage || !errorMessage) {
    console.error("No se encontraron divs de mensajes. Verifica que existan en el HTML");
    return;
  }

  try {
    console.log("Inicializando BD...");
    dbInstance = await initDB();
    console.log("BD inicializada:", dbInstance.name);
  } catch (error) {
    console.error("Error BD:", error);
    showError("Error al conectar BD");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Formulario enviado");

    const idUsuario = localStorage.getItem("id_usuario");
    console.log("ID usuario:", idUsuario);

    if (!idUsuario) {
      showError("No estás logueado");
      return;
    }

    const altura = document.getElementById("altura")?.value || "";
    const peso = document.getElementById("peso")?.value || "";
    const edad = document.getElementById("edad")?.value || "";
    const pecho = document.getElementById("pecho")?.value || "";
    const cintura = document.getElementById("cintura")?.value || "";
    const cadera = document.getElementById("cadera")?.value || "";
    const brazo = document.getElementById("brazo")?.value || "";
    const tipoSangre = document.getElementById("tipoSangre")?.value || "";
    const presionArterial = document.getElementById("presionArterial")?.value || "";
    const frecuenciaCardiaca = document.getElementById("frecuenciaCardiaca")?.value || "";

    const condiciones = Array.from(document.querySelectorAll('input[name="conditions"]:checked'))
      .map(cb => cb.value)
      .join(", ");

    if (!altura || !peso) {
      showError("Completa altura y peso");
      return;
    }

    if (isNaN(altura) || isNaN(peso) || altura <= 0 || peso <= 0) {
      showError("Altura y peso inválidos");
      return;
    }

    try {
      console.log("Obteniendo usuario...");
      const usuario = await getUserById(parseInt(idUsuario));
      
      if (!usuario) {
        showError("Usuario no existe");
        return;
      }

      const actualizado = {
        ...usuario,
        altura: parseFloat(altura),
        peso: parseFloat(peso),
        edad: edad ? parseInt(edad) : usuario.edad,
        pecho: pecho ? parseFloat(pecho) : usuario.pecho,
        cintura: cintura ? parseFloat(cintura) : usuario.cintura,
        cadera: cadera ? parseFloat(cadera) : usuario.cadera,
        brazo: brazo ? parseFloat(brazo) : usuario.brazo,
        tipoSangre: tipoSangre || usuario.tipoSangre,
        presionArterial: presionArterial || usuario.presionArterial,
        frecuenciaCardiaca: frecuenciaCardiaca ? parseInt(frecuenciaCardiaca) : usuario.frecuenciaCardiaca,
        condiciones: condiciones || usuario.condiciones,
        fechaActualizacion: new Date().toISOString()
      };

      console.log("Actualizando...", actualizado);
      await updateUser(parseInt(idUsuario), actualizado);
      
      showSuccess("Datos guardados!");
      form.reset();

    } catch (err) {
      console.error("Error:", err);
      showError(String(err));
    }
  });

  function showError(msg) {
    if (errorMessage) {
      errorMessage.textContent = msg;
      errorMessage.classList.add("show");
      if (successMessage) successMessage.classList.remove("show");
    }
    console.error("ERROR:", msg);
  }

  function showSuccess(msg) {
    if (successMessage) {
      successMessage.textContent = msg;
      successMessage.classList.add("show");
      if (errorMessage) errorMessage.classList.remove("show");
    }
    console.log("SUCCESS:", msg);
  }

  console.log("========== HEALTHDATA LISTO ==========");
});