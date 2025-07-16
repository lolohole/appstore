const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');

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

// Export for Vercel
module.exports = app;
