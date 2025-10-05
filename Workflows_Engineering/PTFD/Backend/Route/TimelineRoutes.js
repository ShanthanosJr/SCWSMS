// routes/timelineRoutes.js
const express = require("express");
const router = express.Router();
const timelineController = require("../Controllers/TimelineControllers");

router.get("/", timelineController.getAllTimelines);
router.get("/:id", timelineController.getTimelineById);
router.post("/", timelineController.createTimeline);
router.put("/:id", timelineController.updateTimeline);
router.delete("/:id", timelineController.deleteTimeline);

module.exports = router;
