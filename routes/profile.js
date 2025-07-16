const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/User');

// إعداد multer لرفع الصورة
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// صفحة تعديل البروفايل
router.get('/profile/edit', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('editProfile', { user: req.session.user });
});

// تعديل البروفايل وحفظ الصورة
router.post('/profile/edit', upload.single('avatar'), async (req, res) => {
  const { bio, tiktok, instagram, github } = req.body;
  const updateData = {
    bio,
    links: { tiktok, instagram, github }
  };

  if (req.file) {
    updateData.avatar = '/uploads/' + req.file.filename;
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.session.user._id,
    updateData,
    { new: true }
  );

  req.session.user = updatedUser;
  res.redirect('/profile');
});

router.get('/profile', (req, res) => {
  console.log('الجلسة الحالية:', req.session.user);

  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render('profile', { user: req.session.user });
});


module.exports = router;
