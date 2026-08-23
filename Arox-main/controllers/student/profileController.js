const { getDb } = require('../../config/database');
const logger = require('../../utils/logger');

exports.index = (req, res) => {
  try {
    const db = getDb();
    
    // Get student details
    const student = db.prepare('SELECT * FROM students WHERE user_id = ?').get(req.user.id);
    
    res.render('student/profile', {
      layout: 'layouts/student',
      title: 'Profile Settings | AROX ERP',
      pageTitle: 'Profile Settings',
      user: req.user,
      student: student || null
    });
  } catch (error) {
    logger.error('Student Profile Load Error:', error);
    res.status(500).render('website/error', {
      layout: 'layouts/student',
      title: 'Error - Student Portal',
      code: 500,
      message: 'Something went wrong loading your profile. Please try again later.',
      user: req.user || { first_name: 'Student', last_name: '', role: 'student' }
    });
  }
};
