const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const AuthorizationError = require("../errors/unauthorizedError");

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new AuthorizationError("Authorization required");
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    throw new AuthorizationError("Authorization error");
  }
};

module.exports = authMiddleware;
