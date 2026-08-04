import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import "dotenv/config";
import { randomUUID } from "node:crypto";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/api-error.js";

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new ApiError("Stripe Secret Key is required for configuration", 500);
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const getPaymentUrls = (next) => {
  const apiUrl = process.env.API_URL || process.env.URL;
  const frontendUrl = process.env.FRONTEND_URL;

  if (!apiUrl || !frontendUrl) {
    next(
      new ApiError(
        "API_URL (or URL) and FRONTEND_URL must be configured for Checkout",
        500,
      ),
    );
    return null;
  }

  return {
    apiUrl: apiUrl.replace(/\/$/, ""),
    frontendUrl: frontendUrl.replace(/\/$/, ""),
  };
};

const restoreInventoryAndCancelOrder = async (stripeSessionId) => {
  const databaseSession = await Order.startSession();

  try {
    await databaseSession.withTransaction(async () => {
      const order = await Order.findOne({
        stripeSessionId,
        paymentStatus: "unpaid",
      })
        .populate("orderItems")
        .session(databaseSession);

      if (!order) return;

      await Promise.all(
        order.orderItems.map((item) =>
          Product.findByIdAndUpdate(
            item.product,
            { $inc: { quantity: item.quantity, sold: -item.quantity } },
            { session: databaseSession },
          ),
        ),
      );

      order.paymentStatus = "failed";
      order.status = "Cancelled";
      order.checkoutCancelToken = undefined;
      await order.save({ session: databaseSession });
    });
  } finally {
    await databaseSession.endSession();
  }
};

const checkout = asyncHandler(async (req, res, next) => {
  const { orderId } = req.body;
  if (!orderId) return next(new ApiError("order Id is required", 404));

  const order = await Order.findById(orderId).populate({
    path: "orderItems",
    populate: {
      path: "product",
      select: "title price priceAfterDiscount",
    },
  });
  if (!order) return next(new ApiError("Order Not found", 404));

  if (order.user.toString() !== req.auth.id.toString())
    return next(new ApiError("You are not allowed to pay for this order"), 403);
  if (order.status !== "Pending")
    return next(new ApiError("You can only pay for pending orders"));

  const lineItems = order.orderItems.map((orderItem) => {
    if (!orderItem.product)
      throw new ApiError("This item doesn't have a product", 400);
    const price = orderItem.product.price;

    return {
      price_data: {
        currency: (process.env.STRIPE_CURRENCY || "usd").toLowerCase(),
        product_data: { name: orderItem.product.title },
        unit_amount: Math.round(price * 100),
      },
      quantity: orderItem.quantity,
    };
  });

  const paymentUrls = getPaymentUrls(next);
  if (!paymentUrls) return;

  const stripe = getStripe();
  const cancelToken = randomUUID();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    client_reference_id: order.id,
    metadata: { orderId: order.id, userId: req.auth.id },
    success_url: `${paymentUrls.frontendUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${paymentUrls.apiUrl}/api/payment/cancel?token=${cancelToken}`,
  });

  await Order.findByIdAndUpdate(order.id, {
    stripeSessionId: session.id,
    checkoutCancelToken: cancelToken,
  });

  res.status(201).json({
    status: "success",
    data: { sessionId: session.id, checkoutUrl: session.url },
  });
});

const checkoutSuccess = (req, res, next) => {
  const paymentUrls = getPaymentUrls(next);
  if (!paymentUrls) return;

  const sessionId =
    typeof req.query.session_id === "string" ? req.query.session_id : "";
  res.redirect(
    `${paymentUrls.frontendUrl}/checkout/success?session_id=${encodeURIComponent(sessionId)}`,
  );
};

const checkoutCancel = asyncHandler(async (req, res, next) => {
  const token = req.query.token;
  if (!token || typeof token !== "string") {
    return next(new ApiError("A valid cancellation token is required", 400));
  }

  const order = await Order.findOne({
    checkoutCancelToken: token,
    paymentStatus: "unpaid",
    status: "Pending",
  }).select("+checkoutCancelToken");

  if (!order) {
    const paymentUrls = getPaymentUrls(next);
    if (!paymentUrls) return;
    return res.redirect(
      `${paymentUrls.frontendUrl}/checkout/cancel?state=closed`,
    );
  }

  const stripe = getStripe();
  const checkoutSession = await stripe.checkout.sessions.retrieve(
    order.stripeSessionId,
  );

  if (
    checkoutSession.status === "complete" ||
    checkoutSession.payment_status === "paid"
  ) {
    const paymentUrls = getPaymentUrls(next);
    if (!paymentUrls) return;
    return res.redirect(
      `${paymentUrls.frontendUrl}/checkout/success?session_id=${encodeURIComponent(order.stripeSessionId)}`,
    );
  }

  if (checkoutSession.status === "open") {
    await stripe.checkout.sessions.expire(order.stripeSessionId);
  }

  await restoreInventoryAndCancelOrder(order.stripeSessionId);

  const paymentUrls = getPaymentUrls(next);
  if (!paymentUrls) return;
  res.redirect(`${paymentUrls.frontendUrl}/checkout/cancel`);
});

const getCheckoutOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findOne({
    stripeSessionId: req.params.sessionId,
    user: req.auth.id,
  }).populate({
    path: "orderItems",
    populate: { path: "product", select: "title" },
  });

  if (!order) return next(new ApiError("Checkout order not found", 404));

  res.status(200).json({ status: "success", data: order });
});

const stripeWebhook = asyncHandler(async (req, res) => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).send("STRIPE_WEBHOOK_SECRET is not configured");
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    return res
      .status(400)
      .send(`Webhook signature verification failed: ${error.message}`);
  }

  const successfulPaymentEvents = [
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
  ];

  if (successfulPaymentEvents.includes(event.type)) {
    const checkoutSession = event.data.object;

    if (checkoutSession.payment_status === "paid") {
      const paymentIntentId = checkoutSession.payment_intent
        ? String(checkoutSession.payment_intent)
        : undefined;

      const order = await Order.findOneAndUpdate(
        { stripeSessionId: checkoutSession.id },
        {
          $set: {
            paymentStatus: "paid",
            ...(paymentIntentId && { stripePaymentIntentId: paymentIntentId }),
          },
        },
        { new: true },
      );

      if (!order) {
        console.error(
          `No order found for Stripe session ${checkoutSession.id}`,
        );
        return res.status(500).send("Order for Stripe session was not found");
      }
    }
  }

  const inventoryRestoreEvents = [
    "checkout.session.async_payment_failed",
    "checkout.session.expired",
  ];

  if (inventoryRestoreEvents.includes(event.type)) {
    const checkoutSession = event.data.object;
    await restoreInventoryAndCancelOrder(checkoutSession.id);
  }

  res.status(200).json({ received: true });
});

export {
  checkout,
  checkoutSuccess,
  checkoutCancel,
  getCheckoutOrder,
  stripeWebhook,
};
