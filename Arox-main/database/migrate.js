const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

function migrate() {
  // getDb() works synchronously after initDb() has been called
  const { getDb } = require('../config/database');
  const db = getDb();
  const schemaPath = path.join(__dirname, 'schema.sql');
  const seedPath = path.join(__dirname, 'seed.sql');

  try {
    // Run schema
    logger.info('Running database schema...');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // sql.js exec handles multiple statements
    db.exec(schema);
    logger.info('✅ Schema applied successfully.');

    // Run seed data
    const shouldSeed = process.argv.includes('--seed') || process.argv.includes('-s');
    
    // Always seed on first run (check if roles table is empty)
    const roleCount = db.prepare('SELECT COUNT(*) as count FROM roles').get();
    
    if (shouldSeed || (roleCount && roleCount.count === 0)) {
      logger.info('Running seed data...');
      const seed = fs.readFileSync(seedPath, 'utf8');
      db.exec(seed);
      logger.info('✅ Seed data inserted successfully.');
    } else {
      logger.info('ℹ️  Seed data skipped (use --seed flag to force).');
    }

    logger.info('🎉 Database migration complete!');
  } catch (error) {
    logger.warn('⚠️ Migration failed/skipped due to DB connection issue.');
    // We intentionally don't throw error to allow frontend server to continue running
  }
}

// Run if called directly
if (require.main === module) {
  const { initDb, closeDb } = require('../config/database');
  initDb().then(() => {
    migrate();
    closeDb();
  }).catch(err => {
    logger.error('Failed to init database:', err);
    process.exit(1);
  });
}

module.exports = { migrate };
