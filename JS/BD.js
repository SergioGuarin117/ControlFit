let db;

// Función para inicializar la base de datos
export function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("controlFit", 5); // Incrementar versión para actualizar esquema

    request.onsuccess = (event) => {
      db = event.target.result;
      console.log("Base de datos abierta correctamente:", db.name);
      resolve(db);
    };

    request.onerror = (event) => {
      console.error("Error al abrir la base de datos:", event.target.error);
      reject(event.target.error);
    };

    request.onupgradeneeded = (event) => {
      console.log("Creando/actualizando estructura de la base de datos...");
      const db = event.target.result;
      crearTablas(db, event.oldVersion);
    };
  });
}

function crearTablas(db, oldVersion) {
  // USUARIO
  if (!db.objectStoreNames.contains("Usuario")) {
    console.log("Creando tabla Usuario...");
    const usuario = db.createObjectStore("Usuario", {
      keyPath: "id_usuario",
      autoIncrement: true,
    });

    usuario.createIndex("nombre", "nombre", { unique: false });
    usuario.createIndex("email", "email", { unique: true });
    usuario.createIndex("usuario", "usuario", { unique: true });
    usuario.createIndex("contraseña", "contraseña", { unique: false });
    usuario.createIndex("edad", "edad", { unique: false });
    usuario.createIndex("peso", "peso", { unique: false });
    usuario.createIndex("altura", "altura", { unique: false });
    usuario.createIndex("tipoSangre", "tipoSangre", { unique: false });
    usuario.createIndex("pecho", "pecho", { unique: false });
    usuario.createIndex("cintura", "cintura", { unique: false });
    usuario.createIndex("cadera", "cadera", { unique: false });
    usuario.createIndex("brazo", "brazo", { unique: false });
    usuario.createIndex("presionArterial", "presionArterial", { unique: false });
    usuario.createIndex("frecuenciaCardiaca", "frecuenciaCardiaca", { unique: false });
    usuario.createIndex("objetivoEntrenamiento", "objetivoEntrenamiento", { unique: false });
    usuario.createIndex("intensidadEntrenamiento", "intensidadEntrenamiento", { unique: false });
  } else if (oldVersion < 2) {
    // Si la tabla ya existe pero necesitamos agregar nuevos índices
    console.log("Actualizando tabla Usuario con nuevos campos...");
    // No podemos modificar índices en una tabla existente directamente
    // Los nuevos campos se agregarán automáticamente cuando se guarden datos
  }

  // MÁQUINAS
  if (!db.objectStoreNames.contains("Maquinas")) {
    console.log("Creando tabla Maquinas...");
    const maquinas = db.createObjectStore("Maquinas", {
      keyPath: "id_maquina",
      autoIncrement: true,
    });
    maquinas.createIndex("nombreMaquina", "nombreMaquina", { unique: false });
    maquinas.createIndex("musculacion", "musculacion", { unique: false });
    maquinas.createIndex("cardio", "cardio", { unique: false });
    maquinas.createIndex("bajarPeso", "bajarPeso", { unique: false });
  }

  // EJERCICIOS
  if (!db.objectStoreNames.contains("Ejercicios")) {
    console.log("Creando tabla Ejercicios...");
    const ejercicios = db.createObjectStore("Ejercicios", {
      keyPath: "id_ejercicio",
      autoIncrement: true,
    });

    ejercicios.createIndex("id_maquinas_fk", "id_maquinas", { unique: false });
    ejercicios.createIndex("nombreEjercicio", "nombreEjercicio", { unique: false });
    ejercicios.createIndex("repeticiones", "repeticiones", { unique: false });
    ejercicios.createIndex("descripcion", "descripcion", { unique: false });
  }

  // RUTINAS
  if (!db.objectStoreNames.contains("Rutinas")) {
    console.log("Creando tabla Rutinas...");
    const rutinas = db.createObjectStore("Rutinas", {
      keyPath: "id_rutina",
      autoIncrement: true,
    });

    rutinas.createIndex("id_ejercicios_fk", "id_ejercicios", { unique: false });
    rutinas.createIndex("id_usuario_fk", "id_usuario", { unique: false });
    rutinas.createIndex("fecha", "fecha", { unique: false });
  }

  console.log("Todas las tablas creadas/actualizadas exitosamente");
}

