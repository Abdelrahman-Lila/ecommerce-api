import { check, body } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validation.middleware.js";

const createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Subcategory Name is required")
    .isLength({ min: 2 })
    .withMessage("Subcategory Name is too short")
    .isLength({ max: 32 })
    .withMessage("Subcategory Name is too long")
    .custom((name, { req }) => {
      req.body.slug = slugify(req.body.name);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("You must provide the category")
    .isMongoId()
    .withMessage("Invalid MongoDB Id"),
  validatorMiddleware,
];

const getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid MongoDB Id format"),
  validatorMiddleware,
];

const updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid MongoDB Id format"),
  body("name")
    .optional()
    .custom((title, { req }) => {
      if (req.body.name) {
        req.body.slug = slugify(req.body.name);
        return true;
      }
    }),
  validatorMiddleware,
];

const deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid MongoDB Id format"),
  validatorMiddleware,
];

export {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
};
