import Category from "../models/category.model.js";
import SubCategory from "../models/subcategory.model.js";
import Product from "../models/product.model.js";
import * as factory from "./factory-handler.controller.js";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/api-error.js";

const getCategories = factory.getAll(Category);

const getCategory = factory.getOne(Category);

const createCategory = factory.createOne(Category);

const updateCategory = factory.updateOne(Category);

const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    return next(new ApiError(`Category Requested not found`, 404));
  }

  const [subcategoryCount, productCount] = await Promise.all([
    SubCategory.countDocuments({ category: id }),
    Product.countDocuments({ category: id }),
  ]);
  if (subcategoryCount || productCount) {
    return next(
      new ApiError(
        "This category is still used by subcategories or products and cannot be deleted",
        409,
      ),
    );
  }

  await category.deleteOne();
  res
    .status(200)
    .json({ status: "success", message: `Category Deleted`, data: category });
});

export {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
