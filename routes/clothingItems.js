const express = require("express");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const { errorHandler } = require("../utils/errors");

const router = express.Router();

// Create
router.post("/", createClothingItem);

// get all clothing items READ
router.get("/", getClothingItems);

// delete clothing item by id DELETE
router.delete("/:itemId", deleteClothingItem);

// like clothing item by id UPDATE
router.put("/:itemId/likes", likeItem);

// dislike clothing item by id UPDATE
router.delete("/:itemId/dislikes", dislikeItem);

// handle non-existent resources UPDATE
router.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

// Error handling middleware
router.use(errorHandler);

module.exports = router;
