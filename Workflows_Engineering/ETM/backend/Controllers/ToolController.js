// controllers/toolController.js
const Tool = require('../Model/Tool');
const StatusLog = require('../Model/StatusLog');
const Maintenance = require('../Model/Maintenance');
const moment = require('moment');

// Get all tools
exports.getAllTools = async (req, res) => {
  try {
    const tools = await Tool.find();
    res.status(200).json(tools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new tool
exports.createTool = async (req, res) => {
  try {
    console.log("Creating tool with data:", req.body); // Log request data
    const tool = new Tool(req.body);
    await tool.save();
    res.status(201).json(tool);
  } catch (err) {
    console.error("Error creating tool:", err); // Log detailed error
    res.status(500).json({ error: err.message });
  }
};

// Update tool
exports.updateTool = async (req, res) => {
  try {
    const tool = await Tool.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }
    res.status(200).json(tool);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete tool
exports.deleteTool = async (req, res) => {
  try {
    const tool = await Tool.findByIdAndDelete(req.params.id);
    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }
    res.status(200).json({ message: "Tool deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update tool status with history logging
exports.updateToolStatus = async (req, res) => {
  const { toolId, status, reason } = req.body;
  
  try {
    const tool = await Tool.findById(toolId);
    
    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }
    
    // Create a log of the status change
    const statusLog = new StatusLog({
      toolId,
      previousStatus: tool.status,
      newStatus: status,
      reason,
      changedBy: req.body.changedBy || 'admin' // You can pass who changed it
    });
    
    // Update the tool's status
    tool.status = status;
    
    // Save both changes
    await Promise.all([tool.save(), statusLog.save()]);
    
    res.status(200).json({ tool, statusLog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get status history for a tool
exports.getStatusHistory = async (req, res) => {
  const { toolId } = req.params;
  
  try {
    const statusLogs = await StatusLog.find({ toolId })
      .sort({ createdAt: -1 });
    
    res.status(200).json(statusLogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Log maintenance
exports.logMaintenance = async (req, res) => {
  const { toolId, serviceDetails, nextScheduledService, damageReported } = req.body;
  
  try {
    const tool = await Tool.findById(toolId);
    
    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }
    
    const maintenance = new Maintenance({
      toolId,
      serviceDetails,
      nextScheduledService,
      damageReported,
      servicedBy: req.body.servicedBy || 'admin'
    });
    
    // If tool status should change to "under maintenance"
    if (req.body.updateStatus) {
      // Create status log
      const statusLog = new StatusLog({
        toolId,
        previousStatus: tool.status,
        newStatus: 'under maintenance',
        reason: `Maintenance: ${serviceDetails}`,
        changedBy: req.body.servicedBy || 'admin'
      });
      
      // Update tool status
      tool.status = 'under maintenance';
      
      await Promise.all([tool.save(), maintenance.save(), statusLog.save()]);
    } else {
      await maintenance.save();
    }
    
    res.status(201).json(maintenance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get maintenance history for a tool
exports.getMaintenanceHistory = async (req, res) => {
  const { toolId } = req.params;
  
  try {
    const maintenanceLogs = await Maintenance.find({ toolId })
      .sort({ serviceDate: -1 });
    
    res.status(200).json(maintenanceLogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Calculate depreciation for a tool
exports.calculateDepreciation = async (req, res) => {
  const { toolId } = req.params;
  try {
    const tool = await Tool.findById(toolId);
    const currentDate = moment();
    const yearsInUse = currentDate.diff(tool.purchaseDate, 'years');
    const depreciation = yearsInUse * tool.depreciationRate + (tool.usageHours / 1000);
    res.status(200).json({ depreciation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single tool by ID
exports.getToolById = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    
    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }
    
    res.status(200).json(tool);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};