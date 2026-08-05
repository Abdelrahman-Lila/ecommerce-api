import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
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
import { createCheckoutSession } from "../api/payment.api.js";
import { saveActiveCheckoutSession } from "../lib/checkoutStorage.js";
import {
  checkoutDefaultValues,
  checkoutSchema,
} from "../schemas/checkout.schema.js";
import CheckoutSummary from "../components/CheckoutSummary.jsx";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const session = useAuthSession();
  const { items, subtotal } = useCart();
  const createOrderMutation = useCreateOrderMutation();
  const checkoutMutation = useMutation({ mutationFn: createCheckoutSession });

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
      const orderId = result?._id ?? result?.id;
      const checkout = await checkoutMutation.mutateAsync(orderId);

      saveActiveCheckoutSession(checkout.sessionId);
      window.location.assign(checkout.checkoutUrl);
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

  if (createOrderMutation.isPending || checkoutMutation.isPending) {
    return (
      <PageShell className="py-8 sm:py-10">
        <LoadingState
          label={
            checkoutMutation.isPending
              ? "Opening secure payment"
              : "Creating your order"
          }
        />
      </PageShell>
    );
  }

  return (
    <PageShell className="space-y-8 py-8 sm:py-10">
      <div className="space-y-3">
        <Badge variant="primary">Checkout</Badge>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
          Continue to payment
        </h1>
        <p className="text-sm text-[var(--muted)]">
          {session.isAuthenticated
            ? "You are signed in and ready to place the order."
            : "Your order will be created before secure payment opens."}
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
              placeholder="City"
              error={errors.city?.message}
              {...register("city")}
            />
            <Input
              label="Country"
              placeholder="Country"
              error={errors.country?.message}
              {...register("country")}
            />
          </div>
          <Input
            label="Shipping address"
            placeholder="Shipping address"
            error={errors.shippingAddress?.message}
            {...register("shippingAddress")}
          />
          <Input
            label="Phone"
            placeholder="Phone"
            error={errors.phone?.message}
            {...register("phone")}
          />

          {createOrderMutation.isError || checkoutMutation.isError ? (
            <ErrorState
              error={createOrderMutation.error ?? checkoutMutation.error}
              title="Could not start secure payment"
            />
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              disabled={createOrderMutation.isPending || checkoutMutation.isPending}
            >
              Continue to payment
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
