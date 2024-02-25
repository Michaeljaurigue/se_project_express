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

// Define allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://wtwr.devwonders.com",
  "https://www.wtwr.devwonders.com",
];

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("Error connecting to db", err);
});
db.once("open", () => {
  console.log("No errors. Hooray!");
});

app.use(helmet());

// CORS middleware setup to dynamically allow specified origins
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

const routes = require("./routes");

app.use(express.json());

app.use(requestLogger);
app.use(routes);
app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
  console.log("Do it now!")
});

module.exports = app;
