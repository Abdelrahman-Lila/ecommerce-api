import express from "express";
import * as categoryController from "../controllers/category.controller.js";
import * as categoryValidator from "../utils/validators/category.validator.js";
import subCategriesRouter from "./subcategory.route.js";
import requireAdmin from "../middlewares/require-admin.middleware.js";

const router = express.Router();

router
  .route("/")
  .get(categoryController.getCategories)
  .post(
    requireAdmin,
    categoryValidator.createCategoryValidator,
    categoryController.createCategory,
  );

router
  .route("/:id")
  .get(categoryValidator.getCategoryValidator, categoryController.getCategory)
  .put(
    requireAdmin,
    categoryValidator.updateCategoryValidator,
    categoryController.updateCategory,
  )
  .delete(
    requireAdmin,
    categoryValidator.deleteCategoryValidator,
    categoryController.deleteCategory,
  );

router.use("/:categoryId/subcategories", subCategriesRouter);

export default router;
