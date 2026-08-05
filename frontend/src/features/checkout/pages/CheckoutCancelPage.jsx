import { useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import PageShell from "../../../components/layout/PageShell.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import { clearActiveCheckoutSession } from "../lib/checkoutStorage.js";

export default function CheckoutCancelPage() {
  const [searchParams] = useSearchParams();
  const wasAlreadyClosed = searchParams.get("state") === "closed";

  useEffect(() => {
    clearActiveCheckoutSession();
  }, []);

  return (
    <PageShell className="space-y-8 py-8 sm:py-10">
      <div className="space-y-3">
        <Badge variant="warning">Payment cancelled</Badge>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
          {wasAlreadyClosed ? "This checkout is already closed" : "Your payment was cancelled"}
        </h1>
        <p className="max-w-2xl text-sm text-[var(--muted)]">
          {wasAlreadyClosed
            ? "This Checkout Session is no longer active."
            : "Your order was cancelled and the reserved inventory was returned. Your cart is still available."}
        </p>
      </div>

      <Card className="flex flex-wrap gap-3">
        <Button as={Link} to="/cart">
          Return to cart
        </Button>
        <Button as={Link} to="/products" variant="secondary">
          Continue shopping
        </Button>
      </Card>
    </PageShell>
  );
}
