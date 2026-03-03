const response = require('../utils/response');
const errorHandler = require('../middlewares/errorHandler');
const { bansosService } = require('../services');
const uploadUtils = require('../config/upload');

class BansosController {
  /**
   * @route   GET /api/bansos
   * @desc    Get all bansos (admin only)
   * @access  Private (Admin)
   */
  async getAllBansos(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        kategori,
        jenis_bansos,
        prioritas,
        search,
        include_deleted = false,
      } = req.query;

      const filters = {};
      if (status) filters.status = status;
      if (kategori) filters.kategori = kategori;
      if (jenis_bansos) filters.jenis_bansos = jenis_bansos;
      if (prioritas) filters.prioritas = prioritas;
      if (search) filters.search = search;

      const result = await bansosService.getAllBansos(
        parseInt(page),
        parseInt(limit),
        filters,
        include_deleted === 'true'
      );

      return response.success(res, result, 'Data bansos berhasil diambil');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   GET /api/bansos/active
   * @desc    Get active bansos (public)
   * @access  Public
   */
  async getActiveBansos(req, res) {
    try {
      const bansosList = await bansosService.getActiveBansos();

      return response.success(
        res,
        bansosList,
        'Data bansos aktif berhasil diambil'
      );
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   GET /api/bansos/:id
   * @desc    Get bansos by ID
   * @access  Private (Admin) or Public for active bansos
   */
  async getBansosById(req, res) {
    try {
      const bansosId = parseInt(req.params.id);
      const includeDetails = req.query.details !== 'false';

      const bansos = await bansosService.getBansosById(
        bansosId,
        includeDetails
      );

      // Check if user can access (admin can access all, others only active)
      if (req.user?.role_name !== 'admin' && bansos.status !== 'AKTIF') {
        return response.forbidden(
          res,
          'Anda tidak memiliki akses ke bansos ini'
        );
      }

      return response.success(res, bansos, 'Data bansos berhasil diambil');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   POST /api/bansos
   * @desc    Create new bansos
   * @access  Private (Admin)
   */
  async createBansos(req, res) {
    try {
      const result = await bansosService.createBansos(req.body, req.user.id);

      return response.success(res, result, 'Bansos berhasil dibuat', 201);
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   PUT /api/bansos/:id
   * @desc    Update bansos
   * @access  Private (Admin)
   */
  async updateBansos(req, res) {
    try {
      const bansosId = parseInt(req.params.id);

      const result = await bansosService.updateBansos(bansosId, req.body);

      return response.success(res, result, 'Bansos berhasil diperbarui');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   DELETE /api/bansos/:id
   * @desc    Delete bansos (soft delete)
   * @access  Private (Admin)
   */
  async deleteBansos(req, res) {
    try {
      const bansosId = parseInt(req.params.id);

      await bansosService.deleteBansos(bansosId);

      return response.success(res, null, 'Bansos berhasil dihapus');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   POST /api/bansos/:id/restore
   * @desc    Restore deleted bansos
   * @access  Private (Admin)
   */
  async restoreBansos(req, res) {
    try {
      const bansosId = parseInt(req.params.id);

      const result = await bansosService.restoreBansos(bansosId);

      return response.success(res, result, 'Bansos berhasil dipulihkan');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   PUT /api/bansos/:id/status
   * @desc    Update bansos status
   * @access  Private (Admin)
   */
  async updateBansosStatus(req, res) {
    try {
      const bansosId = parseInt(req.params.id);
      const { status } = req.body;

      const result = await bansosService.updateBansosStatus(bansosId, status);

      return response.success(res, result, 'Status bansos berhasil diubah');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   GET /api/bansos/:id/eligibility
   * @desc    Check eligibility for bansos
   * @access  Private (Kepala Keluarga)
   */
  async checkEligibility(req, res) {
    try {
      const bansosId = parseInt(req.params.id);
      const userId = req.user.id;

      const eligibility = await bansosService.checkEligibility(
        bansosId,
        userId
      );

      return response.success(res, eligibility, 'Hasil pengecekan kelayakan');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   GET /api/bansos/statistics
   * @desc    Get bansos statistics
   * @access  Private (Admin)
   */
  async getBansosStatistics(req, res) {
    try {
      const statistics = await bansosService.getBansosStatistics();

      return response.success(
        res,
        statistics,
        'Statistik bansos berhasil diambil'
      );
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   GET /api/bansos/timeline
   * @desc    Get bansos timeline
   * @access  Private (Admin)
   */
  async getBansosTimeline(req, res) {
    try {
      const { start_date, end_date } = req.query;

      if (!start_date || !end_date) {
        return response.error(res, 'Start date dan end date diperlukan', 400);
      }

      const timeline = await bansosService.getBansosTimeline(
        start_date,
        end_date
      );

      return response.success(
        res,
        timeline,
        'Timeline bansos berhasil diambil'
      );
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   POST /api/bansos/:id/upload-panduan
   * @desc    Upload dokumen panduan
   * @access  Private (Admin)
   */
  async uploadDokumenPanduan(req, res) {
    try {
      const bansosId = parseInt(req.params.id);

      if (!req.file) {
        return response.error(res, 'File diperlukan', 400);
      }

      const result = await bansosService.uploadDokumenPanduan(
        bansosId,
        req.file.filename
      );

      return response.success(res, result, 'Dokumen panduan berhasil diupload');
    } catch (error) {
      // Clean up uploaded file if error
      if (req.file) {
        uploadUtils.removeFile(req.file.path);
      }

      return errorHandler.globalErrorHandler(error, req, res);
    }
  }
}

module.exports = new BansosController();
