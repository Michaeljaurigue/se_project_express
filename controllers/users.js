const bcrypt = require("bcryptjs");

const {
  NOT_FOUND_ERROR,
  VALIDATION_ERROR_CODE,
} = require("../utils/errorConstants");
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
  const { name, avatar, email, password } = req.body;

  // Validation
  if (!name || !avatar || !email || !password) {
    return res
      .status(VALIDATION_ERROR_CODE)
      .json({ msg: "Please include name, avatar URL, email, and password" });
  }

  try {
    // Check if the user already exists with the same email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(VALIDATION_ERROR_CODE)
        .json({ msg: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    res.json(newUser);
  } catch (err) {
    // Handle duplicate email error
    if (err.code === 11000) {
      return res
        .status(VALIDATION_ERROR_CODE)
        .json({ msg: "User already exists" });
    }
    next(err);
  }
};

// Export controller functions as methods on an object
module.exports = {
  getUsers,
  getUser,
  createUser,
};
