const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const Visitor = require('./models/Visitor');
const axios = require('axios');

const profileRoute = require('./routes/profile');
const routes = require('./routes/index');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');

const app = express();


// MongoDB connection URL
const mongoUrl = 'mongodb+srv://basemHalaika:V5ieA0XcG47tlo5h@clusterappstore.srfmfwr.mongodb.net/yourDatabaseName?retryWrites=true&w=majority';

// Session setup stored in MongoDB
app.use(session({
  secret: 'your_secret_key', // Replace with a stronger secret in production
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl,
    collectionName: 'sessions',
    ttl: 7 * 24 * 60 * 60 // 1 week in seconds
  }),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,  // 1 week in ms
    httpOnly: true,
    secure: false // Set true if using HTTPS
  }
}));

// Make session user available in views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(async (req, res, next) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const language = req.headers['accept-language'];
    const referrer = req.get('Referrer') || 'Direct';

    // استدعاء API لجلب البلد
    const geoResponse = await axios.get(`https://ipapi.co/${ip}/json/`);
    const geoData = geoResponse.data;

    const visitor = new Visitor({
      ip,
      userAgent,
      browser: parseBrowser(userAgent),
      os: parseOS(userAgent),
      device: detectDevice(userAgent),
      language,
      country: geoData.country_name,
      city: geoData.city,
      continent: geoData.continent_name,
      referrer
    });

    await visitor.save();
  } catch (err) {
    console.error('Visitor Tracking Error:', err.message);
  }

  next();
});

// Routes
app.use('/', routes);
app.use('/', registerRoute);
app.use('/', loginRoute);
app.use('/', profileRoute);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).send('An internal server error occurred');
});

// Connect to MongoDB
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));
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

// Export for Vercel

module.exports = app;
