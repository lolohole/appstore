const express = require('express');
const router = express.Router();
const User = require('../models/User'); // تأكد أن المسار صحيح

// صفحة تسجيل الدخول - GET
router.get('/login', (req, res) => {
  res.render('login');
});

// تسجيل الدخول - POST
router.post('/login', async (req, res) => {
  const { email } = req.body;

  try {
    // 🔍 البحث عن المستخدم
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.send('البريد الإلكتروني غير مسجل.');
    }

    // حفظ المستخدم في الجلسة
    req.session.user = foundUser;

    // إعادة التوجيه إلى الصفحة الرئيسية
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('حدث خطأ أثناء تسجيل الدخول.');
  }
});

module.exports = router;
