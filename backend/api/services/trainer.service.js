const Trainer = require("../models/trainer");

const newTrainer = (body) => {
  return new Trainer(body);
};

const saveTrainer = (trainer) => {
  return trainer.save();
};

const trainerService = {
  newTrainer,
  saveTrainer,
};

module.exports = trainerService;
