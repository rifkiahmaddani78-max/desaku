const response = require('../utils/response');
const errorHandler = require('../middlewares/errorHandler');
const { pengajuanBansosService } = require('../services');
const uploadUtils = require('../config/upload');

class PengajuanBansosController {
  /**
   * @route   GET /api/pengajuan-bansos
   * @desc    Get all pengajuan (admin only)
   * @access  Private (Admin)
   */
  async getAllPengajuan(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        bansos_id,
        kepala_keluarga_id,
        status,
        dusun_id,
        rw_id,
        rt_id,
        tanggal_mulai,
        tanggal_selesai,
        search,
      } = req.query;

      const filters = {};
      if (bansos_id) filters.bansos_id = parseInt(bansos_id);
      if (kepala_keluarga_id)
        filters.kepala_keluarga_id = parseInt(kepala_keluarga_id);
      if (status) filters.status = status;
      if (dusun_id) filters.dusun_id = parseInt(dusun_id);
      if (rw_id) filters.rw_id = parseInt(rw_id);
      if (rt_id) filters.rt_id = parseInt(rt_id);
      if (tanggal_mulai && tanggal_selesai) {
        filters.tanggal_mulai = tanggal_mulai;
        filters.tanggal_selesai = tanggal_selesai;
      }
      if (search) filters.search = search;

      const result = await pengajuanBansosService.getAllPengajuan(
        parseInt(page),
        parseInt(limit),
        filters
      );

