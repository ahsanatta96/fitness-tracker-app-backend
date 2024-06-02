const messageService = require("../../services/message.service");

const getMessagesByChatRoomId = async (req, res) => {
  try {
    const { chatRoomId } = req.params;
    const messages = await messageService.getMessagesByChatRoomId(chatRoomId);

    if (!messages) {
      return res.status(404).json({
        message: "Messages not found",
      });
    }

    res.status(200).json({
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    console.log("Error getting messages", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getMessagesByChatRoomId,
};
