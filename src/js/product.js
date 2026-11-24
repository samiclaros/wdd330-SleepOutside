import { getParam, loadHeaderFooter } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';
import ProductDetails from './ProductDetails.mjs';
import { updateBreadcrumb } from './breadcrumb.mjs';

const productId = getParam('product');
const dataSource = new ExternalServices(productId);

const product = new ProductDetails(productId, dataSource);

product.init().then(() => {
  updateBreadcrumb({ category: product.product.Category });
});

loadHeaderFooter();
