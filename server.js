// ==============================
// IMPORTACIONES
// ==============================

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const multer = require("multer");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// servir frontend
app.use(express.static("./"));

// servir uploads
app.use("/uploads", express.static("uploads"));

// servir QR generados
app.use("/qrs", express.static("qrs"));


// ==============================
// SUBIDA DE IMÁGENES
// ==============================

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


// ==============================
// BASE DE DATOS
// ==============================

const db = new sqlite3.Database("./jardin_botanico.db");

db.run(`
CREATE TABLE IF NOT EXISTS plantas (
id INTEGER PRIMARY KEY AUTOINCREMENT,
nombre TEXT,
cientifico TEXT,
descripcion TEXT,
imagen TEXT,
familia TEXT,
taxonomia TEXT,
lat REAL,
lon REAL
)
`);


// ==============================
// OBTENER TODAS LAS PLANTAS
// ==============================

app.get("/api/plantas",(req,res)=>{

db.all("SELECT * FROM plantas",[],(err,rows)=>{

if(err) return res.status(500).json(err);

res.json(rows);

});

});


// ==============================
// OBTENER PLANTA POR ID
// ==============================

app.get("/api/plantas/:id",(req,res)=>{

db.get(
"SELECT * FROM plantas WHERE id=?",
[req.params.id],
(err,row)=>{

if(err) return res.status(500).json(err);

res.json(row);

});

});


// ==============================
// CREAR PLANTA MANUAL
// ==============================

app.post("/api/plantas",upload.single("imagen"),(req,res)=>{

let nombre = req.body.nombre;
let cientifico = req.body.cientifico;
let descripcion = req.body.descripcion;

let imagen = "";

if(req.file){
imagen = "/uploads/" + req.file.filename;
}

db.run(
`INSERT INTO plantas (nombre,cientifico,descripcion,imagen)
VALUES (?,?,?,?)`,
[nombre,cientifico,descripcion,imagen],
function(err){

if(err){
console.log(err);
return res.json({error:true});
}

res.json({ok:true});

});

});


// ==============================
// ELIMINAR PLANTA
// ==============================

app.delete("/api/plantas/:id",(req,res)=>{

db.run(
"DELETE FROM plantas WHERE id=?",
[req.params.id],
()=>res.json({ok:true})
);

});


// ==============================
// IMPORTAR PLANTA DESDE GBIF
// ==============================

app.post("/api/importar-planta/:nombre",async(req,res)=>{

try{

let nombre = req.params.nombre;


// ==============================
// BUSCAR EN GBIF
// ==============================

let especieRes = await fetch(
`https://api.gbif.org/v1/species/match?name=${nombre}`
);

let especie = await especieRes.json();

if(!especie.scientificName){
return res.json({error:"Planta no encontrada"});
}


// ==============================
// OCURRENCIAS
// ==============================

let occRes = await fetch(
`https://api.gbif.org/v1/occurrence/search?scientificName=${especie.scientificName}&limit=1`
);

let occ = await occRes.json();

let lat = null;
let lon = null;

if(occ.results.length > 0){

lat = occ.results[0].decimalLatitude;
lon = occ.results[0].decimalLongitude;

}


// ==============================
// WIKIPEDIA
// ==============================

let imagen = "/assets/images/default.jpg";
let descripcion = "Información botánica";

try{

let wikiRes = await fetch(
`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(especie.canonicalName)}`
);

let wiki = await wikiRes.json();

if(wiki.thumbnail){
imagen = wiki.thumbnail.source;
}

if(wiki.extract){
descripcion = wiki.extract;
}

}catch(e){

console.log("No se encontró Wikipedia");

}


// ==============================
// TAXONOMIA
// ==============================

let taxonomia =
`${especie.kingdom} > ${especie.phylum} > ${especie.class} > ${especie.order}`;


// ==============================
// GUARDAR EN SQLITE
// ==============================

db.run(
`INSERT INTO plantas
(nombre,cientifico,descripcion,imagen,familia,taxonomia,lat,lon)
VALUES (?,?,?,?,?,?,?,?)`,
[
especie.canonicalName,
especie.scientificName,
descripcion,
imagen,
especie.family,
taxonomia,
lat,
lon
],
async function(err){

if(err){
console.log(err);
return res.json({error:true});
}


// ==============================
// GENERAR QR AUTOMATICO
// ==============================

let id = this.lastID;

let url = `http://localhost:3000/planta.html?id=${id}`;

let nombreArchivo =
`qr-${especie.canonicalName.replace(/\s/g,"-")}.png`;

let ruta = path.join(__dirname,"qrs",nombreArchivo);

let qr = await QRCode.toBuffer(url);

fs.writeFileSync(ruta,qr);

console.log("QR guardado:",nombreArchivo);


res.json({ok:true});

});

}catch(error){

console.log(error);

res.json({error:true});

}

});


// ==============================
// IMPORTAR MUCHAS PLANTAS
// ==============================

app.get("/api/importar-muchas",async(req,res)=>{

try{

let url =
"https://api.gbif.org/v1/species/search?q=bromeliaceae&limit=15";

let response = await fetch(url);
let data = await response.json();

for(let planta of data.results){

let nombre = planta.canonicalName || "Sin nombre";
let cientifico = planta.scientificName || "";

let familia = planta.family || "";

let taxonomia =
`${planta.kingdom} > ${planta.phylum} > ${planta.class} > ${planta.order}`;

let descripcion = "Importado automáticamente desde GBIF";

let imagen = "/assets/images/default.jpg";

db.run(
`INSERT INTO plantas
(nombre,cientifico,descripcion,imagen,familia,taxonomia)
VALUES (?,?,?,?,?,?)`,
[nombre,cientifico,descripcion,imagen,familia,taxonomia]
);

}

res.send("Plantas importadas correctamente");

}catch(error){

console.log(error);

res.send("Error importando plantas");

}

});


// ==============================
// VER QR DE UNA PLANTA
// ==============================

app.get("/api/qr/:id",async(req,res)=>{

let id = req.params.id;

let url = `http://localhost:3000/planta.html?id=${id}`;

let qr = await QRCode.toDataURL(url);

res.send(`
<h2>QR Planta ${id}</h2>
<img src="${qr}">
`);

});


// ==============================
// INICIAR SERVIDOR
// ==============================

app.listen(3000,()=>{

console.log("Servidor corriendo en http://localhost:3000");

});