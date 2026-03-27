const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }, 
  listingType: { type: String, default: 'For Sale' }, 
  condition: { type: String }, 
  summary: { type: String, required: true }, // Unutulan özet alanı eklendi
  description: { type: String, required: true },
  location: { type: String, required: true }, 
  photos: [String], 
  owner: { type: String, required: false },
  isShowcase: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' } // Veysel'in kodları için içeriye eklendi
}, { timestamps: true }); 

mongoose.model('Listing', listingSchema);