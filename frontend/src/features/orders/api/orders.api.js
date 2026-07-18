import apiClient from "../../../api/client.js";
import {
  normalizeCollectionResponse,
  unwrapResponseData,
} from "../../../api/response.js";

export const createOrder = async (payload) => {
  const { data } = await apiClient.post("/orders", payload);
  return unwrapResponseData(data);
};

export const getUserOrders = async (userId) => {
  const { data } = await apiClient.get(`/orders/get/userorders/${userId}`);
  return normalizeCollectionResponse(data, "orders");
};

export const getOrders = async (params = {}) => {
  const { data } = await apiClient.get("/orders", { params });
  return normalizeCollectionResponse(data, "orders");
};

export const getOrder = async (orderId) => {
  const { data } = await apiClient.get(`/orders/${orderId}`);
  return unwrapResponseData(data);
};
