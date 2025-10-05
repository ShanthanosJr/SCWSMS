const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  birthdate: { type: Date },
  role: { type: String, enum: ['ADMIN','WORKER'], default: 'WORKER', index: true }
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);
