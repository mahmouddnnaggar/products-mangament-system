// ^ get elements
const productNameInput = document.getElementById("product-name");
const productCategoryInput = document.getElementById("product-category");
const productPriceInput = document.getElementById("product-price");
const productImageInput = document.getElementById("product-image");
const errorMessageName = document.getElementById("error-message-name");
const errorMessageCategory = document.getElementById("error-message-category");
const errorMessagePrice = document.getElementById("error-message-price");
const addProductButton = document.getElementById("add-product-button");
const updateProductButton = document.getElementById("update-product-button");
const hintToValidateButton = document.getElementById("hint-to-validate");
const totalProducts = document.getElementById("total-products");
const totalAmount = document.getElementById("total-amount");
const categoriesButtons = document.querySelectorAll(".categories button");
const searchInput = document.getElementById("search-input");
const productsList = document.getElementById("products-list");
const clearProductsButton = document.getElementById("clear-products-button");
const editProductButton = document.getElementById("edit-product-button");
const deleteProductButton = document.getElementById("delete-product-button");

// ^ variables
let products = JSON.parse(localStorage.getItem("products")) || [];
// ~ regex variables
let dataIsValid = false;
const nameRegex = /^[A-Z][A-z1-9 \-]{5,25}$/;
const categoryRegex = /^[A-Z][A-z& ]{2,20}$/;
const priceRegex = /^[1-9][\d]{0,5}$/;

