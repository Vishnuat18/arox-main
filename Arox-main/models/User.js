const { getDb } = require('../config/database');
const bcrypt = require('bcryptjs');
const authConfig = require('../config/auth');

class User {
  static findById(id) {
    const db = getDb();
    return db.prepare(`
      SELECT u.*, r.name as role_name 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id 
      WHERE u.id = ?
    `).get(id);
  }

  static findByEmail(email) {
    const db = getDb();
    return db.prepare(`
      SELECT u.*, r.name as role_name 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id 
      WHERE u.email = ?
    `).get(email);
  }

  static async create(data) {
    const db = getDb();
    const passwordHash = await bcrypt.hash(data.password, authConfig.bcryptRounds);
    
    let roleId = 3;
    if (data.roleId) {
      roleId = data.roleId;
    } else if (data.role) {
      const roleMap = {
        'super_admin': 1,
        'admin': 2,
        'student': 3,
        'staff': 4,
        'trainer': 4
      };
      roleId = roleMap[data.role.toLowerCase()] || 3;
    }

    const first_name = data.first_name || '';
    const last_name = data.last_name || '';
    const phone = data.phone || '';
    const status = data.status || 'active';
    const email = data.email;

    const result = db.prepare(`
      INSERT INTO users (email, password_hash, role_id, status, first_name, last_name, phone, email_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `).run(email, passwordHash, roleId, status, first_name, last_name, phone);

    return { id: result.lastInsertRowid, email, roleId };
  }

  static findAll() {
    const db = getDb();
    return db.prepare(`
      SELECT u.*, r.name as role, (u.status = 'active') as is_active 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id
      ORDER BY u.created_at DESC
    `).all();
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static updateLastLogin(id) {
    const db = getDb();
    db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(id);
  }

  static updatePassword(id, passwordHash) {
    const db = getDb();
    db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(passwordHash, id);
  }

  static setResetToken(id, token, expires) {
    const db = getDb();
    db.prepare('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?').run(token, expires, id);
  }

  static findByResetToken(token) {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > CURRENT_TIMESTAMP').get(token);
  }

  static getAll({ page = 1, limit = 20, role, status, search } = {}) {
    const db = getDb();
    let query = `SELECT u.*, r.name as role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE 1=1`;
    const params = [];

    if (role) { query += ' AND r.name = ?'; params.push(role); }
    if (status) { query += ' AND u.status = ?'; params.push(status); }
    if (search) { query += ' AND u.email LIKE ?'; params.push(`%${search}%`); }

    const countQuery = query.replace('SELECT u.*, r.name as role_name', 'SELECT COUNT(*) as total');
    const total = db.prepare(countQuery).get(...params).total;

    query += ' ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);

    const users = db.prepare(query).all(...params);
    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

module.exports = User;
