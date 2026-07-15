import express from "express";
import * as subCategoryController from "../controllers/subcategory.controller.js";
import * as subCategoryValidator from "../utils/validators/subcategory.validator.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    subCategoryController.filterToSubCategorySearch,
    subCategoryController.getSubCategories,
  )
  .post(
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
    subCategoryValidator.updateSubCategoryValidator,
    subCategoryController.updateSubCategory,
  )
  .delete(
    subCategoryValidator.deleteSubCategoryValidator,
    subCategoryController.deleteSubCategory,
  );

export default router;
