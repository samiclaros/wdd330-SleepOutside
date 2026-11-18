import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { getParam, loadHeaderFooter } from './utils.mjs';




// Week03 Team Activity, dynamic Header and Footer
loadHeaderFooter();

const category = getParam('category');

const validCategories = [
  'tents',
  'backpacks',
  'sleeping-bags',
  'hammocks',
];


const dataSource = new ProductData(category);
const listElement = document.querySelector('.product-list');
const categoryTitle = document.getElementById('category-title');

// Validate the category before requesting products
if (!category || !validCategories.includes(category)) {
  categoryTitle.textContent = 'Category Not Found';

  listElement.innerHTML = `
    <li>
      <p>
        The selected product category is unavailable.
        Please return to the homepage and choose a valid category.
      </p>
      <a href="/">Back to Categories</a>
    </li>
  `;
}else {
  // Display a readable category title
  const formattedCategory = category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  categoryTitle.textContent = `Top Products: ${formattedCategory}`;

  // Load products for the selected category
  const dataSource = new ProductData();

  const productList = new ProductList(
    category,
    dataSource,
    listElement
  );

  productList.init();
}

const productList = new ProductList(category, dataSource, listElement);
productList.init();

const personalizedTitle = document.getElementById('category-title');
personalizedTitle.innerHTML = `Top Products: ${category.toUpperCase()}`;

