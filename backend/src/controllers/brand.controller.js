import asyncHandler from "express-async-handler";
import fs from "fs";
import path from "path";
import Brand from "../models/brand.model.js";
import Product from "../models/product.model.js";
import * as factory from "./factory-handler.controller.js";
import ApiError from "../utils/api-error.js";

const getBrands = factory.getAll(Brand);

const getBrand = factory.getOne(Brand);

const createBrand = asyncHandler(async (req, res, next) => {
  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/uploads/brands/`;
  req.body.image = `${basePath}${fileName}`;

  const brand = await Brand.create(req.body);
  res.status(201).json({
    status: "success",
    message: "Created brand Successfully",
    data: brand,
  });
});

const updateBrand = factory.updateOne(Brand);

const deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);

  if (!brand) {
    return next(new ApiError("Requested brand not found", 404));
  }

  const productCount = await Product.countDocuments({ brand: id });
  if (productCount) {
    return next(
      new ApiError("This brand is still used by products and cannot be deleted", 409),
    );
  }

  if (brand.image) {
    const relativePath = brand.image.split("/uploads/brands")[1] || brand.image;
    const absolutePath = path.join(
      process.cwd(),
      "uploads/brands",
      relativePath,
    );

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  }
  await brand.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Brand and associated image deleted successfully",
  });
});

export { getBrands, getBrand, createBrand, updateBrand, deleteBrand };
