const { pengajuanBansosRepository, bansosRepository, userRepository } = require('../repositories');
const errorHandler = require('../middlewares/errorHandler');
const logger = require('../utils/logger');
const uploadUtils = require('../config/upload');

class PengajuanBansosService {
  /**
   * Get all pengajuan
   */
  async getAllPengajuan(page = 1, limit = 10, filters = {}) {
    try {
      return await pengajuanBansosRepository.findAllPengajuan(page, limit, filters);
    } catch (error) {
      logger.error('Get all pengajuan service error:', error);
      throw error;
    }
  }

  /**
   * Get pengajuan by ID
   */
  async getPengajuanById(id) {
    try {
      const pengajuan = await pengajuanBansosRepository.findPengajuanWithDetails(id);

      if (!pengajuan) {
        throw errorHandler.createError('Pengajuan tidak ditemukan', 404);
      }

      // Add file URLs
      pengajuan.dokumen_pendukung_url = uploadUtils.getFileUrl(
        pengajuan.dokumen_pendukung,
        'bansos'
      );
      pengajuan.dokumen_ktp_url = uploadUtils.getFileUrl(pengajuan.dokumen_ktp, 'ktp');
      pengajuan.dokumen_kk_url = uploadUtils.getFileUrl(pengajuan.dokumen_kk, 'kk');
      pengajuan.dokumen_surat_permohonan_url = uploadUtils.getFileUrl(
        pengajuan.dokumen_surat_permohonan,
        'dokumen'
      );
      pengajuan.dokumen_lainnya_url = uploadUtils.getFileUrl(pengajuan.dokumen_lainnya, 'bansos');

      // Get logs
      pengajuan.logs = await pengajuanBansosRepository.getLogs(id);

      return pengajuan;
    } catch (error) {
      logger.error('Get pengajuan by ID service error:', error);
      throw error;
    }
  }

  /**
   * Get pengajuan by kepala keluarga
   */
  async getPengajuanByKepalaKeluarga(kepalaKeluargaId, status = null) {
    try {
      const pengajuanList = await pengajuanBansosRepository.getPengajuanByKepalaKeluarga(
        kepalaKeluargaId,
        status
      );

      // Add file URLs
      return pengajuanList.map(p => ({
        ...p,
        dokumen_pendukung_url: uploadUtils.getFileUrl(p.dokumen_pendukung, 'bansos'),
      }));
    } catch (error) {
      logger.error('Get pengajuan by KK service error:', error);
      throw error;
    }
  }

