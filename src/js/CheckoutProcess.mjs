import { getLocalStorage , alertMessage} from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

function packageItems(items) {
    return items.map((item) => ({
        id: item.Id,
        name: item.Name,
        price: item.FinalPrice,
        quantity: 1
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

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
        this.services = new ExternalServices();
    }

    init() {
        // We verify if we are in the checkout page looking the principal button
        const checkoutButton = document.querySelector('#checkoutSubmit');
        if (!checkoutButton) return;
        this.list = getLocalStorage(this.key);
        this.calculateItemSubtotal();
        document.querySelector('#checkoutSubmit').addEventListener('click', (e) => {
            e.preventDefault();

            const formElement = document.forms['checkout'];
            const check_status = formElement.checkValidity();
            formElement.reportValidity();
            if (check_status) {
                this.checkout();
            }
        });
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

    async checkout() {
        const formElement = document.forms['checkout'];
        const json = formToJSON(formElement);

        json.orderDate = new Date().toISOString();
        json.items = packageItems(this.list);
        json.subtotal = this.itemTotal;
        json.shipping = this.shipping;
        json.tax = this.tax;
        json.orderTotal = this.orderTotal;

        try {
            const res = await this.services.checkout(json);
            console.log(res);

            this.list = localStorage.removeItem(this.key);
            this.list = [];
            window.location.href = '/checkout/success.html';
        } catch (err) {
            console.log(err);

            const errorMessage = err.message.cardNumber || JSON.stringify(err.message);
            alertMessage(errorMessage);
        }
    }
}