const express = require("express");
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { errorHandler } = require("../utils/errors");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.get("/me", authMiddleware, getCurrentUser);
router.patch("/me", authMiddleware, updateProfile);

router.use(errorHandler);

module.exports = router;
