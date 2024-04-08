import {
  abrirCarrito,
  agregarAlCarrito,
  actualizarContenidoCarrito,
} from "./carritoFunciones.js";

export function carritoListeners() {
  document.querySelectorAll(".agregar-carrito").forEach((boton) => {
    boton.addEventListener("click", async function (event) {
      event.preventDefault();
      const productoId = this.getAttribute("data-product-id");
      await agregarAlCarrito(productoId);
      await actualizarContenidoCarrito();
    });
  });

  document.querySelectorAll(".agregar-carrito-modal").forEach((boton) => {
    boton.addEventListener("click", async function (event) {
      event.preventDefault();
      const productoId = this.getAttribute("data-product-id");
      await agregarAlCarrito(productoId);
      await actualizarContenidoCarrito();
    });
  });

  // Agregar evento de clic a la imagen del carrito para abrir el carrito
  const carritoLink = document.getElementById("carritoLink");
  if (carritoLink) {
    carritoLink.addEventListener("click", (event) => {
      event.preventDefault(); // Para evitar que el enlace recargue la página
      abrirCarrito();
    });
  }
}
