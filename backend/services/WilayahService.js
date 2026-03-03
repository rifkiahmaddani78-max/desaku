const { wilayahRepository, alamatRepository } = require('../repositories');
const errorHandler = require('../middlewares/errorHandler');
const logger = require('../utils/logger');

class WilayahService {
  /**
   * Get all dusun with statistics
   */
  async getAllDusun() {
    try {
      return await wilayahRepository.getAllDusunWithStats();
    } catch (error) {
      logger.error('Get all dusun service error:', error);
      throw error;
    }
  }

  /**
   * Get dusun by ID
   */
  // services/wilayahService.js
  async getDusunById(dusunId) {
    try {
      // Panggil method repository yang baru
      // const dusun = await wilayahRepository.getDusunByIdWithCompleteHierarchy(dusunId);
      // atau
      const dusun = await wilayahRepository.getDusunByIdWithDetails(dusunId);

      if (!dusun) {
        throw errorHandler.createError('Dusun tidak ditemukan', 404);
      }

      return dusun;
    } catch (error) {
      logger.error('Get dusun by ID service error:', error);
      throw error;
    }
  }

  /**
   * Create dusun
   */
  async createDusun(dusunData) {
    try {
      // Check if kode_dusun already exists
      const kodeExists = await wilayahRepository.findOne('kode_dusun', dusunData.kode_dusun);
      if (kodeExists) {
        throw errorHandler.createError('Kode dusun sudah digunakan', 400);
      }

      // Check if nama_dusun already exists
      const namaExists = await wilayahRepository.findOne('nama_dusun', dusunData.nama_dusun);
      if (namaExists) {
        throw errorHandler.createError('Nama dusun sudah digunakan', 400);
      }

      return await wilayahRepository.create(dusunData);
    } catch (error) {
      logger.error('Create dusun service error:', error);
      throw error;
    }
  }

  /**
   * Update dusun
   */
  async updateDusun(dusunId, updateData) {
    try {
      // Check if dusun exists
      const dusun = await wilayahRepository.findById(dusunId);
      if (!dusun) {
        throw errorHandler.createError('Dusun tidak ditemukan', 404);
      }

      // Check if kode_dusun already exists (if being updated)
      if (updateData.kode_dusun && updateData.kode_dusun !== dusun.kode_dusun) {
        const kodeExists = await wilayahRepository.findOne('kode_dusun', updateData.kode_dusun);
        if (kodeExists) {
          throw errorHandler.createError('Kode dusun sudah digunakan', 400);
        }
      }

      // Check if nama_dusun already exists (if being updated)
      if (updateData.nama_dusun && updateData.nama_dusun !== dusun.nama_dusun) {
        const namaExists = await wilayahRepository.findOne('nama_dusun', updateData.nama_dusun);
        if (namaExists) {
          throw errorHandler.createError('Nama dusun sudah digunakan', 400);
        }
      }

      return await wilayahRepository.update(dusunId, updateData);
    } catch (error) {
      logger.error('Update dusun service error:', error);
      throw error;
    }
  }

  /**
   * Delete dusun
   */
  async deleteDusun(dusunId) {
    try {
      // Check if dusun exists
      const dusun = await wilayahRepository.findById(dusunId);
      if (!dusun) {
        throw errorHandler.createError('Dusun tidak ditemukan', 404);
      }

      // Check if dusun has associated data
      const hasKk = await alamatRepository.executeQuery(
        'SELECT COUNT(*) as count FROM alamat WHERE dusun_id = ?',
        [dusunId]
      );

      if (hasKk[0].count > 0) {
        throw errorHandler.createError(
          'Tidak dapat menghapus dusun yang sudah memiliki data kepala keluarga',
          400
        );
      }

      return await wilayahRepository.delete(dusunId);
    } catch (error) {
      logger.error('Delete dusun service error:', error);
      throw error;
    }
  }

