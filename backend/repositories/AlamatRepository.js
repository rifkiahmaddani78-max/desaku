const BaseRepository = require('./BaseRepository');
const pool = require('../config/database');

class AlamatRepository extends BaseRepository {
  constructor() {
    super('alamat', pool);
  }

  /**
   * Find alamat by user ID
   */
  async findByUserId(userId) {
    const query = `
      SELECT
        a.*,
        d.nama_dusun,
        d.kode_dusun,
        d.kepala_dusun,
        rw.nomor_rw,
        rw.ketua_rw,
        rt.nomor_rt,
        rt.ketua_rt
      FROM alamat a
      JOIN dusun d ON a.dusun_id = d.id
      JOIN rw ON a.rw_id = rw.id
      JOIN rt ON a.rt_id = rt.id
      WHERE a.user_id = ?
      LIMIT 1
    `;

    const results = await this.executeQuery(query, [userId]);
    return results[0] || null;
  }

  /**
   * Get all KK by wilayah
   */
  async getKKByWilayah(dusunId = null, rwId = null, rtId = null) {
    let query = `
      SELECT
        a.*,
        u.nik,
        u.nama_lengkap,
        u.telepon,
        d.nama_dusun,
        rw.nomor_rw,
        rt.nomor_rt,
        COUNT(ak.id) as jumlah_anggota
      FROM alamat a
      JOIN users u ON a.user_id = u.id
      JOIN dusun d ON a.dusun_id = d.id
      JOIN rw ON a.rw_id = rw.id
      JOIN rt ON a.rt_id = rt.id
      LEFT JOIN anggota_keluarga ak ON u.id = ak.kepala_keluarga_id
      WHERE u.role_id = (SELECT id FROM roles WHERE name = 'kepala_keluarga')
    `;

    const params = [];

    if (dusunId) {
      query += ` AND a.dusun_id = ?`;
      params.push(dusunId);
    }

    if (rwId) {
      query += ` AND a.rw_id = ?`;
      params.push(rwId);
    }

    if (rtId) {
      query += ` AND a.rt_id = ?`;
      params.push(rtId);
    }

    query += ` GROUP BY a.id ORDER BY d.nama_dusun, rw.nomor_rw, rt.nomor_rt, u.nama_lengkap`;

    return await this.executeQuery(query, params);
  }

  /**
   * Create or update alamat
   */
  async upsertAlamat(userId, alamatData) {
    const existing = await this.findByUserId(userId);

    if (existing) {
      // Update existing
      return await this.update(existing.id, alamatData);
    } else {
      // Create new
      return await this.create({ user_id: userId, ...alamatData });
    }
  }
}

module.exports = new AlamatRepository();
