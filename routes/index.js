const router = require("express").Router();
const itemRouter = require("./clothingItems");
// const userRouter = require("./users");
const { login, createUser } = require("../controllers/users");

router.use("/items", itemRouter);

// Sign up and sign in routes

router.post("/signup", createUser);
router.post("/signin", login);

// router.use("/items", itemRouter);
// router.use("/users", userRouter);

// Use the NOT_FOUND_ERROR variable instead of a string literal
const { NOT_FOUND_ERROR } = require("../utils/config");

router.use("*", (req, res) => {
  res.status(404).json({ message: NOT_FOUND_ERROR });
});

module.exports = router;
