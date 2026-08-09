const { getDb } = require('../config/database');

class Payment {
  static findById(id) {
    const db = getDb();
    return db.prepare(`
      SELECT p.*, s.first_name, s.last_name, s.email as student_email, s.student_id as student_code,
             r.registration_id as reg_code, c.title as course_title
      FROM payments p
      LEFT JOIN students s ON p.student_id = s.id
      LEFT JOIN registrations r ON p.registration_id = r.id
      LEFT JOIN courses c ON r.course_id = c.id
      WHERE p.id = ?
    `).get(id);
  }

  static findByPaymentId(paymentId) {
    const db = getDb();
    return db.prepare(`
      SELECT p.*, s.first_name, s.last_name, s.email as student_email,
             r.registration_id as reg_code
      FROM payments p
      LEFT JOIN students s ON p.student_id = s.id
      LEFT JOIN registrations r ON p.registration_id = r.id
      WHERE p.payment_id = ?
    `).get(paymentId);
  }

  static create(data) {
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO payments (
        payment_id, registration_id, student_id,
        amount, gst_amount, total_amount,
        payment_method, payment_type, transaction_id,
        status, invoice_number, paid_at
      ) VALUES (
        @payment_id, @registration_id, @student_id,
        @amount, @gst_amount, @total_amount,
        @payment_method, @payment_type, @transaction_id,
        @status, @invoice_number, @paid_at
      )
    `).run(data);

    return { id: result.lastInsertRowid, ...data };
  }

  static updateStatus(id, status) {
    const db = getDb();
    db.prepare('UPDATE payments SET status = ? WHERE id = ?').run(status, id);
  }

  static getByStudentId(studentId) {
    const db = getDb();
    return db.prepare(`
      SELECT p.*, r.registration_id as reg_code, c.title as course_title
      FROM payments p
      LEFT JOIN registrations r ON p.registration_id = r.id
      LEFT JOIN courses c ON r.course_id = c.id
      WHERE p.student_id = ?
      ORDER BY p.created_at DESC
    `).all(studentId);
  }

  static getByRegistrationId(registrationId) {
    const db = getDb();
    return db.prepare('SELECT * FROM payments WHERE registration_id = ? ORDER BY created_at DESC').all(registrationId);
  }

  static getTotalRevenue() {
    const db = getDb();
    const result = db.prepare("SELECT COALESCE(SUM(total_amount), 0) as total FROM payments WHERE status = 'completed'").get();
    return result.total;
  }

  static getTodayRevenue() {
    const db = getDb();
    const result = db.prepare("SELECT COALESCE(SUM(total_amount), 0) as total FROM payments WHERE status = 'completed' AND DATE(paid_at) = DATE('now')").get();
    return result.total;
  }

  static getPendingCount() {
    const db = getDb();
    return db.prepare("SELECT COUNT(*) as count FROM payments WHERE status = 'pending'").get().count;
  }
}

module.exports = Payment;
