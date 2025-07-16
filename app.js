const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // 🟢 استدعاء مكتبة التخزين في MongoDB

const profileRoute = require('./routes/profile');
const routes = require('./routes/index');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');

const app = express();

// 🔐 رابط الاتصال بقاعدة البيانات
const mongoUrl = 'mongodb+srv://basemHalaika:V5ieA0XcG47tlo5h@clusterappstore.srfmfwr.mongodb.net/yourDatabaseName?retryWrites=true&w=majority&appName=clusterAppStore';

// 🟢 إعداد الجلسات لتُحفظ داخل MongoDB
app.use(session({
  secret: 'your_secret_key', // استبدلها بمفتاح أقوى في الإنتاج
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoUrl,
    collectionName: 'sessions',       // اسم التجميع داخل MongoDB
    ttl: 7 * 24 * 60 * 60             // الجلسة تبقى أسبوع (بالثواني)
  }),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,  // أسبوع (بالمللي ثانية)
    httpOnly: true,
    secure: false                     // 🔒 اجعلها true إذا تستخدم HTTPS (على Vercel يفضل تركها false في البداية)
  }
}));

// 🟢 جعل بيانات الجلسة متاحة في جميع الصفحات
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// 🔧 Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 🖼️ إعداد EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 🔗 ربط المسارات
app.use('/', routes);
app.use('/', registerRoute);
app.use('/', loginRoute);
app.use('/', profileRoute);

// ❌ معالجة الأخطاء
app.use((err, req, res, next) => {
  console.error('❌ خطأ في السيرفر:', err.stack);
  res.status(500).send('حدث خطأ في السيرفر');
});

// 🟢 الاتصال بقاعدة البيانات
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB Connected');
}).catch((err) => {
  console.error('❌ فشل الاتصال بقاعدة البيانات:', err);
});

// ⏏️ تصدير التطبيق لـ Vercel
module.exports = app;
