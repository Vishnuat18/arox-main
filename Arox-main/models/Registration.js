const { getDb } = require('../config/database');

class Registration {
  static findById(id) {
    const db = getDb();
    return db.prepare(`
      SELECT r.*, s.first_name, s.last_name, s.email as student_email, s.student_id as student_code,
             c.title as course_title, c.slug as course_slug, c.duration as course_duration,
             c.trainer_name, c.batch_name as course_batch,
             i.title as internship_title
      FROM registrations r
      LEFT JOIN students s ON r.student_id = s.id
      LEFT JOIN courses c ON r.course_id = c.id
      LEFT JOIN internships i ON r.internship_id = i.id
      WHERE r.id = ?
    `).get(id);
  }

  static findByRegistrationId(registrationId) {
    const db = getDb();
    return db.prepare(`
      SELECT r.*, s.first_name, s.last_name, s.email as student_email, s.student_id as student_code,
             c.title as course_title, c.slug as course_slug, c.duration as course_duration,
             c.trainer_name, c.batch_name as course_batch,
             i.title as internship_title
      FROM registrations r
      LEFT JOIN students s ON r.student_id = s.id
      LEFT JOIN courses c ON r.course_id = c.id
      LEFT JOIN internships i ON r.internship_id = i.id
      WHERE r.registration_id = ?
    `).get(registrationId);
  }

  static create(data) {
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO registrations (
        registration_id, student_id, course_id, internship_id,
        batch_name, start_date, end_date, mode,
        status, payment_plan, total_amount, paid_amount, balance_amount,
        coupon_code, discount_amount, gst_amount
      ) VALUES (
        @registration_id, @student_id, @course_id, @internship_id,
        @batch_name, @start_date, @end_date, @mode,
        @status, @payment_plan, @total_amount, @paid_amount, @balance_amount,
        @coupon_code, @discount_amount, @gst_amount
      )
    `).run(data);

    return { id: result.lastInsertRowid, ...data };
  }

  static updateStatus(id, status) {
    const db = getDb();
    db.prepare('UPDATE registrations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, id);
  }

  static updatePayment(id, paidAmount, balanceAmount) {
    const db = getDb();
    db.prepare(`
      UPDATE registrations 
      SET paid_amount = ?, balance_amount = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(paidAmount, balanceAmount, id);
  }

  static getByStudentId(studentId) {
    const db = getDb();
    return db.prepare(`
      SELECT r.*, c.title as course_title, i.title as internship_title
      FROM registrations r
      LEFT JOIN courses c ON r.course_id = c.id
      LEFT JOIN internships i ON r.internship_id = i.id
      WHERE r.student_id = ?
      ORDER BY r.created_at DESC
    `).all(studentId);
  }

  static getCount() {
    const db = getDb();
    return db.prepare('SELECT COUNT(*) as count FROM registrations').get().count;
  }

  static getTodayCount() {
    const db = getDb();
    return db.prepare("SELECT COUNT(*) as count FROM registrations WHERE DATE(created_at) = DATE('now')").get().count;
  }
}

module.exports = Registration;