      return response.success(res, result, 'Data pengajuan berhasil diambil');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   GET /api/pengajuan-bansos/my
   * @desc    Get pengajuan by current user
   * @access  Private (Kepala Keluarga)
   */
  async getMyPengajuan(req, res) {
    try {
      const { status } = req.query;

      const pengajuanList =
        await pengajuanBansosService.getPengajuanByKepalaKeluarga(
          req.user.id,
          status
        );

      return response.success(
        res,
        pengajuanList,
        'Data pengajuan berhasil diambil'
      );
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   GET /api/pengajuan-bansos/:id
   * @desc    Get pengajuan by ID
   * @access  Private (Admin or Owner)
   */
  async getPengajuanById(req, res) {
    try {
      const pengajuanId = parseInt(req.params.id);

      const pengajuan = await pengajuanBansosService.getPengajuanById(
        pengajuanId
      );

      // Check access: admin can access all, user only their own
      if (
        req.user.role_name !== 'admin' &&
        pengajuan.kepala_keluarga_id !== req.user.id
      ) {
        return response.forbidden(
          res,
          'Anda tidak memiliki akses ke pengajuan ini'
        );
      }

      return response.success(
        res,
        pengajuan,
        'Data pengajuan berhasil diambil'
      );
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   POST /api/pengajuan-bansos
   * @desc    Create new pengajuan
   * @access  Private (Kepala Keluarga)
   */
  async createPengajuan(req, res) {
    try {
      // Handle file uploads
      const files = {};
      if (req.files) {
        Object.keys(req.files).forEach((key) => {
          files[key] = req.files[key].map((file) => file.filename);
        });
      }

      const result = await pengajuanBansosService.createPengajuan(
        req.body,
        files,
        req.user.id
      );

      return response.success(res, result, 'Pengajuan berhasil dibuat', 201);
    } catch (error) {
      // Clean up uploaded files if error
      if (req.files) {
        Object.values(req.files).forEach((fileArray) => {
          fileArray.forEach((file) => {
            uploadUtils.removeFile(file.path);
          });
        });
      }

      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   PUT /api/pengajuan-bansos/:id/status
   * @desc    Update pengajuan status
   * @access  Private (Admin)
   */
  async updatePengajuanStatus(req, res) {
    try {
      const pengajuanId = parseInt(req.params.id);
      const { status, keterangan, catatan_admin } = req.body;

      const result = await pengajuanBansosService.updatePengajuanStatus(
        pengajuanId,
        status,
        req.user.id,
        keterangan,
        catatan_admin
      );

      return response.success(res, result, 'Status pengajuan berhasil diubah');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   POST /api/pengajuan-bansos/:id/rating
   * @desc    Add rating and testimoni
   * @access  Private (Kepala Keluarga - Owner only)
   */
  async addRating(req, res) {
    try {
      const pengajuanId = parseInt(req.params.id);
      const { rating, testimoni } = req.body;

      const result = await pengajuanBansosService.addRating(
        pengajuanId,
        rating,
        testimoni,
        req.user.id
      );

      return response.success(
        res,
        result,
        'Rating dan testimoni berhasil disimpan'
      );
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   GET /api/pengajuan-bansos/statistics
   * @desc    Get pengajuan statistics
   * @access  Private (Admin)
   */
  async getPengajuanStatistics(req, res) {
    try {
      const { bansos_id, dusun_id, rw_id, rt_id } = req.query;

      const wilayahFilters = {};
      if (dusun_id) wilayahFilters.dusun_id = parseInt(dusun_id);
      if (rw_id) wilayahFilters.rw_id = parseInt(rw_id);
      if (rt_id) wilayahFilters.rt_id = parseInt(rt_id);

      const statistics = await pengajuanBansosService.getPengajuanStatistics(
        bansos_id ? parseInt(bansos_id) : null,
        wilayahFilters
      );

      return response.success(
        res,
        statistics,
        'Statistik pengajuan berhasil diambil'
      );
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   GET /api/pengajuan-bansos/notifications
   * @desc    Get notifications
   * @access  Private
   */
  async getNotifications(req, res) {
    try {
      const { limit = 20, unread_only = false } = req.query;

      const notifications = await pengajuanBansosService.getNotifications(
        req.user.id,
        parseInt(limit),
        unread_only === 'true'
      );

      return response.success(
        res,
        notifications,
        'Notifikasi berhasil diambil'
      );
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   PUT /api/pengajuan-bansos/notifications/:id/read
   * @desc    Mark notification as read
   * @access  Private
   */
  async markNotificationAsRead(req, res) {
    try {
      const notificationId = parseInt(req.params.id);

      await pengajuanBansosService.markNotificationAsRead(
        notificationId,
        req.user.id
      );

      return response.success(
        res,
        null,
        'Notifikasi ditandai sebagai telah dibaca'
      );
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   PUT /api/pengajuan-bansos/notifications/read-all
   * @desc    Mark all notifications as read
   * @access  Private
   */
  async markAllNotificationsAsRead(req, res) {
    try {
      await pengajuanBansosService.markAllNotificationsAsRead(req.user.id);

      return response.success(
        res,
        null,
        'Semua notifikasi ditandai sebagai telah dibaca'
      );
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   POST /api/pengajuan-bansos/export
   * @desc    Export pengajuan data
   * @access  Private (Admin)
   */
  async exportPengajuan(req, res) {
    try {
      const { format = 'excel', ...filters } = req.query;

      const result = await pengajuanBansosService.exportPengajuan(
        filters,
        format
      );

      return response.success(res, result, 'Data berhasil diexport');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   POST /api/pengajuan-bansos/:id/upload-dokumen
   * @desc    Upload additional document
   * @access  Private (Kepala Keluarga - Owner only)
   */
  async uploadDokumen(req, res) {
    try {
      const pengajuanId = parseInt(req.params.id);
      const { field_name } = req.body;

      if (!field_name || !req.file) {
        return response.error(res, 'Field name dan file diperlukan', 400);
      }

      const result = await pengajuanBansosService.uploadDokumen(
        pengajuanId,
        field_name,
        req.file.filename,
        req.user.id
      );

      return response.success(res, result, 'Dokumen berhasil diupload');
    } catch (error) {
      // Clean up uploaded file if error
      if (req.file) {
        uploadUtils.removeFile(req.file.path);
      }

      return errorHandler.globalErrorHandler(error, req, res);
    }
  }
}

module.exports = new PengajuanBansosController();
