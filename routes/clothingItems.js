const express = require("express");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const authMiddleware = require("../middlewares/auth");
const {
  validateItemBody,
  validateItemId,
} = require("../middlewares/validation");

const router = express.Router();

router.get("/", getClothingItems);

router.post("/", authMiddleware, validateItemBody, createClothingItem);

router.delete("/:itemId", authMiddleware, validateItemId, deleteClothingItem);

router.put("/:itemId/likes", authMiddleware, validateItemId, likeItem);

router.delete("/:itemId/likes", authMiddleware, validateItemId, dislikeItem);

module.exports = router;
