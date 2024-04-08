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

  // Función para agregar un producto al carrito
  async function agregarProductoAlCarrito(productoId) {
    // Obtener información del producto
    const producto = await obtenerInformacionProducto(productoId);
    // Agregar el producto al carrito
    await agregarAlCarrito(producto);
    // Actualizar el contenido del carrito
    await actualizarContenidoCarrito();
  }

  // Función para obtener información de un producto
  async function obtenerInformacionProducto(productoId) {
    const response = await fetch(
      `https://fakestoreapi.com/products/${productoId}`
    );
    const producto = await response.json();
    return producto;
  }

  // Función para agregar un producto al carrito
  async function agregarAlCarrito(producto) {
    // Obtener el carrito del almacenamiento local o crear uno nuevo
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.find((item) => item.id === producto.id);

    if (productoExistente) {
      // Si el producto ya está en el carrito, actualizar cantidad y precio total
      productoExistente.cantidad += 1;
      productoExistente.precioTotal =
        productoExistente.cantidad * producto.precio;
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

    // Guardar el carrito actualizado en el almacenamiento local
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  // Función para actualizar el contenido del carrito
  async function actualizarContenidoCarrito() {
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

  // Función para mostrar el contenido del carrito
  function mostrarContenidoCarrito(carritoContainer, carritoHTML, precioTotal) {
    carritoContainer.innerHTML = carritoHTML;

    const precioTotalElement = document.createElement("p");
    precioTotalElement.textContent = `Precio total: $${precioTotal.toFixed(2)}`;
    carritoContainer.appendChild(precioTotalElement);

    agregarEventosEliminarProducto();
    agregarEventosModificarCantidad();
  }

  // Función para agregar eventos de clic a los botones de eliminar producto
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

  // Función para agregar eventos de clic a los botones de suma y resta de cantidad
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

  // Función para agregar eventos de apertura y cierre de modales
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

  // Función para abrir un modal
  function abrirModal(modalId) {
    const modal = document.querySelector(modalId);
    modal.classList.add("show");
    modal.style.display = "block";
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("role", "dialog");
  }

  // Función para cerrar un modal
  function cerrarModal(modalId) {
    const modal = document.querySelector(modalId);
    modal.classList.remove("show");
    modal.style.display = "none";
    modal.removeAttribute("aria-modal");
    modal.removeAttribute("role");
  }

  // Función para obtener y mostrar los productos
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
});
