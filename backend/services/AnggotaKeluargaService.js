const {
  anggotaKeluargaRepository,
  userRepository,
} = require('../repositories');
const errorHandler = require('../middlewares/errorHandler');
const logger = require('../utils/logger');

class AnggotaKeluargaService {
  /**
   * Get all anggota keluarga by kepala keluarga ID
   */
  async getAnggotaByKepalaKeluarga(kepalaKeluargaId) {
    try {
      // Check if kepala keluarga exists
      const kk = await userRepository.findById(kepalaKeluargaId);
      if (!kk) {
        throw errorHandler.createError('Kepala keluarga tidak ditemukan', 404);
      }

      return await anggotaKeluargaRepository.getByKepalaKeluargaId(
        kepalaKeluargaId
      );
    } catch (error) {
      logger.error('Get anggota by KK service error:', error);
      throw error;
    }
  }

  /**
   * Get anggota keluarga by ID
   */
  async getAnggotaById(anggotaId) {
    try {
      const anggota = await anggotaKeluargaRepository.getAnggotaWithDetail(
        anggotaId
      );

      if (!anggota) {
        throw errorHandler.createError('Anggota keluarga tidak ditemukan', 404);
      }

      return anggota;
    } catch (error) {
      logger.error('Get anggota by ID service error:', error);
      throw error;
    }
  }

  /**
   * Create anggota keluarga
   */
  async createAnggota(kepalaKeluargaId, anggotaData) {
    try {
      // Check if kepala keluarga exists
      const kk = await userRepository.findById(kepalaKeluargaId);
      if (!kk) {
        throw errorHandler.createError('Kepala keluarga tidak ditemukan', 404);
      }

      // Check if NIK already exists
      const nikExists = await anggotaKeluargaRepository.nikExists(
        anggotaData.nik
      );
      if (nikExists) {
        throw errorHandler.createError('NIK sudah terdaftar', 400);
      }

      // Validate hubungan
      const validHubungan = [
        'SUAMI',
        'ISTRI',
        'ANAK',
        'MENANTU',
        'CUCU',
        'ORANG_TUA',
        'MERTUA',
        'FAMILI_LAIN',
        'PEMBANTU',
      ];
      if (!validHubungan.includes(anggotaData.hubungan)) {
        throw errorHandler.createError('Hubungan keluarga tidak valid', 400);
      }

      // Check for spouse if adding husband/wife
      if (
        anggotaData.hubungan === 'SUAMI' ||
        anggotaData.hubungan === 'ISTRI'
      ) {
        const existingSpouse = await anggotaKeluargaRepository.executeQuery(
          'SELECT * FROM anggota_keluarga WHERE kepala_keluarga_id = ? AND hubungan IN (?, ?)',
          [kepalaKeluargaId, 'SUAMI', 'ISTRI']
        );

        if (existingSpouse.length > 0) {
          const spouse = existingSpouse[0];
          throw errorHandler.createError(
            `Sudah ada ${spouse.hubungan.toLowerCase()} dalam keluarga ini: ${
              spouse.nama_lengkap
            }`,
            400
          );
        }
      }

      // Calculate age
      const birthDate = new Date(anggotaData.tanggal_lahir);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      // Validate age based on relationship
      if (
        anggotaData.hubungan === 'SUAMI' ||
        anggotaData.hubungan === 'ISTRI'
      ) {
        if (age < 17) {
          throw errorHandler.createError(
            'Suami/istri minimal berusia 17 tahun',
            400
          );
        }
      }

      // Create anggota keluarga
      const anggotaToCreate = {
        ...anggotaData,
        kepala_keluarga_id: kepalaKeluargaId,
      };

      const createdAnggota = await anggotaKeluargaRepository.create(
        anggotaToCreate
      );

      // Log the creation
      logger.info(
        `Anggota keluarga ${createdAnggota.id} created for KK ${kepalaKeluargaId}`
      );

      return {
        anggota: createdAnggota,
        message: 'Anggota keluarga berhasil ditambahkan',
      };
    } catch (error) {
      logger.error('Create anggota keluarga service error:', error);
      throw error;
    }
  }

