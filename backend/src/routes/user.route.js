import express from "express";
import * as userController from "../controllers/user.controller.js";
import requireAdmin from "../middlewares/require-admin.middleware.js";

const router = express.Router();

router.route("/").get(requireAdmin, userController.getUsers);

router
  .route("/:id")
  .get(requireAdmin, userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

router.route("/register").post(userController.register);

router.route("/login").post(userController.login);

export default router;
