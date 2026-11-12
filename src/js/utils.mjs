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

// TeamActivity Week03. Working on automatizing the header and footer
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerContainer = document.getElementById('dynamicHeader');
  const headerTemplate = await loadTemplate('../partials/header.html');
  renderWithTemplate(headerTemplate, headerContainer);

  const footerContainer = document.getElementById('dynamicFooter');
  const footerTemplate = await loadTemplate('../partials/footer.html');
  renderWithTemplate(footerTemplate, footerContainer);
}