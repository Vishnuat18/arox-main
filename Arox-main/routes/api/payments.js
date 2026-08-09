const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/paymentController');

// POST /api/payments - Process payment
router.post('/', paymentController.processPayment);

// POST /api/payments/verify-coupon - Verify coupon code
router.post('/verify-coupon', paymentController.verifyCoupon);

module.exports = router;
