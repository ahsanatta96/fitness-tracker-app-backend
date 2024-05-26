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
        name: {
          type: String,
        },
        description: {
          type: String,
        },
        image: {
          type: String,
        },
        price: {
          type: Number,
        },
        trainerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Trainer",
        },

        days: [
          {
            name: {
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
                  default: null,
                },
              },
            ],
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
