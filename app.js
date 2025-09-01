const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expense");
const userRoutes = require("./routes/user");
const logger = require("./util/logger");

const requiredEnv = ["MONGODB_URI", "JWT_SECRET", "PORT"];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Error: Missing environment variable ${key}`);
    process.exit(1);
  }
});

const app = express();

const PORT = process.env.PORT || 5000;

const MONGODB_URI = process.env.MONGODB_URI;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/auth", authRoutes);

app.use("/api/expenses", expenseRoutes);

app.use("/api/user", userRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    message: "Resource not found",
  });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(PORT, () => {
      logger.info(`Conncted to the Database and listening to the port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error("Error connecting to the database", { error });
  });
