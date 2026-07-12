import validatorMiddleware from "../../middlewares/validation.middleware.js";
import { check } from "express-validator";

const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category Name is Required")
    .isLength({ min: 3 })
    .withMessage("Name is too short")
    .isLength({ max: 32 })
    .withMessage("Name is too long"),
  validatorMiddleware,
];

const getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid MongoDB Id format"),
  validatorMiddleware,
];

const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid MongoDB Id format"),
  validatorMiddleware,
];

const deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid MongoDB Id format"),
  validatorMiddleware,
];

export {
  createCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
};
