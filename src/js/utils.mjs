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
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
  // If clear is true, we clear the container
  if (clear === true) {
    parentElement.innerHTML = "";
  }

  // We convert the list of information in a big HTML block using the template
  const htmlStrings = list.map(templateFn).join("");

  // We paste the HTML block inside the main container
  parentElement.insertAdjacentHTML(position, htmlStrings)
};

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
  const headerContainer = document.getElementById("dynamicHeader");
  const headerTemplate = await loadTemplate("../partials/header.html");
  renderWithTemplate(headerTemplate, headerContainer);

  const cart = getLocalStorage("so-cart");
  const count = Array.isArray(cart) ? cart.length : 0;
  const counter = document.querySelector(".cart-count");
  if (counter) counter.textContent = count;

  const footerContainer = document.getElementById("dynamicFooter");
  const footerTemplate = await loadTemplate("../partials/footer.html");
  renderWithTemplate(footerTemplate, footerContainer);
}

export function alertMessage(message, scroll = true, type= "error") {
  const main = document.querySelector("main");

  // Prevent errors if the main element does not exist.
  if (!main) return;

  const messageText = String(message);

  // Prevent duplicate alert messages.
  const existingAlerts = main.querySelectorAll(".alert");

  existingAlerts.forEach((existingAlert) => {
    if (
      existingAlert.querySelector("p")?.textContent === messageText &&
      existingAlert.classList.contains(`alert-${type}`)
    ) {
      existingAlert.remove();
    }
  });

  // Create the alert container.
  const alert = document.createElement("div");
  alert.classList.add("alert", `alert-${type}`);

  alert.setAttribute("role", type === "success" ? "status" : "alert");
  // Safely display the message.
  const paragraph = document.createElement("p");
  paragraph.textContent = messageText;

  // Create an accessible close button.
  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.classList.add("alert-close");
  closeButton.textContent = "\u00D7";
  closeButton.setAttribute("aria-label", "Dismiss notification");

  closeButton.addEventListener("click", () => {
    alert.remove();
  });

  // Add the message and close button.
  alert.append(paragraph, closeButton);

  // Display the alert at the top of the main content.
  main.prepend(alert);

  if (scroll) {
    window.scrollTo(0, 0);
  }
}
