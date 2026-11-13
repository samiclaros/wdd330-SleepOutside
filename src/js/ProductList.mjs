import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="../product_pages/index.html?product=${product.Id}">
    <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.Name}" onerror="this.onerror=null; this.src='/images/product-placeholder.svg';">
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    // Here we ask the API the tents.json elements
    const list = await this.dataSource.getData(this.category);

    // Once I have the array, I call another function to draw the information
    this.renderList(list);
  }

  renderList(list) {
    /* // I use .map() calling the new function productCardTemplate
        const htmlStrings = list.map(productCardTemplate);

        // Unify and set them in the DOM
        this.listElement.innerHTML = htmlStrings.join(''); */

    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
