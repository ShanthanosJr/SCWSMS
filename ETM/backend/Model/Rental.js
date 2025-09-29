// models/Rental.js

const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  toolId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tool',
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'RentalUser',
    required: true 
  },
  rentalStartDate: { 
    type: Date, 
    default: Date.now,
    required: true 
  },
  rentalEndDate: { 
    type: Date,
    required: true 
  },
  actualReturnDate: { 
    type: Date 
  },
  status: { 
    type: String, 
    enum: ['rented', 'returned', 'overdue'],
    default: 'rented'
  },
  notes: { 
    type: String 
  },
  totalPrice: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Rental = mongoose.model('Rental', rentalSchema);

module.exports = Rental;
