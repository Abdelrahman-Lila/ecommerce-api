import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/api-error.js";
import ApiFeatures from "../utils/api-features.js";
import bcrypt from "bcrypt";
import validator from "validator";
import generateJWT from "../utils/generate-JWT.js";

const register = asyncHandler(async (req, res) => {
  const salt = 10;
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  req.body.password = hashedPassword;
  req.body.name = `${req.body.firstName} ${req.body.lastName}`;
  req.body.role = "user";
  const user = await User.create(req.body);
  const token = generateJWT(
    { email: user.email, id: user._id, role: user.role },
    "10m",
  );
  const { password, ...safeUser } = user.toObject();
  res.status(201).json({
    status: "success",
    message: "User Registered Successfully",
    token: token,
    data: safeUser,
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

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ApiError("Invalid email or password", 400));
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    return next(new ApiError("Invalid email or password", 400));
  }
  const token = generateJWT(
    { email: user.email, id: user._id, role: user.role },
    "1d",
  );

  res.status(200).json({ message: "Logged in successfully", token: token });
});

const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
  if (!user) {
    return next(new ApiError("Requested user not found", 404));
  }
  res.status(200).json({ status: "success", data: user });
});

const getMyData = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.auth.id);
  if (!user) {
    return next(new ApiError("Requested user not found", 404));
  }
  res.status(200).json({ status: "success", data: user });
});

const getUsers = asyncHandler(async (req, res) => {
  const { email, ...queryWithoutEmail } = req.query;
  const filter = {
    isDeleted: { $ne: true },
    ...(email
    ? {
        email: {
          $regex: email.trim(),
          $options: "i",
        },
      }
    : {}),
  };
  const userApi = new ApiFeatures(User.find(filter), queryWithoutEmail)
    .filter()
    .keywordSearch("");

  const totalCount = await User.countDocuments(userApi.mongooseQuery.getFilter());

  userApi
    .sort()
    .paginate(totalCount)
    .limitFields();

  const { mongooseQuery, paginationResult } = userApi;

  const users = await mongooseQuery;
  res.send({
    totalCount,
    "Number of users": users.length,
    "current page": paginationResult.currentPage,
    "Number of Pages": paginationResult.numberOfPages,
    data: users,
  });
});

const ensureUserCanManageAccount = (req, next) => {
  const isAdmin = req.auth?.role === "admin";
  const isAccountOwner = req.auth?.id === req.params.id;

  if (!isAdmin && !isAccountOwner) {
    next(new ApiError("You can only manage your own account", 403));
    return false;
  }

  return true;
};

const updateUser = asyncHandler(async (req, res, next) => {
  if (!ensureUserCanManageAccount(req, next)) return;

  const allowedFields = [
    "firstName",
    "lastName",
    "phone",
    "street",
    "apartment",
    "city",
    "country",
    "password",
  ];
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => allowedFields.includes(key)),
  );

  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ApiError("Requested user not found", 404));
  }

  if (updates.firstName || updates.lastName) {
    const firstName = updates.firstName ?? user.firstName;
    const lastName = updates.lastName ?? user.lastName;
    updates.name = `${firstName} ${lastName}`.trim();
  }

  user.set(updates);

  await user.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
    data: user,
  });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  if (!ensureUserCanManageAccount(req, next)) return;

  const user = await User.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
  if (!user) {
    return next(new ApiError("Requested user not found", 404));
  }

  const anonymizedEmail = `deleted-${user._id}@deleted.local`;
  user.set({
    firstName: "Deleted",
    lastName: "User",
    name: "Deleted user",
    email: anonymizedEmail,
    phone: "Deleted",
    street: "",
    apartment: "",
    city: "",
    country: "",
    password: await bcrypt.hash(`${user._id}-${Date.now()}`, 10),
    isDeleted: true,
    deletedAt: new Date(),
  });
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Account deleted and personal data anonymized",
  });
});

export {
  register,
  login,
  getUser,
  getMyData,
  getUsers,
  updateUser,
  deleteUser,
};
