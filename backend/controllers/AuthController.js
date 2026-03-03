const response = require('../utils/response');
const errorHandler = require('../middlewares/errorHandler');
const { authService } = require('../services');

class AuthController {
  /**
   * @route   POST /api/auth/login
   * @desc    Login user
   * @access  Public
   */
  async login(req, res) {
    try {
      const { username, password } = req.body;

      const result = await authService.login(username, password);

      // Set refresh token as HTTP-only cookie
      res.cookie('refresh_token', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return response.success(
        res,
        {
          user: result.user,
          access_token: result.tokens.accessToken,
        },
        'Login berhasil'
      );
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   POST /api/auth/register
   * @desc    Register new kepala keluarga
   * @access  Public
   */
  async register(req, res) {
    try {
      const result = await authService.register(req.body);

      return response.success(res, result, 'Pendaftaran berhasil');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   POST /api/auth/refresh
   * @desc    Refresh access token
   * @access  Public (with refresh token)
   */
  async refreshToken(req, res) {
    try {
      // Get refresh token from body or cookie
      const refreshToken = req.body.refresh_token || req.cookies.refresh_token;

      if (!refreshToken) {
        return response.unauthorized(res, 'Refresh token diperlukan');
      }

      const tokens = await authService.refreshToken(refreshToken);

      // Update refresh token cookie
      res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return response.success(
        res,
        {
          access_token: tokens.accessToken,
        },
        'Token berhasil diperbarui'
      );
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   POST /api/auth/logout
   * @desc    Logout user
   * @access  Private
   */
  async logout(req, res) {
    try {
      const refreshToken = req.body.refresh_token || req.cookies.refresh_token;

      await authService.logout(req.user.id, refreshToken);

      // Clear refresh token cookie
      res.clearCookie('refresh_token');

      return response.success(res, null, 'Logout berhasil');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   POST /api/auth/change-password
   * @desc    Change password
   * @access  Private
   */
  async changePassword(req, res) {
    try {
      const { current_password, new_password, confirm_password } = req.body;

      if (new_password !== confirm_password) {
        return response.error(res, 'Konfirmasi password tidak cocok', 400);
      }

      await authService.changePassword(
        req.user.id,
        current_password,
        new_password
      );

      // Clear cookies on password change
      res.clearCookie('refresh_token');

      return response.success(res, null, 'Password berhasil diubah');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   GET /api/auth/profile
   * @desc    Get current user profile
   * @access  Private
   */
  async getProfile(req, res) {
    try {
      const profile = await authService.getProfile(req.user.id);

      return response.success(res, profile, 'Profile berhasil diambil');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   PUT /api/auth/profile
   * @desc    Update profile
   * @access  Private
   */
  async updateProfile(req, res) {
    try {
      const result = await authService.updateProfile(req.user.id, req.body);

      return response.success(res, result, 'Profile berhasil diperbarui');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   POST /api/auth/verify/:id
   * @desc    Verify user account (admin only)
   * @access  Private (Admin)
   */
  async verifyUser(req, res) {
    try {
      const userId = parseInt(req.params.id);
      const adminId = req.user.id;

      const result = await authService.verifyUser(userId, adminId);

      return response.success(res, result, 'Akun berhasil diverifikasi');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }
}

module.exports = new AuthController();
