// ================= CART STORAGE =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ================= ADD TO CART =================
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartCount();
  alert("Item added to cart");
}

// ================= SAVE CART =================
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ================= UPDATE COUNT =================
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = count;
}

// ================= RENDER CART PAGE =================
function renderCart() {
  const container = document.getElementById("cartContainer");
  const totalEl = document.getElementById("cartTotal");

  if (!container) return;

  container.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-info">
          <h3>${item.name}</h3>
          <p>₦${item.price.toLocaleString()}</p>
        </div>

        <div class="cart-actions">
          <input type="number" min="1" value="${item.quantity}"
            onchange="updateQuantity(${index}, this.value)">
          <button class="remove-btn" onclick="removeItem(${index})">
            Remove
          </button>
        </div>
      </div>
    `;
  });

  totalEl.textContent = total.toLocaleString();
}

// ================= UPDATE QUANTITY =================
function updateQuantity(index, qty) {
  cart[index].quantity = parseInt(qty);
  saveCart();
  renderCart();
  updateCartCount();
}

// ================= REMOVE ITEM =================
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
  updateCartCount();
}

// ================= INIT =================
updateCartCount();
renderCart();
