import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import PageShell from "../../../components/layout/PageShell.jsx";
import EmptyState from "../../../components/ui/EmptyState.jsx";
import ErrorState from "../../../components/ui/ErrorState.jsx";
import LoadingState from "../../../components/ui/LoadingState.jsx";
import Button from "../../../components/ui/Button.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import CheckoutSuccessSummary from "../components/CheckoutSuccessSummary.jsx";
import { useCheckoutOrder } from "../hooks/useCheckoutOrder.js";
import { useCart } from "../../cart/hooks/useCart.js";
import {
  clearActiveCheckoutSession,
  isActiveCheckoutSession,
} from "../lib/checkoutStorage.js";

export default function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderQuery = useCheckoutOrder(sessionId);
  const { clearCart } = useCart();
  const order = orderQuery.data;

  useEffect(() => {
    if (order?.paymentStatus === "paid" && isActiveCheckoutSession(sessionId)) {
      clearCart();
      clearActiveCheckoutSession();
    }
  }, [clearCart, order?.paymentStatus, sessionId]);

  if (!sessionId) {
    return (
      <PageShell className="py-8 sm:py-10">
        <EmptyState
          title="No Checkout Session found"
          description="Return to checkout and complete payment to view your order confirmation."
          actionLabel="Browse products"
          onAction={() => navigate("/products")}
        />
      </PageShell>
    );
  }

  if (orderQuery.isLoading || order?.paymentStatus === "unpaid") {
    return (
      <PageShell className="py-8 sm:py-10">
        <LoadingState label="Confirming your payment" />
      </PageShell>
    );
  }

  if (orderQuery.isError) {
    return (
      <PageShell className="py-8 sm:py-10">
        <ErrorState error={orderQuery.error} title="Could not load this Checkout Session" />
      </PageShell>
    );
  }

  if (order.paymentStatus !== "paid") {
    return (
      <PageShell className="py-8 sm:py-10">
        <EmptyState
          title="Payment was not completed"
          description="This order was cancelled or the payment could not be completed."
          actionLabel="Return to cart"
          onAction={() => navigate("/cart")}
        />
      </PageShell>
    );
  }

  return (
    <PageShell className="space-y-8 py-8 sm:py-10">
      <div className="space-y-3">
        <Badge variant="success">Success</Badge>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
          Your order is on the way
        </h1>
        <p className="max-w-2xl text-sm text-[var(--muted)]">
          Stripe confirmed your payment and your cart has been cleared. You can
          review the details below or head to your order history.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <CheckoutSuccessSummary order={order} />

        <Card className="h-fit space-y-4">
          <div>
            <p className="text-sm text-[var(--muted)]">Next steps</p>
            <h2 className="text-xl font-semibold text-[var(--text)]">
              Track your order
            </h2>
          </div>
          <p className="text-sm text-[var(--muted)]">
            You can revisit the public catalog, check your order history, or
            continue shopping from the catalog.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button as={Link} to="/orders">
              View orders
            </Button>
            <Button
              as={Link}
              to="/products"
              variant="secondary"
            >
              Continue shopping
            </Button>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
