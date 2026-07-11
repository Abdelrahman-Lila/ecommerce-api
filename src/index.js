import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import categoriesRouter from "./routes/category.route.js";

const app = express();
app.use(express.json());

try {
  await mongoose.connect(process.env.databaseUrl);
  console.log("Connection successful");
} catch (error) {
  console.error(`Error: ${error}`);
}

app.use("/api/categories", categoriesRouter);

app.listen(process.env.port, () => {
  console.log(`Listening on port ${process.env.port}`);
});
