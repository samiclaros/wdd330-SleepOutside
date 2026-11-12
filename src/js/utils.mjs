// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// With this, I can get the URL parameters. I change the last line and taked out const product, because as it's a function, I want to return something and not just assign to a variable
export function getParam(param) { 
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// Made on week02
export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  // If clear is true, we clear the container
  if (clear === true) {
    parentElement.innerHTML = "";
  }

  // We convert the list of information in a big HTML block using the template
  const htmlStrings = list.map(templateFn).join('');

  // We paste the HTML block inside the main container
  parentElement.insertAdjacentHTML(position, htmlStrings);

}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Failed to load template "${path}": ${response.status} ${response.statusText}`);
  }

  return response.text();
}

export async function loadHeaderFooter() {
  const [headerTemplate, footerTemplate] = await Promise.all([
    loadTemplate("/partials/header.html"),
    loadTemplate("/partials/footer.html"),
  ]);
  const headerElement = qs("#main-header");
  const footerElement = qs("#main-footer");

  if (!headerElement || !footerElement) {
    throw new Error("Header or footer placeholder is missing from the page.");
  }

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}