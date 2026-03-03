const response = require('../utils/response');
const errorHandler = require('../middlewares/errorHandler');
const { wilayahService } = require('../services');

class WilayahController {
  // ===== DUSUN ENDPOINTS =====

  /**
   * @route   GET /api/wilayah/dusun
   * @desc    Get all dusun
   * @access  Private (Admin)
   */
  async getAllDusun(req, res) {
    try {
      const dusunList = await wilayahService.getAllDusun();

      return response.success(res, dusunList, 'Data dusun berhasil diambil');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   GET /api/wilayah/dusun/:id
   * @desc    Get dusun by ID
   * @access  Private (Admin)
   */
  async getDusunById(req, res) {
    try {
      const dusunId = parseInt(req.params.id);

      const dusun = await wilayahService.getDusunById(dusunId);

      return response.success(res, dusun, 'Data dusun berhasil diambil');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   POST /api/wilayah/dusun
   * @desc    Create new dusun
   * @access  Private (Admin)
   */
  async createDusun(req, res) {
    try {
      const dusun = await wilayahService.createDusun(req.body);

      return response.success(res, dusun, 'Dusun berhasil dibuat', 201);
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   PUT /api/wilayah/dusun/:id
   * @desc    Update dusun
   * @access  Private (Admin)
   */
  async updateDusun(req, res) {
    try {
      const dusunId = parseInt(req.params.id);

      const dusun = await wilayahService.updateDusun(dusunId, req.body);

      return response.success(res, dusun, 'Dusun berhasil diperbarui');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   DELETE /api/wilayah/dusun/:id
   * @desc    Delete dusun
   * @access  Private (Admin)
   */
  async deleteDusun(req, res) {
    try {
      const dusunId = parseInt(req.params.id);

      await wilayahService.deleteDusun(dusunId);

      return response.success(res, null, 'Dusun berhasil dihapus');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  // ===== RW ENDPOINTS =====

  /**
   * @route   GET /api/wilayah/dusun/:dusunId/rw
   * @desc    Get RW by dusun
   * @access  Private (Admin)
   */
  async getRwByDusun(req, res) {
    try {
      const dusunId = parseInt(req.params.dusunId);

      const rwList = await wilayahService.getRwByDusun(dusunId);

      return response.success(res, rwList, 'Data RW berhasil diambil');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   POST /api/wilayah/rw
   * @desc    Create new RW
   * @access  Private (Admin)
   */
  async createRw(req, res) {
    try {
      const rw = await wilayahService.createRw(req.body);

      return response.success(res, rw, 'RW berhasil dibuat', 201);
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   PUT /api/wilayah/rw/:id
   * @desc    Update RW
   * @access  Private (Admin)
   */
  async updateRw(req, res) {
    try {
      const rwId = parseInt(req.params.id);

      const rw = await wilayahService.updateRw(rwId, req.body);

      return response.success(res, rw, 'RW berhasil diperbarui');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   DELETE /api/wilayah/rw/:id
   * @desc    Delete RW
   * @access  Private (Admin)
   */
  async deleteRw(req, res) {
    try {
      const rwId = parseInt(req.params.id);

      await wilayahService.deleteRw(rwId);

      return response.success(res, null, 'RW berhasil dihapus');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  // ===== RT ENDPOINTS =====

  /**
   * @route   GET /api/wilayah/rw/:rwId/rt
   * @desc    Get RT by RW
   * @access  Private (Admin)
   */
  async getRtByRw(req, res) {
    try {
      const rwId = parseInt(req.params.rwId);

      const rtList = await wilayahService.getRtByRw(rwId);

      return response.success(res, rtList, 'Data RT berhasil diambil');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   POST /api/wilayah/rt
   * @desc    Create new RT
   * @access  Private (Admin)
   */
  async createRt(req, res) {
    try {
      const rt = await wilayahService.createRt(req.body);

      return response.success(res, rt, 'RT berhasil dibuat', 201);
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   PUT /api/wilayah/rt/:id
   * @desc    Update RT
   * @access  Private (Admin)
   */
  async updateRt(req, res) {
    try {
      const rtId = parseInt(req.params.id);

      const rt = await wilayahService.updateRt(rtId, req.body);

      return response.success(res, rt, 'RT berhasil diperbarui');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   DELETE /api/wilayah/rt/:id
   * @desc    Delete RT
   * @access  Private (Admin)
   */
  async deleteRt(req, res) {
    try {
      const rtId = parseInt(req.params.id);

      await wilayahService.deleteRt(rtId);

      return response.success(res, null, 'RT berhasil dihapus');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  // ===== GENERAL WILAYAH ENDPOINTS =====

  /**
   * @route   GET /api/wilayah/hierarchy
   * @desc    Get complete wilayah hierarchy
   * @access  Private (Admin)
   */
  async getWilayahHierarchy(req, res) {
    try {
      const hierarchy = await wilayahService.getWilayahHierarchy();

      return response.success(
        res,
        hierarchy,
        'Hierarki wilayah berhasil diambil'
      );
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   GET /api/wilayah/kk
   * @desc    Get KK by wilayah
   * @access  Private (Admin)
   */
  async getKkByWilayah(req, res) {
    try {
      const { dusun_id, rw_id, rt_id } = req.query;

      const kkList = await wilayahService.getKkByWilayah(
        dusun_id ? parseInt(dusun_id) : null,
        rw_id ? parseInt(rw_id) : null,
        rt_id ? parseInt(rt_id) : null
      );

      return response.success(res, kkList, 'Data KK berhasil diambil');
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }

  /**
   * @route   GET /api/wilayah/statistics
   * @desc    Get wilayah statistics
   * @access  Private (Admin)
   */
  async getWilayahStatistics(req, res) {
    try {
      const statistics = await wilayahService.getWilayahStatistics();

      return response.success(
        res,
        statistics,
        'Statistik wilayah berhasil diambil'
      );
    } catch (error) {
      return errorHandler.globalErrorHandler(error, req, res);
    }
  }
}

module.exports = new WilayahController();
