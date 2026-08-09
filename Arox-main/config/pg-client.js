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

  let client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'Semester6!',
    database: process.env.DB_NAME || 'Arox_database',
  });

  try {
    try {
      await client.connect();
    } catch (err) {
      if (err.code === '3D000') {
        const adminClient = new Client({
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT) || 5432,
          user: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD || 'Semester6!',
          database: 'postgres',
        });
        await adminClient.connect();
        const dbName = process.env.DB_NAME || 'Arox_database';
        await adminClient.query(`CREATE DATABASE "${dbName}"`);
        await adminClient.end();
        
        client = new Client({
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT) || 5432,
          user: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD || 'Semester6!',
          database: process.env.DB_NAME || 'Arox_database',
        });
        await client.connect();
      } else {
        throw err;
      }
    }
    
    let translatedSql = sql;
    let pgParams = [];

    if (params) {
      if (Array.isArray(params)) {
        pgParams = params;
        let index = 1;
        translatedSql = sql.replace(/\?/g, () => `$${index++}`);
      } else if (typeof params === 'object') {
        const namedParamRegex = /[@$:][a-zA-Z0-9_]+/g;
        const matches = sql.match(namedParamRegex) || [];
        let index = 1;
        const paramMap = {};
        translatedSql = sql.replace(namedParamRegex, (match) => {
          const name = match;
          if (!paramMap[name]) {
            paramMap[name] = index++;
            const keyWithoutPrefix = name.slice(1);
            const val = params[name] !== undefined ? params[name] : params[keyWithoutPrefix];
            pgParams.push(val === undefined ? null : val);
          }
          return `$${paramMap[name]}`;
        });
      }
    }

    // Convert SQLite specific syntax to PostgreSQL
    translatedSql = translatedSql
      .replace(/datetime\('now'\)/gi, 'CURRENT_TIMESTAMP')
      .replace(/date\('now'\)/gi, 'CURRENT_DATE')
      .replace(/last_insert_rowid\(\)/gi, 'lastval()')
      .replace(/PRAGMA foreign_keys\s*=\s*\w+/gi, 'SELECT 1') // Ignore pragmas
      .replace(/CREATE TABLE IF NOT EXISTS/gi, 'CREATE TABLE IF NOT EXISTS')
      .replace(/INTEGER\s+PRIMARY\s+KEY\s+AUTOINCREMENT/gi, 'SERIAL PRIMARY KEY')
      .replace(/INSERT\s+OR\s+IGNORE\s+INTO/gi, 'INSERT INTO')
      .replace(/DATETIME/gi, 'TIMESTAMP')
      .replace(/DATE\('now'\)/gi, 'CURRENT_DATE');

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
