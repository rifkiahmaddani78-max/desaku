const BaseRepository = require('./BaseRepository');
const pool = require('../config/database');

class WilayahRepository extends BaseRepository {
  constructor() {
    super('dusun', pool);
  }

  /**
   * Get all dusun with RW and RT counts
   */
  async getAllDusunWithStats() {
    const query = `
      SELECT
        d.*,
        COUNT(DISTINCT rw.id) as jumlah_rw,
        COUNT(DISTINCT rt.id) as jumlah_rt,
        COUNT(DISTINCT a.user_id) as jumlah_kk
      FROM dusun d
      LEFT JOIN rw ON d.id = rw.dusun_id
      LEFT JOIN rt ON rw.id = rt.rw_id
      LEFT JOIN alamat a ON d.id = a.dusun_id
      GROUP BY d.id
      ORDER BY d.kode_dusun
    `;

    return await this.executeQuery(query);
  }

  /**
   * Get RW by dusun ID
   */
  async getRwByDusun(dusunId) {
    const query = `
      SELECT rw.*, COUNT(DISTINCT rt.id) as jumlah_rt
      FROM rw
      LEFT JOIN rt ON rw.id = rt.rw_id
      WHERE rw.dusun_id = ?
      GROUP BY rw.id
      ORDER BY rw.nomor_rw
    `;

    return await this.executeQuery(query, [dusunId]);
  }

  /**
   * Get RT by RW ID
   */
  async getRtByRw(rwId) {
    const query = `
      SELECT rt.*, COUNT(DISTINCT a.user_id) as jumlah_kk
      FROM rt
      LEFT JOIN alamat a ON rt.id = a.rt_id
      WHERE rt.rw_id = ?
      GROUP BY rt.id
      ORDER BY rt.nomor_rt
    `;

    return await this.executeQuery(query, [rwId]);
  }

  /**
   * Get complete wilayah hierarchy
   */
  async getWilayahHierarchy() {
    const query = `
      SELECT
        d.id as dusun_id,
        d.kode_dusun,
        d.nama_dusun,
        d.kepala_dusun,
        rw.id as rw_id,
        rw.nomor_rw,
        rw.ketua_rw,
        rt.id as rt_id,
        rt.nomor_rt,
        rt.ketua_rt
      FROM dusun d
      LEFT JOIN rw ON d.id = rw.dusun_id
      LEFT JOIN rt ON rw.id = rt.rw_id
      ORDER BY d.kode_dusun, rw.nomor_rw, rt.nomor_rt
    `;

    const results = await this.executeQuery(query);

    // Transform to hierarchical structure
    const hierarchy = {};

    results.forEach(row => {
      if (!hierarchy[row.dusun_id]) {
        hierarchy[row.dusun_id] = {
          id: row.dusun_id,
          kode_dusun: row.kode_dusun,
          nama_dusun: row.nama_dusun,
          kepala_dusun: row.kepala_dusun,
          rw_list: {},
        };
      }

      if (row.rw_id && !hierarchy[row.dusun_id].rw_list[row.rw_id]) {
        hierarchy[row.dusun_id].rw_list[row.rw_id] = {
          id: row.rw_id,
          nomor_rw: row.nomor_rw,
          ketua_rw: row.ketua_rw,
          rt_list: {},
        };
      }

      if (row.rt_id && hierarchy[row.dusun_id].rw_list[row.rw_id]) {
        hierarchy[row.dusun_id].rw_list[row.rw_id].rt_list[row.rt_id] = {
          id: row.rt_id,
          nomor_rt: row.nomor_rt,
          ketua_rt: row.ketua_rt,
        };
      }
    });

    // Convert to array format
    return Object.values(hierarchy).map(dusun => ({
      ...dusun,
      rw_list: Object.values(dusun.rw_list).map(rw => ({
        ...rw,
        rt_list: Object.values(rw.rt_list),
      })),
    }));
  }

  /**
   * Get dusun by ID with RW and their RT lists (step by step)
   */
  async getDusunByIdWithDetails(dusunId) {
    // 1. Ambil data dusun
    const dusunQuery = 'SELECT * FROM dusun WHERE id = ?';
    const dusunResult = await this.executeQuery(dusunQuery, [dusunId]);

    if (dusunResult.length === 0) {
      return null;
    }

    const dusun = dusunResult[0];

    // 2. Ambil semua RW di dusun ini
    const rwList = await this.getRwByDusun(dusunId);

    // 3. Untuk setiap RW, ambil RT-nya
    const rwWithRtList = await Promise.all(
      rwList.map(async rw => {
        const rtList = await this.getRtByRw(rw.id);
        return {
          ...rw,
          rt_list: rtList || [], // Pastikan selalu array
        };
      })
    );

    return {
      ...dusun,
      rw_list: rwWithRtList,
    };
  }

  /**
   * Get RW repository instance
   */
  getRwRepository() {
    return new BaseRepository('rw', this.pool);
  }

  /**
   * Get RT repository instance
   */
  getRtRepository() {
    return new BaseRepository('rt', this.pool);
  }
}

module.exports = new WilayahRepository();
