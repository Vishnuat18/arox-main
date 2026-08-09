const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { getDb } = require('../../config/database');
const { authenticate } = require('../../middleware/auth');
const roleGuard = require('../../middleware/roleGuard');
const upload = require('../../middleware/upload');
const logger = require('../../utils/logger');
const authConfig = require('../../config/auth');

// Secure all student API endpoints
router.use(authenticate);
router.use(roleGuard('student'));

/**
 * POST /api/student/assignment/submit
 * Handles uploading assignment file
 */
router.post('/assignment/submit', upload.single('submission'), async (req, res) => {
  try {
    const { assignment_id, submission_text } = req.body;
    const db = getDb();
    
    if (!assignment_id) {
      return res.status(400).json({ success: false, message: 'Assignment ID is required.' });
    }

    const student = db.prepare('SELECT id FROM students WHERE user_id = ?').get(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    // Verify assignment exists and is active
    const assignment = db.prepare('SELECT id FROM assignments WHERE id = ? AND is_active = 1').get(assignment_id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found or inactive.' });
    }

    // Determine path
    let fileRelativePath = null;
    if (req.file) {
      fileRelativePath = `/uploads/submissions/${req.file.filename}`;
    }

    // Check if submission already exists
    const existing = db.prepare('SELECT id, status FROM assignment_submissions WHERE assignment_id = ? AND student_id = ?').get(assignment_id, student.id);
    
    if (existing) {
      if (['reviewed', 'graded'].includes(existing.status)) {
        return res.status(400).json({ success: false, message: 'Cannot update assignment. It has already been reviewed or graded.' });
      }

      // Update existing
      db.prepare(`
        UPDATE assignment_submissions 
        SET submission_path = COALESCE(?, submission_path), 
            submission_text = ?, 
            status = 'submitted', 
            submitted_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(fileRelativePath, submission_text || '', existing.id);
    } else {
      // Create new
      db.prepare(`
        INSERT INTO assignment_submissions (assignment_id, student_id, submission_path, submission_text, status)
        VALUES (?, ?, ?, ?, 'submitted')
      `).run(assignment_id, student.id, fileRelativePath, submission_text || '');
    }

    res.json({
      success: true,
      message: 'Assignment submitted successfully!',
      filePath: fileRelativePath
    });
  } catch (error) {
    logger.error('Assignment submission error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

/**
 * POST /api/student/project/submit
 * Handles submitting project link and details
 */
router.post('/project/submit', upload.single('submission'), async (req, res) => {
  try {
    const { project_id, title, description, github_link, demo_link } = req.body;
    const db = getDb();
    
    if (!project_id) {
      return res.status(400).json({ success: false, message: 'Project ID is required.' });
    }

    const student = db.prepare('SELECT id FROM students WHERE user_id = ?').get(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    // Verify project exists
    const project = db.prepare('SELECT id FROM projects WHERE id = ? AND is_active = 1').get(project_id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    let fileRelativePath = null;
    if (req.file) {
      fileRelativePath = `/uploads/submissions/${req.file.filename}`;
    }

    const existing = db.prepare('SELECT id, status FROM project_submissions WHERE project_id = ? AND student_id = ?').get(project_id, student.id);

    if (existing) {
      if (['approved', 'under_review'].includes(existing.status) && existing.status !== 'resubmit') {
        // If under review or approved, block resubmission unless explicitly requested
        return res.status(400).json({ success: false, message: 'Project submission is already under review or approved.' });
      }

      db.prepare(`
        UPDATE project_submissions 
        SET title = ?, description = ?, github_link = ?, demo_link = ?, 
            file_path = COALESCE(?, file_path), status = 'submitted', submitted_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(title || '', description || '', github_link || '', demo_link || '', fileRelativePath, existing.id);
    } else {
      db.prepare(`
        INSERT INTO project_submissions (project_id, student_id, title, description, github_link, demo_link, file_path, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'submitted')
      `).run(project_id, student.id, title || '', description || '', github_link || '', demo_link || '', fileRelativePath);
    }

    res.json({ success: true, message: 'Project submitted successfully!' });
  } catch (error) {
    logger.error('Project submission error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

/**
 * POST /api/student/profile/update
 * Handles updating student profile details
 */
router.post('/profile/update', upload.single('photo'), async (req, res) => {
  try {
    const db = getDb();
    const {
      first_name, last_name, phone, gender, dob, address, city, state, pincode,
      college, university, degree, department, year_of_study, graduation_year, roll_number
    } = req.body;

    if (!first_name || !last_name || !phone) {
      return res.status(400).json({ success: false, message: 'First name, last name, and phone are required.' });
    }

    const student = db.prepare('SELECT id, photo FROM students WHERE user_id = ?').get(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    let photoPath = student.photo;
    if (req.file) {
      photoPath = `/uploads/photos/${req.file.filename}`;
    }

    db.prepare(`
      UPDATE students 
      SET first_name = ?, last_name = ?, phone = ?, gender = ?, dob = ?, 
          address = ?, city = ?, state = ?, pincode = ?, photo = ?,
          college = ?, university = ?, degree = ?, department = ?, 
          year_of_study = ?, graduation_year = ?, roll_number = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      first_name, last_name, phone, gender || null, dob || null,
      address || null, city || null, state || null, pincode || null, photoPath,
      college || null, university || null, degree || null, department || null,
      year_of_study || null, graduation_year || null, roll_number || null, student.id
    );

    res.json({ success: true, message: 'Profile updated successfully!', photo: photoPath });
  } catch (error) {
    logger.error('Profile update error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

/**
 * POST /api/student/profile/password
 * Handles changing student account password
 */
router.post('/profile/password', async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const db = getDb();

    if (!current_password || !new_password) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
    }

    const user = db.prepare('SELECT id, password_hash FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(current_password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password.' });
    }

    const newHash = await bcrypt.hash(new_password, authConfig.bcryptRounds);
    db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newHash, user.id);

    res.json({ success: true, message: 'Password changed successfully!' });
  } catch (error) {
    logger.error('Password change error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

/**
 * POST /api/student/attendance/mark
 * Marks attendance for today
 */
router.post('/attendance/mark', async (req, res) => {
  try {
    const { course_id } = req.body;
    const db = getDb();
    
    if (!course_id) {
      return res.status(400).json({ success: false, message: 'Course ID is required.' });
    }

    const student = db.prepare('SELECT id FROM students WHERE user_id = ?').get(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    // Format today as YYYY-MM-DD in local time
    const localToday = new Date();
    const year = localToday.getFullYear();
    const month = String(localToday.getMonth() + 1).padStart(2, '0');
    const day = String(localToday.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    // Check if already marked
    const existing = db.prepare('SELECT id FROM attendance WHERE student_id = ? AND course_id = ? AND date = ?').get(student.id, course_id, todayStr);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Attendance already marked for today.' });
    }

    const timeStr = localToday.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    // Mark attendance
    db.prepare(`
      INSERT INTO attendance (student_id, course_id, date, status, check_in_time, method)
      VALUES (?, ?, ?, 'present', ?, 'online')
    `).run(student.id, course_id, todayStr, timeStr);

    res.json({ success: true, message: 'Attendance marked successfully!', time: timeStr });
  } catch (error) {
    logger.error('Mark attendance error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
