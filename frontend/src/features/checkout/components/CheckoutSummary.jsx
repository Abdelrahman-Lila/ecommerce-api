import { Card } from "../../../components/ui/Card.jsx";
import Badge from "../../../components/ui/Badge.jsx";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));

export default function CheckoutSummary({ items = [], subtotal }) {
  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--muted)]">Order summary</p>
          <h2 className="text-xl font-semibold text-[var(--text)]">
            Review your items
          </h2>
        </div>
        <Badge variant="primary">{items.length} lines</Badge>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-[var(--text)]">
                {item.title}
              </p>
              <p className="text-[var(--muted)]">Qty {item.quantity}</p>
            </div>
            <p className="font-medium text-[var(--text)]">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--border)] pt-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-[var(--muted)]">Total</p>
          <p className="text-2xl font-semibold text-[var(--text)]">
            {formatPrice(subtotal)}
          </p>
        </div>
      </div>
    </Card>
  );
}