  /**
   * Create pengajuan bansos
   */
  async createPengajuan(pengajuanData, files, kepalaKeluargaId) {
    const connection = await pengajuanBansosRepository.pool.getConnection();

    try {
      await connection.beginTransaction();

      const { bansos_id, alasan_pengajuan, ...otherData } = pengajuanData;

      // Check bansos exists and active
      const bansos = await bansosRepository.findById(bansos_id);
      if (!bansos || bansos.deleted_at) {
        throw errorHandler.createError('Bansos tidak ditemukan', 404);
      }

      if (bansos.status !== 'AKTIF') {
        throw errorHandler.createError('Bansos tidak aktif', 400);
      }

      // Check dates
      const today = new Date();
      const mulai = new Date(bansos.tanggal_mulai);
      const selesai = new Date(bansos.tanggal_selesai);

      if (today < mulai || today > selesai) {
        throw errorHandler.createError('Bansos tidak dalam periode pengajuan', 400);
      }

      // Check if already applied
      // const hasApplied = await pengajuanBansosRepository.hasApplied(
      //   bansos_id,
      //   kepalaKeluargaId
      // );
      // if (hasApplied) {
      //   throw errorHandler.createError('Anda sudah mengajukan bansos ini', 400);
      // }

      const existing = await pengajuanBansosRepository.findByBansosAndUser(
        bansos_id,
        kepalaKeluargaId
      );

      if (existing) {
        if (existing.status === 'DITOLAK') {
          // Reset jadi pengajuan baru
          await pengajuanBansosRepository.update(existing.id, {
            status: 'MENUNGGU',
            alasan_pengajuan,
            ...otherData,
          });

          await pengajuanBansosRepository.createLog(
            existing.id,
            kepalaKeluargaId,
            'PENGAJUAN_ULANG',
            'Pengajuan ulang setelah ditolak',
            { old_status: 'DITOLAK', new_status: 'MENUNGGU' }
          );

          await connection.commit();

          return {
            pengajuan: await this.getPengajuanById(existing.id),
            message: 'Pengajuan ulang berhasil dibuat',
          };
        }

        throw errorHandler.createError('Anda sudah mengajukan bansos ini', 400);
      }

      // Check eligibility and quota
      const eligibility = await bansosRepository.checkKuotaForUser(bansos_id, kepalaKeluargaId);
      if (!eligibility) {
        throw errorHandler.createError('Tidak ada kuota untuk wilayah Anda', 400);
      }

      if (eligibility.terpakai >= eligibility.kuota) {
        throw errorHandler.createError('Kuota untuk wilayah Anda sudah habis', 400);
      }

      // Check if user is verified
      const user = await userRepository.findById(kepalaKeluargaId);
      if (!user.is_verified) {
        throw errorHandler.createError('Akun Anda belum diverifikasi', 400);
      }

      // Check if user has complete address
      const alamat = await userRepository.executeQuery('SELECT * FROM alamat WHERE user_id = ?', [
        kepalaKeluargaId,
      ]);

      if (!alamat[0] || !alamat[0].dusun_id || !alamat[0].rw_id || !alamat[0].rt_id) {
        throw errorHandler.createError('Data alamat belum lengkap', 400);
      }

      // Prepare pengajuan data
      const pengajuanToCreate = {
        bansos_id,
        kepala_keluarga_id: kepalaKeluargaId,
        alasan_pengajuan,
        status: 'MENUNGGU',
        ...otherData,
      };

      // Handle file uploads
      if (files) {
        if (files.dokumen_pendukung) {
          pengajuanToCreate.dokumen_pendukung = files.dokumen_pendukung[0];
        }
        if (files.dokumen_ktp) {
          pengajuanToCreate.dokumen_ktp = files.dokumen_ktp[0];
        }
        if (files.dokumen_kk) {
          pengajuanToCreate.dokumen_kk = files.dokumen_kk[0];
        }
        if (files.dokumen_surat_permohonan) {
          pengajuanToCreate.dokumen_surat_permohonan = files.dokumen_surat_permohonan[0];
        }
        if (files.dokumen_lainnya) {
          pengajuanToCreate.dokumen_lainnya = files.dokumen_lainnya[0];
        }
      }

      // Create pengajuan
      const createdPengajuan = await pengajuanBansosRepository.create(pengajuanToCreate);

      // Increment quota usage
      await bansosRepository.incrementTerpakai(eligibility.id);

      // Create log
      await pengajuanBansosRepository.createLog(
        createdPengajuan.id,
        kepalaKeluargaId,
        'PENGAJUAN',
        'Pengajuan bansos dibuat',
        { status: 'MENUNGGU' }
      );

      // Create notification for admin
      const adminUsers = await userRepository.executeQuery(
        `SELECT id FROM users WHERE role_id = (SELECT id FROM roles WHERE name = 'admin')`
      );

      for (const admin of adminUsers) {
        await pengajuanBansosRepository.createNotification(
          createdPengajuan.id,
          admin.id,
          'Pengajuan Bansos Baru',
          `Ada pengajuan bansos baru dari ${user.nama_lengkap}`,
          'PENGAJUAN'
        );
      }

      await connection.commit();

      logger.info(`Pengajuan ${createdPengajuan.id} created by user ${kepalaKeluargaId}`);

      return {
        pengajuan: await this.getPengajuanById(createdPengajuan.id),
        message: 'Pengajuan bansos berhasil dibuat',
      };
    } catch (error) {
      await connection.rollback();

      // Clean up uploaded files if error
      if (files) {
        Object.values(files).forEach(fileArray => {
          fileArray.forEach(file => {
            if (file.path) {
              uploadUtils.removeFile(file.path);
            }
          });
        });
      }

      logger.error('Create pengajuan service error:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Update pengajuan status (admin only)
   */
  async updatePengajuanStatus(id, status, adminId, keterangan = null, catatanAdmin = null) {
    const connection = await pengajuanBansosRepository.pool.getConnection();

    try {
      await connection.beginTransaction();

      // Check pengajuan exists
      const pengajuan = await pengajuanBansosRepository.findById(id);
      if (!pengajuan) {
        throw errorHandler.createError('Pengajuan tidak ditemukan', 404);
      }

      // Validate status transition
      const validStatuses = ['MENUNGGU', 'DIPROSES', 'DITERIMA', 'DITOLAK'];
      if (!validStatuses.includes(status)) {
        throw errorHandler.createError('Status tidak valid', 400);
      }

      // Get old status for log
      const oldStatus = pengajuan.status;

      // Update status
      const updatedPengajuan = await pengajuanBansosRepository.updateStatus(
        id,
        status,
        adminId,
        keterangan,
        catatanAdmin
      );

      // Create log
      await pengajuanBansosRepository.createLog(
        id,
        adminId,
        status === 'DITERIMA' ? 'VERIFIKASI' : status === 'DITOLAK' ? 'PENOLAKAN' : 'PERUBAHAN',
        `Status pengajuan diubah dari ${oldStatus} menjadi ${status}`,
        {
          old_status: oldStatus,
          new_status: status,
          keterangan,
          catatan_admin: catatanAdmin,
        }
      );

      // Handle quota if rejected
      if (oldStatus !== 'DITOLAK' && status === 'DITOLAK') {
        const eligibility = await bansosRepository.checkKuotaForUser(
          pengajuan.bansos_id,
          pengajuan.kepala_keluarga_id
        );

        if (eligibility) {
          await bansosRepository.decrementTerpakai(eligibility.id);
        }
      }

      // Handle quota if accepted
      if (oldStatus === 'DITOLAK' && status === 'DITERIMA') {
        const eligibility = await bansosRepository.checkKuotaForUser(
          pengajuan.bansos_id,
          pengajuan.kepala_keluarga_id
        );

        if (eligibility) {
          await bansosRepository.incrementTerpakai(eligibility.id);
        }
      }

      // Create notification for user
      let judulNotifikasi = '';
      let pesanNotifikasi = '';

      switch (status) {
        case 'DIPROSES':
          judulNotifikasi = 'Pengajuan Sedang Diproses';
          pesanNotifikasi = 'Pengajuan bansos Anda sedang dalam proses verifikasi';
          break;
        case 'DITERIMA':
          judulNotifikasi = 'Pengajuan Diterima!';
          pesanNotifikasi = 'Selamat! Pengajuan bansos Anda telah diterima';
          break;
        case 'DITOLAK':
          judulNotifikasi = 'Pengajuan Ditolak';
          pesanNotifikasi = `Pengajuan bansos Anda ditolak. Alasan: ${
            keterangan || 'Tidak disebutkan'
          }`;
          break;
      }

      if (judulNotifikasi) {
        await pengajuanBansosRepository.createNotification(
          id,
          pengajuan.kepala_keluarga_id,
          judulNotifikasi,
          pesanNotifikasi,
          status === 'DITERIMA' ? 'VERIFIKASI' : 'PENGINGAT'
        );
      }

      await connection.commit();

      logger.info(`Pengajuan ${id} status updated to ${status} by admin ${adminId}`);

      return {
        pengajuan: await this.getPengajuanById(id),
        message: `Status pengajuan berhasil diubah menjadi ${status}`,
      };
    } catch (error) {
      await connection.rollback();
      logger.error('Update pengajuan status service error:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Add rating and testimoni
   */
  async addRating(id, rating, testimoni, userId) {
    try {
      // Check pengajuan exists and belongs to user
      const pengajuan = await pengajuanBansosRepository.findById(id);
      if (!pengajuan) {
        throw errorHandler.createError('Pengajuan tidak ditemukan', 404);
      }

      if (pengajuan.kepala_keluarga_id !== userId) {
        throw errorHandler.createError('Anda tidak memiliki akses', 403);
      }

      if (pengajuan.status !== 'DITERIMA') {
        throw errorHandler.createError(
          'Hanya pengajuan yang diterima dapat memberikan rating',
          400
        );
      }

      if (rating < 1 || rating > 5) {
        throw errorHandler.createError('Rating harus antara 1-5', 400);
      }

      // Add rating
      await pengajuanBansosRepository.addRating(id, rating, testimoni);

      // Create log
      await pengajuanBansosRepository.createLog(
        id,
        userId,
        'RATING',
        'Memberikan rating dan testimoni',
        { rating, testimoni_length: testimoni.length }
      );

      return {
        message: 'Rating dan testimoni berhasil disimpan',
        pengajuan: await this.getPengajuanById(id),
      };
    } catch (error) {
      logger.error('Add rating service error:', error);
      throw error;
    }
  }

  /**
   * Get pengajuan statistics
   */
  async getPengajuanStatistics(bansosId = null, wilayahFilters = {}) {
    try {
      const statistics = await pengajuanBansosRepository.getPengajuanStatistics(
        bansosId,
        wilayahFilters
      );
      const testimonials = await pengajuanBansosRepository.getTestimonials(5);

      return {
        ...statistics,
        testimonials,
      };
    } catch (error) {
      logger.error('Get pengajuan statistics service error:', error);
      throw error;
    }
  }

  /**
   * Get notifications for user
   */
  async getNotifications(userId, limit = 20, unreadOnly = false) {
    try {
      const notifications = await pengajuanBansosRepository.getNotifications(
        userId,
        limit,
        unreadOnly
      );

      return notifications;
    } catch (error) {
      logger.error('Get notifications service error:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId, userId) {
    try {
      await pengajuanBansosRepository.markNotificationAsRead(notificationId, userId);

      return { message: 'Notifikasi ditandai sebagai telah dibaca' };
    } catch (error) {
      logger.error('Mark notification as read service error:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsAsRead(userId) {
    try {
      await pengajuanBansosRepository.markAllNotificationsAsRead(userId);

      return { message: 'Semua notifikasi ditandai sebagai telah dibaca' };
    } catch (error) {
      logger.error('Mark all notifications as read service error:', error);
      throw error;
    }
  }

  /**
   * Export pengajuan to Excel/PDF (placeholder)
   */
  async exportPengajuan(filters, format = 'excel') {
    try {
      // In real implementation, use library like exceljs or pdfkit
      // This is a placeholder
      const pengajuan = await pengajuanBansosRepository.findAllPengajuan(1, 1000, filters);

      return {
        message: `Data berhasil diexport dalam format ${format.toUpperCase()}`,
        count: pengajuan.data.length,
        // In real implementation, return file buffer or path
        data: pengajuan.data,
      };
    } catch (error) {
      logger.error('Export pengajuan service error:', error);
      throw error;
    }
  }

  /**
   * Upload additional document
   */
  async uploadDokumen(pengajuanId, fieldName, filename, userId) {
    try {
      // Check pengajuan exists and belongs to user
      const pengajuan = await pengajuanBansosRepository.findById(pengajuanId);
      if (!pengajuan) {
        throw errorHandler.createError('Pengajuan tidak ditemukan', 404);
      }

      if (pengajuan.kepala_keluarga_id !== userId) {
        throw errorHandler.createError('Anda tidak memiliki akses', 403);
      }

      // Validate field name
      const validFields = [
        'dokumen_pendukung',
        'dokumen_ktp',
        'dokumen_kk',
        'dokumen_surat_permohonan',
        'dokumen_lainnya',
      ];

      if (!validFields.includes(fieldName)) {
        throw errorHandler.createError('Nama field dokumen tidak valid', 400);
      }

      // Remove old file if exists
      if (pengajuan[fieldName]) {
        let folder = 'bansos';
        if (fieldName === 'dokumen_ktp') folder = 'ktp';
        if (fieldName === 'dokumen_kk') folder = 'kk';
        if (fieldName === 'dokumen_surat_permohonan') folder = 'dokumen';

        uploadUtils.removeFile(`uploads/${folder}/${pengajuan[fieldName]}`);
      }

      // Update database
      const updateData = { [fieldName]: filename };
      await pengajuanBansosRepository.update(pengajuanId, updateData);

      // Create log
      await pengajuanBansosRepository.createLog(
        pengajuanId,
        userId,
        'PERUBAHAN',
        `Dokumen ${fieldName} diupload ulang`,
        { field_name: fieldName }
      );

      return {
        message: 'Dokumen berhasil diupload',
        file_url: uploadUtils.getFileUrl(
          filename,
          fieldName === 'dokumen_ktp'
            ? 'ktp'
            : fieldName === 'dokumen_kk'
              ? 'kk'
              : fieldName === 'dokumen_surat_permohonan'
                ? 'dokumen'
                : 'bansos'
        ),
      };
    } catch (error) {
      logger.error('Upload dokumen service error:', error);
      throw error;
    }
  }
}

module.exports = new PengajuanBansosService();
