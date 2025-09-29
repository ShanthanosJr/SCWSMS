// models/Tool.js

const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
  model: { type: String, required: true },
  serial: { type: String, required: true, unique: true },
  purchaseDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['available', 'in use', 'under maintenance', 'retired'], 
    default: 'available' 
  },
  depreciationRate: { type: Number, default: 0.1 },
  usageHours: { type: Number, default: 0 },
  price: { type: Number, required: true }, // <-- Added
  image: { type: String }, // <-- Added (base64 string)
}, { timestamps: true });

const Tool = mongoose.model('Tool', toolSchema);

module.exports = Tool;
