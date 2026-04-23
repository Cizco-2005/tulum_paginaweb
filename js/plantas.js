

async function cargarPlantas(){

// leer base de datos JSON
let res = await fetch("data/plantas.json");
let plantas = await res.json();

let contenedor = document.getElementById("lista-plantas");

plantas.forEach(p => {

// crear tarjeta de planta
contenedor.innerHTML += `

<div class="planta-card">

<img src="${p.imagen}" width="200">

<h2>${p.nombre}</h2>

<a href="planta.html?id=${p.id}">
<button>Ver planta</button>
</a>

</div>

`;

});

}

// ejecutar función
cargarPlantas();

function obtenerPlantas(){

// leer JSON inicial
let plantas = [];

// leer almacenamiento local
let guardadas = localStorage.getItem("plantas");

if(guardadas){

plantas = JSON.parse(guardadas);

}

return plantas;

}

function mostrarPlantas(){

let plantas = obtenerPlantas();

let contenedor = document.getElementById("lista-plantas");

contenedor.innerHTML = "";

plantas.forEach(p => {

contenedor.innerHTML += `

<div class="planta-card">

<img src="${p.imagen}" width="200">

<h2>${p.nombre}</h2>

<a href="planta.html?id=${p.id}">
<button>Ver planta</button>
</a>

</div>

`;

});

}

mostrarPlantas();