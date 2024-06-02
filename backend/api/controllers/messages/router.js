const express = require("express");
const controller = require("./controller");

const router = express.Router();

router.get("/get-messages/:chatRoomId", controller.getMessagesByChatRoomId);

module.exports = router;
