const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', async (req, res) => {
  console.log("Login POST body:", req.body);
  const { email } = req.body;

  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.send('البريد الإلكتروني غير مسجل.');
    }

    req.session.user = foundUser;
    res.redirect('/');
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).send('حدث خطأ أثناء تسجيل الدخول.');
  }
});

module.exports = router;
