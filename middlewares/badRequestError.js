const { VALIDATION_ERROR_CODE } = require("../utils/errorConstants");

class ValidationErrorCode extends Error {
  constructor(message) {
    super(message);
    this.statusCode = VALIDATION_ERROR_CODE;
  }
}

module.exports = ValidationErrorCode;
