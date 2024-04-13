import { agregarProductoAlCarrito, abrirOffcanvas } from "./carritoFunciones";

document.addEventListener("DOMContentLoaded", async function () {
  // Agregar evento de clic a los botones "Agregar al carrito"
  document.querySelectorAll(".agregar-carrito").forEach((boton) => {
    boton.addEventListener("click", async function (event) {
      event.preventDefault();
      const productoId = this.getAttribute("data-product-id");
      await agregarProductoAlCarrito(productoId);
    });
  });

  // Agregar evento de clic a los botones "Agregar al carrito" dentro del modal
  document.querySelectorAll(".agregar-carrito-modal").forEach((boton) => {
    boton.addEventListener("click", async function (event) {
      event.preventDefault();
      const productoId = this.getAttribute("data-product-id");
      await agregarProductoAlCarrito(productoId);
    });
  });

  // Agregar evento de clic al botón del carrito
  const carritoLink = document.querySelector("a#carritoLink");

  if (carritoLink) {
    carritoLink.addEventListener("click", function (event) {
      event.preventDefault();
      console.log("Se hizo clic en el enlace del carrito");
      abrirOffcanvas();
    });
  } else {
    console.error("No se encontró el enlace del carrito en el DOM.");
  }
});
