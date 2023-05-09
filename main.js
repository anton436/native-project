// есть API = 'https://fakestoreapi.com/products'. Необходимо реализовать следующий функционал:

// 0.1 - подключить bootstrap
// 0.2 - добавить navbar

// 1. Стянуть данные с указанного API и сохранить данные в локальном хранилище (сделать это необходимо 1 раз!)
// 2. реализовать CRUD на localStorage (
// -сначала отображение (использовать карточки из bootstrap),
// -потом создание продукта, (используйте модальное окно из bootstrap)
// -удаление
// -редактирование (используйте модальное окно из bootstrap)

// 3. EXTRA -- Реализовать фильтрацию по категориям
// 4. EXTRA -- Реализовать поиск

const API = "https://fakestoreapi.com/products";

// TODO 1.========================
function getDataFromAPI() {
  fetch(API)
    .then((res) => res.json())
    .then((data) => localStorage.setItem("data", JSON.stringify(data)));
}

// getDataFromAPI();

// TODO 2.1 READ============================

const productList = document.querySelector(".product-list");

render();
function render() {
  const data = JSON.parse(localStorage.getItem("data"));
  productList.innerHTML = "";
  data.forEach((item) => {
    productList.innerHTML += `<div class="card" style="width: 15rem; margin:0.5rem; padding:1rem;">
    <img src=${item.image} class="card-img-top p-3 d-block m-auto" alt="...">
    <div class="card-body">
      <h5 class="card-title">${item.title.slice(0, 20)}</h5>
      <p class="card-text">${item.description.slice(0, 50)}</p>
      <p class="card-text">$ ${item.price}</p>

      <a href="#"  onclick="openEditModal(${
        item.id
      })" class="btn btn-primary" data-bs-toggle="modal"
      data-bs-target="#editModal">Edit</a>

      <a href="#" onclick="deleteProduct(${
        item.id
      })" class="btn btn-primary">Delete</a>

    </div>
  </div>`;
  });
}

//TODO 2.2 CREATE ===========================
let inpTitle = document.querySelector(".input-title");
let inpDescr = document.querySelector(".input-descr");
let inpPrice = document.querySelector(".input-price");
let inpCat = document.querySelector(".input-cat");
let inpImage = document.querySelector(".input-image");

let btnAdd = document.querySelector(".btn-add");

btnAdd.addEventListener("click", () => {
  if (
    !inpTitle.value ||
    !inpImage.value ||
    !inpCat.value ||
    !inpDescr.value ||
    !inpPrice.value
  ) {
    alert("заполните все поля");
    return;
  }
  let newProduct = {
    title: inpTitle.value,
    price: inpPrice.value,
    image: inpImage.value,
    description: inpDescr.value,
    category: inpCat.value,
    id: Date.now(),
  };

  let data = JSON.parse(localStorage.getItem("data"));
  data.push(newProduct);
  localStorage.setItem("data", JSON.stringify(data));
  render();

  let addModal = document.querySelector("#addModal");
  let modal = bootstrap.Modal.getInstance(addModal);
  modal.hide();
});

// TODO 2.3 DELETE ==============================
function deleteProduct(id) {
  let data = JSON.parse(localStorage.getItem("data"));
  let newData = data.filter((item) => item.id != id);
  localStorage.setItem("data", JSON.stringify(newData));
  render();
}

// TODO UPDATE ==================================
let inpEditTitle = document.querySelector(".input-edit-title");
let inpEditDescr = document.querySelector(".input-edit-descr");
let inpEditPrice = document.querySelector(".input-edit-price");
let inpEditCat = document.querySelector(".input-edit-cat");
let inpEditImage = document.querySelector(".input-edit-image");

let btnSave = document.querySelector(".btn-save");

function openEditModal(id) {
  let data = JSON.parse(localStorage.getItem("data"));
  let newData = data.filter((item) => item.id == id);

  inpEditTitle.value = newData[0].title;
  inpEditDescr.value = newData[0].description;
  inpEditPrice.value = newData[0].price;
  inpEditCat.value = newData[0].category;
  inpEditImage.value = newData[0].image;

  btnSave.setAttribute("id", id);
}

function saveEditedProduct() {
  let data = JSON.parse(localStorage.getItem("data"));
  let id = btnSave.id;

  let editedProduct = {
    title: inpEditTitle.value,
    price: inpEditPrice.value,
    image: inpEditImage.value,
    description: inpEditDescr.value,
    category: inpEditCat.value,
    id: id,
  };

  let updatedData = data.map((elem) => {
    if (elem.id == id) {
      return editedProduct;
    } else {
      return elem;
    }
  });

  localStorage.setItem("data", JSON.stringify(updatedData));
  render();
  let editModal = document.querySelector("#editModal");
  let modal = bootstrap.Modal.getInstance(editModal);
  modal.hide();
}

btnSave.addEventListener("click", saveEditedProduct);

// TODO SEARCH=======================
const searchInp = document.querySelector(".search-input");

searchInp.addEventListener("input", () => {
  let data = JSON.parse(localStorage.getItem("data"));
  const searchResults = data.filter((item) => {
    if (item.title.toLowerCase().includes(searchInp.value.toLowerCase())) {
      return item;
    }
  });

  productList.innerHTML = "";
  searchResults.forEach((item) => {
    productList.innerHTML += `<div class="card" style="width: 15rem; margin:0.5rem; padding:1rem;">
    <img src=${item.image} class="card-img-top p-3 d-block m-auto" alt="...">
    <div class="card-body">
      <h5 class="card-title">${item.title.slice(0, 20)}</h5>
      <p class="card-text">${item.description.slice(0, 50)}</p>
      <p class="card-text">$ ${item.price}</p>

      <a href="#"  onclick="openEditModal(${
        item.id
      })" class="btn btn-primary" data-bs-toggle="modal"
      data-bs-target="#editModal">Edit</a>

      <a href="#" onclick="deleteProduct(${
        item.id
      })" class="btn btn-primary">Delete</a>

    </div>
  </div>`;
  });
});

// TODO FILTER===============================
let select = document.querySelector(".form-select");

select.addEventListener("change", () => {
  if (select.value === "all") {
    render();
    return;
  }

  let data = JSON.parse(localStorage.getItem("data"));
  const filteredData = data.filter((item) => item.category === select.value);

  productList.innerHTML = "";
  filteredData.forEach((item) => {
    productList.innerHTML += `<div class="card" style="width: 15rem; margin:0.5rem; padding:1rem;">
    <img src=${item.image} class="card-img-top p-3 d-block m-auto" alt="...">
    <div class="card-body">
      <h5 class="card-title">${item.title.slice(0, 20)}</h5>
      <p class="card-text">${item.description.slice(0, 50)}</p>
      <p class="card-text">$ ${item.price}</p>

      <a href="#"  onclick="openEditModal(${
        item.id
      })" class="btn btn-primary" data-bs-toggle="modal"
      data-bs-target="#editModal">Edit</a>

      <a href="#" onclick="deleteProduct(${
        item.id
      })" class="btn btn-primary">Delete</a>

    </div>
  </div>`;
  });
});
