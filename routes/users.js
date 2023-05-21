const express = require("express");
const userController = require("../controllers/users");
const { errorHandler } = require("../utils/errors");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.get("/users/me", authMiddleware, userController.getCurrentUser);
router.patch("/users/me", authMiddleware, userController.updateProfile);

router.use(errorHandler);

module.exports = router;
