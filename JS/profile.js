import { initDB, getUserById } from "/JS/BD.js";

let dbInstance = null;

document.addEventListener("DOMContentLoaded", async () => {
  console.log("========== INICIANDO PROFILE ==========");

  // Verificar si hay usuario logueado
  const idUsuario = localStorage.getItem("id_usuario");
  
  if (!idUsuario) {
    console.error("No hay usuario logueado");
    alert("Debes iniciar sesión primero");
    window.location.href = "index.html";
    return;
  }

  try {
    // Inicializar BD
    console.log("Inicializando BD...");
    dbInstance = await initDB();
    console.log("BD inicializada:", dbInstance.name);

    // Obtener datos del usuario
    console.log("Obteniendo datos del usuario ID:", idUsuario);
    const usuario = await getUserById(parseInt(idUsuario));
    
    if (!usuario) {
      console.error("Usuario no encontrado");
      alert("Error: Usuario no encontrado");
      window.location.href = "index.html";
      return;
    }

    console.log("Datos del usuario obtenidos:", usuario);
    mostrarDatosUsuario(usuario);

  } catch (error) {
    console.error("Error al cargar perfil:", error);
    alert("Error al cargar los datos del perfil");
  }

  // Event listener para el botón de actualizar (por ahora solo console.log)
  const updateButton = document.getElementById("updateButton");
  if (updateButton) {
    updateButton.addEventListener("click", () => {
      console.log("Botón de actualizar clickeado");
      // Aquí irá la funcionalidad de actualización más adelante
    });
  }
});

function mostrarDatosUsuario(usuario) {
  console.log("Mostrando datos del usuario...");
  
  let datosIncompletos = false;

  // Header del perfil
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const profileAvatar = document.getElementById("profileAvatar");

  if (profileName && usuario.nombre) {
    profileName.textContent = usuario.nombre;
  }

  if (profileEmail && usuario.email) {
    profileEmail.textContent = usuario.email;
  }

  if (profileAvatar && usuario.nombre) {
    const inicial = usuario.nombre.charAt(0).toUpperCase();
    profileAvatar.textContent = inicial;
  }

  // Datos básicos
  mostrarDato("dataEdad", usuario.edad, "años", () => datosIncompletos = true);
  mostrarDato("dataPeso", usuario.peso, "kg", () => datosIncompletos = true);
  mostrarDato("dataAltura", usuario.altura, "cm", () => datosIncompletos = true);
  mostrarDato("dataTipoSangre", usuario.tipoSangre, "", () => datosIncompletos = true);

  // Medidas corporales
  mostrarDato("dataPecho", usuario.pecho, "cm", () => datosIncompletos = true);
  mostrarDato("dataCintura", usuario.cintura, "cm", () => datosIncompletos = true);
  mostrarDato("dataCadera", usuario.cadera, "cm", () => datosIncompletos = true);
  mostrarDato("dataBrazo", usuario.brazo, "cm", () => datosIncompletos = true);

  // Datos cardiovasculares
  mostrarDato("dataPresion", usuario.presionArterial, "mmHg", () => datosIncompletos = true);
  mostrarDato("dataFrecuencia", usuario.frecuenciaCardiaca, "bpm", () => datosIncompletos = true);

  // Mostrar alerta si hay datos incompletos
  if (datosIncompletos) {
    const alertMessage = document.getElementById("alertMessage");
    if (alertMessage) {
      alertMessage.classList.add("show");
    }
  }

  console.log("Datos mostrados. Datos incompletos:", datosIncompletos);
}

function mostrarDato(elementId, valor, unidad, onEmpty) {
  const elemento = document.getElementById(elementId);
  
  if (!elemento) {
    console.warn(`Elemento ${elementId} no encontrado`);
    return;
  }

  // Limpiar skeleton
  elemento.innerHTML = "";

  if (valor !== undefined && valor !== null && valor !== "") {
    // Tiene valor
    elemento.classList.remove("empty");
    
    if (unidad) {
      elemento.innerHTML = `${valor}<span class="data-unit">${unidad}</span>`;
    } else {
      elemento.textContent = valor;
    }
  } else {
    // No tiene valor
    elemento.classList.add("empty");
    elemento.textContent = "No registrado";
    
    if (onEmpty && typeof onEmpty === "function") {
      onEmpty();
    }
  }
}

console.log("PROFILE.JS CARGADO");