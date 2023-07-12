const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../utils/errors");

const { VALIDATION_ERROR_CODE, USER_OK } = require("../utils/errorConstants");

const NotFoundError = require("../errors/NotFoundError");
const AuthorizationError = require("../errors/UnauthorizedError");
const ConflictError = require("../errors/ConflictError");

const User = require("../models/user");

const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    const responseData = user;
    return res.json(responseData);
  } catch (err) {
    return next(err);
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
      return new ConflictError("Conflict error");
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

    const responseData = userWithoutPassword;
    return res.json(responseData);
  } catch (err) {
    if (err.code === 11000) {
      return new ConflictError("Conflict error");
    }
    return next(err);
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
      return new NotFoundError("User not found");
    }

    return res.json(updatedUser); // Added return statement
  } catch (err) {
    if (err.name === "ValidationError") {
      return new ConflictError("Conflict error");
    }
    return next(err);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(USER_OK).json({ token });
  } catch (err) {
    return new AuthorizationError("Authorization error");
  }
};

module.exports = {
  createUser,
  login,
  updateProfile,
  getCurrentUser,
  errorHandler,
};
