import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import PageShell from "../../../components/layout/PageShell.jsx";
import Button from "../../../components/ui/Button.jsx";
import EmptyState from "../../../components/ui/EmptyState.jsx";
import ErrorState from "../../../components/ui/ErrorState.jsx";
import Input from "../../../components/ui/Input.jsx";
import LoadingState from "../../../components/ui/LoadingState.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import { useAuthSession } from "../../auth/hooks/useAuthSession.js";
import { useCart } from "../../cart/hooks/useCart.js";
import { useCreateOrderMutation } from "../../orders/hooks/useOrderMutations.js";
import {
  checkoutDefaultValues,
  checkoutSchema,
} from "../schemas/checkout.schema.js";
import CheckoutSummary from "../components/CheckoutSummary.jsx";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const session = useAuthSession();
  const { items, subtotal, clearCart } = useCart();
  const createOrderMutation = useCreateOrderMutation();

  const orderItems = useMemo(
    () =>
      items.map((item) => ({
        product: item.id,
        quantity: item.quantity,
      })),
    [items],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: checkoutDefaultValues,
  });

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      orderItems,
    };

    try {
      const result = await createOrderMutation.mutateAsync(payload);

      if (result) {
        clearCart();
        navigate("/", { replace: true });
      }
    } catch {
      // Mutation state already captures the API error for the UI.
    }
  };

  if (!items.length) {
    return (
      <PageShell className="py-8 sm:py-10">
        <EmptyState
          title="Nothing to checkout"
          description="Your cart is empty, so there is no order to submit."
          actionLabel="Browse products"
          onAction={() => navigate("/products")}
        />
      </PageShell>
    );
  }

  if (createOrderMutation.isPending) {
    return (
      <PageShell className="py-8 sm:py-10">
        <LoadingState label="Placing order" />
      </PageShell>
    );
  }

  return (
    <PageShell className="space-y-8 py-8 sm:py-10">
      <div className="space-y-3">
        <Badge variant="primary">Checkout</Badge>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
          Submit your order
        </h1>
        <p className="text-sm text-[var(--muted)]">
          {session.isAuthenticated
            ? "You are signed in and ready to place the order."
            : "Authentication is required to complete checkout."}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <form
          className="space-y-4 rounded-3xl border border-[var(--border)] bg-white/75 p-6 shadow-sm"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="City"
              placeholder="Austin"
              error={errors.city?.message}
              {...register("city")}
            />
            <Input
              label="Country"
              placeholder="United States"
              error={errors.country?.message}
              {...register("country")}
            />
          </div>
          <Input
            label="Shipping address"
            placeholder="123 Main Street"
            error={errors.shippingAddress?.message}
            {...register("shippingAddress")}
          />
          <Input
            label="Phone"
            placeholder="+1 555 123 4567"
            error={errors.phone?.message}
            {...register("phone")}
          />

          {createOrderMutation.isError ? (
            <ErrorState
              error={createOrderMutation.error}
              title="Could not place order"
            />
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={createOrderMutation.isPending}>
              Place order
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate("/cart")}
            >
              Back to cart
            </Button>
          </div>
        </form>

        <CheckoutSummary items={items} subtotal={subtotal} />
      </div>
    </PageShell>
  );
}
