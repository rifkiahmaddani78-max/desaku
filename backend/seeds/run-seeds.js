const fs = require('fs');
const path = require('path');
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

async function runSeeds() {
  const connection = await pool.getConnection();

  try {
    logger.info('Starting database seeds...');

    // Hash password untuk admin
    const hashedPassword = await bcrypt.hash('Admin123!', 12);

    // Seed data untuk roles
    await connection.query(`
      INSERT IGNORE INTO roles (id, name, description) VALUES
      (1, 'admin', 'Administrator sistem desa'),
      (2, 'kepala_keluarga', 'Kepala keluarga yang terdaftar')
    `);
    logger.info('✅ Roles seeded');

    // Seed admin user
    await connection.query(
      `
      INSERT IGNORE INTO users
      (id, role_id, nik, nama_lengkap, email, username, password_hash, telepon, jenis_kelamin, is_verified)
      VALUES
      (1, 1, '0000000000000001', 'Administrator Desa', 'admin@desaku.example', 'admin', ?, '081234567890', 'L', TRUE)
      ON DUPLICATE KEY UPDATE
      password_hash = VALUES(password_hash),
      email = VALUES(email)
    `,
      [hashedPassword]
    );
    logger.info('✅ Admin user seeded (password: Admin123!)');

    // Seed dusun contoh
    await connection.query(`
      INSERT IGNORE INTO dusun (id, kode_dusun, nama_dusun, alamat, kepala_dusun) VALUES
      (1, 'D001', 'Dusun Krajan', 'Jl. Raya Krajan No. 1', 'Bapak Suharto'),
      (2, 'D002', 'Dusun Sumber', 'Jl. Sumber Asri No. 5', 'Bapak Widodo')
    `);
    logger.info('✅ Dusun seeded');

    // Seed RW
    await connection.query(`
      INSERT IGNORE INTO rw (id, dusun_id, nomor_rw, ketua_rw) VALUES
      (1, 1, '01', 'Bapak Riyadi'),
      (2, 1, '02', 'Bapak Slamet'),
      (3, 2, '01', 'Bapak Joko')
    `);
    logger.info('✅ RW seeded');

    // Seed RT
    await connection.query(`
      INSERT IGNORE INTO rt (id, rw_id, nomor_rt, ketua_rt) VALUES
      (1, 1, '01', 'Bapak Ahmad'),
      (2, 1, '02', 'Bapak Bambang'),
      (3, 2, '01', 'Bapak Cakra'),
      (4, 3, '01', 'Bapak Dedi')
    `);
    logger.info('✅ RT seeded');

    logger.info('🎉 All seeds completed successfully!');
  } catch (error) {
    logger.error('Seeding failed:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Run seeds if called directly
if (require.main === module) {
  runSeeds()
    .then(() => {
      logger.info('Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Seeding process failed:', error);
      process.exit(1);
    });
}

module.exports = runSeeds;
