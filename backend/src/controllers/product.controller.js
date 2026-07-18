import Product from "../models/product.model.js";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/api-error.js";
import ApiFeatures from "../utils/api-features.js";
import * as factory from "./factory-handler.controller.js";

const getProducts = factory.getAll(Product, "products");
// productApi.mongooseQuery
//   .populate({ path: "category", select: "name -_id" })
//   .populate({ path: "subcategories", select: "name -_id" });

const getProduct = factory.getOne(Product);
// .populate({
//     path: "category",
//     select: "name -_id",
//   });

const createProduct = asyncHandler(async (req, res, next) => {
  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/uploads/products/`;
  req.body.imageCover = `${basePath}${fileName}`;

  const product = await Product.create(req.body);
  res.status(201).json({
    status: "success",
    message: "Created Product Successfully",
    data: product,
  });
});

const uploadImageGallery = asyncHandler(async (req, res, next) => {
  const files = req.files;
  let imagePaths = [];
  const basePath = `${req.protocol}://${req.get("host")}/uploads/`;

  files.map((file) => {
    imagePaths.push(`${basePath}${file.filename}`);
  });

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { images: imagePaths },
    {
      returnDocument: "after",
    },
  );
  if (!product) {
    return next(new ApiError("Requested product not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Uploaded images to Product Gallery",
    data: product,
  });
});

const updateProduct = factory.updateOne(Product);

const deleteProduct = factory.deleteOne(Product);

export {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImageGallery,
};