// ^ functions
function passNewFileInput(index) {
  function getFileName(path) {
    return path.split("/").pop();
  }
  // ^ Create a new File object
  const newFile = new File(
    [getFileName(products[index].image)],
    getFileName(products[index].image),
    { type: "image/*" }
  );

  // Create a new FileList containing the new File
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(newFile);

  // Set the new FileList as the files property of the input
  return dataTransfer.files;
}
function displayAllProducts() {
  productsList.innerHTML = "";
  products.forEach((product, index) => {
    displayProduct(index);
  });
}
function updateStatistics() {
  totalProducts.textContent = products.length;
  totalAmount.textContent = products.reduce(
    (acc, product) => acc + parseInt(product.price),
    0
  );
}
function clearAllProducts() {
  products = [];
  localStorage.removeItem("products");
  productsList.innerHTML = "";
  clearProductsButton.style.display = "none";
  updateStatistics();
}
updateStatistics();
displayAllProducts();
function dataIsValidOrNot() {
  if (
    nameRegex.test(productNameInput.value) &&
    categoryRegex.test(productCategoryInput.value) &&
    priceRegex.test(productPriceInput.value)
  ) {
    return true;
  } else {
    if (!nameRegex.test(productNameInput.value)) {
      errorMessageName.style.cssText = `
    opacity: 1;
    scale: 1;
    `;
    }
    if (!categoryRegex.test(productCategoryInput.value)) {
      errorMessageCategory.style.cssText = `
    opacity: 1;
    scale: 1;
    `;
    }
    if (!priceRegex.test(productPriceInput.value)) {
      errorMessagePrice.style.cssText = `
    opacity: 1;
    scale: 1;
    `;
    }
    return false;
  }
}
function hideHint() {
  productNameInput.onfocus = () => {
    addProductButton.style.display = "block";
    hintToValidateButton.style.display = "none";
  };
  productCategoryInput.onfocus = () => {
    addProductButton.style.display = "block";
    hintToValidateButton.style.display = "none";
  };
  productPriceInput.onfocus = () => {
    addProductButton.style.display = "block";
    hintToValidateButton.style.display = "none";
  };
}
hideHint();
function addProduct() {
  if (dataIsValidOrNot()) {
    products.push({
      name: productNameInput.value,
      category: productCategoryInput.value,
      price: productPriceInput.value,
      image: `../assets/imgs/${
        productImageInput.files[0]?.name || "placeholder.svg"
      }`,
    });
    localStorage.setItem("products", JSON.stringify(products));
    displayProduct(products.length - 1);
    updateStatistics();
    clearInputFields();
  } else {
    addProductButton.style.display = "none";
    hintToValidateButton.style.display = "block";
  }
}
function displayProduct(index) {
  productsList.innerHTML += `
  <div class="product-item" data-index="${index}">
    <div class="product-image">
      <img src="${products[index].image}" alt="product image" />
    </div>
    <div class="product-info">
    <h3>${products[index].name}</h3>
    <p>${products[index].category}</p>
    <p>$${products[index].price}</p>
    </div>
    <div class="product-actions">
      <button onclick="editProduct(${index})" id="edit-product-button" type="button">Edit</button>
      <button onclick="deleteProduct(${index})" id="delete-product-button" type="button">Delete</button>
    </div>
  </div>
  `;
  if (products.length > 4) {
    clearProductsButton.style.display = "block";
  }
}
function clearInputFields() {
  productNameInput.value = "";
  productCategoryInput.value = "";
  productPriceInput.value = "";
  productImageInput.value = "";
}
function deleteProduct(index) {
  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  displayAllProducts();
  if (products.length <= 4) {
    clearProductsButton.style.display = "none";
  }
  updateStatistics();
}
function editProduct(index) {
  addProductButton.style.display = "none";
  updateProductButton.style.display = "block";
  productNameInput.value = products[index].name;
  productCategoryInput.value = products[index].category;
  productPriceInput.value = products[index].price;
  productImageInput.files = passNewFileInput(index);
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  updateProductButton.onclick = () => {
    products[index].name = productNameInput.value;
    products[index].category = productCategoryInput.value;
    products[index].price = productPriceInput.value;
    products[index].image = `assets/imgs/${productImageInput.files[0]?.name}`;
    localStorage.setItem("products", JSON.stringify(products));
    displayAllProducts();
    clearInputFields();
    updateStatistics();
    addProductButton.style.display = "block";
    updateProductButton.style.display = "none";
  };
}
function searchProduct() {
  const searchValue = searchInput.value.toLowerCase();
  productsList.innerHTML = "";
  products.forEach((product, index) => {
    if (product.name.toLowerCase().includes(searchValue)) {
      displayProduct(index);
    }
  });
  if (searchInput.value === "") {
    clearProductsButton.style.display = "block";
  } else {
    clearProductsButton.style.display = "none";
  }
}
function exitSearch() {
  searchInput.value = "";
  displayAllProducts();
}
function displayProductsByCategory(category) {
  productsList.innerHTML = "";
  products.forEach((product, index) => {
    if (
      product.category.toLowerCase() === category.toLowerCase() ||
      category === "all"
    ) {
      displayProduct(index);
    }
  });
  if (category === "all") {
    clearProductsButton.style.display = "block";
  } else {
    clearProductsButton.style.display = "none";
  }
}
function validateOnInput(input, regex, errorMessage) {
  input.addEventListener("blur", hideAndDisplayWhenBlur);
  input.addEventListener("focus", hideWhenFocus);
  function hideAndDisplayWhenBlur() {
    if (!regex.test(input.value)) {
      errorMessage.style.cssText = `
    opacity: 1;
    scale: 1;
    `;
    } else {
      errorMessage.style.cssText = `
    opacity: 0;
    scale: 0;
    `;
    }
  }
  function hideWhenFocus() {
    errorMessage.style.cssText = `
    opacity: 0;
    scale: 0;
    `;
  }
}
function validateAllInput() {
  validateOnInput(productNameInput, nameRegex, errorMessageName);
  validateOnInput(productCategoryInput, categoryRegex, errorMessageCategory);
  validateOnInput(productPriceInput, priceRegex, errorMessagePrice);
}
validateAllInput();
// ^ event listeners
addProductButton.addEventListener("click", addProduct);
clearProductsButton.addEventListener("click", clearAllProducts);
searchInput.addEventListener("input", searchProduct);
searchInput.addEventListener("blur", exitSearch);
categoriesButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoriesButtons.forEach((button) => {
      button.classList.remove("active");
    });
    button.classList.add("active");
    displayProductsByCategory(button.dataset.category);
  });
});
