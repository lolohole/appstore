const express = require('express'); // ← تأكد من إضافته هنا
const router = express.Router();
const User = require('../models/User');
router.post('/register', async (req, res) => {
  try {
    const { name, email, tiktokUsername } = req.body;

    const newUser = new User({ name, email, tiktokUsername });
    await newUser.save();

    // حفظ الجلسة
    req.session.user = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      tiktokUsername: newUser.tiktokUsername
    };

    res.redirect('/');
 } catch (error) {
    console.error('❌ خطأ في التسجيل:', error);
    res.status(500).send("حدث خطأ أثناء التسجيل.");
  }
});

module.exports = router;
