import slugify from "slugify";
import asyncHandler from "express-async-handler";
import SubCategory from "../models/subcategory.model.js";
import ApiFeatures from "../utils/api-features.js";

const getSubCategories = asyncHandler(async (req, res) => {
  const numberofDocuments = await SubCategory.countDocuments();
  let filter = {};
  if (req.params.categoryId) {
    filter = { category: req.params.categoryId };
  }

  let subCategoryApi = new ApiFeatures(SubCategory.find(filter), req.query)
    .paginate(numberofDocuments)
    .sort()
    .limitFields()
    .keywordSearch("subcategories");

  subCategoryApi.mongooseQuery.populate({
    path: "category",
    select: "name -_id",
  });

  const { mongooseQuery, paginationResult } = subCategoryApi;

  const subCategories = await mongooseQuery;
  res.send({
    "Number of SubCategories": subCategories.length,
    "current page": paginationResult.currentPage,
    "Number of Pages": paginationResult.numberOfPages,
    data: subCategories,
  });
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
