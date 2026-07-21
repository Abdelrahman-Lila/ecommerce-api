import express from "express";
import * as subCategoryController from "../controllers/subcategory.controller.js";
import * as subCategoryValidator from "../utils/validators/subcategory.validator.js";
import requireAdmin from "../middlewares/require-admin.middleware.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    subCategoryController.filterToSubCategorySearch,
    subCategoryController.getSubCategories,
  )
  .post(
    requireAdmin,
    subCategoryController.setCategorytoBody,
    subCategoryValidator.createSubCategoryValidator,
    subCategoryController.createSubCategory,
  );

router
  .route("/:id")
  .get(
    subCategoryValidator.getSubCategoryValidator,
    subCategoryController.getSubCategory,
  )
  .put(
    requireAdmin,
    subCategoryValidator.updateSubCategoryValidator,
    subCategoryController.updateSubCategory,
  )
  .delete(
    requireAdmin,
    subCategoryValidator.deleteSubCategoryValidator,
    subCategoryController.deleteSubCategory,
  );

export default router;
