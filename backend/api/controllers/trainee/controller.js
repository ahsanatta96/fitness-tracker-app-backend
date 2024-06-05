const chatRoomService = require("../../services/chatRoom.service");
const programService = require("../../services/program.service");
const traineeService = require("../../services/trainee.service");

const bookProgram = async (req, res) => {
  try {
    const { id } = req.params; // program-id
    const userId = req.user;

    const trainee = await traineeService.findTraineeByUserId(userId);
    if (!trainee) {
      return res.status(404).json({ message: "Trainee not found!" });
    }

    if (!id) {
      return res.status(400).json({ message: "Program is required!" });
    }

    const program = await programService.findProgramById(id);
    if (!program) {
      return res.status(404).json({ message: "Program not found!" });
    }

    // Set the date for each program object
    const currentDate = new Date();
    program.date = currentDate;
    trainee.program.forEach((program, index) => {
      if (index > 0) {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + index);
        program.date = nextDate;
      }
    });

    trainee.program.push(program);
    await traineeService.saveTrainee(trainee);

    const chatRoom = chatRoomService.newChatRoom({
      traineeId: userId,
      trainerId: program.trainerId,
    });

    await chatRoomService.saveChatRoom(chatRoom);

    res.status(200).json({
      message: "Program booked successfully!",
      data: trainee?.program,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllPrograms = async (req, res) => {
  try {
    const userId = req.user;
    const trainee = await traineeService.findTraineeByUserId(userId);
    return res.status(200).send({
      message: "All programs fetched successfully!",
      data: trainee?.program,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTraineeSingleProgram = async (req, res) => {
  try {
    const { programId } = req.params;
    const userId = req.user;
    console.log(programId);
    const trainee = await traineeService.findTraineeByUserId(userId);
    const program = trainee.program.id(programId);
    return res.status(200).send({
      message: "Program fetched successfully!",
      data: program,
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};
const updateSingleExerciseStatus = async (req, res) => {
  try {
    const { status, exerciseId, dayId, programId } = req.body;
    const userId = req.user;
    const trainee = await traineeService.findTraineeByUserId(userId);
    const program = trainee.program.find((p) => p._id.toString() === programId);
    const day = program.days.find((d) => d._id.toString() === dayId);
    const exercise = day.exercises.find((e) => e._id.toString() === exerciseId);
    exercise.status = status;
    program.status = status;
    await traineeService.saveTrainee(trainee);
    return res.status(200).send({
      message: "Program updated successfully!",
      data: program,
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

module.exports = {
  bookProgram,
  getAllPrograms,
  getTraineeSingleProgram,
  updateSingleExerciseStatus,
};
