let db;

const request = indexedBD.open("controlFit", 1);

request.onsuccess = (event) => {
    db = event.target.result;
    console.log("Base de datos abierta correctamente", db.name);
};

request.onerror = (event) => {
    console.error("Error al abrir la base de datos", event.target.error);
};

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    crearTabla(db);}
function crearTabla(db) {

    if(!db.objectStoreNames.contains("Usuario")){
        const usuario = db.createObjectStore("Usuario", {keypath: "id_usuario",autoIncrement: true})

        usuario.createIndex("nombre", "nombre", {unique:false}),
        usuario.createIndex("email", "email", {unique:true}),
        usuario.createIndex("usuario", "usuario", {unique:true}),
        usuario.createIndex("password", "password", {unique:true}),

        usuario.createIndex("edad","edad", {unique:false});
        usuario.createIndex("peso", "peso",{unique:false});
        usuario.createIndex("altura", "altura", {unique:false});
    }

    if (!db.objectStoreNames.contains("Maquinas")){
        const maquinas = db.createObjectStore("Maquinas", {keypath: "id_maquina",autoIncrement: true})
        maquinas.createIndex("nombreMaquina", "nombreMaquina", {unique:false}),
        maquinas.createIndex("musculacion", "musculacion", {unique:false}, Boolean),
        maquinas.createIndex("cardio", "cardio", {unique:false}, Boolean),
        maquinas.createIndex("bajarPeso", "bajarPeso", {unique:false});
    }

    if (!db.objectStoreNames.contains("Ejercicios")){
        const ejercicios = db.createObjectStore("Ejercicios", {keypath: "id_ejercicio",autoIncrement: true})
        ejercicios.createIndex("id_maquinas_fk", "id_maquinas", {unique:false}),
        ejercicios.createIndex("nombreEjercicio", "nombreEjercicio", {unique:false}),
        ejercicios.createIndex("repeticiones", "repeticiones", {unique:false}),
        ejercicios.createIndex("descripcion","descripcion", {unique:false});
    }

    if (!db.objectStoreNames.contains("Rutinas")){
        const rutinas = db.createObjectStore("Rutinas", {keypath: "id_rutina",autoIncrement: true})
        rutinas.createIndex("id_ejercicios_fk", "id_ejercicios", {unique:false}),
        rutinas.createIndex("id_usuario_fk", "id_usuario", {unique:false}),
        rutinas.createIndex("fecha", "fecha", {unique:false}, Date);
    }
}
