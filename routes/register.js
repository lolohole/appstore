const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', (req, res) => {
  res.render('register');
});

router.post('/', async (req, res) => {
  try {
    const { name, email, tiktokUsername } = req.body;

    const newUser = new User({ name, email, tiktokUsername });
    await newUser.save();

    req.session.user = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      tiktokUsername: newUser.tiktokUsername
    };

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send("حدث خطأ أثناء التسجيل.");
  }
});

module.exports = router;
