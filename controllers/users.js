/* eslint-disable consistent-return */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  NOT_FOUND_ERROR,
  VALIDATION_ERROR_CODE,
} = require("../utils/errorConstants");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

// Controller function to get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// Get Current User

const getCurrentUser = async (req, res, next) => {
  try {
    const { _id } = req.user; // Retrieve the user's ID from the token payload
    const user = await User.findById(_id);
    if (!user) {
      return res.status(NOT_FOUND_ERROR).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Controller function to update user profile
const updateProfile = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const updates = req.body;
    const options = { new: true, runValidators: true }; // Enable validators during update

    const updatedUser = await User.findByIdAndUpdate(_id, updates, options);
    if (!updatedUser) {
      return res.status(NOT_FOUND_ERROR).json({ msg: "User not found" });
    }
    res.json(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ msg: err.message });
    }
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

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(VALIDATION_ERROR_CODE).json({ msg: "Invalid email" });
    }

    // Use the custom method to check the password
    const isMatch = await user.checkPassword(password);

    // If the password doesn't match, return an error
    if (!isMatch) {
      return res
        .status(VALIDATION_ERROR_CODE)
        .json({ msg: "Invalid password" });
    }

    // Create JWT token with user's _id in payload
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    // Send the token in the response body
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

// Export controller functions as methods on an object
module.exports = {
  getUsers,
  getUser,
  createUser,
  login, // Add the login controller to the exported oject
  getCurrentUser,
  updateProfile,
};
