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
    console.log(clothingItems, "clothingItems");
  } catch (error) {
    next(error);
  }
};

// delete clothing item by id
const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId, "itemId");
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => {
      res.status(204).send({});
    })
    .catch((err) => errorHandler(err, req, res));
};

const likeItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).orFail();
    res.status(200).send({ data: item });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

const dislikeItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).orFail();
    res.status(200).send({ data: item });
  } catch (err) {
    errorHandler(err, req, res);
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
