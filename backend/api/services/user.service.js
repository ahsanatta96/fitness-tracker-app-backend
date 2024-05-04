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

const userService = {
  newUser,
  saveUser,
  findUserById,
  findUserByEmail,
};
module.exports = userService;
