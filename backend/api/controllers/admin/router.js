const express = require("express");
const controller = require("./controller");
const { sanitizeData } = require("../../../helpers/security");
const { auth, adminAuth } = require("../../middleware/auth");

const router = express.Router();

router.get("/trainers-listing", adminAuth, controller.trainersListing);
router.get("/trainees-listing", adminAuth, controller.traineesListing);

module.exports = router;
