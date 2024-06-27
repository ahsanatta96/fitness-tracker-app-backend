const Trainee = require("../../models/trainee");
const programService = require("../../services/program.service");
const traineeService = require("../../services/trainee.service");
const trainerService = require("../../services/trainer.service");
const userService = require("../../services/user.service");

const addProgram = async (req, res) => {
  try {
    if (req.role !== "trainer") {
      return res
        .status(400)
        .json({ message: "Only trainers can add programs" });
    }

    const { name, description, price, daysCount } = req.body;
    const days = [];

    for (let i = 1; i <= daysCount; i++) {
      days.push({
        name: i.toString(),
        exercises: [],
      });
    }

    let image = "";
    if (req.file) {
      image = req.file.filename;
    }

    const program = programService.newProgram({
      name,
      description,
      price,
      trainerId: req.user,
      image,
      days,
    });

    await programService.saveProgram(program);

    await program.save();
    res.status(201).json({
      message: "Program added successfully!",
      data: program,
    });
  } catch (error) {
    console.log("Error adding program:", error.message);
    res.status(500).json({ message: "Error adding program." });
  }
};

const addDayToProgram = async (req, res) => {
  try {
    if (req.role !== "trainer") {
      return res
        .status(400)
        .json({ message: "Only trainers can add programs" });
    }

    const programId = req.params.id;
    const daysCount = req.body.daysCount;

    const program = await programService.findProgramById(programId);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    for (let i = 0; i < daysCount; i++) {
      program.days.push({
        name: (program.days.length + 1).toString(),
        exercises: [],
      });
    }

    await programService.saveProgram(program);
    res.status(200).json({
      message: "Days added to program successfully!",
      data: program,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding days to program" });
  }
};

const addExerciseToDay = async (req, res) => {
  try {
    if (req.role !== "trainer") {
      return res
        .status(400)
        .json({ message: "Only trainers can add programs" });
    }

    const programId = req.params.id;
    const { dayId, name, description } = req.body;

    const program = await programService.findProgramById(programId);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    const day = program.days.find((day) => day._id.toString() === dayId);

    if (!day) {
      return res.status(404).json({ message: "Day not found" });
    }

    day.exercises.push({ name, description });

    await program.save();
    res.status(200).json({
      message: "Exercise added to day successfully!",
      data: program,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding exercise" });
  }
};

const updateExercise = async (req, res) => {
  try {
    if (req.role !== "trainer") {
      return res
        .status(400)
        .json({ message: "Only trainers can add programs" });
    }

    const programId = req.params.id;
    const { dayId, exerciseId, name, description } = req.body;

    const program = await programService.findProgramById(programId);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    const day = program.days.find((day) => day._id.toString() === dayId);
    if (!day) {
      return res.status(404).json({ message: "Day not found" });
    }

    const exercise = day.exercises.find(
      (exercise) => exercise._id.toString() === exerciseId
    );

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    if (name) {
      exercise.name = name;
    }

    if (description) {
      exercise.description = description;
    }

    await program.save();
    res.status(200).json({
      message: "Exercise updated successfully!",
      data: program,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating exercise" });
  }
};

const deleteExercise = async (req, res) => {
  try {
    if (req.role !== "trainer") {
      return res
        .status(400)
        .json({ message: "Only trainers can add programs" });
    }

    const programId = req.params.id;
    const { dayId, exerciseId } = req.body;

    const program = await programService.findProgramById(programId);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    const day = program.days.find((day) => day._id.toString() === dayId);
    if (!day) {
      return res.status(404).json({ message: "Day not found" });
    }

    const exerciseIndex = day.exercises.findIndex(
      (exercise) => exercise._id.toString() === exerciseId
    );

    if (exerciseIndex === -1) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    day.exercises.splice(exerciseIndex, 1);

    await program.save();
    res.status(200).json({
      message: "Exercise deleted successfully!",
      data: program,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting exercise" });
  }
};

const trainerCustomersListing = async (req, res) => {
  try {
    if (req.role !== "trainer") {
      return res
        .status(400)
        .json({ message: "Only trainers can view customers" });
    }

    const trainees = await traineeService.findTraineeByTrainerId(req.user);

    const response = {
      traineeCount: trainees.length,
      trainees: trainees || [],
    };

    res.status(200).json({
      message: "Customers fetched successfully!",
      data: response,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers" });
  }
};

const totalSales = async (req, res) => {
  try {
    if (req.role !== "trainer") {
      return res
        .status(400)
        .json({ message: "Only trainers can view customers" });
    }

    const trainerId = req.user;

    const trainees = await traineeService.findTraineeByTrainerId(trainerId);

    let totalSales = 0;

    trainees.forEach((trainee) => {
      trainee.program.forEach((prog) => {
        if (prog.trainerId.toString() == trainerId) {
          totalSales += prog.price;
        }
      });
    });

    res.status(200).json({
      message: "Total sales fetched successfully!",
      data: totalSales,
    });
  } catch (error) {
    console.log("Error fetching total sales:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports = {
  addProgram,
  addDayToProgram,
  addExerciseToDay,
  updateExercise,
  deleteExercise,
  trainerCustomersListing,
  totalSales,
};
