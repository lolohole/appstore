const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const profileRoute = require('./routes/profile');
// استيراد الملفات الخاصة بالمسارات
const routes = require('./routes/index');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');

const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // الاتصال بقاعدة البيانات
    await mongoose.connect('mongodb+srv://basemHalaika:V5ieA0XcG47tlo5h@clusterappstore.srfmfwr.mongodb.net/?retryWrites=true&w=majority&appName=clusterAppStore', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');

    // جعل بيانات الجلسة متاحة في جميع الصفحات



    // إعداد السيشن
    app.use(session({
      secret: 'your_secret_key', // ← غيّرها لقيمة سرية حقيقية
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // أسبوع
      }
    }));

    app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

    // Middleware
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, 'public')));

    // إعداد EJS
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));

    // ربط المسارات
    app.use('/', routes);         // صفحة رئيسية، عني، بورتفوليو، تواصل، إلخ
    app.use('/', registerRoute);  // تسجيل
    app.use('/', loginRoute);     // تسجيل دخول
    app.use('/', profileRoute);
    // معالجة الأخطاء
    app.use((err, req, res, next) => {
      console.error('❌ خطأ في السيرفر:', err.stack);
      res.status(500).send('حدث خطأ في السيرفر');
    });

    // بدء السيرفر
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ فشل الاتصال أو تشغيل التطبيق:', error);
  }
})();
