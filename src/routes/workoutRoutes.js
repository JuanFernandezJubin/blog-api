const express = require("express");
const recordController = require("../controllers/recordController");

const router = express.Router();

router
  .get("/", recordController.getAllRecordsForWorkout)
  .get("/:recordId", recordController.getRecordForWorkout)
  .post("/", recordController.createRecordForWorkout)
  .delete("/:recordId", recordController.deleteRecordForWorkout)



module.exports = router;