const express = require("express");
const userController = require("../controllers/users");
const { errorHandler } = require("../utils/errors");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.get("/me", authMiddleware, userController.getCurrentUser);

router.patch("/me", authMiddleware, userController.updateProfile);

router.use(errorHandler);

module.exports = router;
