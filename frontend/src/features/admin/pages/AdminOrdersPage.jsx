import { useMemo, useState } from "react";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import EmptyState from "../../../components/ui/EmptyState.jsx";
import ErrorState from "../../../components/ui/ErrorState.jsx";
import LoadingState from "../../../components/ui/LoadingState.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import CatalogPagination from "../../catalog/components/CatalogPagination.jsx";
import { formatCurrency } from "../../../lib/currency.js";
import {
  cancelAdminOrder,
  deleteAdminOrder,
  getAdminOrder,
  getAdminOrders,
  updateAdminOrder,
} from "../api/admin.api.js";
import { getProducts } from "../../catalog/api/catalog.api.js";
import { getUserOrders } from "../../orders/api/orders.api.js";

const statusVariantMap = {
  Pending: "warning",
  Processing: "primary",
  Shipped: "neutral",
  Delivered: "success",
  Cancelled: "danger",
};

const statuses = ["Pending", "Processing", "Shipped", "Delivered"];
const selectClassName =
  "rounded-2xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)] shadow-sm focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(15,118,110,0.18)]";

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedOrderId = searchParams.get("orderId")?.trim() ?? "";
  const [orderIdSearch, setOrderIdSearch] = useState(requestedOrderId);
  const [searchedOrderId, setSearchedOrderId] = useState(requestedOrderId);
  const [page, setPage] = useState(1);
  const ordersQuery = useQuery({
    queryKey: ["admin", "orders", { page }],
    queryFn: () => getAdminOrders({ limit: 10, page, sort: "-dateOrdered" }),
  });
  const searchedOrderQuery = useQuery({
    queryKey: ["admin", "orders", "by-id", searchedOrderId],
    queryFn: () => getAdminOrder(searchedOrderId),
    enabled: Boolean(searchedOrderId),
  });
  const searchedOrderUserId =
    searchedOrderQuery.data?.user?._id || searchedOrderQuery.data?.user?.id || searchedOrderQuery.data?.user;
  const searchedOrderDetailsQuery = useQuery({
    queryKey: ["admin", "orders", "by-id", searchedOrderId, "details"],
    queryFn: async () => {
      const userOrders = await getUserOrders(searchedOrderUserId);
      return (
        userOrders.items.find(
          (order) => (order?._id || order?.id) === searchedOrderId,
        ) ?? searchedOrderQuery.data
      );
    },
    enabled: Boolean(searchedOrderId && searchedOrderUserId),
  });
  const [orderToDelete, setOrderToDelete] = useState(null);
  const updateMutation = useMutation({
    mutationFn: ({ orderId, status }) => updateAdminOrder(orderId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteAdminOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard", "stats"] });
      queryClient.removeQueries({ queryKey: ["orders", "mine"] });
      setOrderIdSearch("");
      setSearchedOrderId("");
      setSearchParams({});
      setOrderToDelete(null);
    },
  });
  const cancelMutation = useMutation({
    mutationFn: cancelAdminOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard", "stats"] });
      queryClient.removeQueries({ queryKey: ["orders", "mine"] });
    },
  });
  const orders = useMemo(
    () => ordersQuery.data?.items ?? [],
    [ordersQuery.data],
  );
  const displayedOrders = useMemo(
    () =>
      searchedOrderId
        ? searchedOrderDetailsQuery.data || searchedOrderQuery.data
          ? [searchedOrderDetailsQuery.data || searchedOrderQuery.data]
          : []
        : orders,
    [
      orders,
      searchedOrderDetailsQuery.data,
      searchedOrderId,
      searchedOrderQuery.data,
    ],
  );
  const productTitles = useMemo(
    () =>
      [
        ...new Set(
          displayedOrders.flatMap((order) =>
            (order?.orderItems ?? [])
              .map((orderItem) => orderItem?.product?.title)
              .filter(Boolean),
          ),
        ),
      ],
    [displayedOrders],
  );
  const productQueries = useQueries({
    queries: productTitles.map((title) => ({
      queryKey: ["catalog", "admin-order-product", title],
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

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateMutation.mutateAsync({ orderId, status });
    } catch {
      // Mutation state renders the API error below the relevant order.
    }
  };
  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(orderToDelete?._id || orderToDelete?.id);
    } catch {
      // Mutation state renders the API error.
    }
  };
  const handleCancel = async (orderId) => {
    try {
      await cancelMutation.mutateAsync(orderId);
    } catch {
      // Mutation state renders the API error below the relevant order.
    }
  };

  const handleOrderSearch = (event) => {
    event.preventDefault();
    const orderId = orderIdSearch.trim();

    if (orderId === searchedOrderId) {
      searchedOrderQuery.refetch();
      return;
    }

    setSearchedOrderId(orderId);
    setSearchParams(orderId ? { orderId } : {});
  };

  const clearOrderSearch = () => {
    setOrderIdSearch("");
    setSearchedOrderId("");
    setSearchParams({});
  };

  if (!searchedOrderId && ordersQuery.isLoading) {
    return <LoadingState label="Loading orders" />;
  }

  if (!searchedOrderId && ordersQuery.isError) {
    return (
      <ErrorState
        error={ordersQuery.error}
        title="Could not load orders"
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Badge variant="warning">Order management</Badge>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
          Orders
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Review placed orders, update their fulfillment status, and remove
          orders when required.
        </p>
      </div>

      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleOrderSearch}>
        <input
          className={`${selectClassName} min-w-0 flex-1`}
          value={orderIdSearch}
          onChange={(event) => setOrderIdSearch(event.target.value)}
          placeholder="Search by order ID"
          aria-label="Search by order ID"
        />
        <Button type="submit" disabled={!orderIdSearch.trim() || searchedOrderQuery.isFetching}>
          Search
        </Button>
        {searchedOrderId ? (
          <Button type="button" variant="secondary" onClick={clearOrderSearch}>
            Clear
          </Button>
        ) : null}
      </form>

      {searchedOrderId && (searchedOrderQuery.isLoading || searchedOrderDetailsQuery.isLoading) ? (
        <LoadingState label="Finding order" />
      ) : searchedOrderId && searchedOrderQuery.isError ? (
        <ErrorState
          error={searchedOrderQuery.error}
          title="Could not find that order"
          onRetry={() => searchedOrderQuery.refetch()}
        />
      ) : displayedOrders.length ? (
        <div className="space-y-5">
          {displayedOrders.map((order) => {
            const orderId = order?._id || order?.id;
            const orderItems = order?.orderItems ?? [];
            const isUpdating =
              updateMutation.isPending && updateMutation.variables?.orderId === orderId;
            const isCancelling =
              cancelMutation.isPending && cancelMutation.variables === orderId;
            const isCancelled = order?.status === "Cancelled";

            return (
              <Card key={orderId} className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--text)]">
                      {order?.user?.name || order?.user?.email || "Customer order"}
                    </h2>
                    <p className="mt-1 break-all text-xs text-[var(--muted)]">
                      Order ID: {orderId}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {order?.dateOrdered
                        ? new Date(order.dateOrdered).toLocaleString()
                        : "No order date"}
                    </p>
                  </div>
                  <Badge variant={statusVariantMap[order?.status] ?? "neutral"}>
                    {order?.status || "Pending"}
                  </Badge>
                </div>

                <div className="grid gap-4 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-[var(--muted)]">Customer email</p>
                    <p className="mt-1 font-medium text-[var(--text)]">
                      {order?.user?.email || "Unavailable"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[var(--muted)]">Delivery address</p>
                    <p className="mt-1 font-medium text-[var(--text)]">
                      {order?.shippingAddress}, {order?.city}, {order?.country}
                    </p>
                  </div>
                  <div>
                    <p className="text-[var(--muted)]">Total</p>
                    <p className="mt-1 text-lg font-semibold text-[var(--text)]">
                      {formatCurrency(order?.totalPrice)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-[var(--border)] pt-4">
                  <p className="text-sm font-medium text-[var(--text)]">Items</p>
                  {orderItems.map((orderItem, index) => (
                    <div
                      key={orderItem?._id || `${orderId}-${index}`}
                      className="flex justify-between gap-4 text-sm"
                    >
                      <span className="text-[var(--text)]">
                        {orderItem?.product?.title || "Product"}
                      </span>
                      <div className="flex items-center gap-3">
                        <Button
                          as={Link}
                          to={
                            productIdsByTitle[orderItem?.product?.title]
                              ? `/products/${productIdsByTitle[orderItem.product.title]}`
                              : `/products?keyword=${encodeURIComponent(orderItem?.product?.title ?? "")}`
                          }
                          variant="secondary"
                          size="sm"
                          className="px-2 py-1 text-xs"
                        >
                          View product
                        </Button>
                        <span className="text-[var(--muted)]">
                          Qty {orderItem?.quantity ?? 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="text-sm font-medium text-[var(--text)]" htmlFor={`order-status-${orderId}`}>
                      Status
                    </label>
                    <select
                      id={`order-status-${orderId}`}
                      className={selectClassName}
                      value={order?.status || "Pending"}
                      disabled={isUpdating || isCancelled}
                      onChange={(event) => handleStatusChange(orderId, event.target.value)}
                    >
                      {isCancelled ? <option value="Cancelled">Cancelled</option> : null}
                      {statuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {order?.status === "Pending" ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCancel(orderId)}
                        disabled={isCancelling}
                      >
                        {isCancelling ? "Cancelling..." : "Cancel order"}
                      </Button>
                    ) : null}
                    {order?.status === "Cancelled" ? (
                      <Button variant="danger" size="sm" onClick={() => setOrderToDelete(order)}>
                        Delete order
                      </Button>
                    ) : null}
                  </div>
                </div>

                {updateMutation.isError && updateMutation.variables?.orderId === orderId ? (
                  <ErrorState error={updateMutation.error} title="Could not update order status" />
                ) : null}
                {cancelMutation.isError && cancelMutation.variables === orderId ? (
                  <ErrorState error={cancelMutation.error} title="Could not cancel order" />
                ) : null}
              </Card>
            );
          })}
          {!searchedOrderId ? (
            <CatalogPagination meta={ordersQuery.data?.meta} onPageChange={setPage} />
          ) : null}
        </div>
      ) : (
        <EmptyState
          title={searchedOrderId ? "No matching order found" : "No orders found"}
          description={searchedOrderId ? "Try another order ID or clear the search." : "Placed orders will appear here for fulfillment management."}
        />
      )}

      <Modal
        open={Boolean(orderToDelete)}
        title="Delete order?"
        onClose={() => setOrderToDelete(null)}
      >
        <div className="space-y-5">
          <p className="text-sm text-[var(--muted)]">
            This permanently removes the order and its order items.
          </p>
          {deleteMutation.isError ? <ErrorState error={deleteMutation.error} title="Could not delete order" /> : null}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setOrderToDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Delete order"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
