const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const roleGuard = require('../../middleware/roleGuard');

// Controllers
const dashboardController = require('../../controllers/admin/dashboardController');
const usersController = require('../../controllers/admin/usersController');
const studentsController = require('../../controllers/admin/studentsController');
const coursesController = require('../../controllers/admin/coursesController');
const registrationsController = require('../../controllers/admin/registrationsController');
const paymentsController = require('../../controllers/admin/paymentsController');

// Apply auth and roleGuard to all admin routes
router.use(authenticate);
router.use(roleGuard('admin', 'super_admin', 'trainer')); // All staff roles can access the dashboard

// --- Dashboard ---
router.get('/dashboard', dashboardController.overview);

// --- Students ---
router.get('/students', studentsController.index);
router.get('/students/:id', studentsController.show);

// --- Courses ---
router.get('/courses', coursesController.index);
router.post('/courses', coursesController.create);
router.put('/courses/:id/status', coursesController.updateStatus);

// --- Registrations ---
router.get('/registrations', registrationsController.index);
router.get('/registrations/:id', registrationsController.show);
router.put('/registrations/:id/status', registrationsController.updateStatus);

// --- Payments ---
router.get('/payments', paymentsController.index);

// --- Document Hub ---
router.get('/document-hub', roleGuard('admin', 'super_admin', 'trainer'), (req, res) => {
  try {
    const { getDb } = require('../../config/database');
    const db = getDb();
    const students = db.prepare(`
      SELECT 
        s.id, s.student_id, s.first_name, s.last_name, s.email, s.college, s.department,
        r.batch_name, r.status as reg_status, c.title as course_title, c.start_date, c.end_date
      FROM students s
      LEFT JOIN registrations r ON r.student_id = s.id
      LEFT JOIN courses c ON r.course_id = c.id
      ORDER BY s.first_name ASC
    `).all();

    res.render('admin/generators/hub', { 
      layout: 'layouts/admin', 
      pageTitle: 'Document Hub', 
      user: req.user,
      students 
    });
  } catch (error) {
    console.error('Document Hub route error:', error);
    res.status(500).render('website/error', { layout: 'layouts/admin', code: 500, message: 'Failed to load document hub.' });
  }
});

// --- System (Admin Only) ---
router.get('/users', roleGuard('admin', 'super_admin'), usersController.index);
router.post('/users', roleGuard('admin', 'super_admin'), usersController.create);
router.put('/users/:id/status', roleGuard('admin', 'super_admin'), usersController.updateStatus);
router.delete('/users/:id', roleGuard('admin', 'super_admin'), usersController.delete);

router.get('/settings', roleGuard('admin', 'super_admin'), (req, res) => {
  res.render('website/error', { 
    layout: 'layouts/admin', 
    code: 501, 
    message: 'Settings coming soon.',
    pageTitle: 'Settings'
  });
});

module.exports = router;
