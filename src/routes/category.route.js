import * as categoryController from "../controllers/category.controller.js";
import express from "express";
import * as categoryValidator from "../utils/validators/category.validator.js";
const router = express.Router();

router
  .route("/")
  .get(categoryController.getCategories)
  .post(
    categoryValidator.createCategoryValidator,
    categoryController.createCategory,
  );

router
  .route("/:id")
  .get(categoryValidator.getCategoryValidator, categoryController.getCategory)
  .put(
    categoryValidator.updateCategoryValidator,
    categoryController.updateCategory,
  )
  .delete(
    categoryValidator.deleteCategoryValidator,
    categoryController.deleteCategory,
  );

export default router;
