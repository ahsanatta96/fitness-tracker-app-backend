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

const findTraineeByTrainerId = (trainerId) => {
  return Trainee.find({
    "program.trainerId": trainerId,
  }).populate("userId", "first_name last_name email role status profile_image");
};

const traineeService = {
  newTrainee,
  saveTrainee,
  findTraineeByUserId,
  findTraineeByTrainerId,
};

module.exports = traineeService;
