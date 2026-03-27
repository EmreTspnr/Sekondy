const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  }
}, { timestamps: true });

// Bir kullanıcı aynı ilanı iki kez favorilere ekleyemesin diye unique index atıyoruz
favoriteSchema.index({ user: 1, listing: 1 }, { unique: true });

mongoose.model('Favorite', favoriteSchema);