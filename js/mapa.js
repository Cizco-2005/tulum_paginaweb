

/* ===============================
CREAR MAPA
=============================== */

var map = L.map('map').setView([20,-90],3);

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
attribution:'© OpenStreetMap'
}).addTo(map);


/* ===============================
CAPAS
=============================== */

var clusterLayer = L.markerClusterGroup();
var heatPoints = [];
var heat;


/* ===============================
OBTENER ID DESDE URL
=============================== */

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let cientifico = "";


/* ===============================
OBTENER PLANTA DESDE SQLITE
=============================== */

async function obtenerPlanta(){

let res = await fetch(`/api/plantas/${id}`);
let planta = await res.json();

cientifico = planta.cientifico;


/* ===============================
TAXONOMÍA
=============================== */

let tax = document.getElementById("taxonomia");

if(tax){
tax.innerHTML = `
<b>Nombre científico:</b> ${planta.cientifico}<br>
<b>Nombre:</b> ${planta.nombre}
`;
}


/* ===============================
IMAGEN AUTOMÁTICA WIKIPEDIA
=============================== */

let galeria = document.getElementById("galeria");

if(galeria){

let wiki = await fetch(
`https://en.wikipedia.org/api/rest_v1/page/summary/${planta.cientifico}`
);

let wikiData = await wiki.json();

if(wikiData.thumbnail){
galeria.innerHTML =
`<img src="${wikiData.thumbnail.source}" width="200">`;
}

}

}


/* ===============================
CARGAR DATOS GBIF
=============================== */

async function cargarDistribucion(){

let filtro = document.getElementById("filtroPais");

let pais = "";

if(filtro){
pais = filtro.value;
}

let url =
`https://api.gbif.org/v1/occurrence/search?scientificName=${cientifico}&limit=1000&country=${pais}`;

let response = await fetch(url);

let data = await response.json();

clusterLayer.clearLayers();

heatPoints = [];

let puntos = [];


/* ===============================
RECORRER REGISTROS
=============================== */

data.results.forEach(registro => {

if(registro.decimalLatitude && registro.decimalLongitude){

let lat = registro.decimalLatitude;
let lon = registro.decimalLongitude;

let marker = L.circleMarker(
[lat,lon],
{
radius:5,
color:"orange",
fillColor:"yellow",
fillOpacity:0.9
}
);

clusterLayer.addLayer(marker);

heatPoints.push([lat,lon,1]);

puntos.push(turf.point([lon,lat]));

}

});

map.addLayer(clusterLayer);


/* ===============================
HEATMAP
=============================== */

if(heat){
map.removeLayer(heat);
}

heat = L.heatLayer(
heatPoints,
{
radius:25,
blur:20,
maxZoom:6,
max:5
}).addTo(map);


/* ===============================
ESTADÍSTICAS
=============================== */

let stats = document.getElementById("stats");

if(stats){

stats.innerHTML = `
<b>Registros GBIF:</b> ${data.count}<br>
<b>Puntos mostrados:</b> ${data.results.length}
`;

}


/* ===============================
POLÍGONO ÁREA NATIVA
=============================== */

if(puntos.length > 10){

let fc = turf.featureCollection(puntos);

let hull = turf.convex(fc);

if(hull){

L.geoJSON(hull,{
color:"green",
fillOpacity:0.2
}).addTo(map);

}

}

}


/* ===============================
FILTRO
=============================== */

function recargarMapa(){

cargarDistribucion();

}

window.recargarMapa = recargarMapa;


/* ===============================
INICIAR
=============================== */

async function iniciar(){

if(!id) return;

await obtenerPlanta();

cargarDistribucion();

}

iniciar();


/* ===============================
LEYENDA
=============================== */

var legend = L.control({position:"bottomleft"});

legend.onAdd = function(){

var div = L.DomUtil.create("div","info legend");

div.innerHTML = `
<b>Leyenda</b><br>
<span style="color:green">■</span> Área nativa aproximada<br>
<span style="color:orange">●</span> Registros GBIF<br>
Heatmap densidad
`;

return div;

};

legend.addTo(map);