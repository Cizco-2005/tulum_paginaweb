

// obtener id desde la URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// pedir datos al servidor
fetch(`/api/plantas/${id}`)
.then(res => res.json())
.then(planta => {

document.getElementById("nombre").innerText = planta.nombre;

document.getElementById("descripcion").innerText = planta.descripcion;

document.getElementById("imagen").src = planta.imagen;

document.getElementById("ubicacion").href =
`Ubicacion.html?planta=${planta.cientifico}`;

});