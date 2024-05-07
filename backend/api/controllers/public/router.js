const express = require("express");
const adminController = require("../admin/controller");
const controller = require("./controller");

const router = express.Router();

router.get("/trainers-listing", adminController.trainersListing);
router.get("/trainer-details/:id", adminController.trainerDetails);
router.get("/programs-listing", controller.programsListing);
router.get("/program-details/:id", controller.programDetails);
router.get("/trainer-programs/:id", controller.trainerPrograms);

module.exports = router;
