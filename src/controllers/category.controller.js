import Category from "../models/category.model.js";
import slugify from "slugify";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/api-error.js";
import ApiFeatures from "../utils/api-features.js";
import * as factory from "./factory-handler.controller.js";

const getCategories = factory.getAll(Category);

const getCategory = factory.getOne(Category);

const createCategory = factory.createOne(Category);

const updateCategory = factory.updateOne(Category);

const deleteCategory = factory.deleteOne(Category);

export {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
