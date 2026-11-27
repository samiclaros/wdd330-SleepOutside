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

// Validate the credit card expiration date.
const expirationElement = document.querySelector('#expiration');

if (expirationElement) {
  const validateExpiration = () => {
    const value = expirationElement.value.trim();

    // Clear any previous custom validation error.
    expirationElement.setCustomValidity('');

    // Allow HTML validation to handle incorrect formats.
    if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(value)) {
      return;
    }

    const [month, year] = value.split('/').map(Number);
    const currentDate = new Date();

    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const expirationYear = 2000 + year;

    // Check whether the card has expired.
    if (
      expirationYear < currentYear ||
      (expirationYear === currentYear && month < currentMonth)
    ) {
      expirationElement.setCustomValidity(
        'Your card has expired. Please enter a valid expiration date.'
      );
    }
  };

  expirationElement.addEventListener('input', validateExpiration);

  expirationElement.addEventListener('blur', () => {
    validateExpiration();
    expirationElement.reportValidity();
  });

  validateExpiration();
}
