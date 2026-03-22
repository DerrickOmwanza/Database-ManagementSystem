const fs = require('fs');
const path = require('path');

function stripSqlComments(sql) {
  return sql
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');
}

function splitSqlStatements(sql) {
  return stripSqlComments(sql)
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);
}

async function executeSqlFile(connection, filePath) {
  const absolutePath = path.resolve(filePath);
  const sql = fs.readFileSync(absolutePath, 'utf8');
  const statements = splitSqlStatements(sql);

  for (const statement of statements) {
    try {
      await connection.query(statement);
    } catch (err) {
      // 1061 = duplicate key name (index already exists)
      // 1050 = table already exists (belt-and-suspenders alongside IF NOT EXISTS)
      if (err.errno === 1061 || err.errno === 1050) {
        continue;
      }
      throw err;
    }
  }
}

module.exports = {
  executeSqlFile,
};
