const carritoLink = document.querySelector(".nav-link");

function addCart() {
  carritoLink.addEventListener("click", (event) => {
    // Mostrar el Offcanvas
    let offcanvasElement = new bootstrap.Offcanvas(
      document.getElementById("offcanvasCarrito")
    );
    offcanvasElement.show();
  });
}
addCart();
