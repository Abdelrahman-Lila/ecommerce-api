import apiClient from "../../../api/client.js";
import {
  normalizeCollectionResponse,
  unwrapResponseData,
} from "../../../api/response.js";

export const getCategories = async (params = {}) => {
  const { data } = await apiClient.get("/categories", { params });
  return normalizeCollectionResponse(data, "categories");
};

export const getCategory = async (categoryId) => {
  const { data } = await apiClient.get(`/categories/${categoryId}`);
  return unwrapResponseData(data);
};

export const getSubcategories = async (params = {}) => {
  const { data } = await apiClient.get("/subcategories", { params });
  return normalizeCollectionResponse(data, "subcategories");
};

export const getCategorySubcategories = async (categoryId, params = {}) => {
  const { data } = await apiClient.get(
    `/categories/${categoryId}/subcategories`,
    {
      params,
    },
  );
  return normalizeCollectionResponse(data, "subcategories");
};

export const getSubcategory = async (subcategoryId) => {
  const { data } = await apiClient.get(`/subcategories/${subcategoryId}`);
  return unwrapResponseData(data);
};

export const getBrands = async (params = {}) => {
  const { data } = await apiClient.get("/brands", { params });
  return normalizeCollectionResponse(data, "brands");
};

export const getBrand = async (brandId) => {
  const { data } = await apiClient.get(`/brands/${brandId}`);
  return unwrapResponseData(data);
};

export const getProducts = async (params = {}) => {
  const { data } = await apiClient.get("/products", { params });
  return normalizeCollectionResponse(data, "products");
};

export const getProduct = async (productId) => {
  const { data } = await apiClient.get(`/products/${productId}`);
  return unwrapResponseData(data);
};
