import { getLocalStorage, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: 1,
  }));
}

function formToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

// Convert server and network errors into readable messages.
function getErrorMessage(err) {
  const message = err?.message;

  if (err instanceof TypeError) {
    return "Unable to connect to the server. Please check your internet connection and try again.";
  }

  if (typeof message === "string" && message) {
    return message;
  }

  if (message && typeof message === "object") {
    const messages = Object.values(message)
      .flat()
      .filter((value) => value !== null)
      .map((value) =>
        typeof value === "object" ? JSON.stringify(value) : String(value),
      )
      .filter(Boolean);

    if (messages.length > 0) {
      return messages.join(" | ");
    }
  }

  return "Unable to process your order. Please try again.";
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.isSubmitting = false;
    this.services = new ExternalServices();
  }

  init() {
    // We verify if we are in the checkout page looking the principal button
    const checkoutButton = document.querySelector("#checkoutSubmit");
    const formElement = document.forms["checkout"];

    if (!checkoutButton || !formElement) return;

    const cart = getLocalStorage(this.key);
    this.list = Array.isArray(cart) ? cart : [];

    this.calculateItemSubtotal();

    if (this.list.length === 0) {
      checkoutButton.disabled = true;

      alertMessage(
        "Your shopping cart is empty. Please add items before checking out.",
      );

      return;
    }

    checkoutButton.addEventListener("click", (e) => {
      e.preventDefault();

      const isValid = formElement.checkValidity();

      formElement.reportValidity();

      if (isValid && !this.isSubmitting) {
        this.checkout();
      }
    });
  }

  calculateItemSubtotal() {
    this.itemTotal = this.list.reduce((sum, item) => sum + item.FinalPrice, 0);

    const subtotalElement = document.querySelector(
      `${this.outputSelector} #subtotal`,
    );

    subtotalElement.textContent = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    // Tax
    this.tax = this.itemTotal * 0.06;

    // Shipping
    this.shipping = this.list.length > 0 ? 10 + 2 * (this.list.length - 1) : 0;

    // Order Total
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    // Tax
    const taxElement = document.querySelector(`${this.outputSelector} #tax`);

    const shippingElement = document.querySelector(
      `${this.outputSelector} #shipping`,
    );

    const orderTotalElement = document.querySelector(
      `${this.outputSelector} #orderTotal`,
    );

    taxElement.textContent = `$${this.tax.toFixed(2)}`;

    shippingElement.textContent = `$${this.shipping.toFixed(2)}`;

    orderTotalElement.textContent = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout() {
    const formElement = document.forms["checkout"];

    // const json = formToJSON(formElement);

    const checkoutButton = document.querySelector("#checkoutSubmit");

    if (!formElement || !checkoutButton) return;

    if (this.isSubmitting) return;


    if (this.list.length === 0) {
      alertMessage("Your shopping cart is empty.");
      return;
    }

    if (!formElement.reportValidity()) return;

    this.isSubmitting = true;

    const originalButtonText = checkoutButton.textContent;
    checkoutButton.disabled = true;
    checkoutButton.textContent = "Processing order...";

    let orderSucceeded = false;

    try {
      // Ensure totals are calculated before submission.
      this.calculateItemSubtotal();
      this.calculateOrderTotal();

      const json = formToJSON(formElement);

      json.orderDate = new Date().toISOString();
      json.items = packageItems(this.list);
      json.subtotal = this.itemTotal;
      json.shipping = this.shipping;
      json.tax = this.tax;
      json.orderTotal = this.orderTotal;

      await this.services.checkout(json);

      orderSucceeded = true;

      // Clear the cart after successful checkout.
      localStorage.removeItem(this.key);
      this.list = [];

      // Redirect to the success page.
      window.location.href = "/checkout/success.html";
    } catch (err) {
      const errorMessage = orderSucceeded
        ? "Your order was accepted, but the confirmation could not be displayed."
        : getErrorMessage(err);

      alertMessage(errorMessage);
    } finally {
      // Restore the button only if the order failed.
      if (!orderSucceeded) {
        this.isSubmitting = false;
        checkoutButton.disabled = false;
        checkoutButton.textContent = originalButtonText;
      }
    }
  }
}
