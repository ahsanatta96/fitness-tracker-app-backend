const programService = require("../../services/program.service");

const programsListing = async (req, res) => {
  try {
    const programs = await programService.findAllPrograms();
    res.json({
      message: "Programs fetched successfully!",
      data: programs,
    });
  } catch (error) {
    console.log("Error getting programs:", error.message);
    res.status(500).json({ message: "Error getting programs." });
  }
};

const programDetails = async (req, res) => {
  try {
    const program = await programService.findProgramById(req.params.id);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.json({
      message: "Program fetched successfully!",
      data: program,
    });
  } catch (error) {
    console.log("Error getting program:", error.message);
    res.status(500).json({ message: "Error getting program." });
  }
};

const trainerPrograms = async (req, res) => {
  try {
    const trainerId = req.params.id; // user id
    const programs = await programService.findProgramByTrainerId(trainerId);
    res.json({
      message: "Trainer programs fetched successfully!",
      data: programs,
    });
  } catch (error) {
    console.log("Error getting programs:", error.message);
    res.status(500).json({ message: "Error getting programs." });
  }
};

module.exports = {
  programsListing,
  programDetails,
  trainerPrograms,
};
