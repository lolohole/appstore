const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Start session timer
router.get('/startSession', async (req, res) => {
  if (!req.session.user) return res.status(401).send('Unauthorized');
  req.session.startTime = Date.now();
  res.send('Session started');
});

// End session and reward TikTok followers
router.get('/endSession', async (req, res) => {
  if (!req.session.user || !req.session.startTime) return res.status(400).send('Session not started');
  const durationMinutes = (Date.now() - req.session.startTime) / 1000 / 60;
  const user = await User.findById(req.session.user._id);
  let message = 'Session not completed yet.';
  if (durationMinutes >= 60) {
    user.tiktokFollowers = (user.tiktokFollowers || 0) + 10000;
    await user.save();
    req.session.user = user;
    message = 'Congratulations! You earned 10,000 TikTok followers!';
  }
  delete req.session.startTime;
  res.send(message);
});

module.exports = router;
