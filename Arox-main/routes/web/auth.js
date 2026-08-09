const express = require('express');
const router = express.Router();
const pageController = require('../../controllers/pageController');

// ERP Login page
router.get('/login', pageController.login);

// Redirect public training/internships to static files
router.get('/training', (req, res) => res.redirect('/courses.html?tab=training'));
router.get('/internships', (req, res) => res.redirect('/courses.html?tab=internship'));

// Catch-all for 404
router.get('*', pageController.error);

module.exports = router;
