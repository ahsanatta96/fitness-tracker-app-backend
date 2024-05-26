const ChatRoom = require("../models/chatRoom.model");

const newChatRoom = (body) => {
  return new ChatRoom(body);
};

const saveChatRoom = (chatRoom) => {
  return chatRoom.save();
};

const getChatRoomByRoleId = (roleId) => {
  return ChatRoom.find({
    $or: [{ traineeId: roleId }, { trainerId: roleId }],
  });
};

const chatRoomService = {
  newChatRoom,
  saveChatRoom,
  getChatRoomByRoleId,
};

module.exports = chatRoomService;
