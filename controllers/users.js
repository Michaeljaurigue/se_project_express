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
// It uses await to asynchronously query all users from the database using User.find({}).
// The retrieved users are sent as a JSON response using res.json(users).
// If an error occurs, it is passed to the error handling middleware using next(err).
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// Get Current User Controller
// It uses the async/await syntax to asynchronously query the database for the user with the ID from the token payload.
// The token payload is available in the req.user object because of the auth middleware.
// If the user is found, it is sent as a JSON response using res.json(user).
// If the user is not found, a 404 error is passed to the error handling middleware using next(err).

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
// It uses the async/await syntax to asynchronously query the database for the user with the ID from the token payload.
// The token payload is available in the req.user object because of the auth middleware.
// If the user is found, it is updated with the data from the request body.
// The updated user is sent as a JSON response using res.json(updatedUser).
// If the user is not found, a 404 error is passed to the error handling middleware using next(err).

// Here the { _id } is destructured from req.user, which is the user object added to the request by the auth middleware.
// Here we delare updates and options variables to pass to the findByIdAndUpdate method.
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
// It uses the async/await syntax to asynchronously query the database for the user with the ID from the request parameters.
// If the user is found, it is sent as a JSON response using res.json(user).
// If the user is not found, a 404 error is passed to the error handling middleware using next(err).

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
// It extracts the name, avatar, email, and password from the request body.
// It performs a validation check to ensure that all the required fields are present. If not, it returns a 400 error.
// It also checks if a user with the same email already exists. If so, it returns a 400 error.

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
    // Here we use the findOne method to query the database for a user with the same email.
    // If a user is found, we return a 400 error.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(VALIDATION_ERROR_CODE)
        .json({ msg: "User already exists" });
    }

    // Hash the password
    // This is important because we don't want to store the password in plain text in the database.
    // We use the bcryptjs library to hash the password.
    // The hashPassword method takes the password and the number of rounds to use to generate the salt.
    // Salt is a random string that is added to the password before hashing to make it more secure.
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
    // Here we check if the error code is 11000, which is the code for duplicate key error.
    // There are many error codes in MongoDB, and you can find them in the MongoDB documentation.
    if (err.code === 11000) {
      return res
        .status(VALIDATION_ERROR_CODE)
        .json({ msg: "User already exists" });
    }
    next(err);
  }
};

// Controller function to login a user
// Controller function to login a user
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(VALIDATION_ERROR_CODE).json({ msg: "Invalid email" });
    }

    // Use the static method to check the password
    const isMatch = await User.findUserByCredentials(email, password);

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
