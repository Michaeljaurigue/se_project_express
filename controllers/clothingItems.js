const ClothingItem = require("../models/clothingItem");
const NotFoundError = require("../middlewares/notFoundError");
const ForbiddenError = require("../middlewares/forbiddenError");
const BadRequestError = require("../middlewares/badRequestError");

const {
  FORBIDDEN_ERROR,
  PAGE_NOT_FOUND_ERROR,
} = require("../utils/errorConstants");
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
      if (err.name === "ValidationError") {
        return next(new BadRequestError(err.message));
      }
    });
};

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        // Item not found
        return next(new NotFoundError("Item not found"));
      }

      if (item.owner.toString() !== req.user._id.toString()) {
        // User is not authorized to delete this item
        return next(
          new ForbiddenError("You are not authorized to delete this item")
        );
      }

      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then((deletedItem) => {
      res.status(200).send({
        message: `Item with ID ${itemId} has been deleted`,
        data: deletedItem,
      });
    })
    .catch(() => {
      // Catch all errors
      next(new BadRequestError("Invalid item ID"));
    });
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
