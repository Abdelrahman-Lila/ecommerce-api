import express from "express";
import multer from "multer";
import ApiError from "../utils/api-error.js";
import Product from "../models/product.model.js";
import * as productController from "../controllers/product.controller.js";
import * as productValidator from "../utils/validators/product.validator.js";

const router = express.Router();

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invaid image type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "./uploads/products");
  },
  filename: function async(req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    // const fileName = req.body.title.toLowerCase().split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router
  .route("/")
  .get(productController.getProducts)
  .post(
    uploadOptions.single("imageCover"),
    productValidator.createProductValidator,
    productController.createProduct,
  );

router
  .route("/gallery-images/:id")
  .put(uploadOptions.array("images", 5), productController.uploadImageGallery);

router
  .route("/:id")
  .get(productValidator.getProductValidator, productController.getProduct)
  .put(productValidator.updateProductValidator, productController.updateProduct)
  .delete(
    productValidator.deleteProductValidator,
    productController.deleteProduct,
  );

export default router;
