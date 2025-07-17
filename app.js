const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const axios = require('axios');
const Visitor = require('./models/Visitor');

const profileRoute = require('./routes/profile');
const routes = require('./routes/index');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');

const app = express();

// استخدام متغيرات البيئة
const mongoUrl = process.env.MONGO_URL || 'mongodb+srv://basemHalaika:V5ieA0XcG47tlo5h@cluster.mongodb.net/yourDatabaseName?retryWrites=true&w=majority';

// إعداد الجلسة وتخزينها في MongoDB
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl,
    collectionName: 'sessions',
    ttl: 7 * 24 * 60 * 60 // أسبوع
  }),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false // true إذا تستخدم HTTPS
  }
}));

// تمرير بيانات الجلسة للـ views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// إعداد الميدلوير
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// إعداد المحرك EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ميدلوير لتتبع الزوار
app.use(async (req, res, next) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const language = req.headers['accept-language'];
    const referrer = req.get('Referrer') || 'Direct';

    const geoResponse = await axios.get(`https://ipapi.co/${ip}/json/`);
    const geoData = geoResponse.data;

    if (geoData && geoData.country_name) {
      const visitor = new Visitor({
        ip,
        userAgent,
        browser: parseBrowser(userAgent),
        os: parseOS(userAgent),
        device: detectDevice(userAgent),
        language,
        country: geoData.country_name,
        city: geoData.city || 'Unknown',
        continent: geoData.continent_name || 'Unknown',
        referrer
      });

      await visitor.save();
    }
  } catch (err) {
    console.error('Visitor Tracking Error:', err.message);
  }

  next();
});

// تعريف المسارات
app.use('/', routes);
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/profile', profileRoute);

// معالج أخطاء عام
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).send('حدث خطأ في الخادم');
});

// الاتصال بقاعدة MongoDB
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// دوال مساعدة لتحليل الـ User Agent
function parseBrowser(ua) {
  if (/chrome/i.test(ua)) return 'Chrome';
  if (/firefox/i.test(ua)) return 'Firefox';
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return 'Safari';
  if (/edge/i.test(ua)) return 'Edge';
  if (/msie/i.test(ua) || /trident/i.test(ua)) return 'IE';
  return 'Other';
}

function parseOS(ua) {
  if (/windows/i.test(ua)) return 'Windows';
  if (/mac os/i.test(ua)) return 'MacOS';
  if (/android/i.test(ua)) return 'Android';
  if (/linux/i.test(ua)) return 'Linux';
  if (/iphone/i.test(ua)) return 'iOS';
  return 'Other';
}

function detectDevice(ua) {
  if (/mobile/i.test(ua)) return 'Mobile';
  if (/tablet/i.test(ua)) return 'Tablet';
  return 'Desktop';
}

// ✅ تشغيل السيرفر
const PORT = process.env.PORT || 3000;

module.exports = app;
