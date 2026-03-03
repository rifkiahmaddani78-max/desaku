const { bansosRepository, pengajuanBansosRepository } = require('../repositories');
const errorHandler = require('../middlewares/errorHandler');
const logger = require('../utils/logger');
const uploadUtils = require('../config/upload');

class BansosService {
  /**
   * Get all bansos
   */
  async getAllBansos(page = 1, limit = 10, filters = {}, includeDeleted = false) {
    try {
      return await bansosRepository.findAllBansos(page, limit, filters, includeDeleted);
    } catch (error) {
      logger.error('Get all bansos service error:', error);
      throw error;
    }
  }

  /**
   * Get active bansos (public view)
   */
  async getActiveBansos() {
    try {
      const bansosList = await bansosRepository.getActiveBansos();

      // Add file URLs
      return bansosList.map(bansos => ({
        ...bansos,
        dokumen_panduan_url: uploadUtils.getFileUrl(bansos.dokumen_panduan, 'bansos'),
      }));
    } catch (error) {
      logger.error('Get active bansos service error:', error);
      throw error;
    }
  }

  /**
   * Get bansos by ID
   */
  async getBansosById(id, includeDetails = true) {
    try {
      let bansos;

      if (includeDetails) {
        bansos = await bansosRepository.findBansosWithDetails(id);
      } else {
        bansos = await bansosRepository.findById(id);
      }

      if (!bansos || bansos.deleted_at) {
        throw errorHandler.createError('Bansos tidak ditemukan', 404);
      }

      // Add file URLs
      bansos.dokumen_panduan_url = uploadUtils.getFileUrl(bansos.dokumen_panduan, 'bansos');

      // Get kuota wilayah
      bansos.kuota_wilayah = await bansosRepository.getKuotaWilayah(id);

      return bansos;
    } catch (error) {
      logger.error('Get bansos by ID service error:', error);
      throw error;
    }
  }

  /**
   * Create new bansos
   */
  async createBansos(bansosData, createdBy) {
    try {
      // Pisahkan kuota_wilayah dari data utama
      const { kuota_wilayah, ...pureBansosData } = bansosData;

      // Check if kode_bansos already exists
      const kodeExists = await bansosRepository.kodeBansosExists(pureBansosData.kode_bansos);

      if (kodeExists) {
        throw errorHandler.createError('Kode bansos sudah digunakan', 400);
      }

      // Validate dates
      if (new Date(pureBansosData.tanggal_mulai) > new Date(pureBansosData.tanggal_selesai)) {
        throw errorHandler.createError('Tanggal mulai tidak boleh setelah tanggal selesai', 400);
      }

      // Set created_by TANPA kuota_wilayah
      const bansosToCreate = {
        ...pureBansosData,
        created_by: createdBy,
      };

      // Insert ke tabel bansos
      const createdBansos = await bansosRepository.create(bansosToCreate);

      // Insert ke tabel kuota_wilayah_bansos jika ada
      if (kuota_wilayah && Array.isArray(kuota_wilayah)) {
        await bansosRepository.updateKuotaWilayah(createdBansos.id, kuota_wilayah);
      }

      logger.info(`Bansos ${createdBansos.id} created by user ${createdBy}`);

      return {
        bansos: await this.getBansosById(createdBansos.id),
        message: 'Bansos berhasil dibuat',
      };
    } catch (error) {
      logger.error('Create bansos service error:', error);
      throw error;
    }
  }

