import express from "express";
import * as orderController from "../controllers/order.controller.js";
import requireAdmin from "../middlewares/require-admin.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(orderController.createOrder)
  .get(requireAdmin, orderController.getOrders);

router
  .route("/:id")
  .get(requireAdmin, orderController.getOrder)
  .put(requireAdmin, orderController.updateOrder)
  .delete(requireAdmin, orderController.deleteOrder);

router.route(`/get/userorders/:userid`).get(orderController.getUserOrders);

export default router;
