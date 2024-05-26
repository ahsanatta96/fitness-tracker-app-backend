const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.post("/get-chatrooms", controller.getChatRooms);
