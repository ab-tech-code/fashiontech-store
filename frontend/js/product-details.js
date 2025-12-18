const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

fetch("data/products.json")
  .then(res => res.json())
  .then(products => {
    const product = products.find(p => p.id == productId);
    if (!product) return;

    const container = document.getElementById("productDetails");

    container.innerHTML = `
      <div class="details-card">
        <img src="${product.image}" alt="${product.name}">

        <div class="details-info">
          <h2>${product.name}</h2>
          <p>${product.description}</p>
          <div class="price">₦${product.price}</div>

          <button id="addToCartBtn">🛒 Add to Cart</button>
        </div>
      </div>
    `;

    document.getElementById("addToCartBtn").onclick = () => {
      addToCart(product);
      showToast("Item added to cart");
    };
  });

function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}
