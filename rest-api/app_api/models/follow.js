const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Aynı kullanıcı aynı satıcıyı iki kere takip etmesin
followSchema.index({ follower: 1, seller: 1 }, { unique: true });

mongoose.model('Follow', followSchema);