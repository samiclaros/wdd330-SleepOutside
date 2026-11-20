import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';
import { getParam, loadHeaderFooter } from './utils.mjs';

const category = getParam('category');
const dataSource = new ExternalServices(category);
const listElement = document.querySelector('.product-list');

const productList = new ProductList(category, dataSource, listElement);
productList.init().then((list) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const label =
    category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
  breadcrumb.innerHTML = `<span>${label}</span> <span>→</span> <span>(${list.length} items)</span>`;
});

const personalizedTitle = document.getElementById('category-title');
personalizedTitle.innerHTML = `Top Products: ${category.toUpperCase()}`;

// Week03 Team Activity, dynamic Header and Footer
loadHeaderFooter();
