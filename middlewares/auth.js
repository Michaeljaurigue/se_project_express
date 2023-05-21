/* eslint-disable consistent-return */
// This code is an authentication middleware function that verifies the authenticity of the JSON Web Token sent in the Authorization header of an HTTP request.
// It uses the jsonwebtoken package to verify the token.
// If the token is valid, the payload is extracted from the token and added to the req.user object.
// If the token is invalid, a 401 error is sent as a response.

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
// this JWT_SECRET is important because it is used to sign the token and it's the same secret that will be used to verify the token.

// This function is used as a middleware in the routes that require authentication.
const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized Unauthorized" });
  }

  const token = authorization.replace("Bearer ", "");

  // Verify token
  // Here we define payload as the decoded token. and we use the jwt.verify method to verify the token. This works because the jwt.verify method decodes the token and verifies its authenticity.
  // If the token is valid, the payload is extracted from the token and added to the req.user object.
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
