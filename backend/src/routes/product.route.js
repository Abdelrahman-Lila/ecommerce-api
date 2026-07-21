import express from "express";
import multer from "multer";
import ApiError from "../utils/api-error.js";
import Product from "../models/product.model.js";
import * as productController from "../controllers/product.controller.js";
import * as productValidator from "../utils/validators/product.validator.js";
import requireAdmin from "../middlewares/require-admin.middleware.js";

const router = express.Router();

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const storage_images = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "./uploads/products-gallery");
  },
  filename: function async(req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    // const fileName = req.body.title.toLowerCase().split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const upload_images = multer({ storage: storage_images });

const storage_cover = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "./uploads/products");
  },
  filename: function async(req, file, cb) {
    // const fileName = file.originalname.split(" ").join("-");
    const fileName = req.body.title.toLowerCase().split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const upload_cover = multer({ storage: storage_cover });

router
  .route("/")
  .get(productController.getProducts)
  .post(
    requireAdmin,
    upload_cover.single("imageCover"),
    productValidator.createProductValidator,
    productController.createProduct,
  );

router
  .route("/gallery-images/:id")
  .put(
    requireAdmin,
    upload_images.array("images", 5),
    productController.uploadImageGallery,
  );

router
  .route("/:id")
  .get(productValidator.getProductValidator, productController.getProduct)
  .put(
    requireAdmin,
    productValidator.updateProductValidator,
    productController.updateProduct,
  )
  .delete(
    requireAdmin,
    productValidator.deleteProductValidator,
    productController.deleteProduct,
  );

export default router;
