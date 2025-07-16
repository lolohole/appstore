const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Message = require('../models/messageModel');

// ✅ الصفحة الرئيسية
router.get('/', (req, res) => {
  res.render('index', {
    title: "مرحبًا بك في موقعي الشخصي",
    description: "مطور ويب ومطور تطبيقات أندرويد",
  });
});

// ✅ صفحة التسجيل
router.get('/register', (req, res) => {
  res.render('register');
});

// ✅ صفحة تسجيل الدخول
router.get('/login', (req, res) => {
  res.render('login');
});

// ✅ صفحة الملف الشخصي
router.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('profile', { user: req.session.user });
});

// ✅ تسجيل الخروج
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.error(err);
    res.redirect('/login');
  });
});

// ✅ صفحة عني
router.get('/about', (req, res) => {
  res.render('about', {
    title: "عنّي",
    content: "أنا مطور ويب محترف مع خبرة واسعة في تطوير واجهات أمامية وخلفية...",
  });
});

router.get('/sites', (req, res) => {
  res.render('sites', {
    title: "عنّي",
    content: "أنا مطور ويب محترف مع خبرة واسعة في تطوير واجهات أمامية وخلفية...",
  });
});

router.get('/apps', (req, res) => {
  res.render('apps', {
    title: "عنّي",
    content: "أنا مطور ويب محترف مع خبرة واسعة في تطوير واجهات أمامية وخلفية...",
  });
});

// ✅ صفحة المشاريع
router.get('/portfolio', async (req, res) => {
  try {
    const projects = await Project.find();
    res.render('portfolio', { title: "مشاريعي", projects });
  } catch (err) {
    res.status(500).send("خطأ في جلب المشاريع");
  }
});

// ✅ صفحة التواصل - عرض النموذج
router.get('/contact', (req, res) => {
  res.render('contact', { title: "اتصل بي" });
});

// ✅ استقبال رسالة تواصل
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    res.send(`
      <html><head><link rel="stylesheet" href="/styles.css"></head>
      <body>
        <div class="notification">Your message has been received. Thank you!</div>
        <script>
          setTimeout(() => {
            document.querySelector('.notification').style.display = 'none';
          }, 5000);
        </script>
      </body></html>
    `);
  } catch (error) {
    console.error(error);
    res.send(`
      <html><head><link rel="stylesheet" href="/styles.css"></head>
      <body>
        <div class="notification">Failed to send message.</div>
        <script>
          setTimeout(() => {
            document.querySelector('.notification').style.display = 'none';
          }, 5000);
        </script>
      </body></html>
    `);
  }
});

// ✅ صفحة إضافة مشروع (اختياري)
router.get('/add-project', (req, res) => {
  res.render('addProject');
});

router.post('/add-project', async (req, res) => {
  const { title, description, image, link } = req.body;
  try {
    const newProject = new Project({ title, description, image, link });
    await newProject.save();
    res.redirect('/portfolio');
  } catch (err) {
    res.status(500).send('حدث خطأ أثناء حفظ المشروع');
  }
});

module.exports = router;
