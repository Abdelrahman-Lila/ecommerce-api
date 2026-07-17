import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/api-error.js";
import ApiFeatures from "../utils/api-features.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import generateJWT from "../utils/generate-JWT.js";

const register = asyncHandler(async (req, res) => {
  const salt = 10;
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPassword;
  req.body.name = `${req.body.firstName} ${req.body.lastName}`;
  const user = await User.create(req.body);
  const token = generateJWT(
    { email: user.email, id: user._id, isAdmin: user.isAdmin },
    "10m",
  );
  res.status(201).json({
    status: "success",
    message: "User Registered Successfully",
    token: token,
    data: user,
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError("email and password are required", 400));
  }
  if (!validator.isEmail(email)) {
    return next(new ApiError("Invalid email format", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError("Invalid email or password", 400));
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    return next(new ApiError("Invalid email or password", 400));
  }
  const token = generateJWT(
    { email: user.email, id: user._id, isAdmin: user.isAdmin },
    "1d",
  );

  res.status(200).json({ message: "Logged in successfully", token: token });
});

const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ApiError("Requested user not found", 404));
  }
  res.status(200).json({ status: "success", data: user });
});

const getUsers = asyncHandler(async (req, res) => {
  const numberofUsers = await User.countDocuments();

  let userApi = new ApiFeatures(User.find(), req.query)
    .paginate(numberofUsers)
    .sort()
    .filter()
    .limitFields()
    .keywordSearch("");

  const { mongooseQuery, paginationResult } = userApi;

  const users = await mongooseQuery;
  res.send({
    "Number of users": users.length,
    "current page": paginationResult.currentPage,
    "Number of Pages": paginationResult.numberOfPages,
    data: users,
  });
});

export { register, login, getUser, getUsers };