  /**
   * Update bansos
   */
  async updateBansos(id, updateData) {
    try {
      const existingBansos = await bansosRepository.findById(id);
      if (!existingBansos || existingBansos.deleted_at) {
        throw errorHandler.createError('Bansos tidak ditemukan', 404);
      }

      // 🔥 PISAHKAN kuota_wilayah
      const { kuota_wilayah, ...pureUpdateData } = updateData;

      // Check kode
      if (pureUpdateData.kode_bansos && pureUpdateData.kode_bansos !== existingBansos.kode_bansos) {
        const kodeExists = await bansosRepository.kodeBansosExists(pureUpdateData.kode_bansos, id);

        if (kodeExists) {
          throw errorHandler.createError('Kode bansos sudah digunakan', 400);
        }
      }

      // Validate tanggal
      if (pureUpdateData.tanggal_mulai || pureUpdateData.tanggal_selesai) {
        const tanggalMulai = pureUpdateData.tanggal_mulai || existingBansos.tanggal_mulai;
        const tanggalSelesai = pureUpdateData.tanggal_selesai || existingBansos.tanggal_selesai;

        if (new Date(tanggalMulai) > new Date(tanggalSelesai)) {
          throw errorHandler.createError('Tanggal mulai tidak boleh setelah tanggal selesai', 400);
        }
      }

      // ✅ UPDATE tabel bansos TANPA kuota_wilayah
      await bansosRepository.update(id, pureUpdateData);

      // ✅ UPDATE kuota wilayah TERPISAH
      if (kuota_wilayah && Array.isArray(kuota_wilayah)) {
        await bansosRepository.updateKuotaWilayah(id, kuota_wilayah);
      }

      return {
        bansos: await this.getBansosById(id),
        message: 'Bansos berhasil diperbarui',
      };
    } catch (error) {
      logger.error('Update bansos service error:', error);
      throw error;
    }
  }

  /**
   * Soft delete bansos
   */
  async deleteBansos(id) {
    try {
      // Check if bansos exists
      const bansos = await bansosRepository.findById(id);
      if (!bansos) {
        throw errorHandler.createError('Bansos tidak ditemukan', 404);
      }

      if (bansos.deleted_at) {
        throw errorHandler.createError('Bansos sudah dihapus', 400);
      }

      // Check if there are active pengajuan
      const activePengajuan = await pengajuanBansosRepository.executeQuery(
        `SELECT COUNT(*) as count FROM pengajuan_bansos
         WHERE bansos_id = ? AND status NOT IN ('DITOLAK', 'DITERIMA')`,
        [id]
      );

      if (activePengajuan[0].count > 0) {
        throw errorHandler.createError(
          'Tidak dapat menghapus bansos yang masih memiliki pengajuan aktif',
          400
        );
      }

      // Soft delete
      await bansosRepository.softDelete(id);

      logger.info(`Bansos ${id} soft deleted`);

      return { message: 'Bansos berhasil dihapus' };
    } catch (error) {
      logger.error('Delete bansos service error:', error);
      throw error;
    }
  }

  /**
   * Restore deleted bansos
   */
  async restoreBansos(id) {
    try {
      // Check if bansos exists
      const bansos = await bansosRepository.findById(id);
      if (!bansos) {
        throw errorHandler.createError('Bansos tidak ditemukan', 404);
      }

      if (!bansos.deleted_at) {
        throw errorHandler.createError('Bansos tidak dalam status terhapus', 400);
      }

      // Restore
      await bansosRepository.restore(id);

      logger.info(`Bansos ${id} restored`);

      return {
        message: 'Bansos berhasil dipulihkan',
        bansos: await this.getBansosById(id),
      };
    } catch (error) {
      logger.error('Restore bansos service error:', error);
      throw error;
    }
  }

  /**
   * Update bansos status
   */
  async updateBansosStatus(id, status) {
    try {
      // Check if bansos exists
      const bansos = await bansosRepository.findById(id);
      if (!bansos || bansos.deleted_at) {
        throw errorHandler.createError('Bansos tidak ditemukan', 404);
      }

      // Validate status transition
      const validStatuses = ['DRAFT', 'AKTIF', 'SELESAI', 'DIBATALKAN'];
      if (!validStatuses.includes(status)) {
        throw errorHandler.createError('Status tidak valid', 400);
      }

      // Update status
      await bansosRepository.updateStatus(id, status);

      logger.info(`Bansos ${id} status updated to ${status}`);

      return {
        message: `Status bansos berhasil diubah menjadi ${status}`,
        bansos: await this.getBansosById(id),
      };
    } catch (error) {
      logger.error('Update bansos status service error:', error);
      throw error;
    }
  }

