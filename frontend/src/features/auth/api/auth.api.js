import apiClient from "../../../api/client.js";

export const register = async (payload) => {
  const { data } = await apiClient.post("/users/register", payload);
  return data;
};

export const login = async (payload) => {
  const { data } = await apiClient.post("/users/login", payload);
  return data;
};
