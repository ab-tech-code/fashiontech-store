const form = document.getElementById("checkoutForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  const order = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    paymentMethod: document.querySelector(
      'input[name="payment"]:checked'
    ).value,
    cart: cart
  };

  // ✅ CORRECT PATH TO BACKEND API
  fetch("../backend/api/save-order.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(order)
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.removeItem("cart");
        alert("Order placed successfully!");
        window.location.href = "index.html";
      } else {
        alert("Order failed");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Server error");
    });
});
