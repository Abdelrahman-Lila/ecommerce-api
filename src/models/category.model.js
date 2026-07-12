import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category is required"],
      unique: true,
      trim: true,
      minlength: [3, "Minimum length for category is: 3"],
      maxlength: [32, "Maximum length for category is: 32"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

const categoryModel = mongoose.model("Category", categorySchema);

export default categoryModel;
