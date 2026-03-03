import api from './api'

export const wilayahService = {
  // Ambil statistik wilayah
  async getStatistics() {
    try {
      const response = await api.get('/wilayah/statistics')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Ambil jumlah dusun
  async getTotalDusun() {
    try {
      const response = await api.get('/wilayah/statistics')

      const stats = response.data?.data

      if (!stats || typeof stats.total_dusun !== 'number') {
        return 0
      }

      return stats.total_dusun
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Ambil semua dusun
  async getDusun() {
    try {
      const response = await api.get('/wilayah/dusun')

      return response.data.data
    } catch (error) {
      console.error('Error fetching dusun:', error)

      throw {
        success: false,
        message: error.response?.data?.message || error.message || 'Gagal mengambil data dusun',
      }
    }
  },

  async getHierarchy() {
    const res = await api.get('/wilayah/hierarchy')
    return res.data
  },
}
