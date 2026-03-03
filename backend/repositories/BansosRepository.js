const BaseRepository = require('./BaseRepository');
const pool = require('../config/database');

class BansosRepository extends BaseRepository {
  constructor() {
    super('bansos', pool);
  }

  /**
   * Get bansos with creator details
   */
  async findBansosWithDetails(id) {
    const query = `
      SELECT
        b.*,
        u.nama_lengkap as created_by_name,
        u.username as created_by_username,
        (SELECT COUNT(*) FROM pengajuan_bansos WHERE bansos_id = b.id) as total_pengajuan,
        (SELECT COUNT(*) FROM pengajuan_bansos WHERE bansos_id = b.id AND status = 'DITERIMA') as total_diterima,
        (SELECT COUNT(*) FROM pengajuan_bansos WHERE bansos_id = b.id AND status = 'DITOLAK') as total_ditolak,
        (SELECT COALESCE(SUM(kuota), 0) FROM kuota_wilayah_bansos WHERE bansos_id = b.id) as total_kuota_wilayah,
        (SELECT COALESCE(SUM(terpakai), 0) FROM kuota_wilayah_bansos WHERE bansos_id = b.id) as total_terpakai_wilayah
      FROM bansos b
      LEFT JOIN users u ON b.created_by = u.id
      WHERE b.id = ?
      AND b.deleted_at IS NULL
      LIMIT 1
    `;

    const results = await this.executeQuery(query, [id]);
    return results[0] || null;
  }

