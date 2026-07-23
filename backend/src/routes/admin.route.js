import express from "express";
import * as adminController from "../controllers/admin.controller.js";
import requireAdmin from "../middlewares/require-admin.middleware.js";

const router = express.Router();

router
  .route("/dashboard/stats")
  .get(requireAdmin, adminController.getDashboardStats);

export default router;
