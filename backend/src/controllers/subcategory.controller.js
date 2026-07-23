import slugify from "slugify";
import asyncHandler from "express-async-handler";
import SubCategory from "../models/subcategory.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/api-error.js";
import ApiFeatures from "../utils/api-features.js";
import * as factory from "./factory-handler.controller.js";
import { updateBrand } from "./brand.controller.js";
import categoryModel from "../models/category.model.js";

const filterToSubCategorySearch = (req, res, next) => {
  let filter = {};
  if (req.params.categoryId) {
    filter = { category: req.params.categoryId };
  }
  req.filterObject = filter;
  next();
};

const getSubCategories = factory.getAll(SubCategory);
// subCategoryApi.mongooseQuery.populate({
//   path: "category",
//   select: "name -_id",
// });

const getSubCategory = factory.getOne(SubCategory);

const setCategorytoBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

const createSubCategory = factory.createOne(SubCategory);

const updateSubCategory = factory.updateOne(SubCategory);

const deleteSubCategory = asyncHandler(async (req, res, next) => {
  const productCount = await Product.countDocuments({ subcategories: req.params.id });
  if (productCount) {
    return next(
      new ApiError(
        "This subcategory is still used by products and cannot be deleted",
        409,
      ),
    );
  }

  const subcategory = await SubCategory.findByIdAndDelete(req.params.id);
  if (!subcategory) {
    return next(new ApiError("Requested document not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Document Deleted",
    data: subcategory,
  });
});

export {
  filterToSubCategorySearch,
  getSubCategories,
  getSubCategory,
  setCategorytoBody,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
