// carritoFunciones.js
export async function agregarProductoAlCarrito(productoId) {
  const producto = await obtenerInformacionProducto(productoId);
  await agregarAlCarrito(producto);
  await actualizarContenidoCarrito();
}

export async function obtenerInformacionProducto(productoId) {
  const response = await fetch(
    `https://fakestoreapi.com/products/${productoId}`
  );
  const producto = await response.json();
  return producto;
}

export async function agregarAlCarrito(producto) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const productoExistente = carrito.find((item) => item.id === producto.id);

  if (productoExistente) {
    productoExistente.cantidad += 1;
    productoExistente.precioTotal =
      productoExistente.cantidad * producto.precio;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.title,
      precio: producto.price,
      cantidad: 1,
      precioTotal: producto.price,
      imagen: producto.image,
    });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  crearAlerta();
}

export async function actualizarContenidoCarrito() {
  const carritoContainer = document.querySelector(".offcanvas-body");
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let carritoHTML = "";
  let precioTotal = 0;

  carrito.forEach((producto, index) => {
    const precioProducto = producto.precio * producto.cantidad;
    precioTotal += precioProducto;

    carritoHTML += generarHTMLProductoEnCarrito(
      producto,
      index,
      precioProducto
    );
  });

  mostrarContenidoCarrito(carritoContainer, carritoHTML, precioTotal);
}

export function abrirOffcanvas() {
  // Mostrar el Offcanvas
  let offcanvasElement = new bootstrap.Offcanvas(
    document.getElementById("offcanvasCarrito")
  );
  offcanvasElement.show();
}

function generarHTMLProductoEnCarrito(producto, index, precioProducto) {
  return `
      <div class="card mb-3">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${
              producto.imagen
            }" class="img-fluid rounded-start" alt="Imagen del producto">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${producto.nombre}</h5>
              <p class="card-text">Cantidad: 
                <button class="btn btn-sm btn-secondary mr-2" data-product-index="${index}" data-action="decrease">-</button>
                <span class="cantidad">${producto.cantidad}</span>
                <button class="btn btn-sm btn-secondary ml-2" data-product-index="${index}" data-action="increase">+</button>
              </p>
              <p class="card-text">Precio unitario: $${producto.precio.toFixed(
                2
              )}</p>
              <p class="card-text">Precio total: $${precioProducto.toFixed(
                2
              )}</p>
              <button type="button" class="btn btn-danger btn-sm eliminar-producto" data-producto-index="${index}">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    `;
}

function mostrarContenidoCarrito(carritoContainer, carritoHTML, precioTotal) {
  carritoContainer.innerHTML = carritoHTML;

  const precioTotalElement = document.createElement("p");
  precioTotalElement.textContent = `Precio total: $${precioTotal.toFixed(2)}`;
  carritoContainer.appendChild(precioTotalElement);

  agregarEventosEliminarProducto();
  agregarEventosModificarCantidad();
}

function agregarEventosEliminarProducto() {
  document.querySelectorAll(".eliminar-producto").forEach((boton) => {
    boton.addEventListener("click", async function () {
      const index = parseInt(this.getAttribute("data-producto-index"));
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      carrito.splice(index, 1);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      await actualizarContenidoCarrito();
    });
  });
}

function agregarEventosModificarCantidad() {
  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", async function () {
      const index = parseInt(this.getAttribute("data-product-index"));
      const action = this.getAttribute("data-action");

      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const producto = carrito[index];

      if (action === "increase") {
        producto.cantidad++;
      } else if (action === "decrease") {
        if (producto.cantidad > 1) {
          producto.cantidad--;
        } else {
          carrito.splice(index, 1);
        }
      }

      localStorage.setItem("carrito", JSON.stringify(carrito));
      await actualizarContenidoCarrito();
    });
  });
}
function crearAlerta() {
  // Crear el contenedor del toast
  var toastContainer = document.createElement("div");
  toastContainer.classList.add(
    "toast-container",
    "position-fixed",
    "top-50",
    "start-50",
    "translate-middle"
  );
  toastContainer.style.zIndex = "1000"; // Ajustar la superposición para que aparezca por encima del rest
  // Crear el toast
  var toast = document.createElement("div");
  toast.classList.add("toast", "fade", "show", "text-bg-success", "toast-lg"); // Agrega la clase "toast-
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");
  // Crear el cuerpo del toast
  var toastBody = document.createElement("div");
  toastBody.classList.add("toast-body");
  toastBody.classList.add("text-center"); // Centra el texto horizontalmente
  toastBody.style.fontSize = "2rem"; // Ajustar el tamaño de la fuente para que sea aún más grande
  toastBody.style.padding = "30px"; // Aumentar el espacio alrededor del texto aún más
  toastBody.textContent = "Producto agregado al carrito";
  // Agregar el icono de tilde
  var tickIcon = document.createElement("span");
  tickIcon.classList.add("fa", "fa-check-circle", "me-2"); // Agrega las clases del icono de tilde
  toastBody.prepend(tickIcon); // Agrega el icono antes del texto del toast
  // Añadir el cuerpo del toast al toast
  toast.appendChild(toastBody);
  // Añadir el toast al contenedor
  toastContainer.appendChild(toast);
  // Agregar el contenedor al documento
  document.body.appendChild(toastContainer);
  setTimeout(function () {
    toastContainer.remove();
  }, 2000);
}
