# tulum_paginaweb
# 🌿 Jardín Botánico Tulum

Aplicación web fullstack para la gestión y visualización de un jardín botánico en Tulum.
Permite consultar información de plantas, así como administrar registros mediante un panel privado.

---

## 📌 Características principales

* 🌐 Sitio web público con información del jardín
* 🔐 Sistema de login para administrador
* 🌱 Gestión de plantas (manual y desde API)
* 🖼️ Visualización de imágenes y descripciones
* 🗄️ Almacenamiento en base de datos

---

## 🛠️ Tecnologías utilizadas

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Node.js + Express
* **Base de datos:** SQLite / archivo `.db`
* **Almacenamiento local:** localStorage (autenticación básica)

---

## 📦 Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

* Node.js (versión 18 o superior)
* npm (incluido con Node)

Puedes verificar con:

```bash
node -v
npm -v
```

---

## 🚀 Instalación y ejecución

Sigue estos pasos para ejecutar el proyecto en tu computadora:

### 1. Clonar o descargar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd tulum_paginaweb
```

O descargar ZIP desde GitHub y descomprimir.

---

### 2. Instalar dependencias

```bash
npm install
```

---

### 3. Ejecutar el servidor

```bash
node server.js
```

---

### 4. Abrir en el navegador

Ir a:

```
http://localhost:3000
```

---

## 🔐 Acceso al panel administrador

Ruta:

```
http://localhost:3000/login.html
```

Desde ahí se puede:

* Iniciar sesión
* Acceder al panel admin
* Importar plantas desde API
* Agregar plantas manualmente
* Visualizar registros

---

## 📁 Estructura del proyecto

```
tulum_paginaweb/
│
├── index.html
├── login.html
├── admin.html
├── recuperar.html
│
├── css/
├── js/
├── assets/
│
├── server.js
├── package.json
├── package-lock.json
│
├── jardin_botanico.db
│
├── README.md
├── .gitignore
└── LICENSE
```

---

## ⚠️ Notas importantes

* Este proyecto utiliza **localStorage para autenticación**, por lo que:
  ✔ Está diseñado con fines educativos

* El backend debe ejecutarse para que todas las funciones trabajen correctamente

* GitHub **no ejecuta el servidor automáticamente**

---

## 🧪 Pruebas del sistema

Para verificar que todo funciona correctamente:

1. Ejecutar el servidor
2. Abrir `http://localhost:3000`
3. Acceder al login (usuario: admin , contraseña: 1234)
4. Probar:

   * Agregar plantas
   * Importar desde API
   * Visualizar datos

---

## 🌐 Despliegue (opcional)

Para hacer el proyecto accesible en internet:

* Render
* Railway

Esto permite generar un enlace público sin necesidad de instalación local.

---


## 📄 Licencia

Este proyecto está bajo la licencia MIT.
