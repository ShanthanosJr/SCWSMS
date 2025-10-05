const express = require('express');
const router = express.Router();
const maintenanceController = require('../Controllers/maintenanceController');

router.post('/log', maintenanceController.logMaintenance);

module.exports = router;