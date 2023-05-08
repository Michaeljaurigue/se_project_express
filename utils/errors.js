const ERROR_CODE = 400;
const NOT_FOUND_ERROR = 404;

module.exports.errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    res.status(ERROR_CODE).send({
      message: `Validation Error: ${err.message}`,
    });
  } else if (err.name === "CastError") {
    res.status(NOT_FOUND_ERROR).send({
      message: `Document Not Found: ${err.message}`,
    });
  } else {
    next(err);
  }
};
