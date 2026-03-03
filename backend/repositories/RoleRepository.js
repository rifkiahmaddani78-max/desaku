const BaseRepository = require('./BaseRepository');
const pool = require('../config/database');

class RoleRepository extends BaseRepository {
  constructor() {
    super('roles', pool);
  }

  /**
   * Find role by name
   */
  async findByName(name) {
    return this.findOne('name', name);
  }

  /**
   * Get role permissions (nanti bisa dikembangkan)
   */
  async getRolePermissions(roleId) {
    // Untuk sekarang return hardcoded permissions
    // Nanti bisa dikembangkan dengan tabel permissions
    const permissions = {
      admin: [
        'manage_users',
        'manage_wilayah',
        'manage_bansos',
        'manage_berita',
        'manage_jadwal',
        'view_reports',
      ],
      kepala_keluarga: [
        'view_profile',
        'manage_anggota',
        'apply_bansos',
        'view_berita',
        'view_jadwal',
      ],
    };

    const role = await this.findById(roleId);
    return permissions[role.name] || [];
  }
}

module.exports = new RoleRepository();
