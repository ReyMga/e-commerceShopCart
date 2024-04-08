export async function agregarAlCarrito(productoId) {
  const producto = document
    .querySelector(`[data-product-id="${productoId}"]`)
    .closest(".card");
  const nombreProducto = producto.querySelector(".card-title").textContent;
  const precioProducto = parseFloat(
    producto.querySelector(".text-success").textContent.slice(2)
  );
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.push({
    nombre: nombreProducto,
    precio: precioProducto,
    imagen: producto.querySelector(".card-img-top").src,
  });
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

export async function actualizarContenidoCarrito() {
  const carritoContainer = document.querySelector(".offcanvas-body");
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const carritoHTML = carrito
    .map(
      (producto, index) => `
            <div class="card mb-3" data-index="${index}">
              <div class="row g-0">
                <div class="col-md-4">
                  <img src="${
                    producto.imagen
                  }" class="img-fluid rounded-start" alt="Imagen del producto">
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">$${producto.precio.toFixed(2)}</p>
                    <button type="button" class="btn btn-danger btn-sm eliminar-producto" data-producto-index="${index}">Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          `
    )
    .join("");
  carritoContainer.innerHTML = carritoHTML;

  // Agregar evento de clic a los botones de eliminar producto
  document.querySelectorAll(".eliminar-producto").forEach((boton) => {
    boton.addEventListener("click", async function () {
      const index = parseInt(this.getAttribute("data-producto-index"));
      eliminarDelCarrito(index);
    });
  });
}
// carritoFunciones.js
export async function abrirCarrito() {
  const offcanvasCarrito = document.getElementById("offcanvasCarrito");
  const offcanvas = new bootstrap.Offcanvas(offcanvasCarrito);
  offcanvas.show();
}
