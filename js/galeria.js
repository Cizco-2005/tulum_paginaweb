/* obtener id */

const params = new URLSearchParams(window.location.search);
let id = params.get("id");

/* botón volver */

document.getElementById("volver").href =
`planta.html?id=${id}`;


/* cargar planta */

async function cargarPlanta(){

let res = await fetch(`/api/plantas/${id}`);
let planta = await res.json();

document.getElementById("titulo").innerText =
`Galería de ${planta.nombre || planta.cientifico}`;

cargarGaleria(planta.cientifico || planta.nombre);

}


/* cargar imágenes desde GBIF */

async function cargarGaleria(nombre){

try{

let url =
`https://api.gbif.org/v1/occurrence/search?scientificName=${encodeURIComponent(nombre)}&mediaType=StillImage&limit=15`;

let res = await fetch(url);
let data = await res.json();

let galeria = document.getElementById("galeria");

galeria.innerHTML="";

if(!data.results || data.results.length===0){

document.getElementById("mensaje").innerText =
"No se encontraron imágenes";

return;

}

data.results.forEach(r => {

if(r.media && r.media.length>0){

let src = r.media[0].identifier;

let credit =
r.media[0].creator || r.recordedBy || "GBIF";

let card = document.createElement("div");

card.className = "foto-card";

card.innerHTML = `
<img src="${src}" class="foto">
<p class="credit">📷 ${credit}</p>
`;

card.onclick = ()=>abrirImagen(src);

galeria.appendChild(card);

}

});

}catch(e){

console.log("Error cargando imágenes");

}

}


/* visor */

function abrirImagen(src){

document.getElementById("visor").style.display="flex";

document.getElementById("imagenGrande").src = src;

}


/* cerrar visor */

document.getElementById("cerrar").onclick = ()=>{

document.getElementById("visor").style.display="none";

};


cargarPlanta();