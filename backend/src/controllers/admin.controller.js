import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Category from "../models/category.model.js";
import SubCategory from "../models/subcategory.model.js";
import Product from "../models/product.model.js";
import Brand from "../models/brand.model.js";
import asyncHandler from "express-async-handler";

const getDashboardStats = asyncHandler(async (req, res, next) => {
  const numberofProducts = await Product.countDocuments();
  const numberofBrands = await Brand.countDocuments();
  const numberofUsers = await User.countDocuments({ isDeleted: { $ne: true } });
  const numberofCategories = await Category.countDocuments();
  const numberofSubCategories = await SubCategory.countDocuments();
  const numberofOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: "Pending" });

  res.status(200).json({
    products: numberofProducts,
    categories: numberofCategories,
    subcategories: numberofSubCategories,
    brands: numberofBrands,
    users: numberofUsers,
    orders: numberofOrders,
    pendingOrders: pendingOrders,
  });
});

export { getDashboardStats };
