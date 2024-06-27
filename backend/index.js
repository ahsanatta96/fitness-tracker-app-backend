const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
var morgan = require("morgan");
const chalk = require("chalk");
const path = require("path");
const cron = require("node-cron");
const { createServer } = require("http");
const { Server } = require("socket.io");
const errorMiddlware = require("./api/middleware/errors");

const authRouter = require("./api/controllers/auth/router");
const adminRouter = require("./api/controllers/admin/router");
const trainerRouter = require("./api/controllers/trainer/router");
const publicRouter = require("./api/controllers/public/router");
const traineeRouter = require("./api/controllers/trainee/router");
const messageRouter = require("./api/controllers/messages/router");
const Message = require("./api/models/messages");
const Trainee = require("./api/models/trainee");

//initializing App
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", (room) => {
    socket.join(room);
  });

  socket.on("message", async (message, room, senderId, receiverId) => {
    // Save the message to the database
    const newMessage = new Message({
      senderId: senderId,
      receiverId: receiverId,
      message: message,
      chatRoomId: room,
    });
    await newMessage.save();

    io.to(room).emit("message", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use(morgan("dev"));
app.use(cors());
require("dotenv").config({ path: ".env" });

// Body parser
app.use(express.json());
app.use(errorMiddlware);
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/trainer", trainerRouter);
app.use("/api/v1/public", publicRouter);
app.use("/api/v1/trainee", traineeRouter);
app.use("/api/v1/messages", messageRouter);

// Endpoint to serve the trainer documents
app.use(
  "/data",
  express.static(path.join(__dirname, "api/data/trainerDocuments"))
);

// Endpoint to serve the program images
app.use(
  "/data",
  express.static(path.join(__dirname, "api/data/programImages"))
);

// Endpoint to serve the profile images
app.use(
  "/data",
  express.static(path.join(__dirname, "api/data/profileImages"))
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

// Schedule the cron job to run at midnight
cron.schedule("0 0 * * *", async () => {
  // cron.schedule("*/20 * * * * *", async () => {
  try {
    const trainees = await Trainee.find();

    trainees.forEach((trainee) => {
      trainee.program.forEach((program) => {
        program.days.forEach((day) => {
          day.exercises.forEach((exercise) => {
            if (exercise.status === "pending") {
              exercise.status = "missed";
            }
          });
        });
      });
    });

    // Use bulkWrite for better performance
    const bulkOps = trainees.map((trainee) => ({
      updateOne: {
        filter: { _id: trainee._id },
        update: { $set: trainee.toObject() },
      },
    }));

    if (bulkOps.length > 0) {
      const result = await Trainee.bulkWrite(bulkOps);
      console.log(
        `Updated ${result.modifiedCount} trainee documents to missed.`
      );
    } else {
      console.log("No trainees needed updating.");
    }
  } catch (error) {
    console.error("Error updating trainee statuses:", error);
  }
});
