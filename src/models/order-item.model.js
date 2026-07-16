import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const orderItemModel = new mongoose.model("OrderItem", orderItemSchema);

export default orderItemModel;
