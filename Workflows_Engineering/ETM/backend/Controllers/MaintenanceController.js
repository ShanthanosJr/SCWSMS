// controllers/maintenanceController.js
const Maintenance = require('../models/Maintenance');
const Tool = require('../models/Tool');

// Log maintenance
exports.logMaintenance = async (req, res) => {
  const { toolId, serviceDetails, nextScheduledService, damageReported } = req.body;
  try {
    const maintenance = new Maintenance({
      toolId,
      serviceDate: new Date(),
      serviceDetails,
      nextScheduledService,
      damageReported,
    });
    await maintenance.save();

    const tool = await Tool.findById(toolId);
    tool.status = 'under maintenance';
    await tool.save();

    res.status(201).json(maintenance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
