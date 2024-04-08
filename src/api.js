document.addEventListener("DOMContentLoaded", async function () {
  let products = document.querySelector(".productos");
  let carritoButton;

  async function fetchProducts(url) {
    let data = await fetch(url);
    let response = await data.json();

    for (let i = 0; i < response.length; i++) {
      let description = response[i].description;
      let title = response[i].title;
      products.innerHTML += `    
            <div class="card" style="width: 26rem; height:47rem">
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
                    <p class="card-text" data-target="#modalId${i}">${
        description.length > 20
          ? description.substring(0, 60).concat("...más")
          : description
      }</p>
                    <p class="card-text mr-4 text-success">$ ${
                      response[i].price
                    }</p>
                    <a href="#" class="btn btn-dark agregar-carrito" data-product-id="${
                      response[i].id
                    }">Agregar al carrito</a>
                </div>
            </div>
    
            <!--Modal-->
            <div class="modal fade" id="modalId${i}">
            <div class="modal-dialog bg-sucess">
              <div class="modal-content">
                <div class="modal-header pb-2">
                  <h5 class="modal-title" id="exampleModalLabel">${
                    response[i].title
                  }</h5>
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

  await fetchProducts("https://fakestoreapi.com/products");

  // Agregar evento de clic a los botones "Agregar al carrito"
  document.querySelectorAll(".agregar-carrito").forEach((boton) => {
    boton.addEventListener("click", async function (event) {
      event.preventDefault();
      // Obtener el ID del producto desde el atributo data
      const productoId = this.getAttribute("data-product-id");
      // Agregar el producto al carrito
      await agregarAlCarrito(productoId);
      // Actualizar el contenido del carrito
      await actualizarContenidoCarrito();
    });
  });

  // Agregar evento de clic a los botones "Agregar al carrito" dentro del modal
  document.querySelectorAll(".agregar-carrito-modal").forEach((boton) => {
    boton.addEventListener("click", async function (event) {
      event.preventDefault();
      // Obtener el ID del producto desde el atributo data
      const productoId = this.getAttribute("data-product-id");
      // Agregar el producto al carrito
      await agregarAlCarrito(productoId);
      // Actualizar el contenido del carrito
      await actualizarContenidoCarrito();
    });
  });

  // Función para agregar un producto al carrito
  async function agregarAlCarrito(productoId) {
    // Obtener el producto correspondiente al ID
    const producto = document
      .querySelector(`[data-product-id="${productoId}"]`)
      .closest(".card");
    const nombreProducto = producto.querySelector(".card-title").textContent;
    const precioProducto = parseFloat(
      producto.querySelector(".text-success").textContent.slice(2)
    );

    // Obtener el carrito del almacenamiento local o crear uno nuevo
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Agregar el producto al carrito
    carrito.push({
      nombre: nombreProducto,
      precio: precioProducto,
      imagen: producto.querySelector(".card-img-top").src,
    });

    // Guardar el carrito actualizado en el almacenamiento local
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  // Función para actualizar el contenido del carrito
  async function actualizarContenidoCarrito() {
    // Obtener referencia al contenedor del carrito
    const carritoContainer = document.querySelector(".offcanvas-body");
    // Obtener el carrito del almacenamiento local
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Construir el HTML para los productos en el carrito
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

    // Actualizar el contenido del contenedor del carrito
    carritoContainer.innerHTML = carritoHTML;

    // Agregar evento de clic a los botones de eliminar producto
    document.querySelectorAll(".eliminar-producto").forEach((boton) => {
      boton.addEventListener("click", async function () {
        // Obtener el índice del producto a eliminar
        const index = parseInt(this.getAttribute("data-producto-index"));
        // Eliminar el producto del carrito y del almacenamiento local
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        // Actualizar el contenido del carrito
        await actualizarContenidoCarrito();
      });
    });
  }

  // Mostrar el contenido del carrito al cargar la página
  await actualizarContenidoCarrito();

  // Obtener referencia al botón de carrito
  carritoButton = document.getElementById("carritoLink");

  // Función para abrir el modal
  function abrirModal(modalId) {
    const modal = document.querySelector(modalId);
    modal.classList.add("show");
    modal.style.display = "block";
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("role", "dialog");
  }

  // Función para cerrar el modal
  function cerrarModal(modalId) {
    const modal = document.querySelector(modalId);
    modal.classList.remove("show");
    modal.style.display = "none";
    modal.removeAttribute("aria-modal");
    modal.removeAttribute("role");
  }

  // Agregar evento de clic a los botones que abren el modal
  document.querySelectorAll("[data-target]").forEach((boton) => {
    boton.addEventListener("click", function () {
      const targetModalId = this.getAttribute("data-target");
      abrirModal(targetModalId);
    });
  });

  // Agregar evento de clic a los botones de cierre dentro del modal
  const closeModalButtons = document.querySelectorAll(
    '.modal .close, .modal [data-dismiss="modal"]'
  );
  closeModalButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const modal = this.closest(".modal");
      cerrarModal(`#${modal.id}`);
    });
  });

  // Agregar evento para cerrar el modal haciendo clic fuera de él
  window.addEventListener("click", function (event) {
    const modal = document.querySelector(".modal.show");
    if (modal && event.target === modal) {
      cerrarModal(`#${modal.id}`);
    }
  });
});
