import { Link, useNavigate } from "react-router";
import PageShell from "../../../components/layout/PageShell.jsx";
import EmptyState from "../../../components/ui/EmptyState.jsx";
import Button from "../../../components/ui/Button.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import { useAuthSession } from "../../auth/hooks/useAuthSession.js";
import { useCart } from "../hooks/useCart.js";
import CartItemRow from "../components/CartItemRow.jsx";
import { formatCurrency } from "../../../lib/currency.js";

export default function CartPage() {
  const navigate = useNavigate();
  const {
    items,
    subtotal,
    itemCount,
    updateItemQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const session = useAuthSession();

  if (!items.length) {
    return (
      <PageShell className="py-8 sm:py-10">
        <EmptyState
          title="Your cart is empty"
          description="Add products from the catalog to start building an order."
          actionLabel="Browse products"
          onAction={() => navigate("/products")}
        />
      </PageShell>
    );
  }

  return (
    <PageShell className="space-y-8 py-8 sm:py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Badge variant="primary">Cart</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            Shopping cart
          </h1>
          <p className="text-sm text-[var(--muted)]">
            {itemCount} item{itemCount === 1 ? "" : "s"} in your cart.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button as={Link} to="/products" variant="secondary">
            Continue shopping
          </Button>
          <Button variant="ghost" onClick={clearCart}>
            Clear cart
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onIncrease={() => updateItemQuantity(item.id, item.quantity + 1)}
              onDecrease={() => updateItemQuantity(item.id, item.quantity - 1)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </div>

        <Card className="h-fit space-y-5">
          <div>
            <p className="text-sm text-[var(--muted)]">Subtotal</p>
            <p className="text-3xl font-semibold text-[var(--text)]">
              {formatCurrency(subtotal)}
            </p>
          </div>

          <div className="space-y-3 text-sm text-[var(--muted)]">
            <p>Proceed to checkout when you are ready to submit the order.</p>
            <p>
              {session.isAuthenticated
                ? "You are signed in."
                : "You will be asked to sign in before checkout."}
            </p>
          </div>

          <Button as={Link} to="/checkout" className="w-full">
            Checkout
          </Button>
        </Card>
      </div>
    </PageShell>
  );
}
