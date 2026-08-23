const { getDb } = require('../../config/database');
const logger = require('../../utils/logger');

exports.index = (req, res) => {
  try {
    const db = getDb();
    const student = db.prepare('SELECT id FROM students WHERE user_id = ?').get(req.user.id);

    if (!student) {
      return res.render('student/payments/index', {
        layout: 'layouts/student',
        title: 'Payments | AROX ERP',
        pageTitle: 'Payments & Invoices',
        user: req.user,
        student: null,
        payments: [],
        registrations: []
      });
    }

    // Fetch payments list
    const payments = db.prepare(`
      SELECT p.*, c.title as course_title, r.registration_id as reg_display_id 
      FROM payments p 
      JOIN registrations r ON p.registration_id = r.id 
      JOIN courses c ON r.course_id = c.id 
      WHERE p.student_id = ? 
      ORDER BY p.paid_at DESC, p.created_at DESC
    `).all(student.id) || [];

    // Fetch registration summary for payment plan tracking
    const registrations = db.prepare(`
      SELECT r.id, r.registration_id as reg_display_id, r.status, r.total_amount, r.paid_amount, r.balance_amount, 
             c.title as course_title
      FROM registrations r
      JOIN courses c ON r.course_id = c.id
      WHERE r.student_id = ?
      ORDER BY r.created_at DESC
    `).all(student.id) || [];

    res.render('student/payments/index', {
      layout: 'layouts/student',
      title: 'Payments | AROX ERP',
      pageTitle: 'Payments & Invoices',
      user: req.user,
      student,
      payments,
      registrations
    });
  } catch (error) {
    logger.error('Student Payments Error:', error);
    res.status(500).render('website/error', {
      layout: 'layouts/student',
      title: 'Error - Student Portal',
      code: 500,
      message: 'Something went wrong loading payments. Please try again later.',
      user: req.user || { first_name: 'Student', last_name: '', role: 'student' }
    });
  }
};
