const express = require('express');
const router = express.Router();
const toolController = require('../Controllers/toolController');

// Get all tools
router.get('/', toolController.getAllTools);

// Get a single tool by ID
router.get('/:id', toolController.getToolById);

// CRUD operations
router.post('/create', toolController.createTool);
router.put('/update/:id', toolController.updateTool);
router.delete('/delete/:id', toolController.deleteTool);

// Status tracking operations
router.put('/update-status', toolController.updateToolStatus);
router.get('/status-history/:toolId', toolController.getStatusHistory);

// Maintenance operations
router.post('/maintenance', toolController.logMaintenance);
router.get('/maintenance-history/:toolId', toolController.getMaintenanceHistory);

// Depreciation calculation
router.get('/depreciation/:toolId', toolController.calculateDepreciation);

module.exports = router;