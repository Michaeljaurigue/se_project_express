const router = require("express").Router();
const itemRouter = require("./clothingItems");
const userRouter = require("./users");
const authMiddleware = require("../middlewares/auth");
// const { NOT_FOUND_ERROR } = require("../utils/config");
const { login, createUser } = require("../controllers/users");
const { PAGE_NOT_FOUND_ERROR } = require("../utils/errorConstants");

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/items", itemRouter);
router.use("/users", authMiddleware, userRouter);

router.use("*", (req, res) => {
  res.status(PAGE_NOT_FOUND_ERROR).json({ message: "Requested resource not found" });
});

module.exports = router;
