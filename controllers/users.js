/* eslint-disable consistent-return */
const User = require("../models/user");
const { errorHandler } = require("../utils/errors");

// Controller function to get all users
// Controller function to get a user by id
const getUsers = async (req, res) => {
  try {
    const user = await User.find(req.params.userId).orFail();
    res.json(user);
  } catch (err) {
    errorHandler(err, req, res);
  }
};

// Controller function to get a user by id
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    errorHandler(err, req, res);
  }
};

// Controller function to create a new user
const createUser = async (req, res) => {
  const { name, avatar } = req.body;

  // Validation
  if (!name || !avatar) {
    return res
      .status(400)
      .json({ msg: "Please include a name and avatar URL" });
  }

  try {
    const newUser = new User({
      name,
      avatar,
    });

    await newUser.save();

    res.json(newUser);
  } catch (err) {
    errorHandler(err, req, res);
  }
};

// Export controller functions as methods on an object
module.exports = {
  getUsers,
  getUser,
  createUser,
};
