const jwt = require("jsonwebtoken");

const AuthorizationError = require("./unauthorizedError");

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new AuthorizationError("Authorization required");
  }

  const token = authorization.replace("Bearer ", "");

  const { JWT_SECRET = "dev-key" } = process.env; // Set default value for JWT_SECRET

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;
    next();
  } catch (error) {
    throw new AuthorizationError("Authorization error");
  }
};

module.exports = authMiddleware;
