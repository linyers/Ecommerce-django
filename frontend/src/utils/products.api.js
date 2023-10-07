import axios from "axios";

const productsAPI = axios.create({
  baseURL: "http://localhost:8000/api/",
});

export const getProducts = (query) => {
  return query
    ? productsAPI.get(`products/?${query}`)
    : productsAPI.get(`products/`);
};

export const getOneProduct = (slug) => {
  return productsAPI.get(`products/${slug}`)
};

export const getProductsFilters = (title) => {
  return productsAPI.get(`filters-products/?title=${title}`)
};

export const getProductsSearch = (title) => {
  return productsAPI.get(`search-products/?title=${title}`)
};