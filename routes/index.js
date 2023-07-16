const router = require("express").Router();
const itemRouter = require("./clothingItems");
const userRouter = require("./users");
const authMiddleware = require("../middlewares/auth");
const { login, createUser } = require("../controllers/users");
const {
  validateUserInfo,
  validateUserLoginInfo,
} = require("../middlewares/validation");
const { NotFoundError } = require("../middlewares/notFoundError");

router.post("/signin", validateUserLoginInfo, login);

router.post("/signup", validateUserInfo, createUser);

router.use("/items", itemRouter);
router.use("/users", authMiddleware, userRouter);

router.use("*", (req, res, next) => {
  throw new NotFoundError("Requested resource not found");
});

module.exports = router;
