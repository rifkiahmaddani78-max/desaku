const BaseRepository = require('./BaseRepository');
const pool = require('../config/database');

class AuthRepository extends BaseRepository {
  constructor() {
    super('users', pool);
  }

  /**
   * Find user by username or email
   */
  async findByUsernameOrEmail(identifier) {
    const query = `
      SELECT u.*, r.name as role_name, r.description as role_description
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.username = ? OR u.email = ?
      LIMIT 1
    `;

    const results = await this.executeQuery(query, [identifier, identifier]);
    return results[0] || null;
  }

  /**
   * Find user by NIK
   */
  async findByNik(nik) {
    const query = `
      SELECT u.*, r.name as role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.nik = ?
      LIMIT 1
    `;

    const results = await this.executeQuery(query, [nik]);
    return results[0] || null;
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(userId) {
    const query = `
      UPDATE users
      SET last_login = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await this.executeQuery(query, [userId]);
  }

  /**
   * Save refresh token
   */
  async saveRefreshToken(userId, token, expiresAt) {
    const query = `
      INSERT INTO refresh_tokens (user_id, token, expires_at)
      VALUES (?, ?, ?)
    `;

    await this.executeQuery(query, [userId, token, expiresAt]);
  }

  /**
   * Find refresh token
   */
  async findRefreshToken(token) {
    const query = `
      SELECT rt.*, u.id as user_id, u.username, u.role_id, r.name as role_name
      FROM refresh_tokens rt
      JOIN users u ON rt.user_id = u.id
      JOIN roles r ON u.role_id = r.id
      WHERE rt.token = ?
        AND rt.expires_at > NOW()
        AND rt.is_revoked = FALSE
      LIMIT 1
    `;

    const results = await this.executeQuery(query, [token]);
    return results[0] || null;
  }

  /**
   * Revoke refresh token
   */
  async revokeRefreshToken(token) {
    const query = `
      UPDATE refresh_tokens
      SET is_revoked = TRUE
      WHERE token = ?
    `;

    await this.executeQuery(query, [token]);
  }

  /**
   * Revoke all refresh tokens for user
   */
  async revokeAllUserTokens(userId) {
    const query = `
      UPDATE refresh_tokens
      SET is_revoked = TRUE
      WHERE user_id = ?
    `;

    await this.executeQuery(query, [userId]);
  }

  /**
   * Clean expired tokens
   */
  async cleanExpiredTokens() {
    const query = `
      DELETE FROM refresh_tokens
      WHERE expires_at < NOW() OR is_revoked = TRUE
    `;

    await this.executeQuery(query);
  }
}

module.exports = new AuthRepository();
