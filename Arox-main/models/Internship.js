const { getDb } = require('../config/database');

class Internship {
  static findById(id) {
    const db = getDb();
    return db.prepare(`
      SELECT i.*, c.title as course_title, c.slug as course_slug, c.price as course_price,
             c.discounted_price as course_discounted_price, c.duration as course_duration,
             c.curriculum, c.skills, c.projects as course_projects, c.faqs,
             c.trainer_name, c.trainer_title, c.trainer_bio, c.trainer_photo,
             c.start_date, c.end_date, c.batch_name, c.level, c.max_students
      FROM internships i 
      LEFT JOIN courses c ON i.course_id = c.id 
      WHERE i.id = ?
    `).get(id);
  }

  static findBySlug(slug) {
    const db = getDb();
    return db.prepare(`
      SELECT i.*, c.title as course_title, c.slug as course_slug, c.price as course_price,
             c.discounted_price as course_discounted_price, c.duration as course_duration,
             c.curriculum, c.skills, c.projects as course_projects, c.faqs,
             c.trainer_name, c.trainer_title, c.trainer_bio, c.trainer_photo,
             c.start_date, c.end_date, c.batch_name, c.level, c.max_students
      FROM internships i 
      LEFT JOIN courses c ON i.course_id = c.id 
      WHERE i.slug = ?
    `).get(slug);
  }

  static getAll({ domain, mode, search, featured, active = true } = {}) {
    const db = getDb();
    let query = `
      SELECT i.*, c.title as course_title, c.price as course_price, 
             c.discounted_price as course_discounted_price
      FROM internships i 
      LEFT JOIN courses c ON i.course_id = c.id 
      WHERE 1=1
    `;
    const params = [];

    if (active) { query += ' AND i.is_active = 1'; }
    if (domain) { query += ' AND i.domain = ?'; params.push(domain); }
    if (mode) { query += ' AND i.mode = ?'; params.push(mode); }
    if (featured) { query += ' AND i.is_featured = 1'; }
    if (search) {
      query += ' AND (i.title LIKE ? OR i.description LIKE ? OR i.domain LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY i.sort_order ASC, i.created_at DESC';
    return db.prepare(query).all(...params);
  }

  static getFeatured(limit = 3) {
    const db = getDb();
    return db.prepare(`
      SELECT i.*, c.title as course_title, c.price as course_price,
             c.discounted_price as course_discounted_price
      FROM internships i 
      LEFT JOIN courses c ON i.course_id = c.id 
      WHERE i.is_active = 1 AND i.is_featured = 1 
      ORDER BY i.sort_order ASC 
      LIMIT ?
    `).all(limit);
  }

  static incrementEnrollment(id) {
    const db = getDb();
    db.prepare('UPDATE internships SET total_enrolled = total_enrolled + 1 WHERE id = ?').run(id);
  }
}

module.exports = Internship;
