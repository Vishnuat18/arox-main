const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/paymentController');
const upload = require('../../middleware/upload');

// POST /api/payments/submit-proof - Student uploads screenshot & transaction ID
router.post('/submit-proof', upload.single('receipt'), paymentController.submitProof);

// POST /api/payments/:id/verify - Admin verifies and approves/rejects payment
router.post('/:id/verify', paymentController.verifyPayment);

// POST /api/payments - Process payment (legacy/direct)
router.post('/', paymentController.processPayment);

// POST /api/payments/verify-coupon - Verify coupon code
router.post('/verify-coupon', paymentController.verifyCoupon);

module.exports = router;
