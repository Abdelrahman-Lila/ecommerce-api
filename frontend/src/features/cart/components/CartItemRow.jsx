import Button from "../../../components/ui/Button.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import { Link } from "react-router";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));

export default function CartItemRow({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-white/75 p-4 shadow-sm sm:flex-row sm:items-center">
      <Link
        to={`/products/${item.id}`}
        className="h-24 w-24 flex-none overflow-hidden rounded-2xl bg-slate-100"
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        ) : null}
      </Link>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Link
              to={`/products/${item.id}`}
              className="text-lg font-semibold text-[var(--text)] hover:underline"
            >
              {item.title}
            </Link>
            <p className="text-sm text-[var(--muted)]">
              {formatPrice(item.price)} each
            </p>
          </div>
          <Badge variant="neutral">Qty {item.quantity}</Badge>
        </div>
        <p className="text-sm text-[var(--muted)]">
          Line total: {formatPrice(item.price * item.quantity)}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onDecrease}
            disabled={item.quantity <= 1}
          >
            -
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onIncrease}
            disabled={item.quantity >= (item.stock || item.quantity)}
          >
            +
          </Button>
        </div>
        <Button variant="ghost" size="sm" onClick={onRemove}>
          Remove
        </Button>
      </div>
    </div>
  );
}
