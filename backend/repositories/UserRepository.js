const BaseRepository = require('./BaseRepository');
const pool = require('../config/database');

class UserRepository extends BaseRepository {
  constructor() {
    super('users', pool);
  }

  /**
   * Find user with role and alamat details
   */
  async findUserWithDetails(id) {
    const query = `
      SELECT
        u.*,
        r.name as role_name,
        r.description as role_description,
        a.alamat_lengkap,
        a.koordinat_lat,
        a.koordinat_lng,
        d.nama_dusun,
        rw.nomor_rw,
        rt.nomor_rt
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN alamat a ON u.id = a.user_id
      LEFT JOIN dusun d ON a.dusun_id = d.id
      LEFT JOIN rw ON a.rw_id = rw.id
      LEFT JOIN rt ON a.rt_id = rt.id
      WHERE u.id = ?
      LIMIT 1
    `;

    const results = await this.executeQuery(query, [id]);
    return results[0] || null;
  }

  /**
   * Find all users with pagination and filters
   */
  async findAllUsers(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;

    let query = `
      SELECT
        u.*,
        r.name as role_name,
        COUNT(ak.id) as jumlah_anggota_keluarga
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN anggota_keluarga ak ON u.id = ak.kepala_keluarga_id
    `;

    const queryParams = [];
    const conditions = [];

    // Apply filters
    if (filters.role_id) {
      conditions.push('u.role_id = ?');
      queryParams.push(filters.role_id);
    }

    if (filters.search) {
      conditions.push(`
        (u.nik LIKE ? OR u.nama_lengkap LIKE ? OR u.username LIKE ? OR u.email LIKE ?)
      `);
      const searchTerm = `%${filters.search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (filters.is_verified !== undefined) {
      conditions.push('u.is_verified = ?');
      queryParams.push(filters.is_verified);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Group by for count
    query += ` GROUP BY u.id ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    const results = await this.executeQuery(query, queryParams);

    // Get total count
    let countQuery = `
      SELECT COUNT(DISTINCT u.id) as total
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
    `;

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
   * Update user verification status
   */
  async updateVerification(userId, isVerified) {
    const query = `
      UPDATE users
      SET is_verified = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await this.executeQuery(query, [isVerified, userId]);
    return this.findById(userId);
  }

  /**
   * Update user password
   */
  async updatePassword(userId, passwordHash) {
    const query = `
      UPDATE users
      SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await this.executeQuery(query, [passwordHash, userId]);
  }

  /**
   * Check if username exists (excluding current user)
   */
  async usernameExists(username, excludeUserId = null) {
    let query = `SELECT COUNT(*) as count FROM users WHERE username = ?`;
    const params = [username];

    if (excludeUserId) {
      query += ` AND id != ?`;
      params.push(excludeUserId);
    }

    const results = await this.executeQuery(query, params);
    return results[0].count > 0;
  }

  /**
   * Check if email exists (excluding current user)
   */
  async emailExists(email, excludeUserId = null) {
    let query = `SELECT COUNT(*) as count FROM users WHERE email = ?`;
    const params = [email];

    if (excludeUserId) {
      query += ` AND id != ?`;
      params.push(excludeUserId);
    }

    const results = await this.executeQuery(query, params);
    return results[0].count > 0;
  }

  /**
   * Check if NIK exists (excluding current user)
   */
  async nikExists(nik, excludeUserId = null) {
    let query = `SELECT COUNT(*) as count FROM users WHERE nik = ?`;
    const params = [nik];

    if (excludeUserId) {
      query += ` AND id != ?`;
      params.push(excludeUserId);
    }

    const results = await this.executeQuery(query, params);
    return results[0].count > 0;
  }
}

module.exports = new UserRepository();
