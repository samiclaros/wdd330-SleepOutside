import { getParam, loadHeaderFooter } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';
import ProductDetails from './ProductDetails.mjs';

const productId = getParam('product');
const dataSource = new ExternalServices(productId);

const product = new ProductDetails(productId, dataSource);
product.init().then((productData) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const label =
    productData.Category.charAt(0).toUpperCase() + productData.Category.slice(1);
  breadcrumb.innerHTML = `<span>${label}</span>`;
});

loadHeaderFooter();
