import express from "express";
import * as userController from "../controllers/user.controller.js";

const router = express.Router();

router.route("/").get(userController.getUsers);

router.route("/register").post(userController.register);

router.route("/login").post(userController.login);

export default router;
