import apiClient from "../../../api/client.js";

export const register = async (payload) => {
  const { data } = await apiClient.post("/users/register", payload);
  return data;
};

export const login = async (payload) => {
  const { data } = await apiClient.post("/users/login", payload);
  return data;
};

export const updateUserProfile = async ({ userId, payload }) => {
  const { data } = await apiClient.put(`/users/${userId}`, payload);
  return data?.data ?? null;
};

export const deleteUserAccount = async (userId) => {
  await apiClient.delete(`/users/${userId}`);
};
