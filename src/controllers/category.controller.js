import Category from "../models/category.model.js";
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
