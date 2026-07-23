import { useQuery } from "@tanstack/react-query";
import { getOrder, getOrders, getUserOrders } from "../api/orders.api.js";

export const orderKeys = {
  all: ["orders"],
  list: (params) => [...orderKeys.all, "list", params],
  detail: (orderId) => [...orderKeys.all, "detail", orderId],
  mine: (userId, params) => [...orderKeys.all, "mine", userId, params],
};

export const useOrders = (params) =>
  useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => getOrders(params),
  });

export const useOrder = (orderId) =>
  useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => getOrder(orderId),
    enabled: Boolean(orderId),
  });

export const useUserOrders = (userId, params = {}) =>
  useQuery({
    queryKey: orderKeys.mine(userId, params),
    queryFn: () => getUserOrders(userId, params),
    enabled: Boolean(userId),
    staleTime: 0,
    refetchOnMount: "always",
  });
