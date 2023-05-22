const {
  VALIDATION_ERROR_CODE,
  NOT_FOUND_ERROR,
  INVALID_ID_ERROR,
  DEFAULT_ERROR,
} = require("./errorConstants");

module.exports.errorHandler = (err, req, res) => {
  if (err.name === "ValidationError") {
    const fieldName = Object.keys(err.errors)[0];
    res.status(VALIDATION_ERROR_CODE).send({
      message: `Validation Error: ${fieldName} - ${err.errors[fieldName].message}`,
    });
  } else if (err.name === "CastError" && err.kind === "ObjectId") {
    res.status(INVALID_ID_ERROR).send({
      message: "Invalid ID",
    });
  } else if (err.name === "DocumentNotFoundError") {
    res.status(NOT_FOUND_ERROR).send({
      message: "Document not found",
    });
  } else {
    res.status(DEFAULT_ERROR).send({
      message: "An error has occurred on the server",
    });
  }
};
