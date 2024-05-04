const Trainee = require("../models/trainee");

const newTrainee = (body) => {
  return new Trainee(body);
};

const saveTrainee = (trainee) => {
  return trainee.save();
};

const traineeService = {
  newTrainee,
  saveTrainee,
};

module.exports = traineeService;
