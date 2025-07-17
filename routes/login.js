const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', async (req, res) => {
  console.log("📩 بيانات تسجيل الدخول:", req.body);

  const { email } = req.body;

  try {
    const foundUser = await User.findOne({ email });
    console.log("🔍 المستخدم الموجود:", foundUser);

    if (!foundUser) {
      return res.send('البريد الإلكتروني غير مسجل.');
    }

    req.session.user = foundUser;
    res.redirect('/');
  } catch (error) {
    console.error("❌ خطأ في تسجيل الدخول:", error); // هذا سيطبع الخطأ الحقيقي
    res.status(500).send('حدث خطأ أثناء تسجيل الدخول.');
  }
});


module.exports = router;
