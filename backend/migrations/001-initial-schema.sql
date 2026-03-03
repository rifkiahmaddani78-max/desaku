-- Database: desa_ku_db
-- Character Set: utf8mb4 untuk support emoji dan karakter lengkap

-- Table: roles
CREATE TABLE IF NOT EXISTS roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE NOT NULL COMMENT 'Nama role: admin, kepala_keluarga',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: dusun (Wilayah level 1)
CREATE TABLE IF NOT EXISTS dusun (
  id INT PRIMARY KEY AUTO_INCREMENT,
  kode_dusun VARCHAR(10) UNIQUE NOT NULL COMMENT 'Kode unik dusun, contoh: D001',
  nama_dusun VARCHAR(100) NOT NULL,
  alamat TEXT,
  kepala_dusun VARCHAR(100) COMMENT 'Nama kepala dusun',
  telepon VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_kode_dusun (kode_dusun),
  INDEX idx_nama_dusun (nama_dusun)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: rw (Wilayah level 2)
CREATE TABLE IF NOT EXISTS rw (
  id INT PRIMARY KEY AUTO_INCREMENT,
  dusun_id INT NOT NULL,
  nomor_rw VARCHAR(3) NOT NULL COMMENT 'Nomor RW, contoh: 01',
  ketua_rw VARCHAR(100),
  telepon VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (dusun_id) REFERENCES dusun(id) ON DELETE CASCADE,
  UNIQUE KEY unique_rw_dusun (dusun_id, nomor_rw),
  INDEX idx_nomor_rw (nomor_rw),
  INDEX idx_dusun_id (dusun_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: rt (Wilayah level 3)
CREATE TABLE IF NOT EXISTS rt (
  id INT PRIMARY KEY AUTO_INCREMENT,
  rw_id INT NOT NULL,
  nomor_rt VARCHAR(3) NOT NULL COMMENT 'Nomor RT, contoh: 01',
  ketua_rt VARCHAR(100),
  telepon VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (rw_id) REFERENCES rw(id) ON DELETE CASCADE,
  UNIQUE KEY unique_rt_rw (rw_id, nomor_rt),
  INDEX idx_nomor_rt (nomor_rt),
  INDEX idx_rw_id (rw_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: users (untuk admin dan kepala keluarga)
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role_id INT NOT NULL,
  nik VARCHAR(16) UNIQUE NOT NULL COMMENT 'Nomor Induk Kependudukan 16 digit',
  nama_lengkap VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  telepon VARCHAR(20),
  jenis_kelamin ENUM('L', 'P') NOT NULL,
  tempat_lahir VARCHAR(50),
  tanggal_lahir DATE,
  agama VARCHAR(20),
  pekerjaan VARCHAR(50),
  status_perkawinan ENUM('BELUM_KAWIN', 'KAWIN', 'CERAI_HIDUP', 'CERAI_MATI') DEFAULT 'BELUM_KAWIN',
  foto_profil VARCHAR(255) COMMENT 'Path foto profil',
  is_verified BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  INDEX idx_nik (nik),
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_role_id (role_id),
  INDEX idx_nama_lengkap (nama_lengkap)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: alamat (detail alamat kepala keluarga)
CREATE TABLE IF NOT EXISTS alamat (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL COMMENT 'Satu user (kepala keluarga) punya satu alamat',
  dusun_id INT NOT NULL,
  rw_id INT NOT NULL,
  rt_id INT NOT NULL,
  alamat_lengkap TEXT NOT NULL COMMENT 'Detail alamat: nama jalan, nomor rumah, dll',
  koordinat_lat DECIMAL(10, 8) COMMENT 'Latitude untuk mapping',
  koordinat_lng DECIMAL(11, 8) COMMENT 'Longitude untuk mapping',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (dusun_id) REFERENCES dusun(id),
  FOREIGN KEY (rw_id) REFERENCES rw(id),
  FOREIGN KEY (rt_id) REFERENCES rt(id),
  INDEX idx_user_id (user_id),
  INDEX idx_dusun_id (dusun_id),
  INDEX idx_rw_id (rw_id),
  INDEX idx_rt_id (rt_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: anggota_keluarga
CREATE TABLE IF NOT EXISTS anggota_keluarga (
  id INT PRIMARY KEY AUTO_INCREMENT,
  kepala_keluarga_id INT NOT NULL COMMENT 'ID dari users yang sebagai kepala keluarga',
  nik VARCHAR(16) UNIQUE NOT NULL,
  nama_lengkap VARCHAR(100) NOT NULL,
  hubungan ENUM('SUAMI', 'ISTRI', 'ANAK', 'MENANTU', 'CUCU', 'ORANG_TUA', 'MERTUA', 'FAMILI_LAIN', 'PEMBANTU') NOT NULL,
  jenis_kelamin ENUM('L', 'P') NOT NULL,
  tempat_lahir VARCHAR(50),
  tanggal_lahir DATE NOT NULL,
  agama VARCHAR(20),
  pendidikan_terakhir VARCHAR(50),
  pekerjaan VARCHAR(50),
  status_perkawinan ENUM('BELUM_KAWIN', 'KAWIN', 'CERAI_HIDUP', 'CERAI_MATI') DEFAULT 'BELUM_KAWIN',
  status_tinggal ENUM('TINGGAL', 'TIDAK_TINGGAL') DEFAULT 'TINGGAL',
  foto VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (kepala_keluarga_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_kepala_keluarga_id (kepala_keluarga_id),
  INDEX idx_nik (nik),
  INDEX idx_nama_lengkap (nama_lengkap),
  INDEX idx_hubungan (hubungan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: bansos (master data bantuan sosial)
CREATE TABLE IF NOT EXISTS bansos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  kode_bansos VARCHAR(20) UNIQUE NOT NULL COMMENT 'Kode unik bansos, contoh: BLT-2024',
  nama_bansos VARCHAR(100) NOT NULL,
  jenis_bansos ENUM('TUNAI', 'BARANG', 'JASA') NOT NULL,
  deskripsi TEXT,
  jumlah_nominal DECIMAL(15, 2) COMMENT 'Jika jenis TUNAI',
  satuan_barang VARCHAR(50) COMMENT 'Jika jenis BARANG',
  kuota INT NOT NULL,
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE NOT NULL,
  status ENUM('DRAFT', 'AKTIF', 'SELESAI', 'DIBATALKAN') DEFAULT 'DRAFT',
  created_by INT COMMENT 'Admin yang membuat',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_kode_bansos (kode_bansos),
  INDEX idx_status (status),
  INDEX idx_tanggal (tanggal_mulai, tanggal_selesai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: pengajuan_bansos
CREATE TABLE IF NOT EXISTS pengajuan_bansos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  bansos_id INT NOT NULL,
  kepala_keluarga_id INT NOT NULL,
  alasan_pengajuan TEXT NOT NULL,
  dokumen_pendukung VARCHAR(255) COMMENT 'Path file pendukung',
  status ENUM('MENUNGGU', 'DIPROSES', 'DITERIMA', 'DITOLAK') DEFAULT 'MENUNGGU',
  keterangan TEXT COMMENT 'Keterangan dari admin',
  ditolak_oleh INT COMMENT 'Admin yang menolak',
  diterima_oleh INT COMMENT 'Admin yang menerima',
  tanggal_diterima TIMESTAMP NULL,
  tanggal_ditolak TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (bansos_id) REFERENCES bansos(id) ON DELETE CASCADE,
  FOREIGN KEY (kepala_keluarga_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (ditolak_oleh) REFERENCES users(id),
  FOREIGN KEY (diterima_oleh) REFERENCES users(id),
  UNIQUE KEY unique_pengajuan (bansos_id, kepala_keluarga_id),
  INDEX idx_status (status),
  INDEX idx_kepala_keluarga_id (kepala_keluarga_id),
  INDEX idx_bansos_id (bansos_id),
  INDEX idx_tanggal (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: berita
CREATE TABLE IF NOT EXISTS berita (
  id INT PRIMARY KEY AUTO_INCREMENT,
  judul VARCHAR(200) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL COMMENT 'URL-friendly title',
  konten LONGTEXT NOT NULL,
  gambar_cover VARCHAR(255),
  penulis_id INT NOT NULL COMMENT 'Admin yang menulis',
  kategori ENUM('INFORMASI', 'PENGUMUMAN', 'KEGIATAN', 'LAINNYA') DEFAULT 'INFORMASI',
  status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') DEFAULT 'DRAFT',
  tanggal_publikasi TIMESTAMP NULL,
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (penulis_id) REFERENCES users(id),
  INDEX idx_slug (slug),
  INDEX idx_status (status),
  INDEX idx_kategori (kategori),
  INDEX idx_tanggal_publikasi (tanggal_publikasi),
  FULLTEXT idx_search (judul, konten)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: jadwal_desa
CREATE TABLE IF NOT EXISTS jadwal_desa (
  id INT PRIMARY KEY AUTO_INCREMENT,
  judul VARCHAR(200) NOT NULL,
  deskripsi TEXT,
  lokasi VARCHAR(200),
  tanggal_mulai DATETIME NOT NULL,
  tanggal_selesai DATETIME,
  jenis_acara ENUM('RAPAT', 'KEGIATAN', 'SIDAK', 'LAINNYA') NOT NULL,
  pesertaa ENUM('UMUM', 'PERANGKAT_DESA', 'KEPALA_KELUARGA', 'TERBATAS') DEFAULT 'UMUM',
  dibuat_oleh INT NOT NULL COMMENT 'Admin yang membuat',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (dibuat_oleh) REFERENCES users(id),
  INDEX idx_tanggal (tanggal_mulai, tanggal_selesai),
  INDEX idx_jenis_acara (jenis_acara),
  INDEX idx_pesertaa (pesertaa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: refresh_tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  is_revoked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_token (token),
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
