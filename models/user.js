/* eslint-disable consistent-return */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require("validator");

// mongoose bcryptjs validator are required dependencies because they are used in the userSchema.
// bcrypt is used to hash the password before saving it to the database. This is done using the pre-save hook. A pre-save hook is a function that is executed before saving a document to the database.

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: "Elise Bouer",
  },
  avatar: {
    type: String,
    default:
      "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Elise.png",
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
      message: "Invalid URL for avatar",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "You must enter a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8, // Minimum password length
    validate: {
      validator: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value),
      message: "Invalid password",
    },
  },
  about: {
    type: String,
    maxlength: 1000,
    required: false,
  },
});

// Hash the password before saving
// eslint-disable-next-line func-names, consistent-return
// The pre-save hook is a function that is executed before saving a document to the database.The pre("save") middleware function is executed before saving a user to the database. It checks if the password field has been modified and if so, it hashes the password using bcrypt and replaces the plain text password with the hashed value. This ensures that the password is securely stored in the database. The pre-save hook is defined using the pre method on the userSchema.'

// eslint-disable-next-line func-names
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Method to find user by credentials
userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("User not found"));
      }
      return bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          return Promise.reject(new Error("Invalid credentials"));
        }
        return user;
      });
    });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
