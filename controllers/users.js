/* eslint-disable consistent-return */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { USER_OK } = require("../utils/errorConstants");
const { errorHandler } = require("../utils/errors");

const {
  VALIDATION_ERROR_CODE,
  NOT_FOUND_ERROR,
} = require("../utils/errorConstants");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(NOT_FOUND_ERROR).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const updates = req.body;
    const options = { new: true, runValidators: true };

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

const createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return res
      .status(VALIDATION_ERROR_CODE)
      .json({ msg: "Please include name, avatar URL, email, and password" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(VALIDATION_ERROR_CODE)
        .json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    res.json(newUser);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(VALIDATION_ERROR_CODE)
        .json({ msg: "User already exists" });
    }
    next(err);
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

      res.status(USER_OK).json({ token });
    })
    .catch((err) => {
      next(err);
    });
};

// const login = async (req, res, next) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(VALIDATION_ERROR_CODE).json({ msg: "Invalid email" });
//     }

//     const isMatch = await User.findUserByCredentials(email, password);

//     if (!isMatch) {
//       return res
//         .status(VALIDATION_ERROR_CODE)
//         .json({ msg: "Invalid password" });
//     }

//     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

//     res.json({ token });
//   } catch (err) {
//     next(err);
//   }
// };

module.exports = {
  getUsers,
  getUser,
  createUser,
  login,
  getCurrentUser,
  updateProfile,
  errorHandler,
};
