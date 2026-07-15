import Brand from "../models/brand.model.js";
import slugify from "slugify";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/api-error.js";
import ApiFeatures from "../utils/api-features.js";
import * as factory from "./factory-handler.controller.js";

const getBrands = factory.getAll(Brand);

const getBrand = factory.getOne(Brand);

const createBrand = factory.createOne(Brand);

const updateBrand = factory.updateOne(Brand);

const deleteBrand = factory.deleteOne(Brand);

export { getBrands, getBrand, createBrand, updateBrand, deleteBrand };
