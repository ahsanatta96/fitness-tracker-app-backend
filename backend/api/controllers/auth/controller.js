const mongoose = require("mongoose");
const userService = require("../../services/user.service");
const traineeService = require("../../services/trainee.service");
const trainerService = require("../../services/trainer.service");

// Register
const register = async (req, res) => {
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const { first_name, last_name, email, password, role } = req.body;

    const user = userService.newUser({
      first_name,
      last_name,
      email,
      password,
      role,
    });

    let roleUser;
    let documents = [];

    switch (role) {
      case "trainee":
        roleUser = await traineeService.newTrainee({ userId: user._id });
        break;
      case "trainer":
        roleUser = await trainerService.newTrainer({ userId: user._id });

        if (req.files && req.files.length > 0) {
          documents = req.files.map((file) => {
            return file.filename;
          });
        }
        roleUser.documents = documents;
        break;
      case "admin":
        roleUser = await traineeService.newTrainee({ userId: user._id });
        break;
      default:
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "Invalid role" });
    }

    user.roleId = roleUser._id;
    await roleUser.save({ session });
    roleUser.userId = user._id;
    await user.save({ session });

    const token = await user.generateJWT();

    const response = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      status: user.status,
      _id: roleUser._id,
      token,
    };

    await session.commitTransaction();
    res.status(201).json({
      message: "User registered successfully",
      data: response,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    if (!user.comparePassword(password)) {
      return res.status(400).json({ error: "Invalid password" });
    }
    const token = await user.generateJWT();
    const role = user.role;
    res
      .status(200)
      .json({ message: "User logged in successfully", data: { token, role } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// My Profile
const myProfile = async (req, res) => {
  try {
    const user = req.user;

    const roleUser = await userService.findUserById(user);

    res
      .status(200)
      .json({ message: "User found successfully", data: roleUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const approveTrainer = async (req, res) => {
  const { id } = req.params;
  try {
    const trainer = await userService.findUserById(id);
    if (!trainer) {
      return res.status(400).json({ error: "Trainer not found" });
    }
    trainer.status = req.body.status;
    await trainer.save();
    res
      .status(200)
      .json({ message: "Trainer approved successfully", data: trainer });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update User
const updateProfile = async (req, res) => {
  try {
    const user = await userService.findUserById(req.user);
    const { first_name, last_name } = req.body;

    user.first_name = first_name;
    user.last_name = last_name;

    await user.save();
    res
      .status(200)
      .json({ message: "Profile updated successfully", data: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Profile Image
const updateProfileImage = async (req, res) => {
  try {
    const user = await userService.findUserById(req.user);
    user.profile_image = req.file.filename;
    await user.save();
    res
      .status(200)
      .json({ message: "Profile image updated successfully", data: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  myProfile,
  approveTrainer,
  updateProfile,
  updateProfileImage,
};
