const express = require('express');
const router = express.Router();
const path = require('path');
const pageController = require('../../controllers/pageController');

const rootDir = path.join(__dirname, '..', '..');

// Public Pages
router.get('/', (req, res) => res.sendFile(path.join(rootDir, 'index.html')));
router.get('/about', (req, res) => res.sendFile(path.join(rootDir, 'about.html')));
router.get('/contact', (req, res) => res.sendFile(path.join(rootDir, 'contact.html')));
router.get('/apply', (req, res) => res.sendFile(path.join(rootDir, 'apply.html')));
router.get(['/services', '/services.html'], (req, res) => res.sendFile(path.join(rootDir, 'services.html')));
router.get(['/courses', '/courses.html'], (req, res) => res.sendFile(path.join(rootDir, 'courses.html')));
router.get('/training', (req, res) => res.redirect('/courses.html?tab=training'));
router.get('/internships', (req, res) => res.redirect('/courses.html?tab=internship'));
router.get('/course/:slug', (req, res) => res.sendFile(path.join(rootDir, 'detail.html')));
router.get('/verify-certificate', (req, res) => res.redirect('/cert/index.html'));

// ERP Login & Signup pages
router.get('/login', pageController.login);
router.get(['/signup', '/register'], pageController.signup);

// Catch-all for 404
router.get('*', pageController.error);

module.exports = router;
