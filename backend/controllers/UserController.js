const response = require('../utils/response');
const errorHandler = require('../middlewares/errorHandler');
const { userService } = require('../services');

class UserController {
  /**
   * @route   GET /api/users
   * @desc    Get all users (admin only)
   * @access  Private (Admin)
   */
  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10, search, role_id, is_verified } = req.query;

      const filters = {};
      if (search) filters.search = search;
      if (role_id) filters.role_id = parseInt(role_id);
      if (is_verified !== undefined)
        filters.is_verified = is_verified === 'true';

      const result = await userService.getAllUsers(
        parseInt(page),
        parseInt(limit),
        filters
      );

      return response.success(res, result, 'Data user berhasil diambil');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   GET /api/users/:id
   * @desc    Get user by ID
   * @access  Private (Admin) or Own profile
   */
  async getUserById(req, res) {
    try {
      const userId = parseInt(req.params.id);

      // Check if user is accessing own profile or is admin
      if (req.user.id !== userId && req.user.role_name !== 'admin') {
        return response.forbidden(res, 'Anda tidak memiliki akses');
      }

      const user = await userService.getUserById(userId);

      return response.success(res, user, 'Data user berhasil diambil');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   POST /api/users
   * @desc    Create new user (admin only)
   * @access  Private (Admin)
   */
  async createUser(req, res) {
    try {
      const result = await userService.createUser(req.body, req.user.id);

      return response.success(res, result, 'User berhasil dibuat', 201);
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   PUT /api/users/:id
   * @desc    Update user (admin only)
   * @access  Private (Admin)
   */
  async updateUser(req, res) {
    try {
      const userId = parseInt(req.params.id);

      const result = await userService.updateUser(userId, req.body);

      return response.success(res, result, 'User berhasil diperbarui');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   DELETE /api/users/:id
   * @desc    Delete user (admin only)
   * @access  Private (Admin)
   */
  async deleteUser(req, res) {
    try {
      const userId = parseInt(req.params.id);

      await userService.deleteUser(userId, req.user.id);

      return response.success(res, null, 'User berhasil dihapus');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   PUT /api/users/:id/address
   * @desc    Update user address
   * @access  Private (Admin) or Own address
   */
  async updateUserAddress(req, res) {
    try {
      const userId = parseInt(req.params.id);

      // Check if user is updating own address or is admin
      if (req.user.id !== userId && req.user.role_name !== 'admin') {
        return response.forbidden(res, 'Anda tidak memiliki akses');
      }

      const result = await userService.updateUserAddress(userId, req.body);

      return response.success(res, result, 'Alamat berhasil diperbarui');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   GET /api/users/statistics
   * @desc    Get user statistics (admin only)
   * @access  Private (Admin)
   */
  async getUserStatistics(req, res) {
    try {
      const statistics = await userService.getUserStatistics();

      return response.success(
        res,
        statistics,
        'Statistik user berhasil diambil'
      );
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }
}

module.exports = new UserController();
