const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  isSuspended: { type: Boolean, default: false }, // Veysel'in ban sistemi için
  loginHistory: [{ // Furkan'ın giriş takibi için
    ipAddress: String,
    device: String,
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

mongoose.model('User', userSchema);