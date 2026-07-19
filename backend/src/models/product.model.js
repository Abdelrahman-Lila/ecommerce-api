import mongoose, { mongo } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: [2, "Too short product name"],
      maxLength: [70, "Too long product name"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      minLength: [20, "Too Short Description"],
      maxLength: [2000, "Too long description"],
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [{ type: String }],
    imageCover: {
      type: String,
      required: true,
    },
    images: [{ type: String }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    rating: {
      type: Number,
      min: [1, "minimum rating is: 1"],
      max: [5, "maximum rating is: 5"],
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

productSchema.pre(/^find/, function () {
  this.populate([
    { path: "category", select: "name -_id" },
    { path: "subcategories", select: "name -_id" },
    { path: "brand", select: "name -_id" },
  ]);
});

const productModel = new mongoose.model("Product", productSchema);

export default productModel;
