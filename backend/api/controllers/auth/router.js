const express = require("express");
const controller = require("./controller");
const { sanitizeData } = require("../../../helpers/security");
const { auth } = require("../../middleware/auth");
const { uploadTrainerDocuments } = require("../../../helpers/multer");

const router = express.Router();

router.post(
  "/register",
  sanitizeData,
  uploadTrainerDocuments().array("documents"),
  controller.register
);
router.post("/login", sanitizeData, controller.login);
router.get("/profile", auth, controller.myProfile);

module.exports = router;
