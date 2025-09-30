const mongoose = require('mongoose');


const CrackerSchema = new mongoose.Schema({
title: { type: String, required: true }, // e.g., "Rockets", "Sparklers"
name: { type: String, required: true }, // product name
price: { type: Number, required: true },
imageUrl: { type: String },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Cracker', CrackerSchema);