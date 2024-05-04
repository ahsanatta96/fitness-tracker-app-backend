const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
var morgan = require("morgan");
const chalk = require("chalk");
const { createServer } = require("http");

const errorMiddlware = require("./api/middleware/errors");
const authRouter = require("./api/controllers/auth/router");
const path = require("path");

//initializing App
const app = express();
const server = createServer(app);

app.use(morgan("dev"));

app.use(cors());

require("dotenv").config({ path: ".env" });

// Body parser
app.use(express.json());
app.use(errorMiddlware);
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);

// Endpoint to serve the trainer documents
app.use(
  "/data",
  express.static(path.join(__dirname, "api/data/trainerDocuments"))
);

// Handle Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(
    chalk.bold.red(`ERROR MESSAGE: `),
    chalk.bold.blue(`${err.message}`)
  );
  console.log(
    chalk.red("Shutting down the server due to some Uncaught Exception")
  );
  process.exit(1);
});

// Handle Unhandled Promise rejections
process.on("unhandledRejection", (err) => {
  console.log(
    chalk.bold.red(`ERROR MESSAGE: `),
    chalk.bold.blue(`${err.message}`)
  );
  console.log(chalk.bold.red(`ERROR STACK: `), `${err.stack}`);
  console.log(
    chalk.bold.red(
      "Shutting down the server due to Unhandled Promise rejection"
    )
  );
  process.exit(1);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database Connection Successful");
  })
  .catch((error) => {
    console.log("MongoDB Connection Error :", error);
  });

server.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT : ${process.env.PORT}`);
});
