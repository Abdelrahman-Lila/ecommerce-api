import ApiError from "../utils/api-error.js";

const requireAdmin = (req, res, next) => {
  if (!req.auth) {
    return next(new ApiError("Authentication required", 401));
  }

  if (!req.auth.isAdmin) {
    return next(new ApiError("Admin access only", 403));
  }

  next();
};

export default requireAdmin;
