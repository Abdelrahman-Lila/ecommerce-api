import { expressjwt } from "express-jwt";
import "dotenv/config";

const authJWT = expressjwt({
  secret: process.env.JWT_secret_key,
  algorithms: ["HS256"],
}).unless({
  path: [
    { url: /\/uploads(.*)/, methods: ["GET"] },
    { url: /\/api\/categories(.*)/, methods: ["GET"] },
    { url: /\/api\/subcategories(.*)/, methods: ["GET"] },
    { url: /\/api\/brands(.*)/, methods: ["GET"] },
    { url: /\/api\/products(.*)/, methods: ["GET"] },
    "/api/users/login",
    "/api/users/register",
  ],
});

export default authJWT;
