const express = require("express");
// const limiter = require("express-rate-limit");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
// const { errorHandler } = require("../utils/errors");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.post("/", authMiddleware, createClothingItem);
router.get("/", getClothingItems);
router.delete("/:itemId", authMiddleware, deleteClothingItem);
router.put("/:itemId/likes", authMiddleware, likeItem);
router.delete("/:itemId/likes", authMiddleware, dislikeItem);

// router.use((req, res) => {
//   res.status(404).json({ message: "Requested resource not found" });
// });

module.exports = router;
