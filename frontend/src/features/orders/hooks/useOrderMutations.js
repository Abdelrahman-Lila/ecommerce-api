import { useMutation } from "@tanstack/react-query";
import { createOrder } from "../api/orders.api.js";

export const useCreateOrderMutation = () =>
  useMutation({
    mutationFn: createOrder,
  });
