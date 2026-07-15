import asyncHandler from "express-async-handler";
import ApiError from "../utils/api-error.js";
import ApiFeatures from "../utils/api-features.js";

const createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      message: "Created document Successfully",
      data: document,
    });
  });

const getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id);
    if (!document) {
      return next(new ApiError("Requested document not found", 404));
    }
    res.status(200).json({ status: "success", data: document });
  });

const getAll = (Model, modelType = "") =>
  asyncHandler(async (req, res) => {
    const numberofDocuments = await Model.countDocuments();

    let filter = {};
    if (req.filterObject) filter = req.filterObject;

    let modelApi = new ApiFeatures(Model.find(filter), req.query)
      .paginate(numberofDocuments)
      .sort()
      .filter()
      .limitFields()
      .keywordSearch(modelType);

    const { mongooseQuery, paginationResult } = modelApi;

    const documents = await mongooseQuery;
    res.send({
      "Number of documents": documents.length,
      "current page": paginationResult.currentPage,
      "Number of Pages": paginationResult.numberOfPages,
      data: documents,
    });
  });

const updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    });
    if (!document) {
      return next(new ApiError("Requested document not found", 404));
    }
    res
      .status(200)
      .json({ status: "success", message: "Updated Document", data: document });
  });

const deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`Requested  not found`, 404));
    }
    res
      .status(200)
      .json({ status: "success", message: `Document Deleted`, data: document });
  });

export { createOne, getAll, getOne, updateOne, deleteOne };
