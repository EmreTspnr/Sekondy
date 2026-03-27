const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  listing: { // Hangi ilan için mesajlaşılıyor (İsteğe bağlı ama e-ticaret için önemlidir)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing'
  },
  content: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

mongoose.model('Message', messageSchema);