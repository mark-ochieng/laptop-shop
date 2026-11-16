// ---------- DATA ----------
// Each laptop is an object. All laptops are stored in an array.
// Put your pictures in the "images" folder and use the same file names below.
var products = [
  { id: 1, name: "HP 250 G8", brand: "HP", specs: "Core i5, 8GB RAM, 256GB SSD", price: 48000, image: "images/laptop1.jpg" },
  { id: 2, name: "Dell Inspiron 15", brand: "Dell", specs: "Core i5, 8GB RAM, 512GB SSD", price: 62000, image: "images/laptop2.jpg" },
  { id: 3, name: "Lenovo IdeaPad 3", brand: "Lenovo", specs: "Ryzen 5, 8GB RAM, 512GB SSD", price: 55000, image: "images/laptop3.jpg" },
  { id: 4, name: "MacBook Air M1", brand: "Apple", specs: "Apple M1, 8GB RAM, 256GB SSD", price: 115000, image: "images/laptop4.jpg" },
  { id: 5, name: "Acer Aspire 5", brand: "Acer", specs: "Core i3, 4GB RAM, 256GB SSD", price: 38000, image: "images/laptop5.jpg" },
  { id: 6, name: "ASUS VivoBook 15", brand: "ASUS", specs: "Core i7, 16GB RAM, 512GB SSD", price: 85000, image: "images/laptop6.jpg" }
];

// The cart is loaded from localStorage so it survives a page refresh.
// Each cart item looks like: { id: 1, qty: 2 }
var cart = JSON.parse(localStorage.getItem("cart")) || [];

// ---------- SAVE THE CART ----------
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  var count = 0;
  for (var i = 0; i < cart.length; i++) {
    count = count + cart[i].qty;
  }
  document.getElementById("cartCount").innerHTML = count;
}

// ---------- FIND A PRODUCT BY ID ----------
function findProduct(id) {
  for (var i = 0; i < products.length; i++) {
    if (products[i].id == id) {
      return products[i];
    }
  }
}

// ---------- SHOW ONE PAGE AT A TIME ----------
function showPage(page) {
  var shopPage = document.getElementById("shopPage");
  var cartPage = document.getElementById("cartPage");
  var btnShop = document.getElementById("btnShop");
  var btnCart = document.getElementById("btnCart");

  if (page == "shop") {
    shopPage.classList.remove("hidden");
    cartPage.classList.add("hidden");
    btnShop.classList.add("active");
    btnCart.classList.remove("active");
  } else {
    cartPage.classList.remove("hidden");
    shopPage.classList.add("hidden");
    btnCart.classList.add("active");
    btnShop.classList.remove("active");
    document.getElementById("orderMessage").classList.add("hidden");
    displayCart();
  }
}

// ---------- DISPLAY PRODUCTS ----------
function displayProducts(list) {
  var productList = document.getElementById("productList");
  var resultCount = document.getElementById("resultCount");
  productList.innerHTML = "";

  if (list.length == 0) {
    resultCount.innerHTML = "No laptops match your search.";
    return;
  }

  resultCount.innerHTML = list.length + " laptop(s) found";

  for (var i = 0; i < list.length; i++) {
    var p = list[i];

    productList.innerHTML +=
      '<div class="card">' +
        '<div class="photo">' +
          '<img src="' + p.image + '" alt="' + p.name + '" onerror="this.style.display=\'none\'">' +
        '</div>' +
        '<div class="info">' +
          '<h3>' + p.name + '</h3>' +
          '<p>' + p.specs + '</p>' +
          '<p class="price">KES ' + p.price + '</p>' +
          '<button onclick="addToCart(' + p.id + ')">Add to Cart</button>' +
        '</div>' +
      '</div>';
  }
}

// ---------- SEARCH / FILTER ----------
function filterProducts() {
  var name = document.getElementById("searchName").value.toLowerCase();
  var brand = document.getElementById("searchBrand").value;
  var maxPrice = document.getElementById("searchPrice").value;

  var results = [];

  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    var match = true;

    if (name != "" && p.name.toLowerCase().indexOf(name) == -1) {
      match = false;
    }

    if (brand != "all" && p.brand != brand) {
      match = false;
    }

    if (maxPrice != "" && p.price > Number(maxPrice)) {
      match = false;
    }

    if (match == true) {
      results.push(p);
    }
  }

  displayProducts(results);
}

function clearFilters() {
  document.getElementById("searchName").value = "";
  document.getElementById("searchBrand").value = "all";
  document.getElementById("searchPrice").value = "";
  displayProducts(products);
}

// ---------- CART FUNCTIONS ----------
function addToCart(id) {
  var found = false;

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id == id) {
      cart[i].qty = cart[i].qty + 1;
      found = true;
    }
  }

  if (found == false) {
    cart.push({ id: id, qty: 1 });
  }

  saveCart();
  alert(findProduct(id).name + " added to cart");
}

function changeQty(id, change) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id == id) {
      cart[i].qty = cart[i].qty + change;

      if (cart[i].qty <= 0) {
        cart.splice(i, 1);
      }
      break;
    }
  }

  saveCart();
  displayCart();
}

function removeFromCart(id) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id == id) {
      cart.splice(i, 1);
      break;
    }
  }

  saveCart();
  displayCart();
}

function displayCart() {
  var cartItems = document.getElementById("cartItems");
  var cartTotal = document.getElementById("cartTotal");
  var checkoutBox = document.getElementById("checkoutBox");
  var total = 0;

  cartItems.innerHTML = "";

  if (cart.length == 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.innerHTML = "";
    checkoutBox.classList.add("hidden");
    return;
  }

  checkoutBox.classList.remove("hidden");

  for (var i = 0; i < cart.length; i++) {
    var p = findProduct(cart[i].id);
    var subtotal = p.price * cart[i].qty;
    total = total + subtotal;

    cartItems.innerHTML +=
      '<div class="cartRow">' +
        '<h3>' + p.name + '</h3>' +
        '<p>Price: KES ' + p.price + '</p>' +
        '<p>Quantity: ' + cart[i].qty + '</p>' +
        '<p>Subtotal: KES ' + subtotal + '</p>' +
        '<button onclick="changeQty(' + p.id + ', 1)">+</button>' +
        '<button onclick="changeQty(' + p.id + ', -1)">-</button>' +
        '<button class="red" onclick="removeFromCart(' + p.id + ')">Remove</button>' +
      '</div>';
  }

  cartTotal.innerHTML = "Total: KES " + total;
}

// ---------- CHECKOUT ----------
function placeOrder(event) {
  event.preventDefault();

  var name = document.getElementById("custName").value;
  var location = document.getElementById("custLocation").value;
  var payment = document.getElementById("payment").value;
  var total = 0;

  for (var i = 0; i < cart.length; i++) {
    total = total + findProduct(cart[i].id).price * cart[i].qty;
  }

  cart = [];
  saveCart();
  document.getElementById("checkoutForm").reset();
  displayCart();

  var message = document.getElementById("orderMessage");
  message.innerHTML =
    "<h3>Order placed successfully!</h3>" +
    "<p>Thank you, " + name + ".</p>" +
    "<p>Total: KES " + total + " (" + payment + ")</p>" +
    "<p>Your laptop will be delivered to " + location + ".</p>";
  message.classList.remove("hidden");
}

// ---------- RUN WHEN PAGE OPENS ----------
displayProducts(products);
updateCartCount();
