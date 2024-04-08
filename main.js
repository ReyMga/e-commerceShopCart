// Importar los módulos necesarios
import { inicializar } from "./src/inicializar.js";
import { carritoListeners } from "./src/carrito.js";
import { modalListeners } from "./src/modal.js";
import { actualizarContenidoCarrito } from "./src/carritoFunciones.js";
// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", async function () {
  await inicializar();
  carritoListeners();
  modalListeners();
  await actualizarContenidoCarrito();
});
