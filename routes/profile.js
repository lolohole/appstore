const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/User');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// GET edit profile page
router.get('/profile/edit', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('editProfile', { user: req.session.user });
});

// POST edit profile
router.post('/profile/edit', upload.single('avatar'), async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const { fullName, email, phone, location, dob, gender, bio, tiktok, instagram, github } = req.body;
  const updateData = {
    fullName, email, phone, location, dob, gender, bio,
    links: { tiktok, instagram, github }
  };
  if (req.file) updateData.avatar = '/uploads/' + req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.session.user._id, updateData, { new: true });
  req.session.user = updatedUser;
  res.redirect('/profile');
});

// POST delete profile
router.post('/profile/delete', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  await User.findByIdAndDelete(req.session.user._id);
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
