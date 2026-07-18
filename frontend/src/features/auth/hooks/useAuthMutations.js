import { useMutation } from "@tanstack/react-query";
import { login, register } from "../api/auth.api.js";
import { clearAccessToken, setAccessToken } from "../lib/authStorage.js";

export const useLoginMutation = () =>
  useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data?.token) {
        setAccessToken(data.token);
      }
    },
  });

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      if (data?.token) {
        setAccessToken(data.token);
      }
    },
  });

export const useLogout = () => () => clearAccessToken();
