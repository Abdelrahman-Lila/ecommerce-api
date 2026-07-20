import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import connectDatabase from "./config/database.js";
import ApiError from "./utils/api-error.js";
import globalErrorHandler from "./middlewares/global-error-handler.middleware.js";
import authJWT from "./middlewares/auth-JWT.middleware.js";

import categoriesRouter from "./routes/category.route.js";
import subCategoriesRouter from "./routes/subcategory.route.js";
import brandsRouter from "./routes/brand.route.js";
import productsRouter from "./routes/product.route.js";
import usersRouter from "./routes/user.route.js";
import ordersRouter from "./routes/order.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  "/uploads/products",
  express.static(path.join(__dirname, "../uploads/products")),
);
app.use(
  "/uploads/brands",
  express.static(path.join(__dirname, "../uploads/brands")),
);
app.use(
  "/uploads/products-gallery",
  express.static(path.join(__dirname, "../uploads/products-gallery")),
);
connectDatabase();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(authJWT);

app.use("/api/categories", categoriesRouter);
app.use("/api/subcategories", subCategoriesRouter);
app.use("/api/brands", brandsRouter);
app.use("/api/products", productsRouter);

app.use("/api/users", usersRouter);
app.use("/api/orders", ordersRouter);

app.use((req, res, next) => {
  next(new ApiError(`This route is not found - "${req.originalUrl}"`, 404));
});

app.use(globalErrorHandler);

const port = process.env.PORT || process.env.port || 3000;

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`Rejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`SHUTTING SERVER DOWN....`);
    process.exit(1);
  });
});
