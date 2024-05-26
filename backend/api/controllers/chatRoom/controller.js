const chatRoomService = require("../../services/chatRoom.service");

const getChatRooms = async (req, res) => {
  try {
    const userId = req.user;
    const chatRooms = await chatRoomService.getChatRoomByRoleId(userId);
    res.status(200).json({
      message: "Chat rooms fetched successfully!",
      data: chatRooms,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getChatRooms,
};
