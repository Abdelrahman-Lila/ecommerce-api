import express from "express";
import multer from "multer";
import * as brandController from "../controllers/brand.controller.js";
import * as brandValidator from "../utils/validators/brand.validator.js";
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
    cb(uploadError, "./uploads/brands");
  },
  filename: function (req, file, cb) {
    const fileName = req.body.name.toLowerCase().split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router
  .route("/")
  .get(brandController.getBrands)
  .post(
    uploadOptions.single("image"),
    brandValidator.createBrandValidator,
    brandController.createBrand,
  );

router
  .route("/:id")
  .get(brandValidator.getBrandValidator, brandController.getBrand)
  .put(brandValidator.updateBrandValidator, brandController.updateBrand)
  .delete(brandValidator.deleteBrandValidator, brandController.deleteBrand);

export default router;
