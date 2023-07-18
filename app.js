require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");

const { PORT = 3001 } = process.env;

const app = express();

const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/error-handler");

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

mongoose.connect("mongodb://localhost:27017/wtwr", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
      "http://localhost:3000",
      "https://wtwrapp.weatherlab.xyz",
      "https://www.wtwrapp.weatherlab.xyz",
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
