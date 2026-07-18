import fs from "node:fs";
import "dotenv/config";
import Product from "../../models/product.model.js";
import connectDatabase from "../../config/database.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDatabase();

const productsPath = path.join(__dirname, "products.json");
const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

const insertData = async () => {
  try {
    await Product.create(products);
    console.log("Data Inserted");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data Destroyed");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-i") {
  insertData();
} else if (process.argv[2] === "-d") {
  destroyData();
}
