import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { Link } from "react-router";
import PageShell from "../../../components/layout/PageShell.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import LoadingState from "../../../components/ui/LoadingState.jsx";
import ErrorState from "../../../components/ui/ErrorState.jsx";
import EmptyState from "../../../components/ui/EmptyState.jsx";
import { normalizeApiError } from "../../../api/error.js";
import { useAuthSession } from "../../auth/hooks/useAuthSession.js";
import { useUserOrders } from "../hooks/useOrderQueries.js";
import OrderCard from "../components/OrderCard.jsx";
import { getProducts } from "../../catalog/api/catalog.api.js";

export default function OrdersPage() {
  const session = useAuthSession();
  const userId = session.user?.id;
  const ordersQuery = useUserOrders(userId);
  const isNoOrdersResponse =
    ordersQuery.isError && normalizeApiError(ordersQuery.error).status === 404;

  const orders = useMemo(
    () => ordersQuery.data?.items ?? [],
    [ordersQuery.data],
  );
  const productTitles = useMemo(
    () =>
      [
        ...new Set(
          orders.flatMap((order) =>
            (order?.orderItems ?? [])
              .map((orderItem) => orderItem?.product?.title)
              .filter(Boolean),
          ),
        ),
      ],
    [orders],
  );
  const productQueries = useQueries({
    queries: productTitles.map((title) => ({
      queryKey: ["catalog", "order-product", title],
      queryFn: () => getProducts({ keyword: title, limit: 20 }),
      enabled: Boolean(title),
    })),
  });
  const productIdsByTitle = useMemo(
    () =>
      Object.fromEntries(
        productTitles.flatMap((title, index) => {
          const matchingProduct = productQueries[index]?.data?.items?.find(
            (product) =>
              product?.title?.trim().toLocaleLowerCase() ===
              title.trim().toLocaleLowerCase(),
          );
          const productId = matchingProduct?._id || matchingProduct?.id;

          return productId ? [[title, productId]] : [];
        }),
      ),
    [productQueries, productTitles],
  );

  if (ordersQuery.isLoading) {
    return (
      <PageShell className="py-8 sm:py-10">
        <LoadingState label="Loading your orders" />
      </PageShell>
    );
  }

  if (ordersQuery.isError && !isNoOrdersResponse) {
    return (
      <PageShell className="py-8 sm:py-10">
        <ErrorState
          error={ordersQuery.error}
          onRetry={() => window.location.reload()}
        />
      </PageShell>
    );
  }

  if (!orders.length) {
    return (
      <PageShell className="py-8 sm:py-10">
        <EmptyState
          title="No orders yet"
          description="Once you place an order, it will appear here with its status and line items."
          actionLabel="Browse products"
          onAction={() => window.location.assign("/products")}
        />
      </PageShell>
    );
  }

  return (
    <PageShell className="space-y-8 py-8 sm:py-10">
      <div className="space-y-3">
        <Badge variant="primary">Orders</Badge>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
          Your order history
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Review current and past orders from your signed-in session.
        </p>
      </div>

      <div className="space-y-5">
        {orders.map((order) => (
          <OrderCard
            key={order?._id}
            order={order}
            productIdsByTitle={productIdsByTitle}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button as={Link} to="/products">
          Continue shopping
        </Button>
        <Button as={Link} to="/cart" variant="secondary">
          Back to cart
        </Button>
      </div>
    </PageShell>
  );
}
