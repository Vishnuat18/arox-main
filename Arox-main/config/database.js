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
    logger.error(`Postgres execution error: ${sql.substring(0, 100)}...`, err.message);
    throw err;
  }
}

/**
 * Split SQL into individual statements, respecting string literals and dollar-quoted blocks.
 * Handles semicolons inside single-quoted strings, dollar-quoted strings, and $$ blocks.
 */
function splitSqlStatements(sql) {
  const statements = [];
  let current = '';
  let inSingleQuote = false;
  let inDollarQuote = false;
  let dollarTag = '';
  let i = 0;

  while (i < sql.length) {
    const ch = sql[i];

    // Handle dollar-quoted strings ($$...$$ or $tag$...$tag$)
    if (!inSingleQuote && ch === '$') {
      // Check for opening dollar tag: $tag$
      const dollarMatch = sql.slice(i).match(/^\$([a-zA-Z_]*)\$/);
      if (dollarMatch) {
        const tag = dollarMatch[0]; // e.g., $$ or $function$
        if (!inDollarQuote) {
          inDollarQuote = true;
          dollarTag = tag;
          current += tag;
          i += tag.length;
          continue;
        } else if (tag === dollarTag) {
          inDollarQuote = false;
          dollarTag = '';
          current += tag;
          i += tag.length;
          continue;
        }
      }
    }

    // Handle single-quoted strings
    if (!inDollarQuote && ch === "'") {
      // Check for escaped quote ''
      if (inSingleQuote && sql[i + 1] === "'") {
        current += "''";
        i += 2;
        continue;
      }
      inSingleQuote = !inSingleQuote;
      current += ch;
      i++;
      continue;
    }

    // Handle semicolons (statement separators)
    if (ch === ';' && !inSingleQuote && !inDollarQuote) {
      const trimmed = current.trim();
      if (trimmed) {
        statements.push(trimmed);
      }
      current = '';
      i++;
      continue;
    }

    current += ch;
    i++;
  }

  // Push any remaining statement
  const trimmed = current.trim();
  if (trimmed) {
    statements.push(trimmed);
  }

  return statements;
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
    const statements = splitSqlStatements(sql);
    for (const stmt of statements) {
      try {
        executeQuery(stmt);
      } catch (err) {
        logger.warn(`Statement failed: ${stmt.substring(0, 80)}... -> ${err.message}`);
        // Continue with next statement instead of failing the whole batch
        // This is important for seed data where INSERT OR IGNORE might have conflicts
      }
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
