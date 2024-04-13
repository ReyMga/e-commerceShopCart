// inicializar.js
import { actualizarContenidoCarrito } from "./carritoFunciones.js";

document.addEventListener("DOMContentLoaded", async function () {
  // Mostrar el contenido del carrito al cargar la página
  await actualizarContenidoCarrito();

  // Obtener referencia al botón de carrito
  const carritoButton = document.getElementById("carritoLink");

  // Agregar eventos para abrir y cerrar modales
  // (Puede incluirse aquí o en su propio archivo modal.js)
});
