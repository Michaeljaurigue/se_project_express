/* eslint-disable no-console */
const express = require("express");
const mongoose = require("mongoose");

const helmet = require("helmet");

const cors = require("cors");

const { PORT = 3001 } = process.env;
const app = express();

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
      "https://wtwrapp.weatherlab.xyz",
      "https://www.wtwrapp.weatherlab.xyz",
    ],
  })
);

app.use(routes);

routes.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
