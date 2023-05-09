const express = require("express");

const { getUsers, getUser, createUser } = require("../controllers/users");

const { errorHandler } = require("../utils/errors");

const router = express.Router();

// GET all users
router.get("/", getUsers);

// GET user by ID
router.get("/:userId", getUser);

// POST new user
router.post("/", createUser);

// handle errors
router.use(errorHandler);

module.exports = router;
