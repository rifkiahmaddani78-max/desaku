const BaseRepository = require('./BaseRepository');
const pool = require('../config/database');

class PengajuanBansosRepository extends BaseRepository {
  constructor() {
    super('pengajuan_bansos', pool);
  }

  /**
   * Get pengajuan with details
   */
  async findPengajuanWithDetails(id) {
    const query = `
      SELECT
        pb.*,
        b.kode_bansos,
        b.nama_bansos,
        b.jenis_bansos,
        b.kategori,
        b.jumlah_nominal,
        b.satuan_barang,
        u.nik as kk_nik,
        u.nama_lengkap as kk_nama,
        u.telepon as kk_telepon,
        a.alamat_lengkap,
        d.nama_dusun,
        rw.nomor_rw,
        rt.nomor_rt,
        admin_diterima.nama_lengkap as admin_diterima_nama,
        admin_ditolak.nama_lengkap as admin_ditolak_nama
      FROM pengajuan_bansos pb
      INNER JOIN bansos b ON pb.bansos_id = b.id
      INNER JOIN users u ON pb.kepala_keluarga_id = u.id
      LEFT JOIN alamat a ON u.id = a.user_id
      LEFT JOIN dusun d ON a.dusun_id = d.id
      LEFT JOIN rw ON a.rw_id = rw.id
      LEFT JOIN rt ON a.rt_id = rt.id
      LEFT JOIN users admin_diterima ON pb.diterima_oleh = admin_diterima.id
      LEFT JOIN users admin_ditolak ON pb.ditolak_oleh = admin_ditolak.id
      WHERE pb.id = ?
      LIMIT 1
    `;

    const results = await this.executeQuery(query, [id]);
    return results[0] || null;
  }

