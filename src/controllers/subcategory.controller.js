import slugify from "slugify";
import asyncHandler from "express-async-handler";
import SubCategory from "../models/subcategory.model.js";

const getSubCategories = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const skip = (page - 1) * limit;

  let filter = {};
  if (req.params.categoryId) {
    filter = { category: req.params.categoryId };
  }
  const subCategories = await SubCategory.find(filter)
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name -_id" });

  res.send({ page: page, data: subCategories });
});

const getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id);
  if (!subCategory) {
    return next(new ApiError("Requested SubCategory not found", 404));
  }
  res.status(200).json({ status: "success", data: subCategory });
});

const setCategorytoBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

const createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;

  const subCategory = await SubCategory.create({
    name: name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({
    status: "success",
    message: "Created SubCategory Successfully",
    data: subCategory,
  });
});

const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const subCategory = await SubCategory.findByIdAndUpdate(
    { _id: id },
    { name: name, slug: slugify(name), category: category },
    { returnDocument: "after" },
  );
  if (!subCategory) {
    return next(new ApiError("Requested SubCategory not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Updated SubCategory",
    data: subCategory,
  });
});

const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findByIdAndDelete(id);
  if (!subCategory) {
    return next(new ApiError("Requested SubCategory not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "SubCategory deleted",
    data: subCategory,
  });
});

export {
  getSubCategories,
  getSubCategory,
  setCategorytoBody,
  createSubCategory,
  updateCategory,
  deleteCategory,
};
