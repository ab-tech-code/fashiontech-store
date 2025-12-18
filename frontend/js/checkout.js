const cart = JSON.parse(localStorage.getItem("cart")) || [];
const summaryItems = document.getElementById("summaryItems");
const summaryTotal = document.getElementById("summaryTotal");
const form = document.getElementById("checkoutForm");

let total = 0;

/* ================= LOAD ORDER SUMMARY ================= */
if (cart.length === 0) {
  showToast("Your cart is empty");
}

cart.forEach(item => {
  total += item.price * item.quantity;

  const div = document.createElement("div");
  div.className = "summary-item";
  div.innerHTML = `
    <span>${item.name} x${item.quantity}</span>
    <span>₦${item.price * item.quantity}</span>
  `;
  summaryItems.appendChild(div);
});

summaryTotal.textContent = total;

/* ================= FORM SUBMIT ================= */
form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (cart.length === 0) {
    showToast("Cannot place order. Cart is empty.");
    return;
  }

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const paymentInput = document.querySelector("input[name='payment']:checked");

  if (!name || !email || !phone || !address) {
    showToast("Please fill all required fields");
    return;
  }

  if (!paymentInput) {
    showToast("Please select a payment method");
    return;
  }

  const paymentMethod = paymentInput.value;

  if (paymentMethod === "Paystack") {
    payWithPaystack(name, email, phone, address);
  } else {
    saveOrder(name, email, phone, address, "Pay on Delivery", null);
  }
});

/* ================= PAYSTACK ================= */
function payWithPaystack(name, email, phone, address) {
  showToast("Opening payment gateway...");

  const handler = PaystackPop.setup({
    key: "pk_test_xxxxxxxxxxxxxxxxxxxxx",
    email: email,
    amount: total * 100,
    currency: "NGN",

    callback: function (response) {
      saveOrder(name, email, phone, address, "Paystack", response.reference);
    },

    onClose: function () {
      showToast("Payment cancelled");
    }
  });

  handler.openIframe();
}

/* ================= SAVE ORDER ================= */
function saveOrder(name, email, phone, address, method, reference) {
  showToast("Placing your order...");

  fetch("../backend/api/save-order.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      phone,
      address,
      paymentMethod: method,
      paymentReference: reference,
      cart
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.removeItem("cart");
        updateCartCount();
        showToast("Order placed successfully 🎉");

        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      } else {
        showToast("Order failed. Please try again.");
      }
    })
    .catch(() => {
      showToast("Server error. Please try again later.");
    });
}
