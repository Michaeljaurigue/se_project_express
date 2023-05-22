const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { AUTHORIZATION_ERROR } = require("../utils/errorConstants");

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(AUTHORIZATION_ERROR)
      .json({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(AUTHORIZATION_ERROR).json({ message: "Invalid Token" });
  }
};

module.exports = authMiddleware;
