const router = require("express").Router();
const itemRouter = require("./clothingItems");
const userRouter = require("./users");

router.use("/items", itemRouter);
router.use("/users", userRouter);



// move this route to the end
router.use("*", (req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

module.exports = router;
