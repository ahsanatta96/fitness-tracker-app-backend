const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { auth } = require("../../middleware/auth");
const { sanitizeData } = require("../../../helpers/security");

router.post("/book-program/:id", auth, sanitizeData, controller.bookProgram);

module.exports = router;
