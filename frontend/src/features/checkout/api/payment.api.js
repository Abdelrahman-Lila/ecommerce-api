import apiClient from "../../../api/client.js";
import { unwrapResponseData } from "../../../api/response.js";

export const createCheckoutSession = async (orderId) => {
  const { data } = await apiClient.post("/payment/checkout", { orderId });
  return unwrapResponseData(data);
};

export const getCheckoutOrder = async (sessionId) => {
  const { data } = await apiClient.get(`/payment/checkout/${sessionId}`);
  return unwrapResponseData(data);
};
