const mongoose = require('mongoose');
const ComplianceDailySchema = new mongoose.Schema({
  area: { type: String, index: true, required: true },
  date: { type: Date, required: true },
  completed: { type: Number, default: 0 },
  passed: { type: Number, default: 0 },
  score: { type: Number, default: 0 }
}, { timestamps: true });
ComplianceDailySchema.index({ area: 1, date: 1 }, { unique: true });
module.exports = mongoose.model('ComplianceDaily', ComplianceDailySchema);
