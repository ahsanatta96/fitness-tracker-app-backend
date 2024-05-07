const userService = require("../../services/user.service");

const trainersListing = async (req, res) => {
  try {
    const { status } = req.query;

    if (!status) {
      return res.status(400).json({ message: "Status is required!" });
    }

    const trainers = await userService.getAllTrainers(status);

    res.status(200).json({
      message: "All trainers fetched successfully!",
      data: trainers,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const trainerDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const trainer = await userService.getTrainerById(id);

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found!" });
    }

    res.status(200).json({
      message: "Trainer fetched successfully!",
      data: trainer,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const traineesListing = async (req, res) => {
  try {
    const trainees = await userService.getAllTrainees();

    res.status(200).json({
      message: "All trainees fetched successfully!",
      data: trainees,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  trainersListing,
  traineesListing,
  trainerDetails,
};
