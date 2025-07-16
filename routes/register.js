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

    // إظهار الخطأ على المتصفح
    res.status(500).send(`
      <h2 style="color:red; text-align:center;">حدث خطأ أثناء التسجيل</h2>
      <pre style="color:#333; background:#f5f5f5; padding:15px; border-radius:10px; direction:ltr;">
${error.stack}
      </pre>
    `);
  }
});


module.exports = router;
