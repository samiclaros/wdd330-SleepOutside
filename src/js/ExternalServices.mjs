const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  const data = await res.json();
  if (res.ok) {
    return data;
  } else {
    throw { name : 'servicesError', message: data};
  }
}

export default class ExternalServices {
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async searchProducts(keyword) {
  const response = await fetch(`${baseURL}products`);
  const data = await convertToJson(response);

  const products = Array.isArray(data)
    ? data
    : Array.isArray(data.Result)
      ? data.Result
      : [];

  const searchTerm = keyword.trim().toLowerCase();

  if (!searchTerm) {
    return [];
  }

  return products.filter((product) => {
    const name = product.Name?.toLowerCase() || '';
    const brand = product.Brand?.Name?.toLowerCase() || '';
    const category = product.Category?.toLowerCase() || '';

    return (
      name.includes(searchTerm) ||
      brand.includes(searchTerm) ||
      category.includes(searchTerm)
    );
  });
}

  async findProductById(id) {
    const product = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(product);
    return data.Result;
  }
  
  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    const response = await fetch(`${baseURL}checkout`, options);
    const data = await convertToJson(response);
    return data;
  }
}
