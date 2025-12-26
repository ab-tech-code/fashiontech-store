const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const closeBtn = document.getElementById("closeMenu");
const cartCountEl = document.getElementById("cartCount");

/* MOBILE MENU */
if (hamburger) {
  hamburger.onclick = () => mobileMenu.classList.add("active");
}

if (closeBtn) {
  closeBtn.onclick = () => mobileMenu.classList.remove("active");
}

/* CART COUNT */
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function updateCartCount() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cartCountEl) {
    cartCountEl.textContent = totalQty;
  }
}

updateCartCount();

/* Make function global */
window.updateCartCount = updateCartCount;


// FAQ toggle
document.addEventListener("click", function (e) {
  if (e.target.closest(".faq-question")) {
    const item = e.target.closest(".faq-item");
    item.classList.toggle("active");
  }
});
