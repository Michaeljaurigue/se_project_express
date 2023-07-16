const express = require("express");
const { getCurrentUser, updateProfile } = require("../controllers/users");
const authMiddleware = require("../middlewares/auth");
const { validateUserUpdate } = require("../middlewares/validation");

const router = express.Router();

router.get("/me", authMiddleware, getCurrentUser);

router.patch("/me", authMiddleware, validateUserUpdate, updateProfile);

module.exports = router;
