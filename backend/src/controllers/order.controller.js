import asyncHandler from "express-async-handler";
import ApiError from "../utils/api-error.js";
import ApiFeatures from "../utils/api-features.js";

import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import OrderItem from "../models/order-item.model.js";
import * as factory from "./factory-handler.controller.js";

const createOrder = asyncHandler(async (req, res, next) => {
  if (!req.auth?.id) {
    return next(new ApiError("Authentication required", 401));
  }

  if (!Array.isArray(req.body.orderItems) || req.body.orderItems.length === 0) {
    return next(new ApiError("orderItems are required", 400));
  }

  const requestedQuantities = new Map();
  for (const item of req.body.orderItems) {
    const quantity = Number(item?.quantity);
    if (!item?.product || !Number.isInteger(quantity) || quantity < 1) {
      return next(
        new ApiError(
          "Each order item needs a product and a positive quantity",
          400,
        ),
      );
    }
    requestedQuantities.set(
      String(item.product),
      (requestedQuantities.get(String(item.product)) || 0) + quantity,
    );
  }

  const session = await Product.startSession();
  let order;

  try {
    await session.withTransaction(async () => {
      const productsById = new Map();
      for (const [productId, quantity] of requestedQuantities) {
        const product = await Product.findOneAndUpdate(
          { _id: productId, quantity: { $gte: quantity } },
          { $inc: { quantity: -quantity, sold: quantity } },
          { returnDocument: "after", session },
        );
        if (!product) {
          throw new ApiError(
            "A product was not found or does not have enough stock",
            400,
          );
        }
        productsById.set(productId, product);
      }

      const orderItems = await Promise.all(
        req.body.orderItems.map(async (item) => {
          const [orderItem] = await OrderItem.create(
            [{ product: item.product, quantity: Number(item.quantity) }],
            { session },
          );
          return orderItem;
        }),
      );
      const totalPrice = req.body.orderItems.reduce(
        (total, item) =>
          total +
          productsById.get(String(item.product)).price * Number(item.quantity),
        0,
      );
      const [createdOrder] = await Order.create(
        [
          {
            shippingAddress: req.body.shippingAddress,
            city: req.body.city,
            country: req.body.country,
            phone: req.body.phone,
            orderItems: orderItems.map((item) => item._id),
            totalPrice,
            user: req.auth.id,
            status: "Pending",
          },
        ],
        { session },
      );
      order = createdOrder;
    });
  } finally {
    await session.endSession();
  }
  res.status(201).json({
    status: "success",
    message: "Created Order Successfully",
    data: order,
  });
});

const getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
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

  if (!order) {
    return next(new ApiError("Requested order not found", 404));
  }
  res.status(200).json({ status: "success", data: order });
});

const getOrders = asyncHandler(async (req, res) => {
  const orderApi = new ApiFeatures(Order.find(), req.query)
    .sort()
    .filter()
    .limitFields()
    .keywordSearch("");

  const totalCount = await Order.countDocuments(
    orderApi.mongooseQuery.getFilter(),
  );
  orderApi.paginate(totalCount);

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
    totalCount,
    "Number of orders": orders.length,
    "current page": paginationResult.currentPage,
    "Number of Pages": paginationResult.numberOfPages,
    data: orders,
  });
});

const updateOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const allowedStatuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
  ];
  if (!allowedStatuses.includes(req.body.status)) {
    return next(new ApiError("A valid order status is required", 400));
  }

  const order = await Order.findById(id);
  if (!order) {
    return next(new ApiError("Requested Order not found", 404));
  }
  if (order.status === "Cancelled") {
    return next(new ApiError("Cancelled orders cannot be updated", 409));
  }

  order.status = req.body.status;
  await order.save();
  res
    .status(200)
    .json({ status: "success", message: "Updated Order", data: order });
});

const cancelOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const session = await Product.startSession();
  let order;

  try {
    await session.withTransaction(async () => {
      order = await Order.findById(id)
        .populate("orderItems")
        .session(session);

      if (!order) {
        throw new ApiError("Order not found", 404);
      }

      const isAdmin = req.auth?.role === "admin";
      if (!isAdmin && order.user.toString() !== req.auth?.id.toString()) {
        throw new ApiError("You are not authorized to cancel this order", 403);
      }

      if (order.status !== "Pending") {
        throw new ApiError("Only pending orders can be cancelled", 400);
      }

      await Promise.all(
        order.orderItems.map((item) =>
          Product.findByIdAndUpdate(
            item.product,
            { $inc: { quantity: item.quantity, sold: -item.quantity } },
            { session },
          ),
        ),
      );
      order.status = "Cancelled";
      await order.save({ session });
    });
  } finally {
    await session.endSession();
  }

  res.status(200).json({
    status: "success",
    message: "Order cancelled successfully and inventory restored",
    data: order,
  });
});

const deleteOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);

  if (!order) {
    return next(new ApiError(`Requested Order not found`, 404));
  }

  if (order.status !== "Cancelled") {
    return next(
      new ApiError("Only cancelled orders can be permanently deleted", 409),
    );
  }

  await Promise.all(
    order.orderItems.map((orderItemId) =>
      OrderItem.findByIdAndDelete(orderItemId),
    ),
  );
  await order.deleteOne();
  res
    .status(200)
    .json({ status: "success", message: `Order Deleted`, data: order });
});

const ensureUserCanManageAccount = (req, next) => {
  const isAdmin = req.auth?.role === "admin";
  const isAccountOwner = req.auth?.id === req.params.userid;

  if (!isAdmin && !isAccountOwner) {
    next(new ApiError("You can only manage your own account", 403));
    return false;
  }

  return true;
};

const getUserOrders = asyncHandler(async (req, res, next) => {
  if (!ensureUserCanManageAccount(req, next)) return;

  const baseFilter = { user: req.params.userid };
  const orderApi = new ApiFeatures(Order.find(baseFilter), req.query)
    .filter()
    .keywordSearch("")
    .sort()
    .limitFields();
  const totalCount = await Order.countDocuments(orderApi.mongooseQuery.getFilter());
  orderApi.paginate(totalCount);

  const userOrderList = await orderApi.mongooseQuery
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

  if (!userOrderList || userOrderList.length === 0) {
    return res.status(200).json({
      status: "success",
      message: "User Orders",
      totalCount,
      "current page": orderApi.paginationResult.currentPage,
      "Number of Pages": orderApi.paginationResult.numberOfPages,
      data: [],
    });
  }

  res.status(200).json({
    status: "success",
    message: `User Orders`,
    totalCount,
    "current page": orderApi.paginationResult.currentPage,
    "Number of Pages": orderApi.paginationResult.numberOfPages,
    data: userOrderList,
  });
});

export {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  getUserOrders,
  cancelOrder,
};
