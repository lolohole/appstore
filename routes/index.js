const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Message = require('../models/messageModel');

// Home page
router.get('/', (req, res) => {
  res.render('index', {
    title: "Welcome to My Personal Site",
    description: "Web developer and Android app developer"
  });
});

// Register
router.get('/register', (req, res) => res.render('register'));

// Login
router.get('/login', (req, res) => res.render('login'));

// Profile page (protected)
router.get('/profile', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('profile', { user: req.session.user });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.error(err);
    res.redirect('/login');
  });
});

// About page
router.get('/about', (req, res) => {
  res.render('about', {
    title: "About Me",
    content: "I’m a web developer with extensive experience in front-end and back-end development."
  });
});

// Sites and Apps pages (if needed)
router.get('/sites', (req, res) => res.render('sites', { title: "My Sites", content: "Details about my sites..." }));
router.get('/apps', (req, res) => res.render('apps', { title: "My Apps", content: "Details about my apps..." }));

// Portfolio page
router.get('/portfolio', async (req, res) => {
  try {
    const projects = await Project.find();
    res.render('portfolio', { title: "My Projects", projects });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching projects");
  }
});

// Contact form (GET)
router.get('/contact', (req, res) => res.render('contact', { title: "Contact Me" }));

// Contact form (POST)
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    await new Message({ name, email, message }).save();
    res.send(`<div class="notification">Your message has been received. Thank you!</div>`);
  } catch (error) {
    console.error(error);
    res.send(`<div class="notification">Failed to send message.</div>`);
  }
});

// Add project (GET & POST)
router.get('/add-project', (req, res) => res.render('addProject'));
router.post('/add-project', async (req, res) => {
  const { title, description, image, link } = req.body;
  try {
    await new Project({ title, description, image, link }).save();
    res.redirect('/portfolio');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving project');
  }
});

module.exports = router;
