import api from './api'

export const bansosService = {
  // Ambil statistik wilayah
  async getStatistics() {
    try {
      const response = await api.get('/bansos/statistics')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Ambil jumlah dusun
  async getTotalBansos() {
    try {
      const response = await api.get('/bansos/statistics')

      const stats = response.data?.data

      // if (!stats || typeof stats.total_bansos !== 'number') {
      //   return 0
      // }

      return stats.aktif
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Ambil bansos ditolak
  async getBansosTolak() {
    try {
      const response = await api.get('/bansos/statistics')

      const stats = response.data?.data

      // if (!stats || typeof stats.total_bansos !== 'number') {
      //   return 0
      // }

      return stats.total_ditolak
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async getBansosList(params = {}) {
    try {
      const res = await api.get('/bansos', { params })

      return {
        list: res.data.data.data, // array bansos
        pagination: res.data.data.pagination,
      }
    } catch (error) {
      throw error.response?.data || { message: 'Gagal mengambil data bansos' }
    }
  },

  async createBansos(payload) {
    try {
      const res = await api.post('/bansos', payload)
      return res.data
    } catch (error) {
      throw error.response?.data || { message: 'Gagal menambahkan bansos' }
    }
  },

  async deleteBansos(id) {
    try {
      const res = await api.delete(`/bansos/${id}`)
      return res.data
    } catch (error) {
      throw error.response?.data || { message: 'Gagal menghapus bansos' }
    }
  },

  async getBansosById(id) {
    try {
      const res = await api.get(`/bansos/${id}`)
      return res.data.data
    } catch (error) {
      throw error.response?.data || { message: 'Gagal mengambil detail bansos' }
    }
  },

  async getBansosByIdKk(id) {
    try {
      const res = await api.get(`/bansos/${id}`)
      return res.data // jangan ambil .data lagi
    } catch (error) {
      throw error.response?.data || { message: 'Gagal mengambil detail bansos' }
    }
  },

  async updateBansos(id, data) {
    try {
      const response = await api.put(`/bansos/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating bansos:', error)
      throw error
    }
  },

  async getBansosActive() {
    try {
      const response = await api.get('/bansos/active')
      return response.data.data
    } catch (error) {
      throw error.response?.data || { message: 'Gagal mengambil data bansos' }
    }
  },

  async createPengajuanBansos(payload) {
    try {
      const response = await api.post('/pengajuan-bansos', payload)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Gagal mengajukan bansos' }
    }
  },
}
