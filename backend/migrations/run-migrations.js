const fs = require('fs');
const path = require('path');
const pool = require('../config/database');
const logger = require('../utils/logger');

async function runMigrations() {
  const connection = await pool.getConnection();

  try {
    logger.info('Starting database migrations...');

    // Read migration file
    const migrationPath = path.join(__dirname, '001-initial-schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Split SQL statements
    const statements = migrationSQL
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    // Execute each statement
    for (const [index, statement] of statements.entries()) {
      try {
        await connection.query(statement);
        logger.info(`✅ Migration statement ${index + 1} executed successfully`);
      } catch (error) {
        logger.error(`❌ Error executing statement ${index + 1}:`, error.message);
        throw error;
      }
    }

    logger.info('🎉 All migrations completed successfully!');

    // Tambahkan di function runMigrations() setelah migration 001
    const migration2Path = path.join(__dirname, '002-bansos-module.sql');
    const migration2SQL = fs.readFileSync(migration2Path, 'utf8');

    const statements2 = migration2SQL
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    for (const [index, statement] of statements2.entries()) {
      try {
        await connection.query(statement);
        logger.info(`✅ Migration 002 statement ${index + 1} executed successfully`);
      } catch (error) {
        logger.error(`❌ Error executing statement ${index + 1}:`, error.message);
        // Skip if column already exists
        if (
          !error.message.includes('Duplicate column name') &&
          !error.message.includes('already exists')
        ) {
          throw error;
        }
      }
    }
  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Run migrations if called directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      logger.info('Migration process completed');
      process.exit(0);
    })
    .catch(error => {
      logger.error('Migration process failed:', error);
      process.exit(1);
    });
}

module.exports = runMigrations;
