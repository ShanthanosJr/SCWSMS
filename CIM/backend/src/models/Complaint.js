const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    ticket: { type: String, unique: true, index: true },                  // e.g., CMP-2025-1001
    area: { type: String, required: true, trim: true },
    type: { type: String, enum: ['SAFETY', 'QUALITY', 'DELAY', 'OTHER'], required: true },
    status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'], default: 'OPEN' },
    description: String,
    photoUrl: String,

    // NEW: who submitted (shown in dashboard/list), with validations
    complainantName: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: v => /^[A-Za-z\s.'-]+$/.test(v), // letters and standard name punctuation only
        message: 'Name must contain letters only'
      }
    },
    complainantId: { type: String, required: true, trim: true },
    mobile: {
      type: String,
      required: true,
      validate: { validator: v => /^\d{10}$/.test(v), message: 'Mobile must be 10 digits' }
    },

    assignee: String,
    escalated: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// simple ticket generator
complaintSchema.pre('validate', function (next) {
  if (!this.ticket) {
    const y = new Date().getFullYear();
    const seq = Math.floor(Math.random() * 9000 + 1000);
    this.ticket = `CMP-${y}-${seq}`;
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
