import {
  getLocalStorage,
  loadHeaderFooter,
  setLocalStorage,
} from './utils.mjs';

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');

  const cartFooter = document.querySelector('.cart-footer');
  const cartTotal = document.querySelector('.cart-total');
  const checkoutButton = document.querySelector('#checkout-btn');

  // Added and changed by Sam to add to the code the function of take out products from the cart
  const isEmpty = cartItems.length === 0;

  if (cartFooter) {
    cartFooter.classList.toggle('hide', isEmpty);
  }

  if (checkoutButton) {
    checkoutButton.classList.toggle('hide', isEmpty);
  }

  if (!isEmpty) {
    const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
    cartTotal.innerHTML = `Total: $${total.toFixed(2)}`;
  }

  document.querySelectorAll('.remove-item').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      removeFromCart(e.target.dataset.id);
    });
  });
}

function removeFromCart(idToRemove) {
  const cartItems = getLocalStorage('so-cart') || [];
  const indexToRemove = cartItems.findIndex(
    (item) => String(item.Id) === idToRemove,
  );

  if (indexToRemove !== -1) {
    cartItems.splice(indexToRemove, 1);
  }

  setLocalStorage('so-cart', cartItems);
  updateCartCount(cartItems);
  renderCartContents();
}

function updateCartCount(updatedCart) {
  const cartCountEl = document.querySelector('.cart-count');
  if (!cartCountEl) {
    return;
  }

  cartCountEl.textContent = updatedCart.length;
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <span class="remove-item" data-id="${item.Id}">X</span>
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images.PrimaryMedium}"
      alt="${item.Name}"
    />
  </a>
  <a href="#" class="cart-card__title">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
loadHeaderFooter();
