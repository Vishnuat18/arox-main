require('dotenv').config(); // Configured for PostgreSQL database

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');

const appConfig = require('./config/app');
const { initDb, closeDb } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// ----- View Engine -----
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// ----- Core Middleware -----
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ----- Static Files -----
app.use('/erp-assets', express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, '..', 'images')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.use('/images', express.static(path.join(__dirname, 'public', 'assets')));
app.use(express.static(path.join(__dirname, 'public'), { redirect: false }));

// Well-known and devtools handler to prevent 404 console errors
app.get('/.well-known/*', (req, res) => res.status(204).end());

// Generator static folders (robust multi-path resolution)
const serveGeneratorFolder = (routePrefix, folderName) => {
  const candidatePaths = [
    path.join(__dirname, '..', folderName),
    path.join(__dirname, folderName),
    path.join(__dirname, '..', 'arox-' + folderName),
    path.join(__dirname, 'public', folderName)
  ];
  candidatePaths.forEach(p => {
    app.use(routePrefix, express.static(p));
  });
};

serveGeneratorFolder('/cert', 'cert');
serveGeneratorFolder('/attendance', 'attendance');
serveGeneratorFolder('/offerletter', 'offerletter');
serveGeneratorFolder('/project', 'project');

app.use(express.static(path.join(__dirname, '..'), { redirect: false }));
app.use(express.static(__dirname, { redirect: false }));

// ----- Make org config available to all views -----
app.use((req, res, next) => {
  res.locals.org = appConfig.org;
  res.locals.currentPath = req.path;
  res.locals.year = new Date().getFullYear();
  next();
});

// ----- Routes -----
// API routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/courses', require('./routes/api/courses'));
app.use('/api/registrations', require('./routes/api/registrations'));
app.use('/api/payments', require('./routes/api/payments'));
app.use('/api/student', require('./routes/api/student'));

// Standalone Generators API
app.get('/api/students', (req, res) => {
  try {
    const { getDb } = require('./config/database');
    const db = getDb();
    
    // Query students joined with registrations and courses
    const students = db.prepare(`
      SELECT 
        s.id as db_id,
        s.student_id as id,
        (s.first_name || ' ' || s.last_name) as name,
        s.department,
        s.college as collegeName,
        s.year_of_study as year,
        s.status as student_status,
        c.title as internship,
        c.trainer_name as trainerName
      FROM students s
      LEFT JOIN registrations r ON r.student_id = s.id
      LEFT JOIN courses c ON r.course_id = c.id
      ORDER BY s.first_name ASC
    `).all();

    // Query attendances for all students
    const attendances = db.prepare(`
      SELECT student_id, date, status 
      FROM attendance
    `).all();

    // Map attendances by student database ID
    const attendanceMap = {};
    attendances.forEach(a => {
      if (!attendanceMap[a.student_id]) {
        attendanceMap[a.student_id] = [];
      }
      attendanceMap[a.student_id].push({
        date: a.date,
        status: (a.status || 'present').toUpperCase()
      });
    });

    // Format the result array
    const formatted = students.map(s => ({
      id: s.id,
      name: s.name,
      department: s.department || 'N/A',
      collegeName: s.collegeName || 'N/A',
      year: s.year || 'Final Year',
      internship: s.internship || 'Internship Candidate',
      trainerName: s.trainerName || 'Arox Mentor',
      status: (s.student_status || 'active').toUpperCase(),
      attendances: attendanceMap[s.db_id] || []
    }));

    res.json(formatted);
  } catch (error) {
    console.error('API /api/students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Certificate API
app.post('/api/certificates', (req, res) => {
  try {
    const { certId, studentName, course, domain, startDate, endDate, totalDays, issueDate } = req.body;
    logger.info(`Certificate issued/saved: ${certId} for ${studentName}`);
    res.json({ success: true, message: 'Certificate recorded successfully', certId });
  } catch (error) {
    logger.error('API /api/certificates error:', error);
    res.status(500).json({ success: false, error: 'Failed to save certificate record' });
  }
});

// Web (page) routes
app.use('/admin', require('./routes/web/admin'));
app.use('/student', require('./routes/web/student'));
app.use('/', require('./routes/web/auth'));

// ----- 404 Handler -----
app.use((req, res, next) => {
  const err = new Error('Page not found');
  err.statusCode = 404;
  next(err);
});

// ----- Error Handling -----
app.use(errorHandler);

// ----- Start Server (async for sql.js init) -----
const PORT = appConfig.port;

async function startServer() {
  try {
    // Initialize sql.js (async WASM loading)
    await initDb();
    logger.info('✅ Database initialized.');

    // Run migrations
    const { migrate } = require('./database/migrate');
    migrate();

    // Start listening
    app.listen(PORT, () => {
      logger.info(`
  ╔══════════════════════════════════════════╗
  ║                                          ║
  ║     🚀  AROX ERP Server Running          ║
  ║                                          ║
  ║     Port:  ${PORT}                          ║
  ║     Mode:  ${appConfig.nodeEnv}               ║
  ║     URL:   http://localhost:${PORT}          ║
  ║                                          ║
  ╚══════════════════════════════════════════╝
      `);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Shutting down gracefully...');
  closeDb();
  process.exit(0);
});

process.on('SIGTERM', () => {
  closeDb();
  process.exit(0);
});

module.exports = app;
