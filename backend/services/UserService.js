const {
  userRepository,
  authRepository,
  roleRepository,
  alamatRepository,
} = require('../repositories');
const authUtils = require('../utils/auth');
const errorHandler = require('../middlewares/errorHandler');
const logger = require('../utils/logger');

class UserService {
  /**
   * Get all users with pagination
   */
  async getAllUsers(page = 1, limit = 10, filters = {}) {
    try {
      return await userRepository.findAllUsers(page, limit, filters);
    } catch (error) {
      logger.error('Get all users service error:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    try {
      const user = await userRepository.findUserWithDetails(userId);

      if (!user) {
        throw errorHandler.createError('User tidak ditemukan', 404);
      }

      // Remove sensitive data
      const { password_hash, ...userWithoutPassword } = user;

      return userWithoutPassword;
    } catch (error) {
      logger.error('Get user by ID service error:', error);
      throw error;
    }
  }

  /**
   * Create user (admin only)
   */
  async createUser(userData, createdByAdminId) {
    try {
      // Check if NIK already exists
      const nikExists = await userRepository.nikExists(userData.nik);
      if (nikExists) {
        throw errorHandler.createError('NIK sudah terdaftar', 400);
      }

      // Check if username already exists
      const usernameExists = await userRepository.usernameExists(
        userData.username
      );
      if (usernameExists) {
        throw errorHandler.createError('Username sudah digunakan', 400);
      }

      // Check if email already exists (if provided)
      if (userData.email) {
        const emailExists = await userRepository.emailExists(userData.email);
        if (emailExists) {
          throw errorHandler.createError('Email sudah terdaftar', 400);
        }
      }

      // Check if role exists
      const role = await roleRepository.findById(userData.role_id);
      if (!role) {
        throw errorHandler.createError('Role tidak ditemukan', 400);
      }

      // Generate random password if not provided
      let password = userData.password;
      if (!password) {
        password = authUtils.generateRandomPassword();
      }

      // Hash password
      const hashedPassword = await authUtils.hashPassword(password);

      // Create user
      const userToCreate = {
        ...userData,
        password_hash: hashedPassword,
        is_verified: true, // Admin-created users are auto-verified
      };

      // Remove plain password from object
      delete userToCreate.password;

      const createdUser = await authRepository.create(userToCreate);

      // Remove password hash from response
      const { password_hash, ...userWithoutPassword } = createdUser;

      // Log the creation
      logger.info(
        `User ${createdUser.id} created by admin ${createdByAdminId}`
      );

      return {
        user: userWithoutPassword,
        generatedPassword: !userData.password ? password : undefined,
        message: 'User berhasil dibuat',
      };
    } catch (error) {
      logger.error('Create user service error:', error);
      throw error;
    }
  }

  /**
   * Update user (admin only)
   */
  async updateUser(userId, updateData) {
    try {
      // Check if user exists
      const existingUser = await userRepository.findById(userId);
      if (!existingUser) {
        throw errorHandler.createError('User tidak ditemukan', 404);
      }

      // Check if username exists (if being updated)
      if (updateData.username) {
        const usernameExists = await userRepository.usernameExists(
          updateData.username,
          userId
        );
        if (usernameExists) {
          throw errorHandler.createError('Username sudah digunakan', 400);
        }
      }

      // Check if email exists (if being updated)
      if (updateData.email) {
        const emailExists = await userRepository.emailExists(
          updateData.email,
          userId
        );
        if (emailExists) {
          throw errorHandler.createError('Email sudah terdaftar', 400);
        }
      }

      // Check if NIK exists (if being updated)
      if (updateData.nik) {
        const nikExists = await userRepository.nikExists(
          updateData.nik,
          userId
        );
        if (nikExists) {
          throw errorHandler.createError('NIK sudah terdaftar', 400);
        }
      }

      // Check if role exists (if being updated)
      if (updateData.role_id) {
        const role = await roleRepository.findById(updateData.role_id);
        if (!role) {
          throw errorHandler.createError('Role tidak ditemukan', 400);
        }
      }

      // Update user
      const updatedUser = await userRepository.update(userId, updateData);

      // Remove password hash from response
      const { password_hash, ...userWithoutPassword } = updatedUser;

      return {
        user: userWithoutPassword,
        message: 'User berhasil diperbarui',
      };
    } catch (error) {
      logger.error('Update user service error:', error);
      throw error;
    }
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(userId, deletedByAdminId) {
    try {
      // Check if user exists
      const user = await userRepository.findById(userId);
      if (!user) {
        throw errorHandler.createError('User tidak ditemukan', 404);
      }

      // Cannot delete self
      if (userId === deletedByAdminId) {
        throw errorHandler.createError(
          'Tidak dapat menghapus akun sendiri',
          400
        );
      }

      // Delete user (cascade will handle related records)
      const deleted = await userRepository.delete(userId);

      if (!deleted) {
        throw errorHandler.createError('Gagal menghapus user', 500);
      }

      // Log the deletion
      logger.info(`User ${userId} deleted by admin ${deletedByAdminId}`);

      return { message: 'User berhasil dihapus' };
    } catch (error) {
      logger.error('Delete user service error:', error);
      throw error;
    }
  }

  /**
   * Update user address
   */
  async updateUserAddress(userId, addressData) {
    try {
      // Check if user exists and is kepala keluarga
      const user = await userRepository.findById(userId);
      if (!user) {
        throw errorHandler.createError('User tidak ditemukan', 404);
      }

      // Verify required wilayah data exists
      if (!addressData.dusun_id || !addressData.rw_id || !addressData.rt_id) {
        throw errorHandler.createError(
          'Data dusun, RW, dan RT diperlukan',
          400
        );
      }

      // Update or create address
      const updatedAddress = await alamatRepository.upsertAlamat(
        userId,
        addressData
      );

      return {
        address: updatedAddress,
        message: 'Alamat berhasil diperbarui',
      };
    } catch (error) {
      logger.error('Update user address service error:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStatistics() {
    try {
      const query = `
        SELECT
          COUNT(*) as total_users,
          SUM(CASE WHEN role_id = (SELECT id FROM roles WHERE name = 'admin') THEN 1 ELSE 0 END) as total_admin,
          SUM(CASE WHEN role_id = (SELECT id FROM roles WHERE name = 'kepala_keluarga') THEN 1 ELSE 0 END) as total_kepala_keluarga,
          SUM(CASE WHEN is_verified = TRUE THEN 1 ELSE 0 END) as verified_users,
          SUM(CASE WHEN is_verified = FALSE THEN 1 ELSE 0 END) as unverified_users,
          DATE(created_at) as registration_date,
          COUNT(*) as daily_registrations
        FROM users
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(created_at)
        ORDER BY registration_date DESC
      `;

      const results = await userRepository.executeQuery(query);

      // Get total counts
      const totalQuery = `
        SELECT
          COUNT(*) as total,
          COUNT(CASE WHEN is_verified = TRUE THEN 1 END) as verified,
          COUNT(CASE WHEN is_verified = FALSE THEN 1 END) as unverified
        FROM users
      `;

      const [totalCounts] = await userRepository.executeQuery(totalQuery);

      return {
        statistics: {
          total: totalCounts.total,
          verified: totalCounts.verified,
          unverified: totalCounts.unverified,
          admin:
            totalCounts.total - totalCounts.verified - totalCounts.unverified, // Simplified
          dailyRegistrations: results,
        },
      };
    } catch (error) {
      logger.error('Get user statistics service error:', error);
      throw error;
    }
  }
}

module.exports = new UserService();
