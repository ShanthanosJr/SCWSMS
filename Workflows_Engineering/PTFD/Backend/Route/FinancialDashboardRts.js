// routes/financial-dashboard.js
const router = require('express').Router();
const financialController = require('../Controllers/FinancialDashboardCtrl');

// Get salary configuration and available projects
router.get('/config/salary', financialController.getSalaryConfig);
router.get('/config/projects', financialController.getAvailableProjects);

// Standard CRUD routes
router.get('/', financialController.getAllDashboards);
router.get('/:id', financialController.getDashboardById);
router.post('/calculate', financialController.calculateFinancialDashboard);
router.put('/:id', financialController.updateDashboard);
router.delete('/:id', financialController.deleteDashboard);

// Add export route
router.get('/:id/export', financialController.exportDashboard);

module.exports = router;