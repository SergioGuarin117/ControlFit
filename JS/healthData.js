import { initDB, updateUser, getUserById } from "/JS/BD.js";

let dbInstance = null;

// Definir objetivos de entrenamiento con descripciones
const objetivosEntrenamiento = [
  { valor: "bajar-peso", nombre: "Bajar de peso", descripcion: "Entrenamiento centrado en quema de grasa y cardio." },
  { valor: "aumentar-masa", nombre: "Aumentar masa muscular", descripcion: "Rutinas de fuerza e hipertrofia progresiva." },
  { valor: "mejorar-resistencia", nombre: "Mejorar resistencia", descripcion: "Ejercicios de alto volumen para resistencia cardiovascular." },
  { valor: "definicion", nombre: "Definición muscular", descripcion: "Tonificación con enfoque en repeticiones altas." },
  { valor: "mantener", nombre: "Mantener condición física", descripcion: "Entrenamientos balanceados entre fuerza y cardio." },
  { valor: "flexibilidad", nombre: "Aumentar flexibilidad", descripcion: "Ejercicios suaves de estiramiento y movilidad." }
];

document.addEventListener("DOMContentLoaded", async () => {
  console.log("========== INICIANDO HEALTHDATA ==========");

  const form = document.getElementById("healthForm");
  const successMessage = document.getElementById("successMessage");
  const errorMessage = document.getElementById("errorMessage");
  const objetivoSelect = document.getElementById("objetivoEntrenamiento");
  const descripcionObjetivo = document.getElementById("descripcionObjetivo");

  console.log("Elementos encontrados:", { 
    form: !!form, 
    successMessage: !!successMessage, 
    errorMessage: !!errorMessage,
    objetivoSelect: !!objetivoSelect,
    descripcionObjetivo: !!descripcionObjetivo
  });

  if (!form) {
    console.error("No se encontró formulario");
    return;
  }

  if (!successMessage || !errorMessage) {
    console.error("No se encontraron divs de mensajes. Verifica que existan en el HTML");
    return;
  }

  // Mostrar descripción del objetivo cuando se seleccione
  if (objetivoSelect && descripcionObjetivo) {
    objetivoSelect.addEventListener("change", (e) => {
      const valorSeleccionado = e.target.value;
      const objetivo = objetivosEntrenamiento.find(obj => obj.valor === valorSeleccionado);
      
      if (objetivo) {
        descripcionObjetivo.textContent = objetivo.descripcion;
        descripcionObjetivo.style.display = "block";
        console.log("Objetivo seleccionado:", objetivo.nombre);
      } else {
        descripcionObjetivo.style.display = "none";
      }
    });
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
    const objetivoEntrenamiento = document.getElementById("objetivoEntrenamiento")?.value || "";
    const intensidadEntrenamiento = document.getElementById("intensidadEntrenamiento")?.value || "";

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
        objetivoEntrenamiento: objetivoEntrenamiento || usuario.objetivoEntrenamiento,
        intensidadEntrenamiento: intensidadEntrenamiento || usuario.intensidadEntrenamiento,
        condiciones: condiciones || usuario.condiciones,
        fechaActualizacion: new Date().toISOString()
      };

      console.log("Actualizando...", actualizado);
      await updateUser(parseInt(idUsuario), actualizado);
      
      showSuccess("Datos guardados! Redirigiendo al inicio...");
      
      // Actualizar la sesión del usuario en localStorage
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser) {
        currentUser.altura = actualizado.altura;
        currentUser.peso = actualizado.peso;
        currentUser.edad = actualizado.edad;
        currentUser.objetivoEntrenamiento = actualizado.objetivoEntrenamiento;
        currentUser.intensidadEntrenamiento = actualizado.intensidadEntrenamiento;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
      }

      // Redirigir al dashboard después de 1.5 segundos
      setTimeout(() => {
        console.log("Redirigiendo a dashboard...");
        window.location.href = "dashboard.html";
      }, 1500);

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

  console.log("HEALTHDATA LISTO");
});