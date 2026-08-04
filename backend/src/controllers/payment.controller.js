import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import "dotenv/config";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/api-error.js";

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new ApiError("Stripe Secret Key is required for configuration", 500);
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
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

  const apiUrl = process.env.URL;
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    client_reference_id: order.id,
    metadata: { orderId: order.id, userId: req.auth.id },
    success_url: `${apiUrl}/api/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${apiUrl}/api/payment/cancel`,
  });

  await Order.findByIdAndUpdate(order.id, {
    stripeSessionId: session.id,
  });

  res.status(201).json({
    status: "success",
    data: { sessionId: session.id, checkoutUrl: session.url },
  });
});

const checkoutSuccess = (req, res) => {
  res
    .status(200)
    .send(
      `<!doctype html><html><body><h1>Payment complete</h1><p>Thank you. Your payment was completed.</p></body></html>`,
    );
};

const checkoutCancel = (req, res) => {
  res
    .status(200)
    .send(
      `<!doctype html><html><body><h1>Payment cancelled</h1><p>No payment was made. You can return to checkout and try again.</p></body></html>`,
    );
};

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

export { checkout, checkoutSuccess, checkoutCancel, stripeWebhook };
