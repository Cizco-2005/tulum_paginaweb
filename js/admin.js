/* =========================
CARGAR PLANTAS GUARDADAS
========================= */

async function cargarPlantas(){

let res = await fetch("/api/plantas");
let plantas = await res.json();

let lista = document.getElementById("lista");

lista.innerHTML = "";

plantas.forEach(p => {

lista.innerHTML += `
<div class="planta-item">

<span>
<b>${p.nombre}</b>
<br>
<small>ID: ${p.id}</small>
</span>

<div class="acciones">

<a href="planta.html?id=${p.id}" target="_blank">
<button class="btn-ver">Ver</button>
</a>

<button onclick="eliminarPlanta(${p.id})" class="btn-eliminar">
Eliminar
</button>

</div>

</div>
`;

});

}


/* =========================
IMPORTAR PLANTA
========================= */

async function importarPlanta(){

let nombre = document.getElementById("cientifico").value;

if(!nombre){
alert("Escribe o selecciona una planta");
return;
}

let res = await fetch(`/api/importar-planta/${encodeURIComponent(nombre)}`,{
method:"POST"
});

let data = await res.json();

if(data.error){
alert("No se encontró la planta en GBIF");
return;
}

alert("Planta importada correctamente 🌿");

document.getElementById("cientifico").value="";
document.getElementById("preview").innerHTML="";

cargarPlantas();

}


/* =========================
IMPORTAR MUCHAS PLANTAS
========================= */

async function importarMuchas(){

let confirmar = confirm("¿Importar varias plantas desde GBIF?");

if(!confirmar) return;

await fetch("/api/importar-muchas");

alert("Plantas importadas 🌿");

cargarPlantas();

}


/* =========================
ELIMINAR PLANTA
========================= */

async function eliminarPlanta(id){

let confirmar = confirm("¿Eliminar esta planta?");

if(!confirmar) return;

await fetch(`/api/plantas/${id}`,{
method:"DELETE"
});

cargarPlantas();

}


/* =========================
BUSCAR PLANTAS EN GBIF
========================= */

async function buscarPlantas(){

let texto = document.getElementById("cientifico").value;

if(texto.length < 3){

document.getElementById("sugerencias").innerHTML = "";
return;

}

let res = await fetch(
`https://api.gbif.org/v1/species/search?q=${encodeURIComponent(texto)}`
);

let data = await res.json();

let sugerencias = document.getElementById("sugerencias");

sugerencias.innerHTML = "";

for(let p of data.results.slice(0,5)){

let nombre = p.scientificName || p.canonicalName;
let familia = p.family || "Familia desconocida";

let imagen = "assets/images/default.jpg";

/* buscar imagen en wikipedia */

try{

let wiki = await fetch(
`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(p.canonicalName)}`
);

let wikiData = await wiki.json();

if(wikiData.thumbnail){
imagen = wikiData.thumbnail.source;
}

}catch(e){

console.log("Imagen no encontrada");

}

/* crear sugerencia */

let div = document.createElement("div");

div.className = "sugerencia-item";

div.innerHTML = `

<img src="${imagen}">

<div>

<b>${nombre}</b>

<br>

<small>${familia}</small>

</div>

`;

div.onclick = () => seleccionar(nombre,imagen);

sugerencias.appendChild(div);

}

}


/* =========================
SELECCIONAR SUGERENCIA
========================= */

function seleccionar(nombre,imagen){

document.getElementById("cientifico").value = nombre;

document.getElementById("sugerencias").innerHTML = "";

/* vista previa */

document.getElementById("preview").innerHTML = `
<img src="${imagen}" class="preview-img">
`;

}


/* =========================
CERRAR SUGERENCIAS
========================= */

document.addEventListener("click",function(e){

if(!e.target.closest("#cientifico")){
document.getElementById("sugerencias").innerHTML="";
}

});


/* =========================
INICIAR
========================= */

cargarPlantas();