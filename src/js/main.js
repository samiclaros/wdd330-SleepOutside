import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

console.log('1. main.js iniciado correctamente');

const dataSource = new ProductData('tents');
const listElement = document.querySelector('.product-list');

console.log('2. Elemento contenedor encontrado:', listElement);

const productList = new ProductList('tents', dataSource, listElement);
productList.init();