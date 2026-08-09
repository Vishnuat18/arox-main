const Course = require('../../models/Course');
const logger = require('../../utils/logger');
const { getDb } = require('../../config/database');
const helpers = require('../../utils/helpers');

exports.index = (req, res) => {
  try {
    const db = getDb();
    
    // Fetch courses with enrollment counts
    const courses = db.prepare(`
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM registrations r WHERE r.course_id = c.id) as enrolled_count
      FROM courses c
      ORDER BY c.created_at DESC
    `).all();

    res.render('admin/courses/index', {
      layout: 'layouts/admin',
      title: 'Courses & Internships | AROX ERP',
      pageTitle: 'Courses & Internships',
      user: req.user,
      courses
    });
  } catch (error) {
    logger.error('Courses Index Error:', error);
    res.status(500).render('website/error', { 
      layout: 'layouts/admin',
      code: 500,
      message: 'Failed to load courses.'
    });
  }
};

exports.create = (req, res) => {
  try {
    const { 
      title, type, batch_name, duration, fee, 
      start_date, end_date, max_students, description, status 
    } = req.body;
    
    const slug = helpers.slugify(title) + '-' + helpers.slugify(batch_name);

    const newId = Course.create({
      title,
      slug,
      type,
      batch_name,
      duration,
      fee: parseFloat(fee) || 0,
      start_date,
      end_date,
      max_students: parseInt(max_students) || 50,
      description,
      status: status || 'draft'
    });

    res.json({ success: true, message: 'Course created successfully', id: newId });
  } catch (error) {
    logger.error('Course Create Error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

exports.updateStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const db = getDb();
    db.prepare('UPDATE courses SET status = @status WHERE id = @id').run({ status, id });

    res.json({ success: true, message: 'Course status updated' });
  } catch (error) {
    logger.error('Course Status Update Error:', error);
    res.status(500).json({ error: 'Failed to update course status' });
  }
};
