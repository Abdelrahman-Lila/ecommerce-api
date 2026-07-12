import mongoose, { Mongoose } from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "SubCategory Name is Required"],
      unique: true,
      trim: true,
      minLength: [2, "SubCategory Name is too short"],
      maxLength: [32, "SubCategory Name is too long"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "You must specify the category"],
    },
  },
  { timestamps: true },
);

const subCategoryModel = mongoose.model("SubCategory", subCategorySchema);

export default subCategoryModel;
