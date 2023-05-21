const router = require("express").Router();
const itemRouter = require("./clothingItems");
const authMiddleware = require("../middlewares/auth");
const { NOT_FOUND_ERROR } = require("../utils/config");

const {
  login,
  createUser,
  getUsers,
  getUser,
  getCurrentUser,
} = require("../controllers/users");

router.use("/items", authMiddleware, itemRouter);

router.post("/signup", createUser);
router.post("/signin", login);

router.use("/users", authMiddleware, getUsers);
router.use("/users", authMiddleware, getUser);
router.use("/users", authMiddleware, getCurrentUser);

router.use("*", (req, res) => {
  res.status(404).json({ message: NOT_FOUND_ERROR });
});

module.exports = router;
