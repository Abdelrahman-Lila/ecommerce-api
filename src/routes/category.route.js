import express from "express";
import * as categoryController from "../controllers/category.controller.js";
import * as categoryValidator from "../utils/validators/category.validator.js";
import subCategriesRouter from "./subcategory.route.js";
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

router.use("/:categoryId/subcategories", subCategriesRouter);

export default router;
