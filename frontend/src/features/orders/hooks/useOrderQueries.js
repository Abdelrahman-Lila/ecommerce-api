import { useQuery } from "@tanstack/react-query";
import { getOrder, getOrders, getUserOrders } from "../api/orders.api.js";

export const orderKeys = {
  all: ["orders"],
  list: (params) => [...orderKeys.all, "list", params],
  detail: (orderId) => [...orderKeys.all, "detail", orderId],
  mine: (userId) => [...orderKeys.all, "mine", userId],
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

export const useUserOrders = (userId) =>
  useQuery({
    queryKey: orderKeys.mine(userId),
    queryFn: () => getUserOrders(userId),
    enabled: Boolean(userId),
  });
