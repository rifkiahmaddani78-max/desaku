const bcrypt = require('bcryptjs');
const {
  authRepository,
  userRepository,
  roleRepository,
} = require('../repositories');
const authUtils = require('../utils/auth');
const errorHandler = require('../middlewares/errorHandler');
const logger = require('../utils/logger');

class AuthService {
  /**
   * Login user
   */
  async login(username, password) {
    try {
      // Find user by username or email
      const user = await authRepository.findByUsernameOrEmail(username);

      if (!user) {
        throw errorHandler.createError('Username atau password salah', 401);
      }

      // Check password
      const isPasswordValid = await authUtils.comparePassword(
        password,
        user.password_hash
      );

      if (!isPasswordValid) {
        throw errorHandler.createError('Username atau password salah', 401);
      }

      // Check if user is verified
      if (!user.is_verified) {
        throw errorHandler.createError(
          'Akun belum diverifikasi. Silakan hubungi admin.',
          403
        );
      }

      // Update last login
      await authRepository.updateLastLogin(user.id);

      // Generate tokens
      const tokens = authUtils.generateTokens(
        user.id,
        user.role_id,
        user.role_name
      );

      // Save refresh token to database
      const expiresAt = authUtils.getTokenExpiration(
        process.env.JWT_REFRESH_EXPIRE || '7d'
      );
      await authRepository.saveRefreshToken(
        user.id,
        tokens.refreshToken,
        expiresAt
      );

      // Return user data without password
      const { password_hash, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        tokens,
      };
    } catch (error) {
      logger.error('Login service error:', error);
      throw error;
    }
  }

  /**
   * Register new kepala keluarga
   */
  async register(userData) {
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

      // Get kepala keluarga role
      const kepalaKeluargaRole = await roleRepository.findByName(
        'kepala_keluarga'
      );
      if (!kepalaKeluargaRole) {
        throw errorHandler.createError(
          'Role kepala keluarga tidak ditemukan',
          500
        );
      }

      // Hash password
      const hashedPassword = await authUtils.hashPassword(userData.password);

      // Create user
      const userToCreate = {
        ...userData,
        role_id: kepalaKeluargaRole.id,
        password_hash: hashedPassword,
        is_verified: false, // Default false, perlu diverifikasi admin
      };

      // Remove plain password from object
      delete userToCreate.password;

      const createdUser = await authRepository.create(userToCreate);

      // Remove password hash from response
      const { password_hash, ...userWithoutPassword } = createdUser;

      return {
        user: userWithoutPassword,
        message: 'Pendaftaran berhasil. Akun menunggu verifikasi admin.',
      };
    } catch (error) {
      logger.error('Register service error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = authUtils.verifyRefreshToken(refreshToken);

      if (!decoded) {
        throw errorHandler.createError('Refresh token tidak valid', 401);
      }

      // Check if token exists in database and not revoked
      const tokenRecord = await authRepository.findRefreshToken(refreshToken);

      if (!tokenRecord) {
        throw errorHandler.createError(
          'Refresh token tidak ditemukan atau telah dicabut',
          401
        );
      }

      // Check if user exists
      const user = await authRepository.findById(decoded.userId);

      if (!user) {
        throw errorHandler.createError('User tidak ditemukan', 401);
      }

      // Check if user is verified
      if (!user.is_verified) {
        throw errorHandler.createError('Akun belum diverifikasi', 403);
      }

      // Generate new tokens
      const tokens = authUtils.generateTokens(
        user.id,
        user.role_id,
        decoded.roleName
      );

      // Save new refresh token
      const expiresAt = authUtils.getTokenExpiration(
        process.env.JWT_REFRESH_EXPIRE || '7d'
      );
      await authRepository.saveRefreshToken(
        user.id,
        tokens.refreshToken,
        expiresAt
      );

      // Revoke old refresh token
      await authRepository.revokeRefreshToken(refreshToken);

      return tokens;
    } catch (error) {
      logger.error('Refresh token service error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(userId, refreshToken = null) {
    try {
      // If refresh token provided, revoke it
      if (refreshToken) {
        await authRepository.revokeRefreshToken(refreshToken);
      } else {
        // Otherwise revoke all user tokens
        await authRepository.revokeAllUserTokens(userId);
      }

      return { message: 'Logout berhasil' };
    } catch (error) {
      logger.error('Logout service error:', error);
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      // Get user with password hash
      const user = await authRepository.findById(userId);

      if (!user) {
        throw errorHandler.createError('User tidak ditemukan', 404);
      }

      // Verify current password
      const isCurrentPasswordValid = await authUtils.comparePassword(
        currentPassword,
        user.password_hash
      );

      if (!isCurrentPasswordValid) {
        throw errorHandler.createError('Password saat ini salah', 400);
      }

      // Hash new password
      const hashedPassword = await authUtils.hashPassword(newPassword);

      // Update password
      await userRepository.updatePassword(userId, hashedPassword);

      // Revoke all existing tokens (security measure)
      await authRepository.revokeAllUserTokens(userId);

      return { message: 'Password berhasil diubah' };
    } catch (error) {
      logger.error('Change password service error:', error);
      throw error;
    }
  }

  /**
   * Verify user account (admin only)
   */
  async verifyUser(userId, adminId) {
    try {
      const user = await userRepository.findById(userId);

      if (!user) {
        throw errorHandler.createError('User tidak ditemukan', 404);
      }

      if (user.is_verified) {
        throw errorHandler.createError('Akun sudah diverifikasi', 400);
      }

      // Update verification status
      await userRepository.updateVerification(userId, true);

      // Log the verification
      logger.info(`User ${userId} verified by admin ${adminId}`);

      return {
        message: 'Akun berhasil diverifikasi',
        user: await userRepository.findUserWithDetails(userId),
      };
    } catch (error) {
      logger.error('Verify user service error:', error);
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(userId) {
    try {
      const user = await userRepository.findUserWithDetails(userId);

      if (!user) {
        throw errorHandler.createError('User tidak ditemukan', 404);
      }

      // Remove sensitive data
      const { password_hash, ...userWithoutPassword } = user;

      return userWithoutPassword;
    } catch (error) {
      logger.error('Get profile service error:', error);
      throw error;
    }
  }

  /**
   * Update profile
   */
  async updateProfile(userId, updateData) {
    try {
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

      // Update user
      const updatedUser = await userRepository.update(userId, updateData);

      // Remove password hash from response
      const { password_hash, ...userWithoutPassword } = updatedUser;

      return {
        user: userWithoutPassword,
        message: 'Profil berhasil diperbarui',
      };
    } catch (error) {
      logger.error('Update profile service error:', error);
      throw error;
    }
  }

  /**
   * Clean expired tokens (cron job)
   */
  async cleanExpiredTokens() {
    try {
      const result = await authRepository.cleanExpiredTokens();
      logger.info('Expired tokens cleaned');
      return result;
    } catch (error) {
      logger.error('Clean expired tokens service error:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();
