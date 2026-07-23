import Product from "../models/product.model.js";
import OrderItem from "../models/order-item.model.js";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/api-error.js";
import ApiFeatures from "../utils/api-features.js";
import deleteLocalFile from "../utils/deleteFile.js";
import * as factory from "./factory-handler.controller.js";

const getProducts = factory.getAll(Product, "products");

const getProduct = factory.getOne(Product);

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
  const { id } = req.params;

  const files = req.files;
  let imagePaths = [];
  const basePath = `${req.protocol}://${req.get("host")}/uploads/products-gallery/`;

  files.map((file) => {
    imagePaths.push(`${basePath}${file.filename}`);
  });

  const product = await Product.findByIdAndUpdate(
    { _id: id },
    { images: imagePaths },
    {
      returnDocument: "after",
    },
  );
  if (!product) {
    return next(new ApiError("Requested product not found", 404));
  }

  const orderItemCount = await OrderItem.countDocuments({ product: id });
  if (orderItemCount) {
    return next(
      new ApiError(
        "This product belongs to existing orders and cannot be deleted",
        409,
      ),
    );
  }
  res.status(200).json({
    status: "success",
    message: "Uploaded images to Product Gallery",
    data: product,
  });
});

const updateProduct = factory.updateOne(Product);

const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return next(new ApiError("Requested product not found", 404));
  }

  deleteLocalFile(product.imageCover);

  if (product.images && Array.isArray(product.images)) {
    product.images.forEach((imageUrl) => {
      deleteLocalFile(imageUrl);
    });
  }

  await product.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Product and associated images deleted successfully",
  });
});

export {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImageGallery,
};