  /**
   * Get RW by dusun
   */
  async getRwByDusun(dusunId) {
    try {
      // Check if dusun exists
      const dusun = await wilayahRepository.findById(dusunId);
      if (!dusun) {
        throw errorHandler.createError('Dusun tidak ditemukan', 404);
      }

      return await wilayahRepository.getRwByDusun(dusunId);
    } catch (error) {
      logger.error('Get RW by dusun service error:', error);
      throw error;
    }
  }

  /**
   * Create RW
   */
  async createRw(rwData) {
    try {
      const rwRepo = wilayahRepository.getRwRepository();

      // Check if dusun exists
      const dusun = await wilayahRepository.findById(rwData.dusun_id);
      if (!dusun) {
        throw errorHandler.createError('Dusun tidak ditemukan', 404);
      }

      // Check if RW number already exists in this dusun
      const existingRw = await rwRepo.executeQuery(
        'SELECT * FROM rw WHERE dusun_id = ? AND nomor_rw = ?',
        [rwData.dusun_id, rwData.nomor_rw]
      );

      if (existingRw.length > 0) {
        throw errorHandler.createError('Nomor RW sudah ada di dusun ini', 400);
      }

      return await rwRepo.create(rwData);
    } catch (error) {
      logger.error('Create RW service error:', error);
      throw error;
    }
  }

  /**
   * Update RW
   */
  async updateRw(rwId, updateData) {
    try {
      const rwRepo = wilayahRepository.getRwRepository();

      // Check if RW exists
      const rw = await rwRepo.findById(rwId);
      if (!rw) {
        throw errorHandler.createError('RW tidak ditemukan', 404);
      }

      // Check if RW number already exists in this dusun (if being updated)
      if (updateData.nomor_rw && updateData.nomor_rw !== rw.nomor_rw) {
        const existingRw = await rwRepo.executeQuery(
          'SELECT * FROM rw WHERE dusun_id = ? AND nomor_rw = ? AND id != ?',
          [updateData.dusun_id || rw.dusun_id, updateData.nomor_rw, rwId]
        );

        if (existingRw.length > 0) {
          throw errorHandler.createError('Nomor RW sudah ada di dusun ini', 400);
        }
      }

      return await rwRepo.update(rwId, updateData);
    } catch (error) {
      logger.error('Update RW service error:', error);
      throw error;
    }
  }

  /**
   * Delete RW
   */
  async deleteRw(rwId) {
    try {
      const rwRepo = wilayahRepository.getRwRepository();

      // Check if RW exists
      const rw = await rwRepo.findById(rwId);
      if (!rw) {
        throw errorHandler.createError('RW tidak ditemukan', 404);
      }

      // Check if RW has associated data
      const hasKk = await alamatRepository.executeQuery(
        'SELECT COUNT(*) as count FROM alamat WHERE rw_id = ?',
        [rwId]
      );

      if (hasKk[0].count > 0) {
        throw errorHandler.createError(
          'Tidak dapat menghapus RW yang sudah memiliki data kepala keluarga',
          400
        );
      }

      return await rwRepo.delete(rwId);
    } catch (error) {
      logger.error('Delete RW service error:', error);
      throw error;
    }
  }

  /**
   * Get RT by RW
   */
  async getRtByRw(rwId) {
    try {
      const rwRepo = wilayahRepository.getRwRepository();

      // Check if RW exists
      const rw = await rwRepo.findById(rwId);
      if (!rw) {
        throw errorHandler.createError('RW tidak ditemukan', 404);
      }

      return await wilayahRepository.getRtByRw(rwId);
    } catch (error) {
      logger.error('Get RT by RW service error:', error);
      throw error;
    }
  }

