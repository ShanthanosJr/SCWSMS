// routes/timelines.js
const router = require('express').Router();
const timelineController = require('../Controllers/ProjectTimelineCtrl');

// FIXED: Put validation route BEFORE parameterized routes to avoid conflicts
router.get('/validate-project/:projectCode', timelineController.validateProject);
router.get('/project/:projectCode', timelineController.getTimelinesByProject);
router.get('/project/:projectCode/summary', timelineController.getProjectSummary);

// Standard CRUD routes
router.get('/', timelineController.getAllTimelines);
router.get('/:id', timelineController.getTimelineById);
router.post('/', timelineController.createTimeline);
router.put('/:id', timelineController.updateTimeline);
router.delete('/:id', timelineController.deleteTimeline);

module.exports = router;