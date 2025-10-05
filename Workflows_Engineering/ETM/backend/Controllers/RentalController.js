// controllers/rentalController.js

const Rental = require('../Model/Rental');
const RentalUser = require('../Model/RentedUser');
const Tool = require('../Model/Tool');
const StatusLog = require('../Model/StatusLog');
const moment = require('moment');

// Start a rental
exports.startRental = async (req, res) => {
  const { toolId, userId, rentalEndDate } = req.body;
  try {
    const rental = new Rental({
      toolId,
      userId,
      rentalStartDate: new Date(),
      rentalEndDate,
    });

    const rentalUser = await RentalUser.findById(userId);
    rentalUser.incrementActiveRentals();

    const tool = await Tool.findById(toolId);
    tool.status = 'in use';
    await tool.save();

    await rental.save();
    rentalUser.rentalHistory.push(rental._id);
    await rentalUser.save();

    res.status(201).json(rental);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// End a rental
exports.endRental = async (req, res) => {
  const { rentalId } = req.body;
  
  try {
    // Find the rental
    const rental = await Rental.findById(rentalId);
    
    if (!rental) {
      return res.status(404).json({ error: "Rental not found" });
    }
    
    // Get the tool
    const tool = await Tool.findById(rental.toolId);
    
    if (!tool) {
      return res.status(404).json({ error: "Associated tool not found" });
    }
    
    // Update rental status
    rental.status = "returned";
    rental.actualReturnDate = new Date();
    
    // Update tool status back to available
    tool.status = "available";
    
    // Create status log entry
    const statusLog = new StatusLog({
      toolId: tool._id,
      previousStatus: "in use",
      newStatus: "available",
      reason: `Tool returned from rental #${rental._id}`,
      changedBy: "admin"
    });
    
    // Save all changes
    await Promise.all([
      rental.save(),
      tool.save(),
      statusLog.save()
    ]);
    
    res.status(200).json({ 
      message: "Rental completed successfully",
      rental 
    });
    
  } catch (err) {
    console.error("Error ending rental:", err);
    res.status(500).json({ error: err.message });
  }
};

// View current rentals
exports.viewCurrentRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ status: 'rented' }).populate('toolId').populate('userId');
    res.status(200).json(rentals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View overdue rentals
exports.viewOverdueRentals = async (req, res) => {
  const currentDate = moment();
  try {
    const overdueRentals = await Rental.find({ rentalEndDate: { $lt: currentDate }, status: 'rented' });
    res.status(200).json(overdueRentals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRental = async (req, res) => {
  const { toolId, rentalStartDate, rentalEndDate, totalPrice, userId } = req.body;
  
  try {
    const tool = await Tool.findById(toolId);

    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }

    if (tool.status !== "available") {
      return res.status(400).json({ error: "Tool is not available for rent" });
    }

    // Use the provided userId or a default one for testing
    const rentalUserId = userId || "65646ace43a19bca9af0907d"; // Hardcoded user ID
    
    // Create a rental record without checking user existence or limits
    const rental = new Rental({
      toolId,
      userId: rentalUserId,
      rentalStartDate,
      rentalEndDate,
      totalPrice,
      status: 'rented'
    });

    // Update tool status to "in use"
    tool.status = "in use";
    
    // Create a status log entry
    const statusLog = new StatusLog({
      toolId,
      previousStatus: "available",
      newStatus: "in use",
      reason: `Rented by demo user`,
      changedBy: "system"
    });
    
    // Save the rental and update tool status
    await Promise.all([rental.save(), tool.save(), statusLog.save()]);

    res.status(201).json(rental);
  } catch (err) {
    console.error("Rental creation error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update rental notes
exports.updateRentalNotes = async (req, res) => {
  const { rentalId, notes } = req.body;
  
  try {
    const rental = await Rental.findById(rentalId);
    
    if (!rental) {
      return res.status(404).json({ error: "Rental not found" });
    }
    
    rental.notes = notes;
    await rental.save();
    
    res.status(200).json(rental);
  } catch (err) {
    console.error("Error updating rental notes:", err);
    res.status(500).json({ error: err.message });
  }
};

// View rental history (returned rentals)
exports.viewRentalHistory = async (req, res) => {
  try {
    const rentals = await Rental.find({ status: "returned" })
      .populate('toolId')
      .populate('userId')
      .sort({ actualReturnDate: -1 }) // Most recently returned first
      .limit(100); // Limit to prevent loading too much data
    
    res.status(200).json(rentals);
  } catch (err) {
    console.error("Error fetching rental history:", err);
    res.status(500).json({ error: err.message });
  }
};