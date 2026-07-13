import Product from "../models/product.model.js";
import slugify from "slugify";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/api-error.js";

const getProducts = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const skip = (page - 1) * limit;
  const products = await Product.find({})
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name -_id" });
  res.send({ page: page, data: products });
});

const getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate({
    path: "category",
    select: "name -_id",
  });
  if (!product) {
    return next(new ApiError("Requested Product not found", 404));
  }
  res.status(200).json({ status: "success", data: product });
});

const createProduct = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);

  const product = await Product.create(req.body);
  res.status(201).json({
    status: "success",
    message: "Created Product Successfully",
    data: product,
  });
});

const updateProduct = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  const product = await Product.findByIdAndUpdate({ _id: id }, req.body, {
    returnDocument: "after",
  });
  if (!product) {
    return next(new ApiError("Requested Product not found", 404));
  }
  res
    .status(200)
    .json({ status: "success", message: "Updated Product", data: product });
});

const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return next(new ApiError("Requested Product not found", 404));
  }
  res
    .status(200)
    .json({ status: "success", message: "Product deleted", data: product });
});

export { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
