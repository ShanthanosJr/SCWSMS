const mongoose = require('mongoose');
const InspectionScheduleSchema = new mongoose.Schema({
  area: { type: String, required: true, index: true },
  project: { type: String, default: '' },
  inspector: { type: String, required: true, index: true },
  dueAt: { type: Date, required: true, index: true },
  status: { type: String, enum: ['UPCOMING','COMPLETED','OVERDUE','CANCELLED'], default: 'UPCOMING', index: true },
  createdBy: { type: String, required: true },
  notes: String,
  reminders: { h24At: Date, h1At: Date, overdueAt: Date }
}, { timestamps: true });
InspectionScheduleSchema.index({ dueAt: 1, status: 1 });
module.exports = mongoose.model('InspectionSchedule', InspectionScheduleSchema);
