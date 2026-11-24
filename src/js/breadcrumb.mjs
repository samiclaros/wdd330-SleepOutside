export function updateBreadcrumb({ category, count }) {
  const breadcrumb = document.querySelector('.breadcrumb');
  if (!breadcrumb) return;

  if (!category) {
    breadcrumb.classList.add('hide');
    return;
  }

  breadcrumb.classList.remove('hide');

  const name = category.charAt(0).toUpperCase() + category.slice(1);

  const categoryEl = breadcrumb.querySelector('[data-breadcrumb="category"]');
  if (categoryEl) categoryEl.textContent = name;

  const countEl = breadcrumb.querySelector('[data-breadcrumb="count"]');
  if (countEl) countEl.textContent = count != null ? `(${count} items)` : '';
}
