import { getLocalStorage } from './utils.mjs'

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
        this.list = getLocalStorage(this.key);
        this.calculateItemSubtotal();
    }

    calculateItemSubtotal() {
        this.itemTotal = this.list.reduce((sum, item) => sum + item.FinalPrice, 0);

        const subtotalElement = document.querySelector(`${this.outputSelector} #subtotal`);
        subtotalElement.innerHTML = `$${this.itemTotal.toFixed(2)}`;
    }

    calculateOrderTotal() {
        // Tax
        this.tax = this.itemTotal * 0.06;
        
        // Shipping
        this.shipping = 0;
        if (this.list.length > 0) {
            this.shipping = 10 + (2 * (this.list.length - 1));
        }

        // Order Total
        this.orderTotal = this.itemTotal + this.tax + this.shipping;
        this.displayOrderTotals();
    }

    displayOrderTotals() {
        // Tax
        const taxElement = document.querySelector(`${this.outputSelector} #tax`);
        taxElement.innerHTML = `$${this.tax.toFixed(2)}`;

        // Shipping
        const shippingElement = document.querySelector(`${this.outputSelector} #shipping`);
        shippingElement.innerHTML = `$${this.shipping.toFixed(2)}`;

        // Order Total
        const orderTotalElement = document.querySelector(`${this.outputSelector} #orderTotal`);
        orderTotalElement.innerHTML = `$${this.orderTotal.toFixed(2)}`;
    }
}