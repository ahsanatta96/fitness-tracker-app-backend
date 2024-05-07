const express = require("express");
const controller = require("./controller");
const { sanitizeData } = require("../../../helpers/security");
const { auth, adminAuth } = require("../../middleware/auth");
const {
  uploadTrainerDocuments,
  uploadProfileImage,
} = require("../../../helpers/multer");

const router = express.Router();

router.post(
  "/register",
  sanitizeData,
  uploadTrainerDocuments().array("documents"),
  controller.register
);
router.post("/login", sanitizeData, controller.login);
router.get("/profile", auth, controller.myProfile);
router.put("/approve/:id", adminAuth, controller.approveTrainer);

// Update Trainer
// Update Trainee

router.patch("/update-profile", auth, controller.updateProfile);
router.patch(
  "/update-profile-image",
  auth,
  uploadProfileImage().single("profile_image"),
  controller.updateProfileImage
);

module.exports = router;
