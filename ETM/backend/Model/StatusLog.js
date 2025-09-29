const mongoose = require('mongoose');

const statusLogSchema = new mongoose.Schema({
  toolId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tool',
    required: true 
  },
  previousStatus: { 
    type: String, 
    enum: ['available', 'in use', 'under maintenance', 'retired'],
    required: true 
  },
  newStatus: { 
    type: String, 
    enum: ['available', 'in use', 'under maintenance', 'retired'],
    required: true 
  },
  reason: { 
    type: String 
  },
  changedBy: { 
    type: String,
    default: 'admin'
  }
}, { timestamps: true });

const StatusLog = mongoose.model('StatusLog', statusLogSchema);

module.exports = StatusLog;