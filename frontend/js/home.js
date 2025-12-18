fetch("data/products.json")
  .then(res => res.json())
  .then(products => {
    const container = document.getElementById("homeProductList");

    // Show only first 4 as featured
    products.slice(0, 4).forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
          <h4>${product.name}</h4>
          <p>₦${product.price}</p>

          <div class="product-actions">
            <button class="add-btn">🛒 Add</button>
            <a href="product-details.html?id=${product.id}" class="view-btn">👁 View</a>
          </div>
        </div>
      `;

      card.querySelector(".add-btn").onclick = () => {
        addToCart(product);
        showToast("Item added to cart");
      };

      container.appendChild(card);
    });
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
