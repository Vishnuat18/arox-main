const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const { authenticate } = require('../../middleware/auth');
const { loginRules, validate } = require('../../middleware/validation');

// POST /api/auth/login
router.post('/login', loginRules, validate, authController.login);

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/forgot-password
router.post('/forgot-password', authController.forgotPassword);

// POST /api/auth/logout
router.post('/logout', authController.logout);

// GET /api/auth/me (protected)
router.get('/me', authenticate, authController.me);

module.exports = router;
