import asyncHandler from "express-async-handler";
import ApiError from "../utils/api-error.js";
import ApiFeatures from "../utils/api-features.js";

import Order from "../models/order.model.js";
import OrderItem from "../models/order-item.model.js";
import * as factory from "./factory-handler.controller.js";

const createOrder = asyncHandler(async (req, res) => {
  let orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = await OrderItem.create({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      return newOrderItem._id;
    }),
  );
  const orderItemsIdsResolved = await orderItemsIds;

  const itemsPrices = await Promise.all(
    await orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price",
      );
      const itemPrice = orderItem.product.price * orderItem.quantity;
      return itemPrice;
    }),
  );
  const totalPrice = itemsPrices.reduce((acc, current) => acc + current, 0);

  req.body.orderItems = orderItemsIdsResolved;
  req.body.totalPrice = totalPrice;
  const order = await Order.create(req.body);
  res.status(201).json({
    status: "success",
    message: "Created Order Successfully",
    data: order,
  });
});

const getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("Requested order not found", 404));
  }
  res.status(200).json({ status: "success", data: order });
});

const getOrders = asyncHandler(async (req, res) => {
  const numberofOrders = await Order.countDocuments();

  let orderApi = new ApiFeatures(Order.find(), req.query)
    .paginate(numberofOrders)
    .sort()
    .filter()
    .limitFields()
    .keywordSearch("");

  const { mongooseQuery, paginationResult } = orderApi;

  mongooseQuery
    .populate({
      path: "orderItems",
      select: "-_id -__v",
      populate: {
        path: "product",
        select: "title -_id",
        populate: { path: "category", select: "name -_id" },
      },
    })
    .populate("user", "name email -_id");

  const orders = await mongooseQuery;
  res.send({
    "Number of orders": orders.length,
    "current page": paginationResult.currentPage,
    "Number of Pages": paginationResult.numberOfPages,
    data: orders,
  });
});

const updateOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  const order = await Order.findByIdAndUpdate(id, req.body, {
    returnDocument: "after",
  });
  if (!order) {
    return next(new ApiError("Requested Order not found", 404));
  }
  res
    .status(200)
    .json({ status: "success", message: "Updated Order", data: order });
});

const deleteOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findByIdAndDelete(id);

  if (order) {
    await order.orderItems.map(async (orderItemId) => {
      await OrderItem.findByIdAndDelete(orderItemId);
    });
    res
      .status(200)
      .json({ status: "success", message: `Order Deleted`, data: order });
  } else {
    return next(new ApiError(`Requested Order not found`, 404));
  }
});

export { createOrder, getOrders, getOrder, updateOrder, deleteOrder };
