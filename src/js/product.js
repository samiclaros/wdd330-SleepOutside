import { getParam, loadHeaderFooter } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductDetails from './ProductDetails.mjs';

const productId = getParam('product');
const dataSource = new ProductData(productId);

const product = new ProductDetails(productId, dataSource);
product.init();

loadHeaderFooter();
