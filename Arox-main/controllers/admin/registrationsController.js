const { getDb } = require('../../config/database');
const logger = require('../../utils/logger');

exports.index = (req, res) => {
  try {
    const db = getDb();
    
    const registrations = db.prepare(`
      SELECT 
        r.id, r.registration_id, r.status, r.created_at,
        s.id as student_id, s.first_name, s.last_name, s.email,
        c.title as course_title, c.category as course_type
      FROM registrations r
      JOIN students s ON r.student_id = s.id
      JOIN courses c ON r.course_id = c.id
      ORDER BY r.created_at DESC
    `).all() || [];

    res.render('admin/registrations/index', {
      layout: 'layouts/admin',
      title: 'Registrations | AROX ERP',
      pageTitle: 'Registrations',
      user: req.user,
      registrations
    });
  } catch (error) {
    logger.error('Registrations Index Error:', error);
    res.status(500).render('website/error', { 
      layout: 'layouts/admin', 
      code: 500,
      message: 'Failed to load registrations.',
      user: req.user || { first_name: 'Admin', last_name: '', role: 'admin' }
    });
  }
};

exports.show = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    
    const reg = db.prepare(`
      SELECT 
        r.*,
        s.college AS college_name, s.degree, s.phone AS whatsapp_no,
        s.first_name, s.last_name, s.email, s.year_of_study, s.department,
        c.title as course_title, c.price as fee, c.batch_name, c.duration,
        c.start_date, c.end_date, c.category as course_type
      FROM registrations r
      JOIN students s ON r.student_id = s.id
      JOIN courses c ON r.course_id = c.id
      WHERE r.id = ?
    `).get(id);

    if (!reg) {
      return res.status(404).render('website/error', { 
        layout: 'layouts/admin', 
        code: 404, 
        message: 'Registration not found',
        user: req.user || { first_name: 'Admin', last_name: '', role: 'admin' }
      });
    }

    const payments = db.prepare('SELECT * FROM payments WHERE registration_id = ? ORDER BY created_at DESC').all(id) || [];

    res.render('admin/registrations/show', {
      layout: 'layouts/admin',
      title: `Registration ${reg.registration_id} | AROX ERP`,
      pageTitle: 'Registration Details',
      user: req.user,
      reg,
      payments
    });
  } catch (error) {
    logger.error('Registration Show Error:', error);
    res.status(500).render('website/error', { 
      layout: 'layouts/admin', 
      code: 500, 
      message: 'Failed to load details',
      user: req.user || { first_name: 'Admin', last_name: '', role: 'admin' }
    });
  }
};

exports.updateStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required.' });
    }
    
    const db = getDb();
    db.prepare('UPDATE registrations SET status = @status WHERE id = @id').run({ status, id });

    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    logger.error('Registration Update Error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
};
