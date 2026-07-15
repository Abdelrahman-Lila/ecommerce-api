import slugify from "slugify";
import asyncHandler from "express-async-handler";
import SubCategory from "../models/subcategory.model.js";
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

const deleteSubCategory = factory.deleteOne(SubCategory);

export {
  filterToSubCategorySearch,
  getSubCategories,
  getSubCategory,
  setCategorytoBody,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
