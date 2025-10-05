// models/RentalUser.js

const mongoose = require('mongoose');

const rentalUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'user', 'team'], default: 'user' },
  rentalLimit: { type: Number, default: 3 },  // Maximum number of tools a user can rent at a time
  activeRentals: { type: Number, default: 0 },  // Tracks the number of active rentals for the user
  rentalHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rental' }],  // References all completed rentals
}, { timestamps: true });

rentalUserSchema.methods.incrementActiveRentals = function() {
  this.activeRentals += 1;
  this.save();
};

rentalUserSchema.methods.decrementActiveRentals = function() {
  if (this.activeRentals > 0) {
    this.activeRentals -= 1;
    this.save();
  }
};

const RentalUser = mongoose.model('RentalUser', rentalUserSchema);

module.exports = RentalUser;
