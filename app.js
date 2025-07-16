const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');

const profileRoute = require('./routes/profile');
const routes = require('./routes/index');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');

const app = express();

// إعداد الجلسات
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // أسبوع
  }
}));

// جعل بيانات الجلسة متاحة في جميع الصفحات
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// إعداد EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ربط المسارات
app.use('/', routes);
app.use('/', registerRoute);
app.use('/', loginRoute);
app.use('/', profileRoute);

// معالجة الأخطاء
app.use((err, req, res, next) => {
  console.error('❌ خطأ في السيرفر:', err.stack);
  res.status(500).send('حدث خطأ في السيرفر');
});

// الاتصال بقاعدة البيانات
mongoose.connect('mongodb+srv://basemHalaika:V5ieA0XcG47tlo5h@clusterappstore.srfmfwr.mongodb.net/?retryWrites=true&w=majority&appName=clusterAppStore', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB Connected');
}).catch((err) => {
  console.error('❌ فشل الاتصال بقاعدة البيانات:', err);
});

// تصدير التطبيق لـ Vercel (بدون listen)
module.exports = app;
