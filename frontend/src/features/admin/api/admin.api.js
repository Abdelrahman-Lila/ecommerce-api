import apiClient from "../../../api/client.js";
import {
  normalizeCollectionResponse,
  unwrapResponseData,
} from "../../../api/response.js";

export const getUsers = async (params = {}) => {
  const { data } = await apiClient.get("/users", { params });
  return normalizeCollectionResponse(data, "users");
};

export const getUser = async (userId) => {
  const { data } = await apiClient.get(`/users/${userId}`);
  return unwrapResponseData(data);
};

export const updateAdminUser = async (userId, payload) => {
  const { data } = await apiClient.put(`/users/${userId}`, payload);
  return unwrapResponseData(data);
};

export const deleteAdminUser = async (userId) => {
  const { data } = await apiClient.delete(`/users/${userId}`);
  return unwrapResponseData(data);
};

export const createProduct = async (payload) => {
  const { data } = await apiClient.post("/products", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrapResponseData(data);
};

export const updateProduct = async (productId, payload) => {
  const { data } = await apiClient.put(`/products/${productId}`, payload);
  return unwrapResponseData(data);
};

export const deleteProduct = async (productId) => {
  const { data } = await apiClient.delete(`/products/${productId}`);
  return unwrapResponseData(data);
};

export const uploadProductGalleryImages = async (productId, payload) => {
  const { data } = await apiClient.put(
    `/products/gallery-images/${productId}`,
    payload,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return unwrapResponseData(data);
};

export const getAdminOrders = async (params = {}) => {
  const { data } = await apiClient.get("/orders", { params });
  return normalizeCollectionResponse(data, "orders");
};

export const getAdminDashboardStats = async () => {
  const { data } = await apiClient.get("/admin/dashboard/stats");
  return data;
};

export const getAdminOrder = async (orderId) => {
  const { data } = await apiClient.get(`/orders/${orderId}`);
  return unwrapResponseData(data);
};

export const updateAdminOrder = async (orderId, payload) => {
  const { data } = await apiClient.put(`/orders/${orderId}`, payload);
  return unwrapResponseData(data);
};

export const cancelAdminOrder = async (orderId) => {
  const { data } = await apiClient.put(`/orders/${orderId}/cancel`);
  return unwrapResponseData(data);
};

export const deleteAdminOrder = async (orderId) => {
  const { data } = await apiClient.delete(`/orders/${orderId}`);
  return unwrapResponseData(data);
};

export const createCategory = async (payload) => {
  const { data } = await apiClient.post("/categories", payload);
  return unwrapResponseData(data);
};

export const updateCategory = async (categoryId, payload) => {
  const { data } = await apiClient.put(`/categories/${categoryId}`, payload);
  return unwrapResponseData(data);
};

export const deleteCategory = async (categoryId) => {
  const { data } = await apiClient.delete(`/categories/${categoryId}`);
  return unwrapResponseData(data);
};

export const createSubcategory = async (payload) => {
  const { data } = await apiClient.post("/subcategories", payload);
  return unwrapResponseData(data);
};

export const updateSubcategory = async (subcategoryId, payload) => {
  const { data } = await apiClient.put(
    `/subcategories/${subcategoryId}`,
    payload,
  );
  return unwrapResponseData(data);
};

export const deleteSubcategory = async (subcategoryId) => {
  const { data } = await apiClient.delete(`/subcategories/${subcategoryId}`);
  return unwrapResponseData(data);
};

export const createBrand = async ({ name, image }) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("image", image);

  const { data } = await apiClient.post("/brands", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrapResponseData(data);
};

export const updateBrand = async (brandId, payload) => {
  const { data } = await apiClient.put(`/brands/${brandId}`, payload);
  return unwrapResponseData(data);
};

export const deleteBrand = async (brandId) => {
  const { data } = await apiClient.delete(`/brands/${brandId}`);
  return unwrapResponseData(data);
};
