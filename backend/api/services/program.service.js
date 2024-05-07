const Program = require("../models/program");

const newProgram = (body) => {
  return new Program(body);
};

const saveProgram = (program) => {
  return program.save();
};

const findProgramById = (id) => {
  return Program.findById(id);
};

const findProgramByTrainerId = (trainerId) => {
  return Program.find({ trainerId });
};

const findAllPrograms = () => {
  return Program.find();
};

const programService = {
  newProgram,
  saveProgram,
  findProgramById,
  findProgramByTrainerId,
  findAllPrograms,
};

module.exports = programService;
