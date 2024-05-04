const mongoose = require("mongoose");

const TraineeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    height: {
      type: Number,
    },
    program: [
      {
        day: {
          type: String,
        },
        exercises: [
          {
            name: {
              type: String,
            },
            description: {
              type: String,
            },
            status: {
              type: String,
              enum: ["completed", "pending", "missed", "skipped"],
              default: "pending",
            },
            skipReason: {
              type: String,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Trainee = mongoose.model("Trainee", TraineeSchema);
module.exports = Trainee;
