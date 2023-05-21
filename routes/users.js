const express = require("express");

const { errorHandler } = require("../utils/errors");

const router = express.Router();

// handle errors
router.use(errorHandler);

module.exports = router;
