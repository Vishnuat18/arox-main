const { Client } = require('pg');
const fs = require('fs');

async function main() {
  let input = '';
  try {
    input = fs.readFileSync(0, 'utf-8');
  } catch (e) {
    console.error(JSON.stringify({ success: false, error: 'Failed to read stdin' }));
    process.exit(1);
  }

  let sql, params;
  try {
    const parsed = JSON.parse(input);
    sql = parsed.sql;
    params = parsed.params;
  } catch (e) {
    console.error(JSON.stringify({ success: false, error: 'Failed to parse JSON input' }));
    process.exit(1);
  }

  const isConnectionString = !!(process.env.DATABASE_URL || process.env.POSTGRES_URL);
  const getClientConfig = (dbOverride) => {
    if (isConnectionString) {
      return {
        connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
      };
    }
    return {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'Semester6!',
      database: dbOverride || process.env.DB_NAME || 'Arox_database',
    };
  };

  let client = new Client(getClientConfig());

  try {
    try {
      await client.connect();
    } catch (err) {
      if (err.code === '3D000' && !isConnectionString) {
        const adminClient = new Client(getClientConfig('postgres'));
        await adminClient.connect();
        const dbName = process.env.DB_NAME || 'Arox_database';
        await adminClient.query(`CREATE DATABASE "${dbName}"`);
        await adminClient.end();
        
        client = new Client(getClientConfig());
        await client.connect();
      } else {
        throw err;
      }
    }
    
    let translatedSql = sql;
    let pgParams = [];

    // Coerce params - ensure proper types for PostgreSQL
    function coerceParam(val) {
      if (val === undefined || val === null || val === '') return null;
      return val;
    }

    if (params) {
      if (Array.isArray(params)) {
        pgParams = params.map(coerceParam);
        let index = 1;
        translatedSql = sql.replace(/\?/g, () => `$${index++}`);
      } else if (typeof params === 'object') {
        // Only match @param and :param styles — NOT $N (PostgreSQL positional)
        const namedParamRegex = /[@:][a-zA-Z0-9_]+/g;
        let index = 1;
        const paramMap = {};
        translatedSql = sql.replace(namedParamRegex, (match) => {
          const name = match;
          if (!paramMap[name]) {
            paramMap[name] = index++;
            const keyWithoutPrefix = name.slice(1);
            const val = params[name] !== undefined ? params[name] : params[keyWithoutPrefix];
            pgParams.push(coerceParam(val));
          }
          return `$${paramMap[name]}`;
        });
      }
    }

    // Check for INSERT OR IGNORE before translation
    const hasInsertOrIgnore = /INSERT\s+OR\s+IGNORE\s+INTO/i.test(translatedSql);

    // Convert SQLite specific syntax to PostgreSQL
    translatedSql = translatedSql
      .replace(/datetime\('now'\)/gi, 'CURRENT_TIMESTAMP')
      .replace(/date\('now'\)/gi, 'CURRENT_DATE')
      .replace(/last_insert_rowid\(\)/gi, 'lastval()')
      .replace(/PRAGMA foreign_keys\s*=\s*\w+/gi, 'SELECT 1') // Ignore pragmas
      .replace(/CREATE TABLE IF NOT EXISTS/gi, 'CREATE TABLE IF NOT EXISTS')
      .replace(/INTEGER\s+PRIMARY\s+KEY\s+AUTOINCREMENT/gi, 'SERIAL PRIMARY KEY')
      .replace(/INSERT\s+OR\s+IGNORE\s+INTO/gi, 'INSERT INTO')
      .replace(/DATETIME(?!\s*\()/gi, 'TIMESTAMP') // Only replace DATETIME type, not datetime() function calls
      .replace(/DATE\('now'\)/gi, 'CURRENT_DATE');

    // Add ON CONFLICT DO NOTHING for INSERT OR IGNORE statements
    if (hasInsertOrIgnore) {
      // Only add if not already present
      if (!/ON\s+CONFLICT/i.test(translatedSql)) {
        translatedSql = translatedSql.trimEnd() + ' ON CONFLICT DO NOTHING';
      }
    }

    const result = await client.query(translatedSql, pgParams);
    
    console.log(JSON.stringify({
      success: true,
      rows: result.rows,
      rowCount: result.rowCount
    }));
  } catch (error) {
    console.log(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack
    }));
    process.exit(1);
  } finally {
    try {
      await client.end();
    } catch (e) {}
  }
}

main();
