import {
  agregarProductoAlCarrito,
  actualizarContenidoCarrito,
} from "./src/carritoFunciones.js";
import { abrirModal, cerrarModal } from "./src/modal.js";

document.addEventListener("DOMContentLoaded", async function () {
  let products = document.querySelector(".productos");
  let carritoButton;

  await fetchProducts("https://fakestoreapi.com/products");

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

  // Mostrar el contenido del carrito al cargar la página
  await actualizarContenidoCarrito();

  // Obtener referencia al botón de carrito
  carritoButton = document.getElementById("carritoLink");

  // Agregar eventos para abrir y cerrar modales
  agregarEventosModales();

  // Función para obtener y mostrar los productos
  async function fetchProducts(url) {
    let data = await fetch(url);
    let response = await data.json();
    for (let i = 0; i < response.length; i++) {
      let description = response[i].description;
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
    
            <!--Modal-->
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
                        <p class="card-text text-success">$ ${
                          response[i].price
                        }</p>
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
  // Agregar eventos de apertura y cierre de modales
  function agregarEventosModales() {
    document.querySelectorAll("[data-target]").forEach((boton) => {
      boton.addEventListener("click", function () {
        const targetModalId = this.getAttribute("data-target");
        abrirModal(targetModalId);
      });
    });

    const closeModalButtons = document.querySelectorAll(
      '.modal .close, .modal [data-dismiss="modal"]'
    );
    closeModalButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const modal = this.closest(".modal");
        cerrarModal(`#${modal.id}`);
      });
    });

    window.addEventListener("click", function (event) {
      const modal = document.querySelector(".modal.show");
      if (modal && event.target === modal) {
        cerrarModal(`#${modal.id}`);
      }
    });
  }
});
