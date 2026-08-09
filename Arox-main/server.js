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
app.use('/attendance', express.static(path.join(__dirname, '../arox-attendance')));
app.use('/cert', express.static(path.join(__dirname, '../arox-cert')));
app.use('/offerletter', express.static(path.join(__dirname, '../arox-offerletter')));
app.use('/project', express.static(path.join(__dirname, '../arox-project')));
app.use(express.static(__dirname));

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

// Web (page) routes
app.use('/admin', require('./routes/web/admin'));
app.use('/student', require('./routes/web/student'));
app.use('/', require('./routes/web/auth'));

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

startServer();

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
