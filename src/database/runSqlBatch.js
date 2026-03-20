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
    await connection.query(statement);
  }
}

module.exports = {
  executeSqlFile,
};
