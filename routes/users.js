const express = require("express");
const userController = require("../controllers/users");
const { errorHandler } = require("../utils/errors");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// Get current user
// GET /me: Retrieves the current user's profile. It uses the authMiddleware to ensure authentication before accessing the route. The userController.getCurrentUser function handles the request.
router.get("/me", authMiddleware, userController.getCurrentUser);

// Patch user profile
// PATCH /me: Updates the current user's profile. It also utilizes the authMiddleware for authentication. The userController.updateProfile function handles the request.
router.patch("/me", authMiddleware, userController.updateProfile);

// handle errors
router.use(errorHandler);

module.exports = router;
