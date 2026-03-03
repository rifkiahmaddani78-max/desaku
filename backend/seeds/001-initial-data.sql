-- Seed data untuk roles
INSERT INTO roles (id, name, description) VALUES
(1, 'admin', 'Administrator sistem desa'),
(2, 'kepala_keluarga', 'Kepala keluarga yang terdaftar');

-- Seed data untuk admin default
-- Password: Admin123! (akan di-hash di seed script)
INSERT INTO users (role_id, nik, nama_lengkap, email, username, password_hash, telepon, jenis_kelamin, is_verified) VALUES
(1, '0000000000000001', 'Administrator Desa', 'admin@desaku.example', 'admin', '$2a$12$YourHashedPasswordHere', '081234567890', 'L', TRUE);

-- Seed data dusun contoh
INSERT INTO dusun (kode_dusun, nama_dusun, alamat, kepala_dusun) VALUES
('D001', 'Dusun Krajan', 'Jl. Raya Krajan No. 1', 'Bapak Suharto'),
('D002', 'Dusun Sumber', 'Jl. Sumber Asri No. 5', 'Bapak Widodo');

-- Seed data RW
INSERT INTO rw (dusun_id, nomor_rw, ketua_rw) VALUES
(1, '01', 'Bapak Riyadi'),
(1, '02', 'Bapak Slamet'),
(2, '01', 'Bapak Joko');

-- Seed data RT
INSERT INTO rt (rw_id, nomor_rt, ketua_rt) VALUES
(1, '01', 'Bapak Ahmad'),
(1, '02', 'Bapak Bambang'),
(2, '01', 'Bapak Cakra'),
(3, '01', 'Bapak Dedi');
