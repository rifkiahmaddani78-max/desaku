const response = require('../utils/response');

/**
 * Role-based Access Control Middleware
 */
const roleMiddleware = {
  /**
   * Check if user has required role
   */
  requireRole: (...allowedRoles) => {
    return (req, res, next) => {
      if (!req.user) {
        return response.unauthorized(res, 'Autentikasi diperlukan');
      }

      if (!allowedRoles.includes(req.user.role_name)) {
        return response.forbidden(
          res,
          `Akses ditolak. Role yang diizinkan: ${allowedRoles.join(', ')}`
        );
      }

      next();
    };
  },

  /**
   * Check if user is admin
   */
  requireAdmin: (req, res, next) => {
    if (!req.user) {
      return response.unauthorized(res, 'Autentikasi diperlukan');
    }

    if (req.user.role_name !== 'admin') {
      return response.forbidden(
        res,
        'Hanya admin yang dapat mengakses fitur ini'
      );
    }

    next();
  },

  /**
   * Check if user is kepala keluarga
   */
  requireKepalaKeluarga: (req, res, next) => {
    if (!req.user) {
      return response.unauthorized(res, 'Autentikasi diperlukan');
    }

    if (req.user.role_name !== 'kepala_keluarga') {
      return response.forbidden(
        res,
        'Hanya kepala keluarga yang dapat mengakses fitur ini'
      );
    }

    next();
  },

  /**
   * Check if user can access their own resource
   */
  requireOwnershipOrAdmin: (resourceUserIdField = 'user_id') => {
    return (req, res, next) => {
      if (!req.user) {
        return response.unauthorized(res, 'Autentikasi diperlukan');
      }

      // Admin can access any resource
      if (req.user.role_name === 'admin') {
        return next();
      }

      // Check if resource belongs to user
      const resourceUserId =
        req.params[resourceUserIdField] || req.body[resourceUserIdField];

      if (parseInt(resourceUserId) !== parseInt(req.user.id)) {
        return response.forbidden(
          res,
          'Anda hanya dapat mengakses data milik sendiri'
        );
      }

      next();
    };
  },

  /**
   * Check permission for specific action
   */
  requirePermission: (permission) => {
    return async (req, res, next) => {
      if (!req.user) {
        return response.unauthorized(res, 'Autentikasi diperlukan');
      }

      // For now, we'll use role-based permissions
      // Later can be extended with a proper permission system
      const rolePermissions = {
        admin: ['all'],
        kepala_keluarga: [
          'read_own_profile',
          'update_own_profile',
          'manage_own_family',
          'apply_bansos',
          'view_bansos_status',
          'view_news',
          'view_schedule',
        ],
      };

      const permissions = rolePermissions[req.user.role_name] || [];

      if (!permissions.includes('all') && !permissions.includes(permission)) {
        return response.forbidden(
          res,
          `Anda tidak memiliki izin untuk melakukan aksi: ${permission}`
        );
      }

      next();
    };
  },

  /**
   * Check if user is verified
   */
  requireVerified: (req, res, next) => {
    if (!req.user) {
      return response.unauthorized(res, 'Autentikasi diperlukan');
    }

    // For now, we assume all authenticated users are verified
    // This can be enhanced by checking user.is_verified from database
    next();
  },
};

module.exports = roleMiddleware;
