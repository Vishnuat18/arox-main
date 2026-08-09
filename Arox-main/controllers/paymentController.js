const { getDb } = require('../config/database');
const Payment = require('../models/Payment');
const Registration = require('../models/Registration');
const paymentService = require('../services/paymentService');
const { generatePaymentId, generateInvoiceNumber, calculateGST } = require('../utils/helpers');
const logger = require('../utils/logger');

const paymentController = {
  /**
   * POST /api/payments
   * Process a mock payment
   */
  async processPayment(req, res) {
    try {
      const { registration_id, amount, payment_method, payment_type } = req.body;

      // Get registration
      const registration = Registration.findByRegistrationId(registration_id);
      if (!registration) {
        return res.status(404).json({ success: false, message: 'Registration not found.' });
      }

      // Process mock payment
      const result = await paymentService.processPayment({
        amount,
        method: payment_method,
        studentId: registration.student_id,
        registrationId: registration.id
      });

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message
        });
      }

      // Calculate GST breakdown
      const gstInfo = calculateGST(amount);

      // Save payment record
      const payment = Payment.create({
        payment_id: result.paymentId,
        registration_id: registration.id,
        student_id: registration.student_id,
        amount: gstInfo.baseAmount,
        gst_amount: gstInfo.gstAmount,
        total_amount: amount,
        payment_method,
        payment_type: payment_type || 'full',
        transaction_id: result.transactionId,
        status: 'completed',
        invoice_number: result.invoiceNumber,
        paid_at: new Date().toISOString()
      });

      // Update registration payment status
      const newPaidAmount = registration.paid_amount + amount;
      const newBalance = registration.total_amount - newPaidAmount;
      Registration.updatePayment(registration.id, newPaidAmount, Math.max(0, newBalance));

      if (newBalance <= 0) {
        Registration.updateStatus(registration.id, 'active');
      }

      res.json({
        success: true,
        message: 'Payment processed successfully! ✅',
        data: {
          paymentId: result.paymentId,
          transactionId: result.transactionId,
          invoiceNumber: result.invoiceNumber,
          amount,
          gst: gstInfo.gstAmount,
          status: 'completed'
        }
      });
    } catch (error) {
      logger.error('Payment error:', error);
      res.status(500).json({ success: false, message: 'Payment processing failed.' });
    }
  },

  /**
   * POST /api/payments/verify-coupon
   */
  verifyCoupon(req, res) {
    try {
      const { code, amount } = req.body;
      const db = getDb();
      const result = paymentService.verifyCoupon(db, code, amount);

      res.json({
        success: result.valid,
        message: result.message,
        data: result.valid ? result.coupon : null
      });
    } catch (error) {
      logger.error('Coupon verification error:', error);
      res.status(500).json({ success: false, message: 'Failed to verify coupon.' });
    }
  }
};

module.exports = paymentController;
