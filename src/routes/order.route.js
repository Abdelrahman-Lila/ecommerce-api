import express from "express";
import * as orderController from "../controllers/order.controller.js";
const router = express.Router();

router
  .route("/")
  .post(orderController.createOrder)
  .get(orderController.getOrders);

router
  .route("/:id")
  .get(orderController.getOrder)
  .put(orderController.updateOrder)
  .delete(orderController.deleteOrder);

export default router;
