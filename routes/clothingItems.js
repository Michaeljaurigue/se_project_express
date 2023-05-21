const express = require("express");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const { errorHandler } = require("../utils/errors");
const authMiddleware = require("../middlewares/auth");

// Here we are creating an instance of the express.Router class and assigning it to the router variable.
const router = express.Router();

// Create a new item of clothing. It is associated with the createClothingItem controller function which handles the logic for creating a new item of clothing. The authMiddleware is used to authenticate the user before the controller function is called.
router.post("/", authMiddleware, createClothingItem);

// get all clothing items READ
router.get("/", getClothingItems);

// delete clothing item by id DELETE
router.delete("/:itemId", authMiddleware, deleteClothingItem);

// like clothing item by id UPDATE
router.put("/:itemId/likes", authMiddleware, likeItem);

// dislike clothing item by id UPDATE
router.delete("/:itemId/dislikes", authMiddleware, dislikeItem);

// handle non-existent resources UPDATE
router.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

// Error handling middleware
router.use(errorHandler);

module.exports = router;
