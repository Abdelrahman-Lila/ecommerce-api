import { useMutation } from "@tanstack/react-query";
import {
  deleteUserAccount,
  login,
  register,
  updateUserProfile,
} from "../api/auth.api.js";
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

export const useUpdateUserProfileMutation = () =>
  useMutation({ mutationFn: updateUserProfile });

export const useDeleteUserAccountMutation = () =>
  useMutation({ mutationFn: deleteUserAccount });

export const useLogout = () => () => clearAccessToken();
