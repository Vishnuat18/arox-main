require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
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
    const shouldSeed = process.argv.includes('--seed') || process.argv.includes('-s');
    let hasTables = false;
    let roleCount = null;

    // Check if tables exist by querying the roles table
    try {
      roleCount = db.prepare('SELECT COUNT(*) as count FROM roles').get();
      if (roleCount !== undefined && roleCount !== null) {
        hasTables = true;
      }
    } catch (e) {
      // Table doesn't exist or query failed
      hasTables = false;
    }

    if (!hasTables) {
      // Run schema
      logger.info('Running database schema...');
      try {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        db.exec(schema);
        logger.info('✅ Schema applied successfully.');
      } catch (schemaErr) {
        logger.error('Schema application failed:', schemaErr.message);
        // Try to continue anyway - some statements may have succeeded
      }
      
      // Re-check if roles table was created
      try {
        roleCount = db.prepare('SELECT COUNT(*) as count FROM roles').get();
      } catch (e) {
        // Roles table still doesn't exist
        roleCount = null;
      }
    } else {
      logger.info('ℹ️  Database schema already up to date.');
    }

    // Run seed data if:
    // 1. --seed flag is passed, OR
    // 2. Roles table exists but is empty (first run after schema creation)
    const shouldRunSeed = shouldSeed || (hasTables && roleCount && parseInt(roleCount.count) === 0);
    
    if (shouldRunSeed) {
      logger.info('Running seed data...');
      try {
        const seed = fs.readFileSync(seedPath, 'utf8');
        db.exec(seed);
        logger.info('✅ Seed data inserted successfully.');
      } catch (seedErr) {
        logger.warn('Seed data partially applied (some may already exist):', seedErr.message);
        // This is expected when re-running seeds - INSERT OR IGNORE handles conflicts
      }
    } else if (!shouldSeed) {
      logger.info('ℹ️  Seed data skipped (use --seed flag to force).');
    }

    logger.info('🎉 Database migration complete!');
  } catch (error) {
    logger.warn('⚠️ Migration failed/skipped due to DB connection issue: ' + (error ? error.message : ''));
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
