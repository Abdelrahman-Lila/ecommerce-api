import Badge from "../../../components/ui/Badge.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import { formatCurrency } from "../../../lib/currency.js";

export default function CheckoutSuccessSummary({ order }) {
  const totalPrice = order?.totalPrice ?? 0;
  const orderItems = order?.lineItems ?? order?.orderItems ?? [];

  return (
    <Card className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--muted)]">Order confirmation</p>
          <h2 className="text-xl font-semibold text-[var(--text)]">
            Order #{order?._id ?? "saved"}
          </h2>
        </div>
        <Badge variant="success">Confirmed</Badge>
      </div>

      <div className="grid gap-3 rounded-3xl bg-slate-50 p-5 sm:grid-cols-2">
        <div>
          <p className="text-sm text-[var(--muted)]">Total</p>
          <p className="text-2xl font-semibold text-[var(--text)]">
            {formatCurrency(totalPrice)}
          </p>
        </div>
        <div>
          <p className="text-sm text-[var(--muted)]">Items</p>
          <p className="text-2xl font-semibold text-[var(--text)]">
            {orderItems.length}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {orderItems.map((orderItem) => {
          const product = orderItem?.product;
          const title = orderItem?.title ?? product?.title ?? "Order item";
          const quantity = orderItem?.quantity ?? 0;

          return (
            <div
              key={orderItem?._id ?? `${title}-${quantity}`}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <div>
                <p className="font-medium text-[var(--text)]">{title}</p>
                <p className="text-[var(--muted)]">Qty {quantity}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
