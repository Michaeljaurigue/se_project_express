const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../utils/errors");

const {
  VALIDATION_ERROR_CODE,
  NOT_FOUND_ERROR,
  INVALID_ID_ERROR,
  USER_OK,
  CONFLICT_ERROR,
  AUTHORIZATION_ERROR,
} = require("../utils/errorConstants");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

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
    const { name, avatar } = req.body;

    const options = { new: true, runValidators: true };
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { name, avatar },
      options
    );

    if (!updatedUser) {
      return res.status(NOT_FOUND_ERROR).json({ msg: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(INVALID_ID_ERROR).json({ msg: "User not found" });
    }
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
      return res.status(CONFLICT_ERROR).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    const { password: _hashedPassword, ...userWithoutPassword } = newUser._doc;
    // Exclude password from the returned user object

    res.json(userWithoutPassword);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(CONFLICT_ERROR).json({ msg: "User already exists" });
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
    .catch(() => {
      res
        .status(AUTHORIZATION_ERROR)
        .json({ msg: "Invalid email or password" });
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
  errorHandler,
};
