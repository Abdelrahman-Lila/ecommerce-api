import "dotenv/config";
import express from "express";
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
app.use(express.json());
console.log();
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

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

const server = app.listen(process.env.port, () => {
  console.log(`Listening on port ${process.env.port}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`Rejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`SHUTTING SERVER DOWN....`);
    process.exit(1);
  });
});
