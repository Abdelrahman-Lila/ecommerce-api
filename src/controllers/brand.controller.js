import Brand from "../models/brand.model.js";
import * as factory from "./factory-handler.controller.js";

const getBrands = factory.getAll(Brand);

const getBrand = factory.getOne(Brand);

const createBrand = factory.createOne(Brand);

const updateBrand = factory.updateOne(Brand);

const deleteBrand = factory.deleteOne(Brand);

export { getBrands, getBrand, createBrand, updateBrand, deleteBrand };
