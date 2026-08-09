const { getDb } = require('../config/database');

class Student {
  static findById(id) {
    const db = getDb();
    return db.prepare('SELECT * FROM students WHERE id = ?').get(id);
  }

  static findByStudentId(studentId) {
    const db = getDb();
    return db.prepare('SELECT * FROM students WHERE student_id = ?').get(studentId);
  }

  static findByUserId(userId) {
    const db = getDb();
    return db.prepare('SELECT * FROM students WHERE user_id = ?').get(userId);
  }

  static findByEmail(email) {
    const db = getDb();
    return db.prepare('SELECT * FROM students WHERE email = ?').get(email);
  }

  static create(data) {
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO students (
        user_id, student_id, photo, first_name, last_name, email, phone,
        gender, dob, address, city, state, pincode,
        college, university, degree, department, year_of_study, graduation_year, roll_number,
        status
      ) VALUES (
        @user_id, @student_id, @photo, @first_name, @last_name, @email, @phone,
        @gender, @dob, @address, @city, @state, @pincode,
        @college, @university, @degree, @department, @year_of_study, @graduation_year, @roll_number,
        'active'
      )
    `).run(data);

    return { id: result.lastInsertRowid, ...data };
  }

  static update(id, data) {
    const db = getDb();
    const fields = Object.keys(data).map(key => `${key} = @${key}`).join(', ');
    data.id = id;
    db.prepare(`UPDATE students SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = @id`).run(data);
  }

  static getAll({ page = 1, limit = 20, status, search, course_id } = {}) {
    const db = getDb();
    let query = 'SELECT s.* FROM students s WHERE 1=1';
    const params = [];

    if (status) { query += ' AND s.status = ?'; params.push(status); }
    if (search) {
      query += ' AND (s.first_name LIKE ? OR s.last_name LIKE ? OR s.email LIKE ? OR s.student_id LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    const countQuery = query.replace('SELECT s.*', 'SELECT COUNT(*) as total');
    const total = db.prepare(countQuery).get(...params).total;

    query += ' ORDER BY s.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);

    const students = db.prepare(query).all(...params);
    return { students, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  static getCount() {
    const db = getDb();
    return db.prepare('SELECT COUNT(*) as count FROM students').get().count;
  }

  static delete(id) {
    const db = getDb();
    db.prepare('DELETE FROM students WHERE id = ?').run(id);
  }
}

module.exports = Student;
