const mongoose = require('mongoose');
const InspectionResultSchema = new mongoose.Schema({
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'InspectionSchedule', unique: true, required: true },
  outcome: { type: String, enum: ['PASS','FAIL'], required: true },
  score: { type: Number, min: 0, max: 100, default: 100 },
  notes: String,
  attachments: [String]
}, { timestamps: true });
module.exports = mongoose.model('InspectionResult', InspectionResultSchema);
