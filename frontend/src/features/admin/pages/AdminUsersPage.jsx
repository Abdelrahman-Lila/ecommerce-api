import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import EmptyState from "../../../components/ui/EmptyState.jsx";
import ErrorState from "../../../components/ui/ErrorState.jsx";
import Input from "../../../components/ui/Input.jsx";
import LoadingState from "../../../components/ui/LoadingState.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import CatalogPagination from "../../catalog/components/CatalogPagination.jsx";
import { formatCurrency } from "../../../lib/currency.js";
import { getUserOrders } from "../../orders/api/orders.api.js";
import {
  deleteAdminUser,
  getUsers,
  updateAdminUser,
} from "../api/admin.api.js";

const getUserId = (user) => user?._id || user?.id;

const getFormValues = (user) => ({
  firstName: user?.firstName ?? "",
  lastName: user?.lastName ?? "",
  phone: user?.phone ?? "",
  street: user?.street ?? "",
  apartment: user?.apartment ?? "",
  city: user?.city ?? "",
  country: user?.country ?? "",
  password: "",
});

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [emailSearch, setEmailSearch] = useState("");
  const [debouncedEmailSearch, setDebouncedEmailSearch] = useState("");
  const [page, setPage] = useState(1);
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedEmailSearch(emailSearch.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [emailSearch]);
  const usersQuery = useQuery({
    queryKey: ["admin", "users", { email: debouncedEmailSearch, page }],
    queryFn: () =>
      getUsers({
        limit: 12,
        page,
        sort: "-createdAt",
        ...(debouncedEmailSearch ? { email: debouncedEmailSearch } : {}),
      }),
  });
  const [editor, setEditor] = useState(null);
  const [form, setForm] = useState(getFormValues());
  const [userToDelete, setUserToDelete] = useState(null);
  const [ordersUser, setOrdersUser] = useState(null);
  const userOrdersQuery = useQuery({
    queryKey: ["admin", "users", getUserId(ordersUser), "orders"],
    queryFn: () => getUserOrders(getUserId(ordersUser)),
    enabled: Boolean(getUserId(ordersUser)),
  });
  const updateMutation = useMutation({
    mutationFn: ({ userId, payload }) => updateAdminUser(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setEditor(null);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setUserToDelete(null);
    },
  });

  const setField = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));
  const openEdit = (user) => {
    setEditor(user);
    setForm(getFormValues(user));
  };
  const handleSave = async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(
      Object.entries(form).filter(([key, value]) =>
        key === "password" ? Boolean(value) : true,
      ),
    );

    try {
      await updateMutation.mutateAsync({
        userId: getUserId(editor),
        payload,
      });
    } catch {
      // Mutation state renders the API error.
    }
  };
  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(getUserId(userToDelete));
    } catch {
      // Mutation state renders the API error.
    }
  };

  if (usersQuery.isLoading) {
    return <LoadingState label="Loading users" />;
  }

  if (usersQuery.isError) {
    return (
      <ErrorState
        error={usersQuery.error}
        title="Could not load users"
        onRetry={() => window.location.reload()}
      />
    );
  }

  const users = usersQuery.data?.items ?? [];

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Badge variant="warning">Customer management</Badge>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
          Users
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Review customer accounts, update permitted profile fields, or remove an
          account when necessary.
        </p>
      </div>

      <div className="max-w-md">
        <Input
          label="Search users by email"
          value={emailSearch}
          onChange={(event) => setEmailSearch(event.target.value)}
          placeholder="Email address"
        />
      </div>

      {users.length ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {users.map((user) => (
            <Card key={getUserId(user)} className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-[var(--text)]">
                    {user?.name || `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Unnamed user"}
                  </h2>
                  <Badge variant={user?.role === "admin" ? "warning" : "neutral"}>
                    {user?.role || "user"}
                  </Badge>
                </div>
                <p className="break-all text-sm text-[var(--muted)]">
                  {user?.email}
                </p>
                <p className="text-sm text-[var(--muted)]">
                  {user?.phone || "No phone"}
                  {user?.city ? ` · ${user.city}` : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" size="sm" onClick={() => setOrdersUser(user)}>
                  View orders
                </Button>
                <Button variant="secondary" size="sm" onClick={() => openEdit(user)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => setUserToDelete(user)}>
                  Delete
                </Button>
              </div>
            </Card>
            ))}
          </div>
          <CatalogPagination meta={usersQuery.data?.meta} onPageChange={setPage} />
        </div>
      ) : (
        <EmptyState
          title={emailSearch ? "No users match that email" : "No users found"}
          description={emailSearch ? "Try another email address or clear the search." : "Registered accounts will appear here."}
          actionLabel={emailSearch ? "Clear search" : undefined}
          onAction={emailSearch ? () => setEmailSearch("") : undefined}
        />
      )}

      <Modal
        open={Boolean(editor)}
        title="Edit user"
        onClose={() => setEditor(null)}
        className="max-h-[calc(100vh-2rem)] max-w-3xl overflow-y-auto"
      >
        <form className="space-y-5" onSubmit={handleSave}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="First name" value={form.firstName} onChange={(event) => setField("firstName", event.target.value)} placeholder="First name" />
            <Input label="Last name" value={form.lastName} onChange={(event) => setField("lastName", event.target.value)} placeholder="Last name" />
            <Input label="Phone" value={form.phone} onChange={(event) => setField("phone", event.target.value)} placeholder="Phone" />
            <Input label="Country" value={form.country} onChange={(event) => setField("country", event.target.value)} placeholder="Country" />
            <Input label="City" value={form.city} onChange={(event) => setField("city", event.target.value)} placeholder="City" />
            <Input label="Apartment" value={form.apartment} onChange={(event) => setField("apartment", event.target.value)} placeholder="Apartment" />
          </div>
          <Input label="Street" value={form.street} onChange={(event) => setField("street", event.target.value)} placeholder="Street" />
          <Input label="New password" type="password" value={form.password} onChange={(event) => setField("password", event.target.value)} placeholder="Leave blank to keep current password" />
          {updateMutation.isError ? <ErrorState error={updateMutation.error} title="Could not update user" /> : null}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setEditor(null)}>Cancel</Button>
            <Button type="submit" disabled={updateMutation.isPending}>{updateMutation.isPending ? "Saving..." : "Save changes"}</Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(ordersUser)}
        title={`Orders for ${ordersUser?.name || ordersUser?.email || "user"}`}
        onClose={() => setOrdersUser(null)}
        className="max-h-[calc(100vh-2rem)] max-w-3xl overflow-y-auto"
      >
        {userOrdersQuery.isLoading ? (
          <LoadingState label="Loading user orders" />
        ) : userOrdersQuery.isError ? (
          <ErrorState
            error={userOrdersQuery.error}
            title="Could not load user orders"
            onRetry={() => userOrdersQuery.refetch()}
          />
        ) : userOrdersQuery.data?.items?.length ? (
          <div className="space-y-4">
            {userOrdersQuery.data.items.map((order) => (
              <Card key={getUserId(order)} className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="break-all text-xs text-[var(--muted)]">
                      Order ID: {getUserId(order)}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {order?.dateOrdered
                        ? new Date(order.dateOrdered).toLocaleString()
                        : "No order date"}
                    </p>
                  </div>
                  <Badge variant={order?.status === "Delivered" ? "success" : "neutral"}>
                    {order?.status || "Pending"}
                  </Badge>
                </div>
                <p className="font-semibold text-[var(--text)]">
                  {formatCurrency(order?.totalPrice)}
                </p>
                <div className="space-y-1 border-t border-[var(--border)] pt-3 text-sm">
                  {(order?.orderItems ?? []).map((item, index) => (
                    <div key={item?._id || index} className="flex justify-between gap-4">
                      <span className="text-[var(--text)]">{item?.product?.title || "Product"}</span>
                      <span className="text-[var(--muted)]">Qty {item?.quantity ?? 0}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end border-t border-[var(--border)] pt-3">
                  <Button
                    as={Link}
                    to={`/admin/orders?orderId=${encodeURIComponent(getUserId(order))}`}
                    variant="secondary"
                    size="sm"
                  >
                    Manage order
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No orders found"
            description="This user has not placed any orders."
          />
        )}
      </Modal>

      <Modal
        open={Boolean(userToDelete)}
        title="Delete user account?"
        onClose={() => setUserToDelete(null)}
      >
        <div className="space-y-5">
          <p className="text-sm text-[var(--muted)]">
            This permanently deletes the account for {userToDelete?.email}. It
            cannot be undone.
          </p>
          {deleteMutation.isError ? <ErrorState error={deleteMutation.error} title="Could not delete user" /> : null}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setUserToDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleteMutation.isPending}>{deleteMutation.isPending ? "Deleting..." : "Delete user"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
