import User from "../models/user.model.js";
import ApiError from "../utils/api-error.js";

const requireActiveAccount = async (req, res, next) => {
  if (!req.auth?.id) {
    return next();
  }

  const activeUser = await User.exists({
    _id: req.auth.id,
    isDeleted: { $ne: true },
  });

  if (!activeUser) {
    return next(new ApiError("This account is no longer active", 401));
  }

  next();
};

export default requireActiveAccount;
