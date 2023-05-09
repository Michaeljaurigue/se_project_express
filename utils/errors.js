const { ERROR_CODE, NOT_FOUND_ERROR } = require("./errorConstants");

module.exports.errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    const fieldName = Object.keys(err.errors)[0];
    res.status(ERROR_CODE).send({
      message: `Validation Error: ${fieldName} - ${err.errors[fieldName].message}`,
    });
  } else if (err.name === "CastError") {
    res.status(ERROR_CODE).send({
      message: "Invalid ID",
    });
  } else if (err.name === "DocumentNotFoundError") {
    res.status(NOT_FOUND_ERROR).send({
      message: "Document not found",
    });
  } else {
    next(err);
  }
};
