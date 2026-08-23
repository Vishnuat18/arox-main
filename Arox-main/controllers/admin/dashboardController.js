const { getDb } = require('../../config/database');
const logger = require('../../utils/logger');

exports.overview = (req, res) => {
  let stats = { students: 0, courses: 0, registrations: 0, pendingRegistrations: 0, revenue: 0, pendingRevenue: 0 };
  let recentRegistrations = [];
  let upcomingBatches = [];
  let analytics = {
    monthlyLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    monthlyEnrollments: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    monthlyRevenue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    categoryBreakdown: {
      internship: 0,
      training: 0
    },
    coursesBreakdown: [],
    paymentStatusBreakdown: {
      completed: 0,
      pending: 0,
      failed: 0
    },
    verificationRate: 100
  };

  try {
    const db = getDb();
    
    // Get aggregate counts
    const studentsRow = db.prepare('SELECT COUNT(*) as count FROM students').get();
    stats.students = studentsRow ? parseInt(studentsRow.count, 10) || 0 : 0;
    
    const coursesRow = db.prepare('SELECT COUNT(*) as count FROM courses WHERE is_active = 1').get();
    stats.courses = coursesRow ? parseInt(coursesRow.count, 10) || 0 : 0;
    
    const regRow = db.prepare('SELECT COUNT(*) as count FROM registrations').get();
    stats.registrations = regRow ? parseInt(regRow.count, 10) || 0 : 0;
    
    const pendingRegRow = db.prepare("SELECT COUNT(*) as count FROM registrations WHERE status = 'pending'").get();
    stats.pendingRegistrations = pendingRegRow ? parseInt(pendingRegRow.count, 10) || 0 : 0;
    
    // Revenue sum (total paid)
    const revenueRow = db.prepare("SELECT SUM(amount) as total FROM payments WHERE status = 'completed'").get();
    stats.revenue = revenueRow && revenueRow.total ? parseFloat(revenueRow.total) || 0 : 0;

    const pendingRevRow = db.prepare("SELECT SUM(amount) as total FROM payments WHERE status = 'pending'").get();
    stats.pendingRevenue = pendingRevRow && pendingRevRow.total ? parseFloat(pendingRevRow.total) || 0 : 0;

    // Student growth: current month vs previous month
    try {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

      const currentMonthRow = db.prepare(
        `SELECT COUNT(*) as count FROM students WHERE EXTRACT(MONTH FROM created_at) = $1 AND EXTRACT(YEAR FROM created_at) = $2`
      ).get(currentMonth, currentYear);
      const currentMonthCount = currentMonthRow ? parseInt(currentMonthRow.count, 10) || 0 : 0;

      const prevMonthRow = db.prepare(
        `SELECT COUNT(*) as count FROM students WHERE EXTRACT(MONTH FROM created_at) = $1 AND EXTRACT(YEAR FROM created_at) = $2`
      ).get(prevMonth, prevYear);
      const prevMonthCount = prevMonthRow ? parseInt(prevMonthRow.count, 10) || 0 : 0;

      if (prevMonthCount > 0) {
        stats.studentGrowth = Math.round(((currentMonthCount - prevMonthCount) / prevMonthCount) * 100);
      } else if (currentMonthCount > 0) {
        stats.studentGrowth = 100; // first month with students
      } else {
        stats.studentGrowth = 0;
      }
      stats.currentMonthStudents = currentMonthCount;
    } catch (e) {
      stats.studentGrowth = 0;
      stats.currentMonthStudents = 0;
    }

    recentRegistrations = db.prepare(`
      SELECT 
        r.id, r.registration_id, r.status, r.created_at,
        s.first_name, s.last_name, s.email,
        c.title as course_title
      FROM registrations r
      JOIN students s ON r.student_id = s.id
      JOIN courses c ON r.course_id = c.id
      ORDER BY r.created_at DESC
      LIMIT 5
    `).all() || [];

    // Upcoming batches
    upcomingBatches = db.prepare(`
      SELECT title, batch_name, start_date, total_enrolled, max_students 
      FROM courses 
      WHERE is_active = 1
      ORDER BY start_date ASC
      LIMIT 4
    `).all() || [];

    // 1. Category Distribution from registrations
    try {
      const catRows = db.prepare(`
        SELECT c.category, COUNT(r.id) as count
        FROM courses c
        LEFT JOIN registrations r ON r.course_id = c.id
        GROUP BY c.category
      `).all() || [];
      catRows.forEach(row => {
        const cat = (row.category || 'training').toLowerCase();
        if (analytics.categoryBreakdown[cat] !== undefined) {
          analytics.categoryBreakdown[cat] += parseInt(row.count, 10) || 0;
        } else {
          analytics.categoryBreakdown[cat] = parseInt(row.count, 10) || 0;
        }
      });
    } catch (e) {
      logger.warn('Category breakdown error:', e.message);
    }

    // 2. Course breakdown
    try {
      analytics.coursesBreakdown = db.prepare(`
        SELECT c.title, c.category, COUNT(r.id) as enrolled, COALESCE(c.price, 0) as price
        FROM courses c
        LEFT JOIN registrations r ON r.course_id = c.id
        GROUP BY c.id, c.title, c.category, c.price
        ORDER BY enrolled DESC
        LIMIT 6
      `).all() || [];
    } catch (e) {
      logger.warn('Courses breakdown error:', e.message);
    }

    // 3. Payment Status Breakdown
    try {
      const payRows = db.prepare(`
        SELECT status, COUNT(*) as count, SUM(amount) as total
        FROM payments
        GROUP BY status
      `).all() || [];
      payRows.forEach(p => {
        if (analytics.paymentStatusBreakdown[p.status] !== undefined) {
          analytics.paymentStatusBreakdown[p.status] = parseInt(p.count, 10) || 0;
        }
      });
    } catch (e) {
      logger.warn('Payment status breakdown error:', e.message);
    }

    const totalPays = (analytics.paymentStatusBreakdown.completed || 0) + (analytics.paymentStatusBreakdown.pending || 0);
    if (totalPays > 0) {
      analytics.verificationRate = Math.round(((analytics.paymentStatusBreakdown.completed || 0) / totalPays) * 100);
    }

    // 4. Monthly trends from registrations and payments
    try {
      const monthEnrollRows = db.prepare(`
        SELECT 
          EXTRACT(MONTH FROM created_at) as month_num,
          COUNT(*) as count
        FROM registrations
        WHERE created_at IS NOT NULL
        GROUP BY EXTRACT(MONTH FROM created_at)
      `).all() || [];
      monthEnrollRows.forEach(r => {
        const mIndex = parseInt(r.month_num, 10) - 1;
        if (mIndex >= 0 && mIndex < 12) {
          analytics.monthlyEnrollments[mIndex] = parseInt(r.count, 10) || 0;
        }
      });
    } catch (e) {
      logger.warn('Month enroll parse error:', e.message);
    }

    try {
      const monthPayRows = db.prepare(`
        SELECT 
          EXTRACT(MONTH FROM created_at) as month_num,
          SUM(amount) as total
        FROM payments
        WHERE status = 'completed' AND created_at IS NOT NULL
        GROUP BY EXTRACT(MONTH FROM created_at)
      `).all() || [];
      monthPayRows.forEach(r => {
        const mIndex = parseInt(r.month_num, 10) - 1;
        if (mIndex >= 0 && mIndex < 12) {
          analytics.monthlyRevenue[mIndex] = parseFloat(r.total) || 0;
        }
      });
    } catch (e) {
      logger.warn('Month pay parse error:', e.message);
    }

    // Ensure current month baseline is reflected if events were recorded
    const currentMonthIndex = new Date().getMonth();
    const sumEnrollments = analytics.monthlyEnrollments.reduce((a, b) => a + b, 0);
    if (sumEnrollments === 0 && stats.registrations > 0) {
      analytics.monthlyEnrollments[currentMonthIndex] = stats.registrations;
    }
    const sumRevenue = analytics.monthlyRevenue.reduce((a, b) => a + b, 0);
    if (sumRevenue === 0 && stats.revenue > 0) {
      analytics.monthlyRevenue[currentMonthIndex] = stats.revenue;
    }

  } catch (error) {
    logger.warn('Dashboard Overview Error (falling back to structured data):', error.message);
  }

  res.render('admin/dashboard/index', {
    layout: 'layouts/admin',
    title: 'Admin Dashboard | AROX ERP',
    pageTitle: 'Overview',
    user: req.user || { first_name: 'Admin', last_name: '', role: 'admin' },
    stats,
    analytics,
    recentRegistrations,
    upcomingBatches
  });
};
