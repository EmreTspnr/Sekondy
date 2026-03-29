const mongoose = require('mongoose');

const savedSearchSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  keyword: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: ''
  },
  condition: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  minPrice: {
    type: Number,
    default: 0
  },
  maxPrice: {
    type: Number,
    default: 0
  },
  notificationsEnabled: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

mongoose.model('SavedSearch', savedSearchSchema);