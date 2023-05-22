/* eslint-disable consistent-return */
const ClothingItem = require("../models/clothingItem");
const { INVALID_ID_ERROR } = require("../utils/errorConstants");
const { errorHandler } = require("../utils/errors");

const getClothingItems = async (req, res, next) => {
  try {
    const clothingItems = await ClothingItem.find();
    res.json(clothingItems);
  } catch (err) {
    next(err);
  }
};

const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const ownerId = req.user && req.user._id;
  if (!ownerId) {
    return res.status(INVALID_ID_ERROR).json({ message: "User ID is missing" });
  }

  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: ownerId,
  })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .then((item) => {
      // here we check if the item exists, if it doesn't we throw an error by using the throw keyword and the new keyword Error
      if (!item) {
        throw new Error("Item not found");
      }

      if (item.owner.toString() !== req.user._id.toString()) {
        // Check if the item owner's ID is different from the logged-in user's ID
        throw new Error("You are not authorized to delete this item");
      }

      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then((deletedItem) => {
      res.status(200).send({
        message: `Item with ID ${itemId} has been deleted`,
        data: deletedItem,
      });
    })
    .catch((err) => next(err));
};

const likeItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).orFail();
    res.status(200).send({ data: item });
  } catch (err) {
    next(err);
  }
};

const dislikeItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).orFail();
    res.status(200).send({ data: item });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
  errorHandler,
};
