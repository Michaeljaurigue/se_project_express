const { AUTHORIZATION_ERROR } = require("../utils/errorConstants");

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = AUTHORIZATION_ERROR;
  }
}

module.exports = AuthorizationError;
