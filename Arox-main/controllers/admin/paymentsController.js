const { getDb } = require('../../config/database');
const logger = require('../../utils/logger');

exports.index = (req, res) => {
  try {
    const db = getDb();
    
    const payments = db.prepare(`
      SELECT 
        p.*,
        r.registration_id,
        s.first_name, s.last_name, s.email
      FROM payments p
      JOIN registrations r ON p.registration_id = r.id
      JOIN students s ON r.student_id = s.id
      ORDER BY p.created_at DESC
    `).all() || [];

    res.render('admin/payments/index', {
      layout: 'layouts/admin',
      title: 'Payments | AROX ERP',
      pageTitle: 'Payments',
      user: req.user,
      payments
    });
  } catch (error) {
    logger.error('Payments Index Error:', error);
    res.status(500).render('website/error', { 
      layout: 'layouts/admin', 
      code: 500,
      message: 'Failed to load payments.',
      user: req.user || { first_name: 'Admin', last_name: '', role: 'admin' }
    });
  }
};
