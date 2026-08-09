const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const roleGuard = require('../../middleware/roleGuard');

// Controllers
const dashboardController = require('../../controllers/student/dashboardController');
const coursesController = require('../../controllers/student/coursesController');
const paymentsController = require('../../controllers/student/paymentsController');
const profileController = require('../../controllers/student/profileController');

// Secure all student routes
router.use(authenticate);
router.use(roleGuard('student'));

// --- Dashboard ---
router.get('/dashboard', dashboardController.index);

// --- Courses ---
router.get('/courses', coursesController.index);
router.get('/courses/:id', coursesController.show);

// --- Payments ---
router.get('/payments', paymentsController.index);

// --- Profile ---
router.get('/profile', profileController.index);

module.exports = router;
