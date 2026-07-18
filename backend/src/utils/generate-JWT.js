import "dotenv/config";
import jwt from "jsonwebtoken";

const generateJWT = (payload, expiration) => {
  const options = {};
  if (expiration) {
    options.expiresIn = expiration;
  }

  const token = jwt.sign(payload, process.env.JWT_secret_key, options);
  return token;
};

export default generateJWT;
