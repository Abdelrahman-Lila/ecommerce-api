import Product from "../models/product.model.js";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/api-error.js";
import ApiFeatures from "../utils/api-features.js";
import * as factory from "./factory-handler.controller.js";
import fs from "fs";
import path from "path";

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

// const deleteProduct = factory.deleteOne(Product);
const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return next(new ApiError("Requested product not found", 404));
  }

  if (product.imageCover) {
    const relativePath =
      product.imageCover.split("/uploads/products")[1] || product.imageCover;
    const absolutePath = path.join(
      process.cwd(),
      "uploads/products",
      relativePath,
    );

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  }
  await product.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Product and associated image deleted successfully",
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
