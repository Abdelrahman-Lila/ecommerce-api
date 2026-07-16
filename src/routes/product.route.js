import express from "express";
import * as productController from "../controllers/product.controller.js";
import * as productValidator from "../utils/validators/product.validator.js";
const router = express.Router();

router
  .route("/")
  .get(productController.getProducts)
  .post(
    productValidator.createProductValidator,
    productController.createProduct,
  );

router
  .route("/:id")
  .get(productValidator.getProductValidator, productController.getProduct)
  .put(productValidator.updateProductValidator, productController.updateProduct)
  .delete(
    productValidator.deleteProductValidator,
    productController.deleteProduct,
  );

export default router;
