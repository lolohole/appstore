const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  tiktokUsername: String,
  avatar: { type: String, default: '/images/profile.png' },
  bio: { type: String, default: '' },
  links: {
    tiktok: String,
    instagram: String,
    github: String
  }
});

module.exports = mongoose.model('User', userSchema);
