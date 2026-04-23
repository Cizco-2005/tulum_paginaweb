const params = new URLSearchParams(window.location.search);

let id = params.get("id");

let map;
let markers;
let heat;


/* botón volver */

document.getElementById("volver").href =
`planta.html?id=${id}`;


/* cargar planta */

async function cargarPlanta(){

let res = await fetch(`/api/plantas/${id}`);
let planta = await res.json();

/* imagen */

document.getElementById("imagen").innerHTML = `
<img src="${planta.imagen || "assets/images/default.jpg"}">
`;

/* taxonomía */

document.getElementById("taxonomia").innerHTML = `
<h3>Taxonomía</h3>
<p>${planta.taxonomia || "No disponible"}</p>
`;

/* mapa */

map = L.map("map").setView([20,0],2);

L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
{
maxZoom:18
}
).addTo(map);

/* cargar distribución */

cargarDistribucion(planta.cientifico || planta.nombre);

}


/* distribución GBIF */

async function cargarDistribucion(nombre){

try{

let url =
`https://api.gbif.org/v1/occurrence/search?scientificName=${encodeURIComponent(nombre)}&hasCoordinate=true&limit=200`;

let res = await fetch(url);

let data = await res.json();

if(!data.results){
return;
}

/* contador */

document.getElementById("contador").innerText =
`${data.count} registros científicos`;


/* clusters */

markers = L.markerClusterGroup();

let heatPoints = [];


data.results.forEach(r => {

if(r.decimalLatitude && r.decimalLongitude){

let lat = r.decimalLatitude;
let lon = r.decimalLongitude;

let marker = L.marker([lat,lon]);

marker.bindPopup(`
<b>${nombre}</b>
<br>
${r.country || "Ubicación desconocida"}
`);

markers.addLayer(marker);

heatPoints.push([lat,lon,0.5]);

}

});


map.addLayer(markers);


/* heatmap */

if(heatPoints.length > 0){

heat = L.heatLayer(heatPoints,{
radius:25,
blur:20
}).addTo(map);

}

}catch(e){

console.log("Error cargando distribución");

}

}


/* iniciar */

cargarPlanta();