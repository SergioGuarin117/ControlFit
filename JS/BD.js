// BD.js - Versión CORREGIDA Y SIMPLIFICADA

let db;

// Función para inicializar la base de datos
export function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("controlFit", 1);

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log("✅ Base de datos abierta correctamente:", db.name);
            resolve(db);
        };

        request.onerror = (event) => {
            console.error("❌ Error al abrir la base de datos:", event.target.error);
            reject(event.target.error);
        };

        request.onupgradeneeded = (event) => {
            console.log("🔄 Creando/actualizando estructura de la base de datos...");
            const db = event.target.result;
            crearTablas(db);
        };
    });
}

function crearTablas(db) {
    // USUARIO
    if (!db.objectStoreNames.contains("Usuario")) {
        console.log("📦 Creando tabla Usuario...");
        const usuario = db.createObjectStore("Usuario", {
            keyPath: "id_usuario",
            autoIncrement: true
        });

        usuario.createIndex("nombre", "nombre", { unique: false });
        usuario.createIndex("email", "email", { unique: true });
        usuario.createIndex("usuario", "usuario", { unique: true });
        usuario.createIndex("contraseña", "contraseña", { unique: false });
        usuario.createIndex("edad", "edad", { unique: false });
        usuario.createIndex("peso", "peso", { unique: false });
        usuario.createIndex("altura", "altura", { unique: false });
    }

    // MAQUINAS
    if (!db.objectStoreNames.contains("Maquinas")) {
        console.log("📦 Creando tabla Maquinas...");
        const maquinas = db.createObjectStore("Maquinas", {
            keyPath: "id_maquina",
            autoIncrement: true
        });

        maquinas.createIndex("nombreMaquina", "nombreMaquina", { unique: false });
        maquinas.createIndex("musculacion", "musculacion", { unique: false });
        maquinas.createIndex("cardio", "cardio", { unique: false });
        maquinas.createIndex("bajarPeso", "bajarPeso", { unique: false });
    }

    // EJERCICIOS
    if (!db.objectStoreNames.contains("Ejercicios")) {
        console.log("📦 Creando tabla Ejercicios...");
        const ejercicios = db.createObjectStore("Ejercicios", {
            keyPath: "id_ejercicio",
            autoIncrement: true
        });

        ejercicios.createIndex("id_maquinas_fK", "id_maquinas", { unique: false });
        ejercicios.createIndex("nombreEjercicio", "nombreEjercicio", { unique: false });
        ejercicios.createIndex("repeticiones", "repeticiones", { unique: false });
        ejercicios.createIndex("descripcion", "descripcion", { unique: false });
    }

    // RUTINAS
    if (!db.objectStoreNames.contains("Rutinas")) {
        console.log("📦 Creando tabla Rutinas...");
        const rutinas = db.createObjectStore("Rutinas", {
            keyPath: "id_rutina",
            autoIncrement: true
        });

        rutinas.createIndex("id_ejercicios_fK", "id_ejercicios", { unique: false });
        rutinas.createIndex("id_usuario_fK", "id_usuario", { unique: false });
        rutinas.createIndex("fecha", "fecha", { unique: false });
    }

    console.log("✅ Todas las tablas creadas exitosamente");
}

// Exportar la instancia de db para uso directo
export function getDB() {
    return db;
}