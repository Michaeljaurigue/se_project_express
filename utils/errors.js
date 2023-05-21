/* eslint-disable no-unused-vars */
const {
  VALIDATION_ERROR_CODE,
  NOT_FOUND_ERROR,
  INVALID_DATA_ERROR,
  INVALID_ID_ERROR,
  AUTHORIZATION_ERROR,
  FORBIDDEN_ERROR,
  CONFLICT_ERROR,
  DEFAULT_ERROR,
} = require("./errorConstants");

module.exports.errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    const fieldName = Object.keys(err.errors)[0];
    res.status(VALIDATION_ERROR_CODE).send({
      message: `Validation Error: ${fieldName} - ${err.errors[fieldName].message}`,
    });
  } else if (err.name === "CastError") {
    if (err.kind === "ObjectId") {
      res.status(INVALID_ID_ERROR).send({
        message: "Invalid ID",
      });
    } else {
      res.status(INVALID_DATA_ERROR).send({
        message: "Invalid data",
      });
    }
  } else if (err.name === "DocumentNotFoundError") {
    res.status(NOT_FOUND_ERROR).send({
      message: "Document not found",
    });
  } else if (err.name === "UnauthorizedError") {
    res.status(AUTHORIZATION_ERROR).send({
      message: "Unauthorized access",
    });
  } else if (err.name === "ForbiddenError") {
    res.status(FORBIDDEN_ERROR).send({
      message: "Forbidden",
    });
  } else if (err.name === "ConflictError") {
    res.status(CONFLICT_ERROR).send({
      message: "Email address already exists",
    });
  } else {
    res.status(DEFAULT_ERROR).send({
      message: "An error has occurred on the server",
    });
  }
};
