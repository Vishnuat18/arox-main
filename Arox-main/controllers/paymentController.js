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
   * POST /api/payments/submit-proof
   * Student uploads payment screenshot and transaction ID for verification
   */
  async submitProof(req, res) {
    try {
      const { registration_id, amount, payment_method, transaction_id, notes } = req.body;
      const db = getDb();

      // Find registration by ID (number or registration_id string)
      let reg = null;
      if (!isNaN(registration_id) && Number.isInteger(Number(registration_id))) {
        reg = db.prepare('SELECT * FROM registrations WHERE id = ?').get(parseInt(registration_id, 10));
      }
      if (!reg) {
        reg = db.prepare('SELECT * FROM registrations WHERE registration_id = ?').get(String(registration_id));
      }

      if (!reg) {
        return res.status(404).json({ success: false, message: 'Registration record not found.' });
      }

      const receiptPath = req.file ? `/uploads/receipts/${req.file.filename}` : null;
      const parsedAmount = parseFloat(amount) || reg.balance_amount || reg.total_amount;
      const paymentId = generatePaymentId();
      const invoiceNumber = generateInvoiceNumber();
      const gstInfo = calculateGST(parsedAmount);

      // Create pending payment record
      db.prepare(`
        INSERT INTO payments (
          payment_id, registration_id, student_id, amount, gst_amount, total_amount,
          payment_method, payment_type, transaction_id, status, invoice_number, receipt_path, notes, created_at
        ) VALUES (
          @payment_id, @registration_id, @student_id, @amount, @gst_amount, @total_amount,
          @payment_method, @payment_type, @transaction_id, 'pending', @invoice_number, @receipt_path, @notes, CURRENT_TIMESTAMP
        )
      `).run({
        payment_id: paymentId,
        registration_id: reg.id,
        student_id: reg.student_id,
        amount: gstInfo.baseAmount,
        gst_amount: gstInfo.gstAmount,
        total_amount: parsedAmount,
        payment_method: payment_method || 'upi',
        payment_type: parsedAmount >= reg.total_amount ? 'full' : 'advance',
        transaction_id: transaction_id || 'PENDING-VERIFICATION',
        invoice_number: invoiceNumber,
        receipt_path: receiptPath,
        notes: notes || 'Submitted via Student Portal for Verification'
      });

      // Update registration status to indicate pending verification if it was pending
      db.prepare(`
        UPDATE registrations 
        SET notes = coalesce(notes || ' | ', '') || 'Payment proof submitted (UTR: ' || @utr || ')'
        WHERE id = @id
      `).run({ utr: transaction_id || 'N/A', id: reg.id });

      logger.info(`Payment proof submitted: ${paymentId} for registration ${reg.registration_id} by student ${reg.student_id}`);

      res.json({
        success: true,
        message: 'Payment screenshot submitted successfully! Our admin team will verify it shortly. ✅',
        data: {
          paymentId,
          transactionId: transaction_id,
          receiptPath,
          status: 'pending'
        }
      });
    } catch (error) {
      logger.error('Payment proof submission error:', error);
      res.status(500).json({ success: false, message: 'Failed to submit payment proof. ' + error.message });
    }
  },

  /**
   * POST /api/payments/:id/verify
   * Admin approves or rejects a payment proof
   */
  async verifyPayment(req, res) {
    try {
      const { id } = req.params;
      const { status, admin_notes } = req.body; // status: 'completed' or 'failed'
      const db = getDb();

      let payment = null;
      if (!isNaN(id) && Number.isInteger(Number(id))) {
        payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(parseInt(id, 10));
      }
      if (!payment) {
        payment = db.prepare('SELECT * FROM payments WHERE payment_id = ?').get(String(id));
      }

      if (!payment) {
        return res.status(404).json({ success: false, message: 'Payment record not found.' });
      }

      if (status === 'completed') {
        // Approve payment
        db.prepare(`
          UPDATE payments 
          SET status = 'completed', paid_at = CURRENT_TIMESTAMP, notes = coalesce(notes || ' | ', '') || @admin_notes
          WHERE id = @id
        `).run({ id: payment.id, admin_notes: admin_notes ? `Admin verified: ${admin_notes}` : 'Admin verified' });

        // Update registration balances & status
        const reg = db.prepare('SELECT * FROM registrations WHERE id = ?').get(payment.registration_id);
        if (reg) {
          const newPaid = reg.paid_amount + payment.total_amount;
          const newBalance = Math.max(0, reg.total_amount - newPaid);
          const newStatus = (reg.status === 'pending' || reg.status === 'confirmed') ? 'confirmed' : reg.status;

          db.prepare(`
            UPDATE registrations 
            SET paid_amount = @paid, balance_amount = @balance, status = @status
            WHERE id = @id
          `).run({ paid: newPaid, balance: newBalance, status: newStatus, id: reg.id });

          // Update course enrolled count
          db.prepare(`
            UPDATE courses 
            SET total_enrolled = (SELECT COUNT(*) FROM registrations WHERE course_id = @courseId AND status IN ('confirmed', 'active', 'completed'))
            WHERE id = @courseId
          `).run({ courseId: reg.course_id });
        }

        logger.info(`Payment ${payment.payment_id} approved by admin.`);
        return res.json({ success: true, message: 'Payment approved and registration confirmed! 🎉' });
      } else {
        // Reject payment
        db.prepare(`
          UPDATE payments 
          SET status = 'failed', notes = coalesce(notes || ' | ', '') || @admin_notes
          WHERE id = @id
        `).run({ id: payment.id, admin_notes: admin_notes ? `Rejected: ${admin_notes}` : 'Rejected by admin' });

        logger.info(`Payment ${payment.payment_id} rejected by admin.`);
        return res.json({ success: true, message: 'Payment rejected. Student will need to re-submit proof.' });
      }
    } catch (error) {
      logger.error('Payment verification error:', error);
      res.status(500).json({ success: false, message: 'Failed to verify payment.' });
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
