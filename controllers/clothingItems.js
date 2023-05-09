const ClothingItem = require("../models/clothingItem");
const { errorHandler } = require("../utils/errors");

// create new clothing item
const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const ownerId = req.user._id; // take the user ID from the req.user object
  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: ownerId, // set the owner field to the user ID
  })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((e) => {
      next(e);
    });
};

// get all clothing items
const getClothingItems = async (req, res, next) => {
  try {
    const clothingItems = await ClothingItem.find();
    res.json(clothingItems);
  } catch (error) {
    next(error);
  }
};

// delete clothing item by id

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res.status(200).send({
        message: `Item with ID ${itemId} has been deleted`,
        data: item,
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
  errorHandler,
  likeItem,
  dislikeItem,
};
