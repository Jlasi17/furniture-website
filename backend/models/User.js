const mongoose = require('mongoose');

// Firebase manages passwords — no bcrypt needed
const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, unique: true, sparse: true },
  name: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, required: true, default: false },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