// USUARIO - Agregar
export function addUser(usuario) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["Usuario"], "readwrite");
    const store = transaction.objectStore("Usuario");
    const request = store.add(usuario);

    request.onsuccess = () => {
      console.log("Usuario agregado con ID:", request.result);
      resolve(request.result);
    };

    request.onerror = () => {
      console.error("Error al agregar usuario:", request.error);
      reject("Error al agregar usuario");
    };
  });
}

// USUARIO - Obtener por usuario y contraseña
export function getUser(usuario, contraseña) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["Usuario"], "readonly");
    const store = transaction.objectStore("Usuario");
    const index = store.index("usuario");
    const request = index.get(usuario);

    request.onsuccess = () => {
      const user = request.result;
      if (user && user.contraseña === contraseña) {
        resolve(user);
      } else {
        reject("Usuario o contraseña incorrectos");
      }
    };

    request.onerror = () => {
      reject("Error al obtener usuario");
    };
  });
}

// USUARIO - Obtener por ID
export function getUserById(idUsuario) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["Usuario"], "readonly");
    const store = transaction.objectStore("Usuario");
    const request = store.get(idUsuario);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject("Error al obtener usuario");
    };
  });
}

// USUARIO - Actualizar
export function updateUser(idUsuario, datosActualizados) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["Usuario"], "readwrite");
    const store = transaction.objectStore("Usuario");
    datosActualizados.id_usuario = idUsuario;
    const request = store.put(datosActualizados);

    request.onsuccess = () => {
      console.log("Usuario actualizado con ID:", request.result);
      resolve(request.result);
    };

    request.onerror = () => {
      console.error("Error al actualizar usuario:", request.error);
      reject("Error al actualizar usuario");
    };
  });
}

// SALUD - Agregar
export function addSalud(saludData) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["Salud"], "readwrite");
    const store = transaction.objectStore("Salud");
    const request = store.add(saludData);

    request.onsuccess = () => {
      console.log("Datos de salud guardados con ID:", request.result);
      resolve(request.result);
    };

    request.onerror = () => {
      console.error("Error al guardar salud:", request.error);
      reject("Error al guardar datos de salud");
    };
  });
}

// SALUD - Obtener por usuario
export function getSaludByUser(idUsuario) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["Salud"], "readonly");
    const store = transaction.objectStore("Salud");
    const index = store.index("id_usuario_fk");
    const request = index.getAll(idUsuario);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject("Error al obtener datos de salud");
    };
  });
}

// SALUD - Obtener último registro
export function getUltimoSalud(idUsuario) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["Salud"], "readonly");
    const store = transaction.objectStore("Salud");
    const index = store.index("id_usuario_fk");
    const request = index.getAll(idUsuario);

    request.onsuccess = () => {
      const registros = request.result;
      if (registros.length > 0) {
        resolve(registros[registros.length - 1]);
      } else {
        reject("No hay registros de salud");
      }
    };

    request.onerror = () => {
      reject("Error al obtener datos de salud");
    };
  });
}

// SALUD - Actualizar
export function updateSalud(id, saludData) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["Salud"], "readwrite");
    const store = transaction.objectStore("Salud");
    saludData.id_salud = id;
    const request = store.put(saludData);

    request.onsuccess = () => {
      console.log("Datos de salud actualizados con ID:", request.result);
      resolve(request.result);
    };

    request.onerror = () => {
      console.error("Error al actualizar salud:", request.error);
      reject("Error al actualizar datos de salud");
    };
  });
}

// SALUD - Eliminar
export function deleteSalud(id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["Salud"], "readwrite");
    const store = transaction.objectStore("Salud");
    const request = store.delete(id);

    request.onsuccess = () => {
      console.log("Registro de salud eliminado");
      resolve("Registro eliminado");
    };

    request.onerror = () => {
      reject("Error al eliminar registro");
    };
  });
}

// MAQUINAS - Agregar
export function addMaquina(maquina) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["Maquinas"], "readwrite");
    const store = transaction.objectStore("Maquinas");
    const request = store.add(maquina);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject("Error al agregar máquina");
    };
  });
}

// EJERCICIOS - Agregar
export function addEjercicio(ejercicio) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["Ejercicios"], "readwrite");
    const store = transaction.objectStore("Ejercicios");
    const request = store.add(ejercicio);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject("Error al agregar ejercicio");
    };
  });
}

// RUTINAS - Agregar
export function addRutina(rutina) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["Rutinas"], "readwrite");
    const store = transaction.objectStore("Rutinas");
    const request = store.add(rutina);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject("Error al agregar rutina");
    };
  });
}

// Exportar la instancia de db para uso directo
export function getDB() {
  return db;
}