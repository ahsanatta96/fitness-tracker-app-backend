const Trainee = require("../models/trainee");

const newTrainee = (body) => {
  return new Trainee(body);
};

const saveTrainee = (trainee) => {
  return trainee.save();
};

const findTraineeByUserId = (userId) => {
  return Trainee.findOne({
    userId,
  });
};

const traineeService = {
  newTrainee,
  saveTrainee,
  findTraineeByUserId,
};

module.exports = traineeService;
