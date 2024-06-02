const Message = require("../models/messages");

const getMessagesByChatRoomId = (chatRoomId) => {
  return Message.find({ chatRoomId });
};

const messageService = {
  getMessagesByChatRoomId,
};

module.exports = messageService;
