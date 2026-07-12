import "dotenv/config";
import express from "express";
import morgan from "morgan";

import connectDatabase from "./config/database.js";
import ApiError from "./utils/api-error.js";
import globalErrorHandler from "./middlewares/global-error-handler.middleware.js";
import categoriesRouter from "./routes/category.route.js";
import subCategoriesRouter from "./routes/subcategory.route.js";
import brandsRouter from "./routes/brand.route.js";

const app = express();
app.use(express.json());

connectDatabase();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/categories", categoriesRouter);
app.use("/api/subcategories", subCategoriesRouter);
app.use("/api/brands", brandsRouter);

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
