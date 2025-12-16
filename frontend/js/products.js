// Load products from local JSON file
fetch("data/products.json")
  .then(response => response.json())
  .then(products => {
    const grid = document.getElementById("productGrid");

    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>₦${product.price.toLocaleString()}</p>
        <button onclick="viewProduct(${product.id})">View Details</button>
      `;

      grid.appendChild(card);
    });
  });

// Redirect to product details page
function viewProduct(id) {
  window.location.href = `product-details.html?id=${id}`;
}
