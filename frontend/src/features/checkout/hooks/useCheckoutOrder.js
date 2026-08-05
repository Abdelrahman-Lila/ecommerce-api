import { useQuery } from "@tanstack/react-query";
import { getCheckoutOrder } from "../api/payment.api.js";

export const useCheckoutOrder = (sessionId) =>
  useQuery({
    queryKey: ["payment", "checkout", sessionId],
    queryFn: () => getCheckoutOrder(sessionId),
    enabled: Boolean(sessionId),
    // Stripe may redirect before the webhook changes the order to paid.
    refetchInterval: (query) =>
      query.state.data?.paymentStatus === "unpaid" ? 1500 : false,
  });
