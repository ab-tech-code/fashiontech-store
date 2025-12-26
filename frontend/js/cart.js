const cartContent = document.getElementById("cartContent");
const cartTotalEl = document.getElementById("cartTotal");
const cartSummary = document.getElementById("cartSummary");

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function renderCart() {
  const cart = getCart();
  cartContent.innerHTML = "";

  if (cart.length === 0) {
    cartContent.innerHTML = `
      <div class="empty-cart">
        <h3>Your cart is empty</h3>
        <p>Browse products and add items to your cart.</p>
      </div>
    `;
    cartSummary.style.display = "none";
    return;
  }

  cartSummary.style.display = "flex";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <div class="price">₦${item.price}</div>
      </div>

      <div class="qty-control">
        <button class="minus">−</button>
        <span>${item.quantity}</span>
        <button class="plus">+</button>
      </div>

      <div>₦${item.price * item.quantity}</div>

      <button class="remove-btn">Remove</button>
    `;

    div.querySelector(".plus").onclick = () => {
      item.quantity++;
      saveCart(cart);
      renderCart();
    };

    div.querySelector(".minus").onclick = () => {
      if (item.quantity > 1) {
        item.quantity--;
      }
      saveCart(cart);
      renderCart();
    };

    div.querySelector(".remove-btn").onclick = () => {
      cart.splice(index, 1);
      saveCart(cart);
      showToast("Item removed");
      renderCart();
    };

    cartContent.appendChild(div);
  });

  cartTotalEl.textContent = total;
}

renderCart();
