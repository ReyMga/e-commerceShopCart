export function modalListeners() {
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

export function abrirModal(modalId) {
  const modal = document.querySelector(modalId);
  modal.classList.add("show");
  modal.style.display = "block";
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("role", "dialog");
}

export function cerrarModal(modalId) {
  const modal = document.querySelector(modalId);
  modal.classList.remove("show");
  modal.style.display = "none";
  modal.removeAttribute("aria-modal");
  modal.removeAttribute("role");
}
