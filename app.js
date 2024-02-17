require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");

const { PORT = 3001 } = process.env;

const app = express();

const { errors } = require("celebrate"); //celebrate error handling is here for validation errors that are thrown by the celebrate middleware in the routes.
const { requestLogger, errorLogger } = require("./middlewares/logger"); //importing the requestLogger and errorLogger middlewares from the logger.js file this is for logging the requests and errors to the console.
const errorHandler = require("./middlewares/error-handler"); //this is the error handler middleware that is used to handle errors that are thrown by the routes.

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const db = mongoose.connection;

db.on("error", (err) => {
  // eslint-disable-next-line no-console
  console.error("Error connecting to db", err);
});
db.once("open", () => {
  // eslint-disable-next-line no-console
  console.log("Connected to the database");
});

app.use(helmet());

const routes = require("./routes");

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "https://wtwr.devwonders.com",
      "https://www.wtwr.devwonders.com",
    ],
  })
);

// app.use(cors());

app.use(requestLogger);
app.use(routes);
app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
  // eslint-disable-next-line no-console
  console.log("Press Ctrl+C to quit.");
});

module.exports = app;
