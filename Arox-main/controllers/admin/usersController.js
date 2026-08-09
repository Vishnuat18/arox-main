const User = require('../../models/User');
const logger = require('../../utils/logger');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

exports.index = (req, res) => {
  try {
    const users = User.findAll();
    res.render('admin/users/index', {
      layout: 'layouts/admin',
      title: 'Staff & Users | AROX ERP',
      pageTitle: 'Staff & Users',
      user: req.user,
      users
    });
  } catch (error) {
    logger.error('Users Index Error:', error);
    res.status(500).render('website/error', { 
      layout: 'layouts/admin',
      code: 500,
      message: 'Failed to load users.'
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { first_name, last_name, email, role, phone } = req.body;
    
    if (User.findByEmail(email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Generate a secure random password for new staff
    // In production, this would be emailed to them to reset
    const tempPassword = crypto.randomBytes(8).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    const newId = User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: role || 'staff',
      phone: phone || null
    });

    // TODO: Send welcome email with tempPassword
    logger.info(`New staff created: ${email} with temp password: ${tempPassword}`);

    res.json({ 
      success: true, 
      message: 'User created successfully',
      id: newId,
      tempPassword // For demo purposes, we return it to display
    });
  } catch (error) {
    logger.error('User Create Error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

exports.updateStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    
    // Prevent deactivating self
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot change your own status' });
    }

    const db = require('../../config/database').getDb();
    db.prepare('UPDATE users SET status = @status WHERE id = @id').run({
      status: is_active ? 'active' : 'inactive',
      id
    });

    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    logger.error('User Status Update Error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
};

exports.delete = (req, res) => {
  try {
    const { id } = req.params;
    
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }

    const db = require('../../config/database').getDb();
    
    // Ensure not deleting the last admin
    const adminCount = db.prepare(`
      SELECT COUNT(*) as count 
      FROM users u 
      JOIN roles r ON u.role_id = r.id 
      WHERE r.name = 'admin' OR r.name = 'super_admin'
    `).get().count;
    const targetUser = db.prepare(`
      SELECT r.name as role 
      FROM users u 
      JOIN roles r ON u.role_id = r.id 
      WHERE u.id = ?
    `).get(id);
    
    if (targetUser && (targetUser.role === 'admin' || targetUser.role === 'super_admin') && adminCount <= 1) {
      return res.status(400).json({ error: 'Cannot delete the last admin account' });
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(id);

    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    logger.error('User Delete Error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
