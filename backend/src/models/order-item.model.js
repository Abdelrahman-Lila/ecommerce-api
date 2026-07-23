import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
    min: [1, "Order item quantity must be at least 1"],
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const orderItemModel = new mongoose.model("OrderItem", orderItemSchema);

export default orderItemModel;
