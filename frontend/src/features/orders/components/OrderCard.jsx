import { Link } from "react-router";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import { formatCurrency } from "../../../lib/currency.js";

const statusVariantMap = {
  Pending: "warning",
  Processing: "primary",
  Shipped: "neutral",
  Delivered: "success",
  Cancelled: "danger",
};

export default function OrderCard({ order, productIdsByTitle = {}, onCancel, isCancelling = false }) {
  const orderItems = order?.orderItems ?? [];
  const orderId = order?._id || order?.id;

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-[var(--text)]">
            Order #{orderId}
          </h3>
        </div>
        <Badge variant={statusVariantMap[order?.status] ?? "neutral"}>
          {order?.status ?? "Pending"}
        </Badge>
      </div>

      <div className="grid gap-3 text-sm text-[var(--muted)] sm:grid-cols-2">
        <div>
          <p className="text-[var(--muted)]">Placed</p>
          <p className="font-medium text-[var(--text)]">
            {order?.dateOrdered
              ? new Date(order.dateOrdered).toLocaleString()
              : "Recently"}
          </p>
        </div>
        <div>
          <p className="text-[var(--muted)]">Total</p>
          <p className="font-medium text-[var(--text)]">
            {formatCurrency(order?.totalPrice)}
          </p>
        </div>
        <div>
          <p className="text-[var(--muted)]">Ship to</p>
          <p className="font-medium text-[var(--text)]">
            {order?.shippingAddress}, {order?.city}
          </p>
        </div>
        <div>
          <p className="text-[var(--muted)]">Items</p>
          <p className="font-medium text-[var(--text)]">{orderItems.length}</p>
        </div>
      </div>

      <div className="space-y-2 border-t border-[var(--border)] pt-4 text-sm">
        {orderItems.map((orderItem) => {
          const product = orderItem?.product;
          const productId =
            product?._id || product?.id || productIdsByTitle[product?.title];

          return (
            <div
              key={
                orderItem?._id ??
                product?._id ??
                `${product?.title}-${orderItem?.quantity}`
              }
              className="flex items-center justify-between gap-3"
            >
              <div>
                <p className="font-medium text-[var(--text)]">
                  {product?.title ?? "Product"}
                </p>
                <p className="text-[var(--muted)]">
                  Qty {orderItem?.quantity ?? 0}
                </p>
              </div>
              <Button
                as={Link}
                to={
                  productId
                    ? `/products/${productId}`
                    : `/products?keyword=${encodeURIComponent(product?.title ?? "")}`
                }
                variant="ghost"
                size="sm"
              >
                {productId ? "View" : "Find"}
              </Button>
            </div>
          );
        })}
      </div>

      {order?.status === "Pending" && onCancel ? (
        <div className="flex justify-end border-t border-[var(--border)] pt-4">
          <Button variant="danger" size="sm" onClick={() => onCancel(order)} disabled={isCancelling}>
            {isCancelling ? "Cancelling..." : "Cancel order"}
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
