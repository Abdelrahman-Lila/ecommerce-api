import validatorMiddleware from "../../middlewares/validation.middleware.js";
import { check } from "express-validator";
import Category from "../../models/category.model.js";
import SubCategory from "../../models/subcategory.model.js";

const createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 2 })
    .withMessage("Product Name is too short")
    .isLength({ max: 70 })
    .withMessage("Product Name is too long"),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 20 })
    .withMessage("Product Description is too short")
    .isLength({ max: 2000 })
    .withMessage("Product Description is too long"),
  check("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must be a number"),
  check("sold").optional().isNumeric().withMessage("must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Must provide product price")
    .isFloat()
    .withMessage("Price must be a number"),
  check("priceAfterDiscount")
    .optional()
    .custom((input, { req }) => {
      if (input >= req.body.price) {
        throw Error("Price After Discount must be less than original price");
      }
      return true;
    }),
  check("colors").optional().isArray().withMessage("colors must be an array"),
  check("imageCover").notEmpty().withMessage("Cover Image is required"),
  check("images").optional().isArray().withMessage("images must be an array"),
  check("category")
    .notEmpty()
    .withMessage("category must be specified")
    .isMongoId()
    .withMessage("Invalid MongoDB Id Format")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error("Category Not Found in Database");
      }
    }),
  check("subcategories")
    .optional()
    .isArray()
    .isMongoId()
    .withMessage("Invalid MongoDB Id Format")
    .custom(async (subCategoriesQuery) => {
      const subCategoriesFound = await SubCategory.find({
        _id: { $in: subCategoriesQuery },
      });
      if (subCategoriesFound.length !== subCategoriesQuery.length) {
        throw new Error("SubCategories Ids are not found in Database");
      }
    })

    .custom(async (subCategoriesIds, { req }) => {
      let subCategoriesofCategory = await SubCategory.find({
        category: req.body.category,
      });
      subCategoriesofCategory = subCategoriesofCategory.map((item) =>
        item._id.toString(),
      );
      if (
        !subCategoriesIds.every((item) =>
          subCategoriesofCategory.includes(item.toString()),
        )
      ) {
        throw new Error("SubCategories doesn't belong to Category");
      }
    }),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid MongoDB Id Format"),
  check("rating")
    .optional()
    .isNumeric()
    .withMessage("Rating must be a number")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be from 1 to 5"),
  check("ratingsCount").optional().isNumeric().withMessage("Must be a number"),
  validatorMiddleware,
];

const getProductValidator = [
  check("id").isMongoId().withMessage("Invalid MongoDB Id format"),
  validatorMiddleware,
];

const updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid MongoDB Id format"),
  validatorMiddleware,
];

const deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid MongoDB Id format"),
  validatorMiddleware,
];

export {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
};
