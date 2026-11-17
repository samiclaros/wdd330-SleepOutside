import { getLocalStorage } from './utils.mjs';
import ExternalServices from '../ExternalServices.mjs';

const services = new ExternalServices();

function formDataToJSON(formElement) {
  const formData = new FormData(formElement),
    convertedJSON = {};
  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  return items.map((item) => {
    return {
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: item.quantity || 1
    };
  });
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
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    const summaryElement = document.querySelector(`${this.outputSelector} #cartTotal`);
    const itemNumElement = document.querySelector(`${this.outputSelector} #num-items`);

    let count = 0;
    this.itemTotal = this.list.reduce((sum, item) => {
      const qty = item.quantity || 1;
      count += qty;
      return sum + (item.FinalPrice * qty);
    }, 0);

    if (itemNumElement) itemNumElement.innerText = count;
    if (summaryElement) summaryElement.innerText = `$${this.itemTotal.toFixed(2)}`;

    this.calculateOrderTotal();
  }

  calculateOrderTotal() {
    let totalQty = this.list.reduce((sum, item) => sum + (item.quantity || 1), 0);
    this.shipping = totalQty > 0 ? 10 + (totalQty - 1) * 2 : 0;

    this.tax = this.itemTotal * 0.06;

    this.orderTotal = this.itemTotal + this.shipping + this.tax;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(`${this.outputSelector} #orderTotal`);

    if (tax) tax.innerText = `$${this.tax.toFixed(2)}`;
    if (shipping) shipping.innerText = `$${this.shipping.toFixed(2)}`;
    if (orderTotal) orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(formElement) {
    const formTR = formDataToJSON(formElement);

    const order = {
      orderDate: new Date().toISOString(),
      fname: formTR.fname,
      lname: formTR.lname,
      street: formTR.street,
      city: formTR.city,
      state: formTR.state,
      zip: formTR.zip,
      cardNumber: formTR.cardNumber,
      expiration: formTR.expiration,
      code: formTR.code,
      items: packageItems(this.list),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping,
      tax: this.tax.toFixed(2)
    };

    try {
      const res = await services.checkout(order);
      console.log('Orden enviada con éxito:', res);
      return res;
    } catch (err) {
      console.error('Error al procesar el checkout:', err);
    }
  }
}
