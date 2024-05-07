const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
    },
    image: {
      type: String,
      default: "",
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
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Program = mongoose.model("Program", ProgramSchema);
module.exports = Program;
