import axios from "axios";

const productsAPI = axios.create({
  baseURL: "http://localhost:8000/api/",
});

export const getProducts = (query) => {
  return query
    ? productsAPI.get(`products/?${query}`)
    : productsAPI.get(`products/`);
};

export const getCategories = () => {
  return productsAPI.get(`categories/`)
};

export const getOneProduct = (slug) => {
  return productsAPI.get(`products/${slug}`);
};

// For discounts, prices and categories filters sidebar left
export const getProductsFilters = (title) => {
  return productsAPI.get(`filters-products/?title=${title}`);
};

export const getProductsSearch = (title) => {
  return productsAPI.get(`search-products/?title=${title}`);
};

export const postProduct = (authToken, body) => {
  return productsAPI.post(`products/`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const putProduct = (authToken, slug, body) => {
  return productsAPI.put(`products/${slug}/`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${authToken}`,
    },
  });
}

export const deleteProduct = (authToken, slug) => {
  return productsAPI.delete(`products/${slug}/`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
}
