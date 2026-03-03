const response = require('../utils/response');
const errorHandler = require('../middlewares/errorHandler');
const { anggotaKeluargaService } = require('../services');

class AnggotaKeluargaController {
  /**
   * @route   GET /api/anggota-keluarga
   * @desc    Get anggota keluarga by kepala keluarga ID (own family or admin)
   * @access  Private
   */
  async getAnggotaByKepalaKeluarga(req, res) {
    try {
      const kepalaKeluargaId = req.query.kepala_keluarga_id
        ? parseInt(req.query.kepala_keluarga_id)
        : req.user.id;

      // Check if user is accessing own family or is admin
      if (req.user.id !== kepalaKeluargaId && req.user.role_name !== 'admin') {
        return response.forbidden(res, 'Anda tidak memiliki akses');
      }

      const anggotaList =
        await anggotaKeluargaService.getAnggotaByKepalaKeluarga(
          kepalaKeluargaId
        );

      return response.success(
        res,
        anggotaList,
        'Data anggota keluarga berhasil diambil'
      );
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   GET /api/anggota-keluarga/:id
   * @desc    Get anggota keluarga by ID
   * @access  Private
   */
  async getAnggotaById(req, res) {
    try {
      const anggotaId = parseInt(req.params.id);

      const anggota = await anggotaKeluargaService.getAnggotaById(anggotaId);

      // Check if user is accessing own family member or is admin
      if (
        req.user.id !== anggota.kepala_keluarga_id &&
        req.user.role_name !== 'admin'
      ) {
        return response.forbidden(res, 'Anda tidak memiliki akses');
      }

      return response.success(
        res,
        anggota,
        'Data anggota keluarga berhasil diambil'
      );
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   POST /api/anggota-keluarga
   * @desc    Create new anggota keluarga
   * @access  Private (Kepala Keluarga or Admin)
   */
  async createAnggota(req, res) {
    try {
      const kepalaKeluargaId = req.body.kepala_keluarga_id || req.user.id;

      // Check if user is adding to own family or is admin
      if (req.user.id !== kepalaKeluargaId && req.user.role_name !== 'admin') {
        return response.forbidden(res, 'Anda tidak memiliki akses');
      }

      const result = await anggotaKeluargaService.createAnggota(
        kepalaKeluargaId,
        req.body
      );

      return response.success(
        res,
        result,
        'Anggota keluarga berhasil ditambahkan',
        201
      );
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   PUT /api/anggota-keluarga/:id
   * @desc    Update anggota keluarga
   * @access  Private
   */
  async updateAnggota(req, res) {
    try {
      const anggotaId = parseInt(req.params.id);

      // For non-admin users, they can only update their own family members
      const kepalaKeluargaId =
        req.user.role_name === 'admin' ? null : req.user.id;

      const result = await anggotaKeluargaService.updateAnggota(
        anggotaId,
        req.body,
        kepalaKeluargaId
      );

      return response.success(
        res,
        result,
        'Data anggota keluarga berhasil diperbarui'
      );
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   DELETE /api/anggota-keluarga/:id
   * @desc    Delete anggota keluarga
   * @access  Private
   */
  async deleteAnggota(req, res) {
    try {
      const anggotaId = parseInt(req.params.id);

      // For non-admin users, they can only delete their own family members
      const kepalaKeluargaId =
        req.user.role_name === 'admin' ? null : req.user.id;

      await anggotaKeluargaService.deleteAnggota(anggotaId, kepalaKeluargaId);

      return response.success(res, null, 'Anggota keluarga berhasil dihapus');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   GET /api/anggota-keluarga/stats/:kepalaKeluargaId?
   * @desc    Get keluarga statistics
   * @access  Private
   */
  async getKeluargaStats(req, res) {
    try {
      const kepalaKeluargaId = req.params.kepalaKeluargaId
        ? parseInt(req.params.kepalaKeluargaId)
        : req.user.id;

      // Check if user is accessing own stats or is admin
      if (req.user.id !== kepalaKeluargaId && req.user.role_name !== 'admin') {
        return response.forbidden(res, 'Anda tidak memiliki akses');
      }

      const stats = await anggotaKeluargaService.getKeluargaStats(
        kepalaKeluargaId
      );

      return response.success(
        res,
        stats,
        'Statistik keluarga berhasil diambil'
      );
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   GET /api/anggota-keluarga/search
   * @desc    Search anggota keluarga
   * @access  Private (Admin) or own family
   */
  async searchAnggota(req, res) {
    try {
      const { q } = req.query;

      if (!q || q.length < 3) {
        return response.error(res, 'Kata pencarian minimal 3 karakter', 400);
      }

      // For non-admin users, only search within their own family
      const kepalaKeluargaId =
        req.user.role_name === 'admin' ? null : req.user.id;

      const results = await anggotaKeluargaService.searchAnggota(
        q,
        kepalaKeluargaId
      );

      return response.success(res, results, 'Pencarian berhasil');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }
}

module.exports = new AnggotaKeluargaController();
