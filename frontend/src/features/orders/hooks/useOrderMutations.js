import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder, createOrder } from "../api/orders.api.js";

export const useCreateOrderMutation = () =>
  useMutation({
    mutationFn: createOrder,
  });

export const useCancelOrderMutation = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", "mine", userId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard", "stats"] });
    },
  });
};
