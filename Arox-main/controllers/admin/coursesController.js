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
        coalesce(c.price, 0) as fee,
        coalesce(c.category, 'training') as type,
        coalesce(c.category, 'training') as category,
        CASE WHEN c.is_active = 1 THEN 'active' ELSE 'draft' END as status,
        (SELECT COUNT(*) FROM registrations r WHERE r.course_id = c.id) as enrolled_count
      FROM courses c
      ORDER BY c.created_at DESC
    `).all() || [];

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
      message: 'Failed to load courses.',
      user: req.user || { first_name: 'Admin', last_name: '', role: 'admin' }
    });
  }
};

exports.create = (req, res) => {
  try {
    const { 
      title, type, batch_name, duration, fee, 
      start_date, end_date, max_students, description, status 
    } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Course title is required.' });
    }

    const slug = helpers.slugify(title) + '-' + helpers.slugify(batch_name || 'batch-1') + '-' + Date.now().toString().slice(-4);

    const newId = require('../../models/Course').create({
      title,
      slug,
      type: type || 'training',
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

exports.update = (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, type, batch_name, duration, fee, 
      start_date, end_date, max_students, description, status 
    } = req.body;

    const db = getDb();
    const isActive = (status === 'active' || status === '1' || status === 1) ? 1 : 0;

    db.prepare(`
      UPDATE courses SET
        title = COALESCE(@title, title),
        category = COALESCE(@category, category),
        batch_name = COALESCE(@batch_name, batch_name),
        duration = COALESCE(@duration, duration),
        price = COALESCE(@price, price),
        start_date = COALESCE(@start_date, start_date),
        end_date = COALESCE(@end_date, end_date),
        max_students = COALESCE(@max_students, max_students),
        description = COALESCE(@description, description),
        is_active = @is_active,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `).run({
      id,
      title,
      category: type || 'training',
      batch_name,
      duration,
      price: parseFloat(fee) || 0,
      start_date,
      end_date,
      max_students: parseInt(max_students) || 50,
      description,
      is_active: isActive
    });

    res.json({ success: true, message: 'Course updated successfully' });
  } catch (error) {
    logger.error('Course Update Error:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
};

exports.updateStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const isActive = (status === 'active') ? 1 : 0;
    
    const db = getDb();
    db.prepare('UPDATE courses SET is_active = @is_active, updated_at = CURRENT_TIMESTAMP WHERE id = @id').run({ is_active: isActive, id });

    res.json({ success: true, message: 'Course status updated' });
  } catch (error) {
    logger.error('Course Status Update Error:', error);
    res.status(500).json({ error: 'Failed to update course status' });
  }
};

exports.delete = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    
    // Check if course has registrations before deleting
    const regCount = db.prepare('SELECT COUNT(*) as count FROM registrations WHERE course_id = ?').get(id);
    if (regCount && parseInt(regCount.count, 10) > 0) {
      return res.status(400).json({ error: 'Cannot delete course with existing registrations. Deactivate it instead.' });
    }
    
    db.prepare('DELETE FROM courses WHERE id = ?').run(id);
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    logger.error('Course Delete Error:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
};
