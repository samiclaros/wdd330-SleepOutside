import { loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

loadHeaderFooter();

const myCheckout = new CheckoutProcess('so-cart', '.order-summary');
myCheckout.init();

// Here we create something to evaluate if we are on index.html from Checkout or we are on success.html
const zipElement = document.querySelector('#zip');
if (zipElement) {
  zipElement.addEventListener('blur', () => {
    myCheckout.calculateOrderTotal();
  });
}
