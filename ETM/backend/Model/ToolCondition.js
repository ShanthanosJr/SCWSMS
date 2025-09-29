// models/ToolCondition.js

const mongoose = require('mongoose');

const conditionSchema = new mongoose.Schema({
  rentalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rental', required: true },
  conditionAtReturn: { 
    type: String, 
    enum: ['good', 'damaged', 'worn-out'],
    required: true 
  },
  damageDetails: { type: String }, // Optional: Detailed damage description
}, { timestamps: true });

const ToolCondition = mongoose.model('ToolCondition', conditionSchema);

module.exports = ToolCondition;
