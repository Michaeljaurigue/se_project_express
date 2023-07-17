require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");

const { PORT = 3001, MONGODB_URI } = process.env;
const app = express();

const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { errorHandler } = require("./middlewares/errors");

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (err) => console.error("error connecting to db", err));
db.once("open", () => console.log("connected to db"));

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

app.use(requestLogger);
app.use(routes);
app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});

module.exports = app;
