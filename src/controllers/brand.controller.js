import Brand from "../models/brand.model.js";
import slugify from "slugify";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/api-error.js";
import ApiFeatures from "../utils/api-features.js";

const getBrands = asyncHandler(async (req, res) => {
  const numberofDocuments = await Brand.countDocuments();

  let brandApi = new ApiFeatures(Brand.find(), req.query)
    .paginate(numberofDocuments)
    .sort()
    .limitFields()
    .keywordSearch("brands");

  const { mongooseQuery, paginationResult } = brandApi;

  const brands = await mongooseQuery;
  res.send({
    "Number of Brands": brands.length,
    "current page": paginationResult.currentPage,
    "Number of Pages": paginationResult.numberOfPages,
    data: brands,
  });
});

const getBrand = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const brand = await Brand.findById(id);
  if (!brand) {
    return next(new ApiError("Requested Brand not found", 404));
  }
  res.status(200).json({ status: "success", data: brand });
});

const createBrand = asyncHandler(async (req, res, next) => {
  const BrandName = req.body.name;

  const brand = await Brand.create({
    name: BrandName,
    slug: slugify(BrandName),
  });
  res.status(201).json({
    status: "success",
    message: "Created Brand Successfully",
    data: brand,
  });
});

const updateBrand = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const name = req.body.name;

  const brand = await Brand.findByIdAndUpdate(
    { _id: id },
    { name: name, slug: slugify(name) },
    { returnDocument: "after" },
  );
  if (!brand) {
    return next(new ApiError("Requested Brand not found", 404));
  }
  res
    .status(200)
    .json({ status: "success", message: "Updated Brand", data: brand });
});

const deleteBrand = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    return next(new ApiError("Requested Brand not found", 404));
  }
  res
    .status(200)
    .json({ status: "success", message: "Brand deleted", data: brand });
});

export { getBrands, getBrand, createBrand, updateBrand, deleteBrand };
