const { execFileSync } = require('child_process');
const path = require('path');
const logger = require('../utils/logger');

// Connection details from env
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5432';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'Semester6!';
const DB_NAME = process.env.DB_NAME || 'Arox_database';

const clientScriptPath = path.resolve(__dirname, 'pg-client.js');

function executeQuery(sql, params) {
  try {
    const input = JSON.stringify({ sql, params });
    const stdout = execFileSync('node', [clientScriptPath], {
      input,
      env: {
        ...process.env,
        DB_HOST,
        DB_PORT,
        DB_USER,
        DB_PASSWORD,
        DB_NAME
      },
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024 // 10MB
    });

    const result = JSON.parse(stdout);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result;
  } catch (err) {
    logger.error(`Postgres execution error: ${sql}`, err.message);
    throw err;
  }
}

class StatementWrapper {
  constructor(sql) {
    this.sql = sql;
  }

  run(...args) {
    const params = this._resolveParams(args);
    // Append RETURNING id so the inserted id comes back in the SAME session
    // (lastval() in a separate process/session would return null).
    const isInsert = this.sql.trim().toUpperCase().startsWith('INSERT');
    const sql = isInsert ? this.sql + ' RETURNING id' : this.sql;
    const result = executeQuery(sql, params);

    let lastInsertRowid = 0;
    if (isInsert) {
      lastInsertRowid = (result.rows && result.rows[0] && result.rows[0].id) || 0;
    }

    return { 
      changes: result.rowCount || 0, 
      lastInsertRowid 
    };
  }

  get(...args) {
    const params = this._resolveParams(args);
    const result = executeQuery(this.sql, params);
    return result.rows[0]; // Returns first row or undefined
  }

  all(...args) {
    const params = this._resolveParams(args);
    const result = executeQuery(this.sql, params);
    return result.rows;
  }

  _resolveParams(args) {
    if (args.length === 0) return [];
    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && !Array.isArray(args[0])) {
      return args[0];
    }
    if (args.length === 1 && Array.isArray(args[0])) {
      return args[0];
    }
    return args;
  }
}

class DatabaseWrapper {
  prepare(sql) {
    return new StatementWrapper(sql);
  }

  exec(sql) {
    const queries = sql.split(';').map(q => q.trim()).filter(Boolean);
    for (const q of queries) {
      executeQuery(q);
    }
  }

  pragma(str) {
    // Ignored in Postgres
  }

  transaction(fn) {
    return (...args) => {
      executeQuery('BEGIN');
      try {
        const result = fn(...args);
        executeQuery('COMMIT');
        return result;
      } catch (err) {
        executeQuery('ROLLBACK');
        throw err;
      }
    };
  }

  close() {
    // No-op for process-based wrapper
  }
}

let dbInstance = new DatabaseWrapper();

async function initDb() {
  try {
    executeQuery('SELECT 1');
    logger.info('✅ Postgres database verified.');
  } catch (err) {
    logger.warn('⚠️ Failed to connect to Postgres. Starting server without database connection.');
    // We intentionally do not throw the error here, so the server can start up and serve the static frontend.
  }
  return dbInstance;
}

function getDb() {
  return dbInstance;
}

function closeDb() {
  // No-op
}

module.exports = { getDb, initDb, closeDb };
