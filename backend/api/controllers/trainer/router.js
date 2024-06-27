const express = require("express");

const router = express.Router();
const controller = require("./controller");
const { auth } = require("../../middleware/auth");
const { uploadProgramImage } = require("../../../helpers/multer");
const { sanitizeData } = require("../../../helpers/security");

router.post(
  "/add-program",
  auth,
  sanitizeData,
  uploadProgramImage().single("image"),
  controller.addProgram
);
router.put("/add-day/:id", auth, controller.addDayToProgram);
router.put("/add-exercise/:id", auth, controller.addExerciseToDay);
router.put("/update-exercise/:id", auth, controller.updateExercise);
router.put("/delete-exercise/:id", auth, controller.deleteExercise);
router.get("/customers", auth, controller.trainerCustomersListing);
router.get("/total-sales", auth, controller.totalSales);

module.exports = router;
