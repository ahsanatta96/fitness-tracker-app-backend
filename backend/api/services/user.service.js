const User = require("../models/user");

const newUser = (body) => {
  return new User(body);
};

const saveUser = (user) => {
  return user.save();
};

const findUserByEmail = (email) => {
  return User.findOne({ email });
};

const findUserById = (id) => {
  return User.findById(id);
};

const findActiveUserById = (id) => {
  return User.findOne({ _id: id, status: "active" });
};

const findUserByRoleId = (roleId) => {
  return User.findOne({ roleId });
};

const getAllTrainers = (status) => {
  return User.find({ role: "trainer", status })
    .populate("roleId", "documents")
    .sort({ createdAt: -1 });
};

const getTrainerById = (id) => {
  return User.findOne({ _id: id, role: "trainer" });
};

const getAllTrainees = (status) => {
  return User.find({ role: "trainee" }).sort({ createdAt: -1 });
};

const userService = {
  newUser,
  saveUser,
  findUserById,
  findActiveUserById,
  findUserByEmail,
  findUserByRoleId,
  getAllTrainers,
  getTrainerById,
  getAllTrainees,
};
module.exports = userService;
