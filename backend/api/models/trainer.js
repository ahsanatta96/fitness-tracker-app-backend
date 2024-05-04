const mongoose = require("mongoose");

const TrainerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    programs: [],
    documents: [String],
  },
  {
    timestamps: true,
  }
);

const Trainer = mongoose.model("Trainer", TrainerSchema);
module.exports = Trainer;
