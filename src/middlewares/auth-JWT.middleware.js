import { expressjwt } from "express-jwt";
import "dotenv/config";

const isRevoked = async (req, token) => {
  if (token.payload.isAdmin) {
    return false;
  }
  return true;
};

const authJWT = expressjwt({
  secret: process.env.JWT_secret_key,
  algorithms: ["HS256"],
  isRevoked: isRevoked,
}).unless({
  path: [
    { url: /\/api\/categories(.*)/, methods: ["GET"] },
    { url: /\/api\/subcategories(.*)/, methods: ["GET"] },
    { url: /\/api\/brands(.*)/, methods: ["GET"] },
    { url: /\/api\/products(.*)/, methods: ["GET"] },
    "/api/users/login",
    "/api/users/register",
    "/api/orders",
  ],
});

export default authJWT;