  /**
   * Get all bansos with pagination and filters
   */
  async findAllBansos(
    page = 1,
    limit = 10,
    filters = {},
    includeDeleted = false
  ) {
    const offset = (page - 1) * limit;

    let query = `
      SELECT
        b.*,
        u.nama_lengkap as created_by_name,
        (SELECT COUNT(*) FROM pengajuan_bansos WHERE bansos_id = b.id) as total_pengajuan
      FROM bansos b
      LEFT JOIN users u ON b.created_by = u.id
    `;

    const queryParams = [];
    const conditions = [];

    // Apply filters
    if (filters.status) {
      conditions.push('b.status = ?');
      queryParams.push(filters.status);
    }

    if (filters.kategori) {
      conditions.push('b.kategori = ?');
      queryParams.push(filters.kategori);
    }

    if (filters.jenis_bansos) {
      conditions.push('b.jenis_bansos = ?');
      queryParams.push(filters.jenis_bansos);
    }

    if (filters.prioritas) {
      conditions.push('b.prioritas = ?');
      queryParams.push(filters.prioritas);
    }

    if (filters.search) {
      conditions.push(`
        (b.kode_bansos LIKE ? OR b.nama_bansos LIKE ? OR b.deskripsi LIKE ?)
      `);
      const searchTerm = `%${filters.search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    if (!includeDeleted) {
      conditions.push('b.deleted_at IS NULL');
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Apply sorting
    if (filters.sortBy && filters.sortOrder) {
      query += ` ORDER BY b.${
        filters.sortBy
      } ${filters.sortOrder.toUpperCase()}`;
    } else {
      query += ` ORDER BY b.prioritas DESC, b.created_at DESC`;
    }

    // Apply pagination
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    const results = await this.executeQuery(query, queryParams);

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM bansos b`;
    if (conditions.length > 0) {
      countQuery += ` WHERE ${conditions.join(' AND ')}`;
    }

    const [countResult] = await this.executeQuery(
      countQuery,
      queryParams.slice(0, -2)
    );

    return {
      data: results,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit),
      },
    };
  }

  /**
   * Get active bansos for public view
   */
  async getActiveBansos() {
    const query = `
      SELECT
        b.*,
        (SELECT COUNT(*) FROM pengajuan_bansos WHERE bansos_id = b.id) as total_pengajuan,
        (SELECT COUNT(*) FROM pengajuan_bansos WHERE bansos_id = b.id AND status = 'DITERIMA') as total_diterima
      FROM bansos b
      WHERE b.status = 'AKTIF'
        AND b.tanggal_mulai <= CURDATE()
        AND b.tanggal_selesai >= CURDATE()
        AND b.deleted_at IS NULL
      ORDER BY b.prioritas DESC, b.created_at DESC
    `;

    return await this.executeQuery(query);
  }

  /**
   * Get bansos statistics
   */
  async getBansosStatistics() {
    const query = `
      SELECT
        COUNT(*) as total_bansos,
        SUM(CASE WHEN status = 'AKTIF' THEN 1 ELSE 0 END) as aktif,
        SUM(CASE WHEN status = 'DRAFT' THEN 1 ELSE 0 END) as draft,
        SUM(CASE WHEN status = 'SELESAI' THEN 1 ELSE 0 END) as selesai,
        SUM(CASE WHEN status = 'DIBATALKAN' THEN 1 ELSE 0 END) as dibatalkan,
        SUM(CASE WHEN jenis_bansos = 'TUNAI' THEN 1 ELSE 0 END) as tunai,
        SUM(CASE WHEN jenis_bansos = 'BARANG' THEN 1 ELSE 0 END) as barang,
        SUM(CASE WHEN jenis_bansos = 'JASA' THEN 1 ELSE 0 END) as jasa,
        SUM(kuota) as total_kuota,
        (SELECT COUNT(*) FROM pengajuan_bansos) as total_pengajuan,
        (SELECT COUNT(*) FROM pengajuan_bansos WHERE status = 'DITERIMA') as total_diterima,
        (SELECT COUNT(*) FROM pengajuan_bansos WHERE status = 'DITOLAK') as total_ditolak
      FROM bansos
      WHERE deleted_at IS NULL
    `;

    const results = await this.executeQuery(query);
    return results[0] || null;
  }

  /**
   * Get bansos by kategori
   */
  async getBansosByKategori() {
    const query = `
      SELECT
        kategori,
        COUNT(*) as jumlah,
        SUM(kuota) as total_kuota,
        GROUP_CONCAT(nama_bansos SEPARATOR ', ') as daftar_bansos
      FROM bansos
      WHERE deleted_at IS NULL
        AND status = 'AKTIF'
      GROUP BY kategori
      ORDER BY jumlah DESC
    `;

    return await this.executeQuery(query);
  }

  /**
   * Soft delete bansos
   */
  async softDelete(id) {
    const query = `
      UPDATE bansos
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await this.executeQuery(query, [id]);
  }

  /**
   * Restore soft deleted bansos
   */
  async restore(id) {
    const query = `
      UPDATE bansos
      SET deleted_at = NULL
      WHERE id = ?
    `;

    await this.executeQuery(query, [id]);
  }

  /**
   * Update bansos status
   */
  async updateStatus(id, status) {
    const query = `
      UPDATE bansos
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await this.executeQuery(query, [status, id]);
  }

  /**
   * Check if kode_bansos exists
   */
  async kodeBansosExists(kode, excludeId = null) {
    let query = `SELECT COUNT(*) as count FROM bansos WHERE kode_bansos = ? AND deleted_at IS NULL`;
    const params = [kode];

    if (excludeId) {
      query += ` AND id != ?`;
      params.push(excludeId);
    }

    const results = await this.executeQuery(query, params);
    return results[0].count > 0;
  }

  /**
   * Get kuota wilayah for bansos
   */
  async getKuotaWilayah(bansosId) {
    const query = `
      SELECT
        kw.*,
        d.nama_dusun,
        d.kode_dusun,
        rw.nomor_rw,
        rt.nomor_rt,
        (kw.kuota - kw.terpakai) as sisa_kuota
      FROM kuota_wilayah_bansos kw
      LEFT JOIN dusun d ON kw.dusun_id = d.id
      LEFT JOIN rw ON kw.rw_id = rw.id
      LEFT JOIN rt ON kw.rt_id = rt.id
      WHERE kw.bansos_id = ?
      ORDER BY d.nama_dusun, rw.nomor_rw, rt.nomor_rt
    `;

    return await this.executeQuery(query, [bansosId]);
  }

  /**
   * Update kuota wilayah
   */
  async updateKuotaWilayah(bansosId, wilayahData) {
    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();

      // Delete existing kuota for this bansos
      await connection.query(
        'DELETE FROM kuota_wilayah_bansos WHERE bansos_id = ?',
        [bansosId]
      );

      // Insert new kuota data
      for (const data of wilayahData) {
        await connection.query(
          `
          INSERT INTO kuota_wilayah_bansos
          (bansos_id, dusun_id, rw_id, rt_id, kuota, terpakai)
          VALUES (?, ?, ?, ?, ?, 0)
        `,
          [
            bansosId,
            data.dusun_id || null,
            data.rw_id || null,
            data.rt_id || null,
            data.kuota,
          ]
        );
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Check available quota for user's wilayah
   */
  async checkKuotaForUser(bansosId, userId) {
    const query = `
      SELECT
        kw.*,
        (kw.kuota - kw.terpakai) as sisa_kuota
      FROM kuota_wilayah_bansos kw
      INNER JOIN alamat a ON (
        (kw.dusun_id IS NULL OR kw.dusun_id = a.dusun_id) AND
        (kw.rw_id IS NULL OR kw.rw_id = a.rw_id) AND
        (kw.rt_id IS NULL OR kw.rt_id = a.rt_id)
      )
      WHERE kw.bansos_id = ?
        AND a.user_id = ?
      ORDER BY
        CASE WHEN kw.rt_id IS NOT NULL THEN 1
             WHEN kw.rw_id IS NOT NULL THEN 2
             WHEN kw.dusun_id IS NOT NULL THEN 3
             ELSE 4
        END
      LIMIT 1
    `;

    const results = await this.executeQuery(query, [bansosId, userId]);
    return results[0] || null;
  }

  /**
   * Increment terpakai quota
   */
  async incrementTerpakai(kuotaId) {
    const query = `
      UPDATE kuota_wilayah_bansos
      SET terpakai = terpakai + 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND terpakai < kuota
    `;

    const result = await this.executeQuery(query, [kuotaId]);
    return result.affectedRows > 0;
  }

  /**
   * Decrement terpakai quota
   */
  async decrementTerpakai(kuotaId) {
    const query = `
      UPDATE kuota_wilayah_bansos
      SET terpakai = GREATEST(0, terpakai - 1), updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await this.executeQuery(query, [kuotaId]);
  }

  /**
   * Get bansos timeline (for calendar view)
   */
  async getBansosTimeline(startDate, endDate) {
    const query = `
      SELECT
        id,
        kode_bansos,
        nama_bansos,
        status,
        prioritas,
        tanggal_mulai as start,
        tanggal_selesai as end,
        jenis_bansos,
        kategori
      FROM bansos
      WHERE deleted_at IS NULL
        AND (
          (tanggal_mulai BETWEEN ? AND ?) OR
          (tanggal_selesai BETWEEN ? AND ?) OR
          (tanggal_mulai <= ? AND tanggal_selesai >= ?)
        )
      ORDER BY tanggal_mulai
    `;

    return await this.executeQuery(query, [
      startDate,
      endDate,
      startDate,
      endDate,
      startDate,
      endDate,
    ]);
  }
}

module.exports = new BansosRepository();
