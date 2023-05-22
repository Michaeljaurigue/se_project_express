const express = require("express");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
// const { errorHandler } = require("../utils/errors");
const authMiddleware = require("../middlewares/auth");
const { errorHandler } = require("../utils/errors");

const router = express.Router();

router.post("/", authMiddleware, createClothingItem);
router.get("/", getClothingItems);
router.delete("/:itemId", authMiddleware, deleteClothingItem);
router.put("/:itemId/likes", authMiddleware, likeItem);
router.delete("/:itemId/dislikes", authMiddleware, dislikeItem);

// router.use((req, res) => {
//   res.status(404).json({ message: "Requested resource not found" });
// });

router.use(errorHandler);

module.exports = router;
