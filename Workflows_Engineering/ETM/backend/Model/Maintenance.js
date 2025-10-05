const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  toolId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tool',
    required: true 
  },
  serviceDate: { 
    type: Date, 
    default: Date.now 
  },
  serviceDetails: { 
    type: String, 
    required: true 
  },
  nextScheduledService: { 
    type: Date 
  },
  damageReported: { 
    type: String 
  },
  servicedBy: { 
    type: String, 
    default: 'admin' 
  }
}, { timestamps: true });

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

module.exports = Maintenance;