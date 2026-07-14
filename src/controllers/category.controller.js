import Category from "../models/category.model.js";
import slugify from "slugify";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/api-error.js";
import ApiFeatures from "../utils/api-features.js";

const getCategories = asyncHandler(async (req, res) => {
  const numberofDocuments = await Category.countDocuments();

  let categoryApi = new ApiFeatures(Category.find(), req.query)
    .paginate(numberofDocuments)
    .sort()
    .limitFields()
    .keywordSearch("categories");

  const { mongooseQuery, paginationResult } = categoryApi;

  const categories = await mongooseQuery;
  res.send({
    "Number of Categories": categories.length,
    "current page": paginationResult.currentPage,
    "Number of Pages": paginationResult.numberOfPages,
    data: categories,
  });
});

const getCategory = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const category = await Category.findById(id);
  if (!category) {
    return next(new ApiError("Requested category not found", 404));
  }
  res.status(200).json({ status: "success", data: category });
});

const createCategory = asyncHandler(async (req, res, next) => {
  const categoryName = req.body.name;

  const category = await Category.create({
    name: categoryName,
    slug: slugify(categoryName),
  });
  res.status(201).json({
    status: "success",
    message: "Created Category Successfully",
    data: category,
  });
});

const updateCategory = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const name = req.body.name;

  const category = await Category.findByIdAndUpdate(
    { _id: id },
    { name: name, slug: slugify(name) },
    { returnDocument: "after" },
  );
  if (!category) {
    return next(new ApiError("Requested category not found", 404));
  }
  res
    .status(200)
    .json({ status: "success", message: "Updated category", data: category });
});

const deleteCategory = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return next(new ApiError("Requested category not found", 404));
  }
  res
    .status(200)
    .json({ status: "success", message: "Category deleted", data: category });
});

export {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
