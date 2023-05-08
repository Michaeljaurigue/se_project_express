const express = require("express");
const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const db = mongoose.connection;
db.on("error", (err) => console.error("error connecting to db", err));
db.once("open", () => console.log("connected to db"));

// Add the authorization middleware
app.use((req, res, next) => {
  req.user = {
    _id: "6458578d77b8a62075ae91fd",
  };
  next();
});

const routes = require("./routes");

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
