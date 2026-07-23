import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],
    shippingAddress: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Total price can't be negative"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dateOrdered: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

orderSchema.index({ user: 1, dateOrdered: -1 });
orderSchema.index({ status: 1, dateOrdered: -1 });

const orderModel = new mongoose.model("Order", orderSchema);

export default orderModel;
