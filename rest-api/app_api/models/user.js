const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  isAdmin: { type: Boolean, default: false },
  isSuspended: { type: Boolean, default: false },
  loginHistory: [{
    ipAddress: String,
    device: String,
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

mongoose.model('User', userSchema);
