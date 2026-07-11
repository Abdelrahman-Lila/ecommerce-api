import Category from "../models/category.model.js";
import slugify from "slugify";
import asyncHandler from "express-async-handler";

const getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const skip = (page - 1) * limit;
  const categories = await Category.find({}).skip(skip).limit(limit);
  res.send({ page: page, data: categories });
});

const getCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const category = await Category.findById(id);
  if (!category) {
    res
      .status(404)
      .json({ status: "fail", message: "Requested category not found" });
  }
  res.status(200).json({ status: "success", data: category });
});

const createCategory = asyncHandler(async (req, res) => {
  const categoryName = req.body.name;

  const category = await Category.create({
    name: categoryName,
    slug: slugify(categoryName),
  });
  res.status(201).json({
    status: "success",
    message: "Created Category Successfully",
    data: category,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;

  const category = await Category.findByIdAndUpdate(
    { _id: id },
    { name: name, slug: slugify(name) },
    { new: true },
  );
  if (!category) {
    res
      .status(404)
      .json({ status: "fail", message: "Requested category not found" });
  }
  res
    .status(200)
    .json({ status: "success", message: "Updated category", data: category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    res
      .status(404)
      .json({ status: "fail", message: "Requested category not found" });
  }
  res
    .status(200)
    .json({ status: "success", message: "Category deleted", data: category });
});

export {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