  /**
   * Get bansos statistics
   */
  async getBansosStatistics() {
    try {
      const statistics = await bansosRepository.getBansosStatistics();
      const byKategori = await bansosRepository.getBansosByKategori();

      return {
        ...statistics,
        by_kategori: byKategori,
      };
    } catch (error) {
      logger.error('Get bansos statistics service error:', error);
      throw error;
    }
  }

  /**
   * Get bansos timeline
   */
  async getBansosTimeline(startDate, endDate) {
    try {
      return await bansosRepository.getBansosTimeline(startDate, endDate);
    } catch (error) {
      logger.error('Get bansos timeline service error:', error);
      throw error;
    }
  }

  /**
   * Upload dokumen panduan
   */
  async uploadDokumenPanduan(bansosId, filename) {
    try {
      // Check if bansos exists
      const bansos = await bansosRepository.findById(bansosId);
      if (!bansos || bansos.deleted_at) {
        throw errorHandler.createError('Bansos tidak ditemukan', 404);
      }

      // Remove old file if exists
      if (bansos.dokumen_panduan) {
        uploadUtils.removeFile(`uploads/bansos/${bansos.dokumen_panduan}`);
      }

      // Update database
      await bansosRepository.update(bansosId, { dokumen_panduan: filename });

      return {
        message: 'Dokumen panduan berhasil diupload',
        file_url: uploadUtils.getFileUrl(filename, 'bansos'),
      };
    } catch (error) {
      logger.error('Upload dokumen panduan service error:', error);
      throw error;
    }
  }

  /**
   * Check eligibility for user
   */
  async checkEligibility(bansosId, userId) {
    try {
      const bansos = await this.getBansosById(bansosId);
      const user = await pengajuanBansosRepository.executeQuery(
        `SELECT u.*, a.* FROM users u
         LEFT JOIN alamat a ON u.id = a.user_id
         WHERE u.id = ?`,
        [userId]
      );

      if (!user[0]) {
        throw errorHandler.createError('User tidak ditemukan', 404);
      }

      const eligibility = {
        is_eligible: true,
        reasons: [],
        warnings: [],
        kuota_info: null,
      };

      // Check if bansos is active
      if (bansos.status !== 'AKTIF') {
        eligibility.is_eligible = false;
        eligibility.reasons.push('Bansos tidak aktif');
      }

      // Check dates
      const today = new Date();
      const mulai = new Date(bansos.tanggal_mulai);
      const selesai = new Date(bansos.tanggal_selesai);

      if (today < mulai) {
        eligibility.is_eligible = false;
        eligibility.reasons.push('Bansos belum dimulai');
      }

      if (today > selesai) {
        eligibility.is_eligible = false;
        eligibility.reasons.push('Bansos sudah berakhir');
      }

      // Check if already applied
      const hasApplied = await pengajuanBansosRepository.hasApplied(bansosId, userId);
      if (hasApplied) {
        eligibility.is_eligible = false;
        eligibility.reasons.push('Sudah mengajukan bansos ini');
      }

      // Check quota for user's wilayah
      const kuotaInfo = await bansosRepository.checkKuotaForUser(bansosId, userId);
      if (!kuotaInfo) {
        eligibility.is_eligible = false;
        eligibility.reasons.push('Tidak ada kuota untuk wilayah Anda');
      } else {
        eligibility.kuota_info = {
          ...kuotaInfo,
          sisa_kuota: kuotaInfo.kuota - kuotaInfo.terpakai,
        };

        if (kuotaInfo.terpakai >= kuotaInfo.kuota) {
          eligibility.is_eligible = false;
          eligibility.reasons.push('Kuota untuk wilayah Anda sudah habis');
        }
      }

      // Check user verification
      if (!user[0].is_verified) {
        eligibility.warnings.push('Akun belum diverifikasi');
      }

      // Check if user has complete address
      if (!user[0].alamat_lengkap || !user[0].dusun_id || !user[0].rw_id || !user[0].rt_id) {
        eligibility.warnings.push('Data alamat belum lengkap');
      }

      return eligibility;
    } catch (error) {
      logger.error('Check eligibility service error:', error);
      throw error;
    }
  }
}

module.exports = new BansosService();
