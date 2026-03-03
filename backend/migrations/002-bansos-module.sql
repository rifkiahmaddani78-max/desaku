-- =============================================
-- ENHANCEMENTS TO EXISTING TABLES
-- =============================================

-- Add index to bansos table for better performance
ALTER TABLE bansos ADD INDEX idx_bansos_status_tanggal (status, tanggal_mulai, tanggal_selesai);

-- Add soft delete to bansos
ALTER TABLE bansos ADD COLUMN deleted_at TIMESTAMP NULL AFTER updated_at;

-- Add priority level to bansos
ALTER TABLE bansos ADD COLUMN prioritas ENUM('RENDAH', 'SEDANG', 'TINGGI', 'DARURAT') DEFAULT 'SEDANG' AFTER status;

-- Add penerima_manfaat to bansos
ALTER TABLE bansos ADD COLUMN penerima_manfaat TEXT COMMENT 'Kriteria penerima manfaat' AFTER deskripsi;

-- Add dokumen_panduan to bansos
ALTER TABLE bansos ADD COLUMN dokumen_panduan VARCHAR(255) COMMENT 'File panduan bansos' AFTER jumlah_nominal;

-- Add persyaratan to pengajuan_bansos
ALTER TABLE pengajuan_bansos
ADD COLUMN dokumen_ktp VARCHAR(255) AFTER dokumen_pendukung,
ADD COLUMN dokumen_kk VARCHAR(255) AFTER dokumen_ktp,
ADD COLUMN dokumen_surat_permohonan VARCHAR(255) AFTER dokumen_kk,
ADD COLUMN dokumen_lainnya VARCHAR(255) AFTER dokumen_surat_permohonan,
ADD COLUMN catatan_admin TEXT AFTER keterangan;

-- Add kategori to bansos
ALTER TABLE bansos ADD COLUMN kategori ENUM('SEMBAKO', 'TUNAI', 'PENDIDIKAN', 'KESEHATAN', 'UMKM', 'LAINNYA') DEFAULT 'TUNAI' AFTER jenis_bansos;

-- Add rating system for pengajuan (optional)
ALTER TABLE pengajuan_bansos
ADD COLUMN rating TINYINT(1) AFTER catatan_admin,
ADD COLUMN testimoni TEXT AFTER rating,
ADD COLUMN tanggal_testimoni TIMESTAMP NULL AFTER testimoni;

-- Create table for bansos notifications
CREATE TABLE IF NOT EXISTS notifikasi_bansos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pengajuan_id INT NOT NULL,
  user_id INT NOT NULL,
  judul VARCHAR(200) NOT NULL,
  pesan TEXT NOT NULL,
  tipe ENUM('PENGAJUAN', 'VERIFIKASI', 'PENCairan', 'PENGINGAT') NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pengajuan_id) REFERENCES pengajuan_bansos(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_read (user_id, is_read),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create table for bansos history/logs
CREATE TABLE IF NOT EXISTS logs_bansos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pengajuan_id INT NOT NULL,
  user_id INT COMMENT 'Admin yang melakukan aksi',
  aksi ENUM('PENGAJUAN', 'VERIFIKASI', 'PENOLAKAN', 'PENCairan', 'PERUBAHAN') NOT NULL,
  deskripsi TEXT,
  metadata JSON COMMENT 'Data sebelum/sesudah perubahan',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pengajuan_id) REFERENCES pengajuan_bansos(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_pengajuan_id (pengajuan_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create table for bansos quotas per wilayah
CREATE TABLE IF NOT EXISTS kuota_wilayah_bansos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  bansos_id INT NOT NULL,
  dusun_id INT,
  rw_id INT,
  rt_id INT,
  kuota INT NOT NULL DEFAULT 0,
  terpakai INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (bansos_id) REFERENCES bansos(id) ON DELETE CASCADE,
  FOREIGN KEY (dusun_id) REFERENCES dusun(id) ON DELETE CASCADE,
  FOREIGN KEY (rw_id) REFERENCES rw(id) ON DELETE CASCADE,
  FOREIGN KEY (rt_id) REFERENCES rt(id) ON DELETE CASCADE,
  UNIQUE KEY unique_kuota_wilayah (bansos_id, dusun_id, rw_id, rt_id),
  INDEX idx_bansos_id (bansos_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed data for bansos
INSERT INTO bansos (kode_bansos, nama_bansos, jenis_bansos, kategori, deskripsi, penerima_manfaat, jumlah_nominal, satuan_barang, kuota, tanggal_mulai, tanggal_selesai, status, prioritas, created_by) VALUES
('BLT-2024-Q1', 'Bantuan Langsung Tunai 2024 Q1', 'TUNAI', 'TUNAI', 'Bantuan langsung tunai untuk keluarga miskin', 'Keluarga dengan penghasilan < Rp 1.000.000/bulan', 300000.00, NULL, 100, '2024-01-01', '2024-03-31', 'AKTIF', 'TINGGI', 1),
('PKH-2024', 'Program Keluarga Harapan 2024', 'TUNAI', 'PENDIDIKAN', 'Bantuan untuk pendidikan anak', 'Keluarga dengan anak sekolah', 750000.00, NULL, 50, '2024-01-01', '2024-12-31', 'AKTIF', 'TINGGI', 1),
('SEMBAKO-2024', 'Bantuan Sembako Bulanan', 'BARANG', 'SEMBAKO', 'Paket sembako bulanan', 'Lansia dan penyandang disabilitas', NULL, 'Paket', 200, '2024-01-01', '2024-12-31', 'AKTIF', 'SEDANG', 1),
('BANSOS-UMKM', 'Bantuan Modal UMKM', 'TUNAI', 'UMKM', 'Bantuan modal usaha kecil', 'Pengusaha mikro dengan usaha < 1 tahun', 5000000.00, NULL, 20, '2024-02-01', '2024-06-30', 'DRAFT', 'SEDANG', 1);

-- Seed data for kuota wilayah
INSERT INTO kuota_wilayah_bansos (bansos_id, dusun_id, kuota) VALUES
(1, 1, 30),  -- BLT untuk Dusun Krajan
(1, 2, 20),  -- BLT untuk Dusun Sumber
(2, 1, 15),  -- PKH untuk Dusun Krajan
(2, 2, 10),  -- PKH untuk Dusun Sumber
(3, 1, 50),  -- SEMBAKO untuk Dusun Krajan
(3, 2, 30);  -- SEMBAKO untuk Dusun Sumber
