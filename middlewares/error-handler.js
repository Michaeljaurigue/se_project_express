// error-handler.js
const errorHandler = (err, req, res, next) => {
  // Handle the error and send the appropriate response
  const statusCode = err.statusCode || 500; // Default to 500 if status code not provided
  const message = err.message || "Internal Server Error"; // Default message for unforeseen errors

  res.status(statusCode).send({ message });
};

module.exports = errorHandler;
