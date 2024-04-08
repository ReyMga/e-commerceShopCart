export async function inicializar() {
  let products = document.querySelector(".productos");

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
}
