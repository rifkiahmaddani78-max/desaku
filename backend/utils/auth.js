const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtConfig = require('../config/jwt');
const logger = require('./logger');

/**
 * Auth Utility Functions
 */
const authUtils = {
  /**
   * Hash password menggunakan bcrypt
   */
  hashPassword: async (password) => {
    try {
      const salt = await bcrypt.genSalt(
        parseInt(process.env.BCRYPT_SALT_ROUNDS || 12)
      );
      return await bcrypt.hash(password, salt);
    } catch (error) {
      logger.error('Error hashing password:', error);
      throw new Error('Password hashing failed');
    }
  },

  /**
   * Compare password dengan hash
   */
  comparePassword: async (password, hash) => {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      logger.error('Error comparing password:', error);
      throw new Error('Password comparison failed');
    }
  },

  /**
   * Generate JWT access token
   */
  generateAccessToken: (userId, roleId, roleName) => {
    return jwt.sign(
      {
        userId,
        roleId,
        roleName,
        type: 'access',
      },
      jwtConfig.accessSecret,
      { expiresIn: jwtConfig.accessExpire }
    );
  },

  /**
   * Generate JWT refresh token
   */
  generateRefreshToken: (userId, roleId, roleName) => {
    return jwt.sign(
      {
        userId,
        roleId,
        roleName,
        type: 'refresh',
      },
      jwtConfig.refreshSecret,
      { expiresIn: jwtConfig.refreshExpire }
    );
  },

  /**
   * Verify JWT access token
   */
  verifyAccessToken: (token) => {
    try {
      return jwt.verify(token, jwtConfig.accessSecret);
    } catch (error) {
      logger.error('Access token verification failed:', error.message);
      return null;
    }
  },

  /**
   * Verify JWT refresh token
   */
  verifyRefreshToken: (token) => {
    try {
      return jwt.verify(token, jwtConfig.refreshSecret);
    } catch (error) {
      logger.error('Refresh token verification failed:', error.message);
      return null;
    }
  },

  /**
   * Decode JWT token tanpa verification
   */
  decodeToken: (token) => {
    try {
      return jwt.decode(token);
    } catch (error) {
      logger.error('Token decoding failed:', error);
      return null;
    }
  },

  /**
   * Generate tokens pair
   */
  generateTokens: (userId, roleId, roleName) => {
    return {
      accessToken: authUtils.generateAccessToken(userId, roleId, roleName),
      refreshToken: authUtils.generateRefreshToken(userId, roleId, roleName),
    };
  },

  /**
   * Validate password strength
   */
  validatePasswordStrength: (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];

    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }
    if (!hasUpperCase) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!hasLowerCase) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!hasNumbers) {
      errors.push('Password must contain at least one number');
    }
    if (!hasSpecialChar) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Generate random password
   */
  generateRandomPassword: (length = 12) => {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';

    // Ensure at least one of each required character type
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(
      Math.floor(Math.random() * 26)
    );
    password += 'abcdefghijklmnopqrstuvwxyz'.charAt(
      Math.floor(Math.random() * 26)
    );
    password += '0123456789'.charAt(Math.floor(Math.random() * 10));
    password += '!@#$%^&*'.charAt(Math.floor(Math.random() * 8));

    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    // Shuffle the password
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  },

  /**
   * Calculate token expiration date
   */
  getTokenExpiration: (expiresIn) => {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1));

    const now = new Date();

    switch (unit) {
      case 's': // seconds
        return new Date(now.getTime() + value * 1000);
      case 'm': // minutes
        return new Date(now.getTime() + value * 60 * 1000);
      case 'h': // hours
        return new Date(now.getTime() + value * 60 * 60 * 1000);
      case 'd': // days
        return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() + 15 * 60 * 1000); // default 15 minutes
    }
  },
};

module.exports = authUtils;
