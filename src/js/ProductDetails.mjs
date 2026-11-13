import { setLocalStorage, getLocalStorage } from './utils.mjs';

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.dataSource = dataSource;
        this.product = {};
    }

    async init() {
        // Here we search the product by its ID
        this.product = await this.dataSource.findProductById(this.productId);
        // Here we set the values of the ID found in the previous step to the HTML elements
        this.renderProductDetails();

        // I connect the "add button" to the shopping cart
        document.getElementById('addToCart').addEventListener('click', this.addProductToCart.bind(this));
    }

    // Here we add the product to the shopping cart. We deleted what is commented on produc.js because that was not working.
    addProductToCart() {
        let cart = getLocalStorage('so-cart');
        if (cart === null || cart === '') {
            cart = [];
        }
        
        cart.push(this.product);
        setLocalStorage('so-cart', cart);
    }

    // Individual activity week03 by Sam Claros
    calculateAndShowDiscount(regularPrice, salePrice) {
        if (regularPrice > salePrice) {
            const savings = regularPrice - salePrice;
            const percentage = Math.round((savings / regularPrice) * 100);
            return percentage;
        }

        return ''; // If there is no discount, we don't return nothing.
    }
    
    // Here we set the values obtained from the product to the HTML elements
    renderProductDetails() {
        document.querySelector('h3').innerText = this.product.Brand.Name;
        document.querySelector('h2').innerText = this.product.NameWithoutBrand;

        const productImage = document.querySelector('.image_divider');
        productImage.src = this.product.Images.PrimaryLarge;
        productImage.alt = this.product.NameWithoutBrand;

        document.querySelector('.product-card__originalPrice').innerText = `Normal Price: $${this.product.SuggestedRetailPrice}`;

        const discountPercent = this.calculateAndShowDiscount(this.product.SuggestedRetailPrice, this.product.FinalPrice);
        const discountElement = document.querySelector('.product-card__discount');
        if (discountElement) {
            if (discountPercent) {
                discountElement.innerText = `${discountPercent}% OFF!`;
            } else {
                discountElement.innerText = '';
            }
        }

        document.querySelector('.product-card__finalPrice').innerText = `Final Price: $${this.product.FinalPrice}`;
        document.querySelector('.product__color').innerText = `Colors available: ${this.product.Colors[0].ColorName}`;
        document.querySelector('.product__description').innerHTML = this.product.DescriptionHtmlSimple;
        document.querySelector('#addToCart').setAttribute('data-id', this.product.Id);
    }
}