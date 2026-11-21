import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';
import { getParam, loadHeaderFooter } from './utils.mjs';

const category = getParam('category');
const searchTerm = getParam('search');

const dataSource = new ExternalServices();
const listElement = document.querySelector('.product-list');


// const productList = new ProductList(category, dataSource, listElement);
// productList.init();

const personalizedTitle = document.getElementById('category-title');

async function initializeProducts() {
  if (searchTerm !== null) {
    const keyword = searchTerm.trim();

    personalizedTitle.textContent = `Search Results: ${keyword}`;

    try {
      const products = await dataSource.searchProducts(keyword);

      listElement.innerHTML = '';

      if (products.length === 0) {
        const message = document.createElement('li');
        message.textContent = 'No products found. Try another search term.';
        listElement.appendChild(message);
        return;
      }

      const productList = new ProductList(
        null,
        dataSource,
        listElement
      );

      productList.renderList(products);
    } catch (error) {
      console.error('Product search failed:', error);

      listElement.innerHTML = '';

      const message = document.createElement('li');
      message.textContent = 'Unable to load search results. Please try again.';
      listElement.appendChild(message);
    }

    return;
  }

  if (category) {
    personalizedTitle.textContent = `Top Products: ${category.toUpperCase()}`;

    try {
      const productList = new ProductList(
        category,
        dataSource,
        listElement
      );

      await productList.init();
    } catch (error) {
      console.error('Unable to load category products:', error);
      listElement.innerHTML = '<li>Unable to load products. Please try again.</li>';
    }
  } else {
    personalizedTitle.textContent = 'Products';
    listElement.innerHTML = '<li>Select a category or search for products.</li>';
  }
}

// Week03 Team Activity, dynamic Header and Footer
loadHeaderFooter();
initializeProducts();









