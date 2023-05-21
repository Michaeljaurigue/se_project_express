/* eslint-disable import/no-extraneous-dependencies */
// mongoose and validator are required dependencies because they are used in the userSchema.
// mongoose is the MongoDB object modeling tool used to define the schema and create the model.
// validator is used to validate the email and password fields. This is done using the validate property in the schema.
// The validate property takes an object with a validator property and a message property.

const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    required: true,
    enum: ["hot", "warm", "cold"],
    // enum is used to restrict the values that can be assigned to the weather field. It enforces that the weather field can only have the values hot, warm, or cold.
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ClothingItem = mongoose.model("ClothingItem", clothingItemSchema);

module.exports = ClothingItem;
