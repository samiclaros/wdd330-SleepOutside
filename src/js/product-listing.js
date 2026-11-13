import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

const category = getParam("category");
const dataSource = new ProductData(category);
const listElement = document.querySelector(".product-list");

const categoryTitle = document.getElementById("categoryTitle");
if (categoryTitle) {
  const categoryName = category
    ? category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Products";
  categoryTitle.textContent = `Top Products: ${categoryName}`;
}

const productList = new ProductList(category, dataSource, listElement);
productList.init();

// Week03 Team Activity, dynamic Header and Footer
loadHeaderFooter();
