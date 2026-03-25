const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }, 
  listingType: { type: String, default: 'For Sale' }, 
  condition: { type: String }, 
  description: { type: String, required: true },
  location: { type: String, required: true }, 
  photos: [String], // Yüklenen fotoğrafların URL'lerini burada tutacağız
  owner: { type: String, required: false } 
}, { timestamps: true }); // İlanın eklenme tarihini otomatik tutar

mongoose.model('Listing', listingSchema);