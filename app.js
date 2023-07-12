/* eslint-disable no-console */
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");

const { PORT = 3001 } = process.env;
const app = express();

const { requestLogger, errorLogger } = require("./middlewares/logger");

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
}); // for testing purposes

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const db = mongoose.connection;

db.on("error", (err) => console.error("error connecting to db", err));
db.once("open", () => console.log("connected to db"));

const { errorHandler } = require("./utils/errors");

app.use(helmet());

const routes = require("./routes");

app.use(express.json());

// Step 1: Specify allowed origin
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://wtwrapp.weatherlab.xyz",
      "https://www.wtwrapp.weatherlab.xyz",
    ],
  })
);

app.use(requestLogger);
app.use(routes);

app.use(errorLogger); // enabling the error logger

app.use(errors()); // celebrate error handler

// Add the errorHandler middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