  /**
   * Create RT
   */
  async createRt(rtData) {
    try {
      const rtRepo = wilayahRepository.getRtRepository();
      const rwRepo = wilayahRepository.getRwRepository();

      // Check if RW exists
      const rw = await rwRepo.findById(rtData.rw_id);
      if (!rw) {
        throw errorHandler.createError('RW tidak ditemukan', 404);
      }

      // Check if RT number already exists in this RW
      const existingRt = await rtRepo.executeQuery(
        'SELECT * FROM rt WHERE rw_id = ? AND nomor_rt = ?',
        [rtData.rw_id, rtData.nomor_rt]
      );

      if (existingRt.length > 0) {
        throw errorHandler.createError('Nomor RT sudah ada di RW ini', 400);
      }

      return await rtRepo.create(rtData);
    } catch (error) {
      logger.error('Create RT service error:', error);
      throw error;
    }
  }

  /**
   * Update RT
   */
  async updateRt(rtId, updateData) {
    try {
      const rtRepo = wilayahRepository.getRtRepository();

      // Check if RT exists
      const rt = await rtRepo.findById(rtId);
      if (!rt) {
        throw errorHandler.createError('RT tidak ditemukan', 404);
      }

      // Check if RT number already exists in this RW (if being updated)
      if (updateData.nomor_rt && updateData.nomor_rt !== rt.nomor_rt) {
        const existingRt = await rtRepo.executeQuery(
          'SELECT * FROM rt WHERE rw_id = ? AND nomor_rt = ? AND id != ?',
          [updateData.rw_id || rt.rw_id, updateData.nomor_rt, rtId]
        );

        if (existingRt.length > 0) {
          throw errorHandler.createError('Nomor RT sudah ada di RW ini', 400);
        }
      }

      return await rtRepo.update(rtId, updateData);
    } catch (error) {
      logger.error('Update RT service error:', error);
      throw error;
    }
  }

  /**
   * Delete RT
   */
  async deleteRt(rtId) {
    try {
      const rtRepo = wilayahRepository.getRtRepository();

      // Check if RT exists
      const rt = await rtRepo.findById(rtId);
      if (!rt) {
        throw errorHandler.createError('RT tidak ditemukan', 404);
      }

      // Check if RT has associated data
      const hasKk = await alamatRepository.executeQuery(
        'SELECT COUNT(*) as count FROM alamat WHERE rt_id = ?',
        [rtId]
      );

      if (hasKk[0].count > 0) {
        throw errorHandler.createError(
          'Tidak dapat menghapus RT yang sudah memiliki data kepala keluarga',
          400
        );
      }

      return await rtRepo.delete(rtId);
    } catch (error) {
      logger.error('Delete RT service error:', error);
      throw error;
    }
  }

  /**
   * Get complete wilayah hierarchy
   */
  async getWilayahHierarchy() {
    try {
      return await wilayahRepository.getWilayahHierarchy();
    } catch (error) {
      logger.error('Get wilayah hierarchy service error:', error);
      throw error;
    }
  }

  /**
   * Get KK by wilayah
   */
  async getKkByWilayah(dusunId = null, rwId = null, rtId = null) {
    try {
      return await alamatRepository.getKKByWilayah(dusunId, rwId, rtId);
    } catch (error) {
      logger.error('Get KK by wilayah service error:', error);
      throw error;
    }
  }

  /**
   * Get wilayah statistics
   */
  async getWilayahStatistics() {
    try {
      const statistics = await wilayahRepository.executeQuery(`
        SELECT
          (SELECT COUNT(*) FROM dusun) as total_dusun,
          (SELECT COUNT(*) FROM rw) as total_rw,
          (SELECT COUNT(*) FROM rt) as total_rt,
          (SELECT COUNT(DISTINCT user_id) FROM alamat) as total_kk_terdaftar
      `);

      const kkByDusun = await wilayahRepository.executeQuery(`
        SELECT
          d.nama_dusun,
          COUNT(DISTINCT a.user_id) as jumlah_kk
        FROM dusun d
        LEFT JOIN alamat a ON d.id = a.dusun_id
        GROUP BY d.id
        ORDER BY d.nama_dusun
      `);

      return {
        ...statistics[0],
        kk_by_dusun: kkByDusun,
      };
    } catch (error) {
      logger.error('Get wilayah statistics service error:', error);
      throw error;
    }
  }
}

module.exports = new WilayahService();
