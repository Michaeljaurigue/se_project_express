const router = require("express").Router();
const itemRouter = require("./clothingItems");
// const userRouter = require("./users");
const {
  login,
  createUser,
  getUsers,
  getUser,
  getCurrentUser,
} = require("../controllers/users");

router.use("/items", itemRouter);
router.post("/signup", createUser);
router.post("/signin", login);

router.use("/users", getUsers);
router.use("/users", getUser);
router.use("/users", getCurrentUser);
// Use the NOT_FOUND_ERROR variable instead of a string literal
const { NOT_FOUND_ERROR } = require("../utils/config");

router.use("*", (req, res) => {
  res.status(404).json({ message: NOT_FOUND_ERROR });
});

module.exports = router;
