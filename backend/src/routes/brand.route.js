import express from "express";
import multer from "multer";
import * as brandController from "../controllers/brand.controller.js";
import * as brandValidator from "../utils/validators/brand.validator.js";
const router = express.Router();

router
  .route("/")
  .get(brandController.getBrands)
  .post(brandValidator.createBrandValidator, brandController.createBrand);

router
  .route("/:id")
  .get(brandValidator.getBrandValidator, brandController.getBrand)
  .put(brandValidator.updateBrandValidator, brandController.updateBrand)
  .delete(brandValidator.deleteBrandValidator, brandController.deleteBrand);

export default router;
