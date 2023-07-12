const express = require("express");
// const limiter = require("express-rate-limit");
const { getCurrentUser, updateProfile } = require("../controllers/users");
const authMiddleware = require("../middlewares/auth");
const { validateUserUpdate } = require("../middlewares/validation");

const router = express.Router();

router.get("/me", authMiddleware, getCurrentUser);
router.patch("/me", validateUserUpdate, authMiddleware, updateProfile);

module.exports = router;
