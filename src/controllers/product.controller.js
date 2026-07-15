import Product from "../models/product.model.js";
import slugify from "slugify";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/api-error.js";
import ApiFeatures from "../utils/api-features.js";
import * as factory from "./factory-handler.controller.js";

const getProducts = factory.getAll(Product, "products");
// productApi.mongooseQuery
//   .populate({ path: "category", select: "name -_id" })
//   .populate({ path: "subcategories", select: "name -_id" });

const getProduct = factory.getOne(Product);
// .populate({
//     path: "category",
//     select: "name -_id",
//   });

const createProduct = factory.createOne(Product);

const updateProduct = factory.updateOne(Product);

const deleteProduct = factory.deleteOne(Product);

export { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