  /**
   * Update anggota keluarga
   */
  async updateAnggota(anggotaId, updateData, kepalaKeluargaId = null) {
    try {
      // Check if anggota exists
      const existingAnggota = await anggotaKeluargaRepository.findById(
        anggotaId
      );
      if (!existingAnggota) {
        throw errorHandler.createError('Anggota keluarga tidak ditemukan', 404);
      }

      // If kepalaKeluargaId provided, verify ownership
      if (
        kepalaKeluargaId &&
        existingAnggota.kepala_keluarga_id !== parseInt(kepalaKeluargaId)
      ) {
        throw errorHandler.createError(
          'Anda tidak memiliki akses untuk mengubah data ini',
          403
        );
      }

      // Check if NIK already exists (if being updated)
      if (updateData.nik && updateData.nik !== existingAnggota.nik) {
        const nikExists = await anggotaKeluargaRepository.nikExists(
          updateData.nik,
          anggotaId
        );
        if (nikExists) {
          throw errorHandler.createError('NIK sudah terdaftar', 400);
        }
      }

      // Validate hubungan if being updated
      if (updateData.hubungan) {
        const validHubungan = [
          'SUAMI',
          'ISTRI',
          'ANAK',
          'MENANTU',
          'CUCU',
          'ORANG_TUA',
          'MERTUA',
          'FAMILI_LAIN',
          'PEMBANTU',
        ];
        if (!validHubungan.includes(updateData.hubungan)) {
          throw errorHandler.createError('Hubungan keluarga tidak valid', 400);
        }

        // Check for spouse if changing to husband/wife
        if (
          (updateData.hubungan === 'SUAMI' ||
            updateData.hubungan === 'ISTRI') &&
          existingAnggota.hubungan !== updateData.hubungan
        ) {
          const existingSpouse = await anggotaKeluargaRepository.executeQuery(
            'SELECT * FROM anggota_keluarga WHERE kepala_keluarga_id = ? AND hubungan IN (?, ?) AND id != ?',
            [existingAnggota.kepala_keluarga_id, 'SUAMI', 'ISTRI', anggotaId]
          );

          if (existingSpouse.length > 0) {
            const spouse = existingSpouse[0];
            throw errorHandler.createError(
              `Sudah ada ${spouse.hubungan.toLowerCase()} dalam keluarga ini: ${
                spouse.nama_lengkap
              }`,
              400
            );
          }
        }
      }

      // Update anggota keluarga
      const updatedAnggota = await anggotaKeluargaRepository.update(
        anggotaId,
        updateData
      );

      return {
        anggota: updatedAnggota,
        message: 'Data anggota keluarga berhasil diperbarui',
      };
    } catch (error) {
      logger.error('Update anggota keluarga service error:', error);
      throw error;
    }
  }

  /**
   * Delete anggota keluarga
   */
  async deleteAnggota(anggotaId, kepalaKeluargaId = null) {
    try {
      // Check if anggota exists
      const anggota = await anggotaKeluargaRepository.findById(anggotaId);
      if (!anggota) {
        throw errorHandler.createError('Anggota keluarga tidak ditemukan', 404);
      }

      // If kepalaKeluargaId provided, verify ownership
      if (
        kepalaKeluargaId &&
        anggota.kepala_keluarga_id !== parseInt(kepalaKeluargaId)
      ) {
        throw errorHandler.createError(
          'Anda tidak memiliki akses untuk menghapus data ini',
          403
        );
      }

      // Prevent deleting kepala keluarga if exists as user
      if (anggota.hubungan === 'KEPALA_KELUARGA') {
        throw errorHandler.createError(
          'Tidak dapat menghapus data kepala keluarga',
          400
        );
      }

      const deleted = await anggotaKeluargaRepository.delete(anggotaId);

      if (!deleted) {
        throw errorHandler.createError('Gagal menghapus anggota keluarga', 500);
      }

      logger.info(`Anggota keluarga ${anggotaId} deleted`);

      return { message: 'Anggota keluarga berhasil dihapus' };
    } catch (error) {
      logger.error('Delete anggota keluarga service error:', error);
      throw error;
    }
  }

  /**
   * Get keluarga statistics
   */
  async getKeluargaStats(kepalaKeluargaId) {
    try {
      // Check if kepala keluarga exists
      const kk = await userRepository.findById(kepalaKeluargaId);
      if (!kk) {
        throw errorHandler.createError('Kepala keluarga tidak ditemukan', 404);
      }

      const stats = await anggotaKeluargaRepository.getKeluargaStats(
        kepalaKeluargaId
      );
      const ageGroups = await anggotaKeluargaRepository.getAnggotaByAgeGroup(
        kepalaKeluargaId
      );

      return {
        ...stats,
        kelompok_umur: ageGroups,
      };
    } catch (error) {
      logger.error('Get keluarga stats service error:', error);
      throw error;
    }
  }

  /**
   * Search anggota keluarga
   */
  async searchAnggota(searchTerm, kepalaKeluargaId = null) {
    try {
      let query = `
        SELECT
          ak.*,
          u.nik as kk_nik,
          u.nama_lengkap as kk_nama,
          d.nama_dusun,
          rw.nomor_rw,
          rt.nomor_rt
        FROM anggota_keluarga ak
        JOIN users u ON ak.kepala_keluarga_id = u.id
        LEFT JOIN alamat a ON u.id = a.user_id
        LEFT JOIN dusun d ON a.dusun_id = d.id
        LEFT JOIN rw ON a.rw_id = rw.id
        LEFT JOIN rt ON a.rt_id = rt.id
        WHERE ak.nik LIKE ? OR ak.nama_lengkap LIKE ?
      `;

      const params = [`%${searchTerm}%`, `%${searchTerm}%`];

      // Filter by kepala keluarga if specified
      if (kepalaKeluargaId) {
        query += ' AND ak.kepala_keluarga_id = ?';
        params.push(kepalaKeluargaId);
      }

      query += ' ORDER BY ak.nama_lengkap LIMIT 50';

      return await anggotaKeluargaRepository.executeQuery(query, params);
    } catch (error) {
      logger.error('Search anggota service error:', error);
      throw error;
    }
  }
}

module.exports = new AnggotaKeluargaService();
