const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { auth } = require("../../middleware/auth");
const { sanitizeData } = require("../../../helpers/security");

router.post("/book-program/:id", auth, sanitizeData, controller.bookProgram);
router.get("/programs", auth, controller.getAllPrograms);
router.get(
  "/program-details/:programId",
  auth,
  controller.getTraineeSingleProgram
);
router.put(
  "/update-exercise-status/:id",
  auth,
  sanitizeData,
  controller.updateExerciseStatus
);
router.put("/update-status", auth, controller.updateSingleExerciseStatus);

module.exports = router;
