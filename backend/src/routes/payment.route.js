import express from "express";
import * as paymentController from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/checkout", paymentController.checkout);
router.get("/checkout/:sessionId", paymentController.getCheckoutOrder);
router.get("/success", paymentController.checkoutSuccess);
router.get("/cancel", paymentController.checkoutCancel);

export default router;
