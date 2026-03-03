const BaseRepository = require('./BaseRepository');
const pool = require('../config/database');

class AnggotaKeluargaRepository extends BaseRepository {
  constructor() {
    super('anggota_keluarga', pool);
  }

  /**
   * Get all anggota by kepala keluarga ID
   */
  async getByKepalaKeluargaId(kepalaKeluargaId) {
    const query = `
      SELECT * FROM anggota_keluarga
      WHERE kepala_keluarga_id = ?
      ORDER BY
        CASE hubungan
          WHEN 'SUAMI' THEN 1
          WHEN 'ISTRI' THEN 2
          WHEN 'ANAK' THEN 3
          WHEN 'ORANG_TUA' THEN 4
          WHEN 'MENANTU' THEN 5
          WHEN 'CUCU' THEN 6
          WHEN 'MERTUA' THEN 7
          ELSE 8
        END,
        tanggal_lahir
    `;

    return await this.executeQuery(query, [kepalaKeluargaId]);
  }

  /**
   * Get anggota with detail
   */
  async getAnggotaWithDetail(anggotaId) {
    const query = `
      SELECT
        ak.*,
        u.nik as kk_nik,
        u.nama_lengkap as kk_nama,
        a.alamat_lengkap,
        d.nama_dusun,
        rw.nomor_rw,
        rt.nomor_rt
      FROM anggota_keluarga ak
      JOIN users u ON ak.kepala_keluarga_id = u.id
      LEFT JOIN alamat a ON u.id = a.user_id
      LEFT JOIN dusun d ON a.dusun_id = d.id
      LEFT JOIN rw ON a.rw_id = rw.id
      LEFT JOIN rt ON a.rt_id = rt.id
      WHERE ak.id = ?
      LIMIT 1
    `;

    const results = await this.executeQuery(query, [anggotaId]);
    return results[0] || null;
  }

  /**
   * Check if NIK exists in anggota keluarga
   */
  async nikExists(nik, excludeId = null) {
    let query = `SELECT COUNT(*) as count FROM anggota_keluarga WHERE nik = ?`;
    const params = [nik];

    if (excludeId) {
      query += ` AND id != ?`;
      params.push(excludeId);
    }

    const results = await this.executeQuery(query, params);
    return results[0].count > 0;
  }

  /**
   * Get keluarga statistics
   */
  async getKeluargaStats(kepalaKeluargaId) {
    const query = `
      SELECT
        COUNT(*) as total_anggota,
        SUM(CASE WHEN jenis_kelamin = 'L' THEN 1 ELSE 0 END) as laki_laki,
        SUM(CASE WHEN jenis_kelamin = 'P' THEN 1 ELSE 0 END) as perempuan,
        SUM(CASE WHEN hubungan = 'ANAK' THEN 1 ELSE 0 END) as jumlah_anak,
        SUM(CASE WHEN status_perkawinan = 'KAWIN' THEN 1 ELSE 0 END) as sudah_menikah,
        SUM(CASE WHEN status_tinggal = 'TINGGAL' THEN 1 ELSE 0 END) as tinggal_bersama
      FROM anggota_keluarga
      WHERE kepala_keluarga_id = ?
    `;

    const results = await this.executeQuery(query, [kepalaKeluargaId]);
    return results[0] || null;
  }

  /**
   * Get anggota by age group
   */
  async getAnggotaByAgeGroup(kepalaKeluargaId) {
    const query = `
      SELECT
        CASE
          WHEN TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) < 5 THEN 'Balita (0-4)'
          WHEN TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) BETWEEN 5 AND 12 THEN 'Anak (5-12)'
          WHEN TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) BETWEEN 13 AND 17 THEN 'Remaja (13-17)'
          WHEN TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) BETWEEN 18 AND 59 THEN 'Dewasa (18-59)'
          ELSE 'Lansia (60+)'
        END as kelompok_umur,
        COUNT(*) as jumlah,
        GROUP_CONCAT(nama_lengkap SEPARATOR ', ') as nama_anggota
      FROM anggota_keluarga
      WHERE kepala_keluarga_id = ?
      GROUP BY kelompok_umur
      ORDER BY
        CASE kelompok_umur
          WHEN 'Balita (0-4)' THEN 1
          WHEN 'Anak (5-12)' THEN 2
          WHEN 'Remaja (13-17)' THEN 3
          WHEN 'Dewasa (18-59)' THEN 4
          ELSE 5
        END
    `;

    return await this.executeQuery(query, [kepalaKeluargaId]);
  }
}

module.exports = new AnggotaKeluargaRepository();
