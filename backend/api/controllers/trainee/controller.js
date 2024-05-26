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

module.exports = {
  bookProgram,
};
