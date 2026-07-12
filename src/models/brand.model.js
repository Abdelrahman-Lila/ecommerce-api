import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand Name is required"],
      unique: true,
      trim: true,
      minlength: [3, "Minimum length for Brand is: 3"],
      maxlength: [32, "Maximum length for Brand is: 32"],
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

const brandModel = mongoose.model("Brand", brandSchema);

export default brandModel;
