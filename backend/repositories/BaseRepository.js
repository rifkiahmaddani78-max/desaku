const logger = require('../utils/logger');

/**
 * Base Repository Class
 * Menyediakan method CRUD dasar untuk semua repositories
 */
class BaseRepository {
  constructor(tableName, connectionPool) {
    this.tableName = tableName;
    this.pool = connectionPool;
  }

  /**
   * Execute query dengan error handling
   */
  async executeQuery(query, params = []) {
    const connection = await this.pool.getConnection();
    try {
      const [results] = await connection.query(query, params);
      return results;
    } catch (error) {
      logger.error(`Database query error in ${this.tableName}:`, error);
      throw new Error(`Database error: ${error.message}`);
    } finally {
      connection.release();
    }
  }

  /**
   * Execute query dengan transaction
   */
  async executeTransaction(callback) {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      logger.error(`Transaction error in ${this.tableName}:`, error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Find all records dengan pagination
   */
  async findAll(page = 1, limit = 10, filters = {}, sort = {}) {
    const offset = (page - 1) * limit;

    let query = `SELECT * FROM ${this.tableName}`;
    const queryParams = [];

    // Apply filters
    const filterConditions = [];
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        filterConditions.push(`${key} = ?`);
        queryParams.push(value);
      }
    });

    if (filterConditions.length > 0) {
      query += ` WHERE ${filterConditions.join(' AND ')}`;
    }

    // Apply sorting
    if (sort.field && sort.direction) {
      query += ` ORDER BY ${sort.field} ${sort.direction.toUpperCase()}`;
    } else {
      query += ` ORDER BY created_at DESC`;
    }

    // Apply pagination
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    const results = await this.executeQuery(query, queryParams);

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM ${this.tableName}`;
    if (filterConditions.length > 0) {
      countQuery += ` WHERE ${filterConditions.join(' AND ')}`;
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
   * Find by ID
   */
  async findById(id) {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const results = await this.executeQuery(query, [id]);
    return results[0] || null;
  }

  /**
   * Find by field
   */
  async findOne(field, value) {
    const query = `SELECT * FROM ${this.tableName} WHERE ${field} = ? LIMIT 1`;
    const results = await this.executeQuery(query, [value]);
    return results[0] || null;
  }

  /**
   * Create new record
   */
  async create(data) {
    const fields = Object.keys(data).join(', ');
    const placeholders = Object.keys(data)
      .map(() => '?')
      .join(', ');
    const values = Object.values(data);

    const query = `
      INSERT INTO ${this.tableName} (${fields})
      VALUES (${placeholders})
    `;

    const result = await this.executeQuery(query, values);
    return { id: result.insertId, ...data };
  }

  /**
   * Update record by ID
   */
  async update(id, data) {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(', ');
    const values = [...Object.values(data), id];

    const query = `
      UPDATE ${this.tableName}
      SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await this.executeQuery(query, values);
    return this.findById(id);
  }

  /**
   * Delete record by ID
   */
  async delete(id) {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const result = await this.executeQuery(query, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Check if record exists
   */
  async exists(field, value) {
    const query = `SELECT COUNT(*) as count FROM ${this.tableName} WHERE ${field} = ?`;
    const results = await this.executeQuery(query, [value]);
    return results[0].count > 0;
  }
}

module.exports = BaseRepository;
