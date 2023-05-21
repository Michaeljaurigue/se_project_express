const express = require("express");
const userController = require("../controllers/users");

const { errorHandler } = require("../utils/errors");

const router = express.Router();

// Get current user
router.get("/me", userController.getCurrentUser);

// Patch user profile
router.patch("/me", userController.updateProfile);

// handle errors
router.use(errorHandler);

module.exports = router;
