const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateHexadecimal = (value, helpers) => {
  const regex = /^[0-9a-fA-F]{24}$/;

  if (regex.test(value)) {
    return value;
  }
  return helpers.error("string.hex");
};

module.exports.validateItemBody = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().required().min(2).max(30).messages({
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
        "string.empty": 'The "name" field must be filled in',
      }),

      imageUrl: Joi.string().required().custom(validateURL).messages({
        "string.empty": 'The "imageUrl" field must be filled in',
        "string.uri": 'the "imageUrl" field must be a valid url',
      }),
    })
    .unknown(true),
});

module.exports.validateUserInfo = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30).messages({
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
        "string.empty": 'The "name" field must be filled in',
      }),
      avatar: Joi.string().custom(validateURL).messages({
        "string.empty": 'The "imageUrl" field must be filled in',
        "string.uri": 'the "imageUrl" field must be a valid url',
      }),
      email: Joi.string()
        .required()
        .email()
        .messages({ "string.email": "Please enter a valid email" }),
      password: Joi.string()
        .required()
        .min(8)
        .messages({ "string.min": "Passowrd must be at least 8 characters." }),
    })
    .unknown(true),
});

module.exports.validateUserLoginInfo = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .messages({ "string.email": "Please enter a valid email" }),
    password: Joi.string()
      .required()
      .min(8)
      .messages({ "string.min": "Passowrd must be at least 8 characters." }),
  }),
});

module.exports.validateItemId = celebrate({
  params: Joi.object().keys({
    ItemId: Joi.string()
      .required()
      .custom(validateHexadecimal)
      .messages({ "string.hex": "Invalid ID" }),
  }),
});

module.exports.validateUserUpdate = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().required().min(2).max(30).messages({
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
        "string.empty": 'The "name" field must be filled in',
      }),
      avatar: Joi.string().custom(validateURL).messages({
        "string.empty": 'The "imageUrl" field must be filled in',
        "string.uri": 'the "imageUrl" field must be a valid url',
      }),
    })
    .unknown(true),
});
