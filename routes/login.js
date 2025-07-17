const express = require('express');
const router = express.Router();
const User = require('../models/User'); // تأكد أن المسار صحيح

// صفحة تسجيل الدخول - GET
router.get('/', (req, res) => {
  res.render('login');
});

// تسجيل الدخول - POST
router.post('/', async (req, res) => {
  const { email } = req.body;

  try {
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.send('البريد الإلكتروني غير مسجل.');
    }

    req.session.user = foundUser;
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('حدث خطأ أثناء تسجيل الدخول.');
  }
});

module.exports = router;
