//import Swal from "sweetalert2/dist/sweetalert2.js";

// Función para obtener la cantidad real de productos en el carrito
function obtenerCantidadProductosEnCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let cantidadTotal = 0;

  // Iterar sobre los productos en el carrito y sumar las cantidades
  carrito.forEach((producto) => {
    cantidadTotal += producto.cantidad;
  });

  return cantidadTotal;
}

function actualizarContadorProductos() {
  // Buscar el elemento del contador de productos por su ID
  const contadorProductos = document.getElementById("contador-productos");
  const cantidadProductos = obtenerCantidadProductosEnCarrito();
  contadorProductos.innerText = cantidadProductos;
}

// Función para actualizar el contenido del carrito
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
  actualizarEstadoBotonComprar();

  // Ocultar el precio total si el carrito está vacío
  const precioTotalElement = document.querySelector(".precio-total");
  if (carrito.length === 0) {
    precioTotalElement.style.display = "none";
  } else {
    precioTotalElement.style.display = "block";
  }

  // Actualizar el contador de productos después de actualizar el carrito
  actualizarContadorProductos();
}

//alert para comprar
function alertCorrecto() {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: "success",
    title: "La compra se ha realizado con éxito!!!",
  });
}

async function alertEliminar(index) {
  const result = await Swal.fire({
    title: "Desea eliminar este producto del carrito?",
    icon: "warning",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Si",
    denyButtonText: `No`,
  });

  if (result.isConfirmed) {
    Swal.fire("Producto eliminado!", "", "success");
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    await actualizarContenidoCarrito();
    actualizarEstadoBotonComprar(); 
  } else if (result.isDenied) {
    Swal.fire("No se eliminó el producto", "", "info");
  }
}

// Definir la variable products antes de llamar a fetchProducts
let products = document.querySelector(".productos");

// Función para generar el HTML de un producto en el carrito
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

/**
 * Función para obtener y mostrar los productos
 * @param {url} a - Url de la api a llamar
 * @returns {void}
 */
export async function fetchProducts(url) {
  let data = await fetch(url);
  let response = await data.json();

  for (let i = 0; i < response.length; i++) {
    let title = response[i].title;
    products.innerHTML += `    
        <div class="card" style="width: 26rem; height:36rem">
            <img src="${
              response[i].image
            }" class="card-img-top" alt="..." data-target="#modalId${i}">
            <div class="card-body">
                <h5 class="card-title">${
                  title.length > 15
                    ? title.substring(0, 15).concat("...")
                    : title
                }</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">${
                  response[i].category
                }</h6>
            </div>
        </div>
        
        <div class="modal fade" id="modalId${i}">
        <div class="col-sm-12 col-md-6 col-lg-4 mb-4">
            <div class="modal-content">
            <div class="d-flex justify-content-end">
            <button type="button" class="close custom-close" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
            <div class="modal-body">
                <div class="row mt-2 p-3">
            
                <div class="col-md-6">
                    <img src="${
                      response[i].image
                    }" width="100%" height="280px" class="rounded" alt="Imagen del producto">
                </div>
                <div class="modal-header pb-2">
                <h5 class="modal-title" id="exampleModalLabel">${
                  response[i].title
                }</h5>
                
            </div>
                <div class="col-md-6"></div>
                <p class="card-text text-dark text-justify">${
                  response[i].description
                }</p>
                <div class="col-md-6">
                    <p class="card-text text-success">$ ${response[i].price}</p>
                </div>
                
                <div class="col-md-6">
                    <a href="#" class="btn btn-dark btn-block agregar-carrito-modal" data-product-id="${
                      response[i].id 
                    }">Agregar al carrito</a>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
        
    `;
  }
}

// Función suma y resta de cantidad productos
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
      actualizarEstadoBotonComprar(); 
    });
  });
}

// Función para mostrar el contenido del carrito
function mostrarContenidoCarrito(carritoContainer, carritoHTML, precioTotal) {
  carritoContainer.innerHTML = carritoHTML;

  const precioTotalElement = document.createElement("p");
  precioTotalElement.textContent = `Precio total: $${precioTotal.toFixed(2)}`;
  precioTotalElement.classList.add("precio-total");
  carritoContainer.appendChild(precioTotalElement);

  agregarEventosEliminarProducto();
  agregarEventosModificarCantidad();
  
}
function agregarEventosEliminarProducto() {
  document.querySelectorAll(".eliminar-producto").forEach((boton) => {
    boton.addEventListener("click", async function () {
      const index = parseInt(this.getAttribute("data-producto-index"));
      await alertEliminar(index);
      
    });
  });
}

// Función para agregar un producto al carrito
export async function agregarAlCarrito(producto) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const productoExistenteIndex = carrito.findIndex((item) => item.id === producto.id);
  
  if (productoExistenteIndex !== -1) {
    // Si el producto ya está en el carrito, incrementar la cantidad y actualizar el precio total
    carrito[productoExistenteIndex].cantidad += 1;
    carrito[productoExistenteIndex].precioTotal = carrito[productoExistenteIndex].cantidad * producto.price;
  } else {
    // Si el producto no está en el carrito, agregarlo
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
}

const botonComprar = document.getElementById("btn-comprar");

// Función para verificar si el carrito está vacío
function carritoEstaVacio() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  return carrito.length === 0;
}

// Función para habilitar o deshabilitar el botón de comprar según el estado del carrito
function actualizarEstadoBotonComprar() {
  if (carritoEstaVacio()) {
    // Si el carrito está vacío, deshabilito el botón
    botonComprar.setAttribute("disabled", "true");
  } else {
    // Si el carrito no está vacío, habilito el botón
    botonComprar.removeAttribute("disabled");
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  // Resto del código...

  // Llama a la función para actualizar el contenido del carrito inicialmente
  await actualizarContenidoCarrito();
});

fetchProducts("https://fakestoreapi.com/products");

// Llama a la función para actualizar el contador de productos
actualizarContadorProductos();
