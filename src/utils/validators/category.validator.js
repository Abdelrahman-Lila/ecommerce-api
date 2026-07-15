import validatorMiddleware from "../../middlewares/validation.middleware.js";
import slugify from "slugify";
import { check, body } from "express-validator";

const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category Name is Required")
    .isLength({ min: 3 })
    .withMessage("Name is too short")
    .isLength({ max: 32 })
    .withMessage("Name is too long")
    .custom((name, { req }) => {
      req.body.slug = slugify(req.body.name);
      return true;
    }),
  validatorMiddleware,
];

const getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid MongoDB Id format"),
  validatorMiddleware,
];

const updateCategoryValidator = [
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
