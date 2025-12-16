// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"));

// Load products
fetch("data/products.json")
  .then(response => response.json())
  .then(products => {
    const product = products.find(p => p.id === productId);

    if (!product) return;

    const container = document.getElementById("productDetails");

    container.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <h3>₦${product.price.toLocaleString()}</h3>
        <button onclick='addToCart(${JSON.stringify(product)})'>
          Add to Cart
        </button>
      </div>
    `;
  });
