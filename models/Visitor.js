const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ip: String,
  userAgent: String,
  browser: String,
  os: String,
  device: String,
  language: String,
  country: String,
  city: String,
  continent: String,
  referrer: String,
  visitTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visitor', visitorSchema);
