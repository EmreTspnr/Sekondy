const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    reportedBy: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' }
}, { timestamps: true });

mongoose.model('Report', reportSchema);