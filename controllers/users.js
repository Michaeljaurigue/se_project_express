const { NOT_FOUND_ERROR } = require("../utils/errorConstants");

/* eslint-disable consistent-return */
const User = require("../models/user");

// Controller function to get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// Controller function to get a user by id
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(NOT_FOUND_ERROR).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};
// Controller function to create a new user
const createUser = async (req, res, next) => {
  const { name, avatar } = req.body;

  // Validation
  if (!name || !avatar) {
    return res
      .status(400)
      .json({ msg: "Please include a name and avatar URL" });
  }

  try {
    const newUser = await User.create({
      name,
      avatar,
    });

    res.json(newUser);
  } catch (err) {
    next(err);
  }
};

// Export controller functions as methods on an object
module.exports = {
  getUsers,
  getUser,
  createUser,
};
