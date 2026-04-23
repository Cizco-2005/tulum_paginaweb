function login(){

let usuario = document.getElementById("usuario").value;
let password = document.getElementById("password").value;

let passGuardada = localStorage.getItem("password") || "1234";

if(usuario === "admin" && password === passGuardada){

localStorage.setItem("admin","true");

window.location.href = "admin.html";

}else{

document.getElementById("error").innerText =
"Usuario o contraseña incorrectos";

}

}