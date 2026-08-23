const logger = require('../../utils/logger');
const { getDb } = require('../../config/database');

exports.index = (req, res) => {
  try {
    const db = getDb();
    
    // We want a list of students with their user info and number of registrations
    const students = db.prepare(`
      SELECT 
        s.id, s.college AS college_name, s.degree, s.phone AS whatsapp_no,
        s.first_name, s.last_name, s.email, s.created_at,
        (SELECT COUNT(*) FROM registrations r WHERE r.student_id = s.id) as course_count
      FROM students s
      ORDER BY s.created_at DESC
    `).all();

    res.render('admin/students/index', {
      layout: 'layouts/admin',
      title: 'Students | AROX ERP',
      pageTitle: 'Students',
      user: req.user,
      students
    });
  } catch (error) {
    logger.error('Students Index Error:', error);
    res.status(500).render('website/error', { 
      layout: 'layouts/admin',
      code: 500,
      message: 'Failed to load students.',
      user: req.user || { first_name: 'Admin', last_name: '', role: 'admin' }
    });
  }
};

exports.show = (req, res) => {
  try {
    const db = getDb();
    const studentId = req.params.id;

    // Get student + user details
    const student = db.prepare(`
      SELECT 
        s.*, s.college AS college_name, s.phone AS whatsapp_no
      FROM students s
      WHERE s.id = ?
    `).get(studentId);

    if (!student) {
      return res.status(404).render('website/error', { 
        layout: 'layouts/admin', 
        code: 404,
        message: 'Student not found.',
        user: req.user || { first_name: 'Admin', last_name: '', role: 'admin' }
      });
    }

    // Get their registrations with course details
    const registrations = db.prepare(`
      SELECT 
        r.*,
        c.title as course_title, c.category as course_type, c.batch_name
      FROM registrations r
      LEFT JOIN courses c ON r.course_id = c.id
      WHERE r.student_id = ?
      ORDER BY r.created_at DESC
    `).all(studentId);

    res.render('admin/students/show', {
      layout: 'layouts/admin',
      title: `${student.first_name} ${student.last_name} | AROX ERP`,
      pageTitle: 'Student Profile',
      user: req.user,
      student,
      registrations
    });
  } catch (error) {
    logger.error('Student Details Error:', error);
    res.status(500).render('website/error', { 
      layout: 'layouts/admin', 
      code: 500,
      message: 'Failed to load student details.',
      user: req.user || { first_name: 'Admin', last_name: '', role: 'admin' }
    });
  }
};
