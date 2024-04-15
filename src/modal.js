// modal.js
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
