/**
 * Función para agregar abrir el modal
 * @returns {void}
 */
export function abrirModal(modalId) {
  const modal = document.querySelector(modalId);
  modal.classList.add("show");
  modal.style.display = "block";
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("role", "dialog");
}

/**
 * Función para agregar cerrar el modal
 * @returns {void}
 */
export function cerrarModal(modalId) {
  const modal = document.querySelector(modalId);
  modal.classList.remove("show");
  modal.style.display = "none";
  modal.removeAttribute("aria-modal");
  modal.removeAttribute("role");
}

/**
 * Función para agregar eventos de apertura y cierre de modales
 * @returns {void}
 */
export function agregarEventosModales() {
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

 /**
 * Función que crea el alerta o toast al agregar un producto al Carrito
 *  * @returns {void}
 */
 export function crearAlerta() {
  var toastContainer = document.createElement("div");
  toastContainer.classList.add(
    "toast-container",
    "position-fixed",
    "top-50",
    "start-50",
    "translate-middle"
  );
  toastContainer.style.zIndex = "1000"; 
  
  var toast = document.createElement("div");
  toast.classList.add("toast", "fade", "show", "text-bg-success", "toast-lg"); 
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  var toastBody = document.createElement("div");
  toastBody.classList.add("toast-body");
  toastBody.classList.add("text-center"); 
  toastBody.style.fontSize = "2rem"; 
  toastBody.style.padding = "30px"; 
  toastBody.textContent = "Producto agregado al carrito";

  var tickIcon = document.createElement("span");
  tickIcon.classList.add("fa", "fa-check-circle", "me-2"); 
  toastBody.prepend(tickIcon); 
  toast.appendChild(toastBody);
  toastContainer.appendChild(toast);
  document.body.appendChild(toastContainer);

  setTimeout(function () {
    toastContainer.remove();
  }, 2000);
}
