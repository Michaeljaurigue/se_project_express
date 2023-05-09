const router = require("express").Router();
const itemRouter = require("./clothingItems");
const userRouter = require("./users");

router.use("/items", itemRouter);
router.use("/users", userRouter);

// Use the NOT_FOUND_ERROR variable instead of a string literal
const { NOT_FOUND_ERROR } = require("../utils/errorConstants");

router.use("*", (req, res) => {
  res.status(404).json({ message: NOT_FOUND_ERROR });
});

module.exports = router;
