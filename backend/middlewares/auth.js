const authUtils = require('../utils/auth');
const response = require('../utils/response');
const { authRepository } = require('../repositories');

/**
 * Authentication Middleware
 */
const authMiddleware = {
  /**
   * Verify JWT access token
   */
  authenticate: async (req, res, next) => {
    try {
      // Get token from header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return response.unauthorized(res, 'Access token tidak ditemukan');
      }

      const token = authHeader.split(' ')[1];

      // Verify token
      const decoded = authUtils.verifyAccessToken(token);

      if (!decoded) {
        return response.unauthorized(
          res,
          'Token tidak valid atau telah kedaluwarsa'
        );
      }

      // Check if user exists
      const user = await authRepository.findById(decoded.userId);

      if (!user) {
        return response.unauthorized(res, 'User tidak ditemukan');
      }

      if (!user.is_verified) {
        return response.forbidden(res, 'Akun belum diverifikasi');
      }

      // Attach user to request
      req.user = {
        id: user.id,
        role_id: user.role_id,
        role_name: decoded.roleName,
        username: user.username,
        email: user.email,
      };

      next();
    } catch (error) {
      console.error('Authentication error:', error);
      return response.unauthorized(res, 'Autentikasi gagal');
    }
  },

  /**
   * Verify refresh token
   */
  verifyRefreshToken: async (req, res, next) => {
    try {
      const { refresh_token } = req.body;

      if (!refresh_token) {
        return response.unauthorized(res, 'Refresh token diperlukan');
      }

      // Verify token
      const decoded = authUtils.verifyRefreshToken(refresh_token);

      if (!decoded) {
        return response.unauthorized(res, 'Refresh token tidak valid');
      }

      // Check token in database
      const tokenRecord = await authRepository.findRefreshToken(refresh_token);

      if (!tokenRecord) {
        return response.unauthorized(
          res,
          'Refresh token tidak ditemukan atau telah dicabut'
        );
      }

      // Check if user exists
      const user = await authRepository.findById(decoded.userId);

      if (!user) {
        return response.unauthorized(res, 'User tidak ditemukan');
      }

      // Attach token info to request
      req.refreshToken = refresh_token;
      req.tokenUser = {
        id: user.id,
        role_id: user.role_id,
        role_name: decoded.roleName,
      };

      next();
    } catch (error) {
      console.error('Refresh token verification error:', error);
      return response.unauthorized(res, 'Verifikasi refresh token gagal');
    }
  },

  /**
   * Optional authentication (for public routes that optionally need auth)
   */
  optionalAuthenticate: async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = authUtils.verifyAccessToken(token);

        if (decoded) {
          const user = await authRepository.findById(decoded.userId);

          if (user && user.is_verified) {
            req.user = {
              id: user.id,
              role_id: user.role_id,
              role_name: decoded.roleName,
              username: user.username,
              email: user.email,
            };
          }
        }
      }

      next();
    } catch (error) {
      // If authentication fails, just continue without user
      next();
    }
  },

  /**
   * Check if user is authenticated (without error response)
   */
  isAuthenticated: async (req) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false;
      }

      const token = authHeader.split(' ')[1];
      const decoded = authUtils.verifyAccessToken(token);

      if (!decoded) {
        return false;
      }

      const user = await authRepository.findById(decoded.userId);

      return !!(user && user.is_verified);
    } catch (error) {
      return false;
    }
  },
};

module.exports = authMiddleware;