  /**
   * Get all pengajuan with filters
   */
  async findAllPengajuan(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;

    let query = `
      SELECT
        pb.*,
        b.kode_bansos,
        b.nama_bansos,
        b.jenis_bansos,
        u.nik as kk_nik,
        u.nama_lengkap as kk_nama,
        d.nama_dusun,
        rw.nomor_rw,
        rt.nomor_rt
      FROM pengajuan_bansos pb
      INNER JOIN bansos b ON pb.bansos_id = b.id
      INNER JOIN users u ON pb.kepala_keluarga_id = u.id
      LEFT JOIN alamat a ON u.id = a.user_id
      LEFT JOIN dusun d ON a.dusun_id = d.id
      LEFT JOIN rw ON a.rw_id = rw.id
      LEFT JOIN rt ON a.rt_id = rt.id
    `;

    const queryParams = [];
    const conditions = [];

    // Apply filters
    if (filters.bansos_id) {
      conditions.push('pb.bansos_id = ?');
      queryParams.push(filters.bansos_id);
    }

    if (filters.kepala_keluarga_id) {
      conditions.push('pb.kepala_keluarga_id = ?');
      queryParams.push(filters.kepala_keluarga_id);
    }

    if (filters.status) {
      conditions.push('pb.status = ?');
      queryParams.push(filters.status);
    }

    if (filters.dusun_id) {
      conditions.push('a.dusun_id = ?');
      queryParams.push(filters.dusun_id);
    }

    if (filters.rw_id) {
      conditions.push('a.rw_id = ?');
      queryParams.push(filters.rw_id);
    }

    if (filters.rt_id) {
      conditions.push('a.rt_id = ?');
      queryParams.push(filters.rt_id);
    }

    if (filters.tanggal_mulai && filters.tanggal_selesai) {
      conditions.push('DATE(pb.created_at) BETWEEN ? AND ?');
      queryParams.push(filters.tanggal_mulai, filters.tanggal_selesai);
    }

    if (filters.search) {
      conditions.push(`
        (b.kode_bansos LIKE ? OR b.nama_bansos LIKE ? OR
         u.nik LIKE ? OR u.nama_lengkap LIKE ?)
      `);
      const searchTerm = `%${filters.search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Apply sorting
    query += ` ORDER BY pb.created_at DESC LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    const results = await this.executeQuery(query, queryParams);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total
      FROM pengajuan_bansos pb
      INNER JOIN bansos b ON pb.bansos_id = b.id
      INNER JOIN users u ON pb.kepala_keluarga_id = u.id
      LEFT JOIN alamat a ON u.id = a.user_id
    `;

    if (conditions.length > 0) {
      countQuery += ` WHERE ${conditions.join(' AND ')}`;
    }

    const [countResult] = await this.executeQuery(countQuery, queryParams.slice(0, -2));

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
   * Get pengajuan by kepala keluarga
   */
  async getPengajuanByKepalaKeluarga(kepalaKeluargaId, status = null) {
    let query = `
      SELECT
        pb.*,
        b.kode_bansos,
        b.nama_bansos,
        b.jenis_bansos,
        b.kategori,
        b.jumlah_nominal,
        b.satuan_barang,
        b.status as bansos_status
      FROM pengajuan_bansos pb
      INNER JOIN bansos b ON pb.bansos_id = b.id
      WHERE pb.kepala_keluarga_id = ?
        AND b.deleted_at IS NULL
    `;

    const params = [kepalaKeluargaId];

    if (status) {
      query += ` AND pb.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY pb.created_at DESC`;

    return await this.executeQuery(query, params);
  }

  /**
   * Check if user already applied for bansos
   */
  async findByBansosAndUser(bansosId, kepalaKeluargaId) {
    const query = `
    SELECT *
    FROM pengajuan_bansos
    WHERE bansos_id = ?
      AND kepala_keluarga_id = ?
    LIMIT 1
  `;

    const results = await this.executeQuery(query, [bansosId, kepalaKeluargaId]);

    return results[0] || null;
  }
  
  async hasApplied(bansosId, kepalaKeluargaId) {
    const query = `
      SELECT COUNT(*) as count
      FROM pengajuan_bansos
      WHERE bansos_id = ?
        AND kepala_keluarga_id = ?
        AND status NOT IN ('DITOLAK')
    `;

    const results = await this.executeQuery(query, [bansosId, kepalaKeluargaId]);
    return results[0].count > 0;
  }

  /**
   * Update pengajuan status
   */
  async updateStatus(id, status, adminId = null, keterangan = null, catatanAdmin = null) {
    const updates = [`status = ?`];
    const params = [status];

    if (status === 'DITERIMA' && adminId) {
      updates.push('diterima_oleh = ?', 'tanggal_diterima = CURRENT_TIMESTAMP');
      params.push(adminId);
    }

    if (status === 'DITOLAK' && adminId) {
      updates.push('ditolak_oleh = ?', 'tanggal_ditolak = CURRENT_TIMESTAMP');
      params.push(adminId);
    }

    if (keterangan) {
      updates.push('keterangan = ?');
      params.push(keterangan);
    }

    if (catatanAdmin) {
      updates.push('catatan_admin = ?');
      params.push(catatanAdmin);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');

    params.push(id);

    const query = `
      UPDATE pengajuan_bansos
      SET ${updates.join(', ')}
      WHERE id = ?
    `;

    await this.executeQuery(query, params);
    return this.findPengajuanWithDetails(id);
  }

  /**
   * Add rating and testimoni
   */
  async addRating(id, rating, testimoni) {
    const query = `
      UPDATE pengajuan_bansos
      SET rating = ?, testimoni = ?, tanggal_testimoni = CURRENT_TIMESTAMP
      WHERE id = ? AND status = 'DITERIMA'
    `;

    await this.executeQuery(query, [rating, testimoni, id]);
  }

  /**
   * Get pengajuan statistics
   */
  async getPengajuanStatistics(bansosId = null, wilayahFilters = {}) {
    let query = `
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'MENUNGGU' THEN 1 ELSE 0 END) as menunggu,
        SUM(CASE WHEN status = 'DIPROSES' THEN 1 ELSE 0 END) as diproses,
        SUM(CASE WHEN status = 'DITERIMA' THEN 1 ELSE 0 END) as diterima,
        SUM(CASE WHEN status = 'DITOLAK' THEN 1 ELSE 0 END) as ditolak,
        DATE(created_at) as tanggal,
        COUNT(*) as harian
      FROM pengajuan_bansos
    `;

    const params = [];
    const conditions = [];

    if (bansosId) {
      conditions.push('bansos_id = ?');
      params.push(bansosId);
    }

    // Apply wilayah filters if provided
    if (wilayahFilters.dusun_id || wilayahFilters.rw_id || wilayahFilters.rt_id) {
      query = `
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN pb.status = 'MENUNGGU' THEN 1 ELSE 0 END) as menunggu,
          SUM(CASE WHEN pb.status = 'DIPROSES' THEN 1 ELSE 0 END) as diproses,
          SUM(CASE WHEN pb.status = 'DITERIMA' THEN 1 ELSE 0 END) as diterima,
          SUM(CASE WHEN pb.status = 'DITOLAK' THEN 1 ELSE 0 END) as ditolak,
          DATE(pb.created_at) as tanggal,
          COUNT(*) as harian
        FROM pengajuan_bansos pb
        INNER JOIN users u ON pb.kepala_keluarga_id = u.id
        INNER JOIN alamat a ON u.id = a.user_id
      `;

      if (wilayahFilters.dusun_id) {
        conditions.push('a.dusun_id = ?');
        params.push(wilayahFilters.dusun_id);
      }

      if (wilayahFilters.rw_id) {
        conditions.push('a.rw_id = ?');
        params.push(wilayahFilters.rw_id);
      }

      if (wilayahFilters.rt_id) {
        conditions.push('a.rt_id = ?');
        params.push(wilayahFilters.rt_id);
      }
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` GROUP BY DATE(created_at) ORDER BY tanggal DESC LIMIT 30`;

    const dailyStats = await this.executeQuery(query, params);

    // Get overall stats
    let overallQuery = `
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'MENUNGGU' THEN 1 ELSE 0 END) as menunggu,
        SUM(CASE WHEN status = 'DIPROSES' THEN 1 ELSE 0 END) as diproses,
        SUM(CASE WHEN status = 'DITERIMA' THEN 1 ELSE 0 END) as diterima,
        SUM(CASE WHEN status = 'DITOLAK' THEN 1 ELSE 0 END) as ditolak,
        AVG(rating) as avg_rating,
        COUNT(rating) as total_rating
      FROM pengajuan_bansos
    `;

    if (bansosId) {
      overallQuery += ` WHERE bansos_id = ?`;
    }

    const [overallStats] = await this.executeQuery(overallQuery, bansosId ? [bansosId] : []);

    return {
      overall: overallStats,
      daily: dailyStats,
    };
  }

  /**
   * Get testimonials
   */
  async getTestimonials(limit = 10) {
    const query = `
      SELECT
        pb.testimoni,
        pb.rating,
        pb.tanggal_testimoni,
        u.nama_lengkap as kk_nama,
        b.nama_bansos,
        d.nama_dusun
      FROM pengajuan_bansos pb
      INNER JOIN users u ON pb.kepala_keluarga_id = u.id
      INNER JOIN bansos b ON pb.bansos_id = b.id
      LEFT JOIN alamat a ON u.id = a.user_id
      LEFT JOIN dusun d ON a.dusun_id = d.id
      WHERE pb.testimoni IS NOT NULL
        AND pb.rating IS NOT NULL
        AND pb.status = 'DITERIMA'
      ORDER BY pb.tanggal_testimoni DESC
      LIMIT ?
    `;

    return await this.executeQuery(query, [limit]);
  }

  /**
   * Create log entry
   */
  async createLog(pengajuanId, userId, aksi, deskripsi, metadata = null) {
    const query = `
      INSERT INTO logs_bansos
      (pengajuan_id, user_id, aksi, deskripsi, metadata)
      VALUES (?, ?, ?, ?, ?)
    `;

    await this.executeQuery(query, [
      pengajuanId,
      userId,
      aksi,
      deskripsi,
      metadata ? JSON.stringify(metadata) : null,
    ]);
  }

  /**
   * Get logs for pengajuan
   */
  async getLogs(pengajuanId) {
    const query = `
      SELECT
        l.*,
        u.nama_lengkap as user_nama,
        u.username as user_username
      FROM logs_bansos l
      LEFT JOIN users u ON l.user_id = u.id
      WHERE l.pengajuan_id = ?
      ORDER BY l.created_at DESC
    `;

    return await this.executeQuery(query, [pengajuanId]);
  }

  /**
   * Create notification
   */
  async createNotification(pengajuanId, userId, judul, pesan, tipe) {
    const query = `
      INSERT INTO notifikasi_bansos
      (pengajuan_id, user_id, judul, pesan, tipe)
      VALUES (?, ?, ?, ?, ?)
    `;

    await this.executeQuery(query, [pengajuanId, userId, judul, pesan, tipe]);
  }

  /**
   * Get notifications for user
   */
  async getNotifications(userId, limit = 20, unreadOnly = false) {
    let query = `
      SELECT
        n.*,
        b.nama_bansos,
        pb.status as pengajuan_status
      FROM notifikasi_bansos n
      INNER JOIN pengajuan_bansos pb ON n.pengajuan_id = pb.id
      INNER JOIN bansos b ON pb.bansos_id = b.id
      WHERE n.user_id = ?
    `;

    const params = [userId];

    if (unreadOnly) {
      query += ` AND n.is_read = FALSE`;
    }

    query += ` ORDER BY n.created_at DESC LIMIT ?`;
    params.push(limit);

    return await this.executeQuery(query, params);
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId, userId = null) {
    let query = `UPDATE notifikasi_bansos SET is_read = TRUE WHERE id = ?`;
    const params = [notificationId];

    if (userId) {
      query += ` AND user_id = ?`;
      params.push(userId);
    }

    await this.executeQuery(query, params);
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsAsRead(userId) {
    const query = `
      UPDATE notifikasi_bansos
      SET is_read = TRUE
      WHERE user_id = ? AND is_read = FALSE
    `;

    await this.executeQuery(query, [userId]);
  }
}

module.exports = new PengajuanBansosRepository();
