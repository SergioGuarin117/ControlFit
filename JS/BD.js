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

    //Creamos las tablas a continuacion

    const tablas = db.createObjectStore("Usuario", {
        keypath: "id_usuario",
        autoIncrement: true,
    })

    // Indices de texto
    tablas.createIndex("nombre", "nombre", {unique:false});
    tablas.createIndex("usuario", "usuario", {unique:false});
    tablas.createIndex("password", "password", {unique:false});

    tablas.createIndex("edad","edad", {unique:false});
    tablas.createIndex("peso", "peso",{unique:false});
    tablas.createIndex("altura", "altura", {unique:false});

    console.log("Tabla USUARIO creada correctamente");
}