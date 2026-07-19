import { Link, useNavigate } from "react-router";
import PageShell from "../../../components/layout/PageShell.jsx";
import EmptyState from "../../../components/ui/EmptyState.jsx";
import Button from "../../../components/ui/Button.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import {
  clearLatestOrderConfirmation,
  readLatestOrderConfirmation,
} from "../lib/confirmationStorage.js";
import CheckoutSuccessSummary from "../components/CheckoutSuccessSummary.jsx";

export default function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const order = readLatestOrderConfirmation();

  if (!order) {
    return (
      <PageShell className="py-8 sm:py-10">
        <EmptyState
          title="No recent order found"
          description="Open the checkout flow to place a new order and generate a confirmation."
          actionLabel="Browse products"
          onAction={() => navigate("/products")}
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
          We saved the order confirmation locally and cleared your cart. You can
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
            clear the saved confirmation from this screen.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button as={Link} to="/orders">
              View orders
            </Button>
            <Button
              as={Link}
              to="/products"
              variant="secondary"
              onClick={() => clearLatestOrderConfirmation()}
            >
              Continue shopping
            </Button>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              clearLatestOrderConfirmation();
              navigate("/products", { replace: true });
            }}
          >
            Dismiss confirmation
          </Button>
        </Card>
      </div>
    </PageShell>
  );
}
