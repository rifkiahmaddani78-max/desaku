import api from './api'

export const pengajuanService = {
  // Get all pengajuan - Admin

  // Get user's pengajuan list
  async getMyPengajuan() {
    try {
      const response = await api.get('/pengajuan-bansos/my')
      return response.data.data
    } catch (error) {
      throw error.response?.data || { message: 'Gagal mengambil data pengajuan bansos' }
    }
  },

  // Create new pengajuan
  async createPengajuan(payload) {
    try {
      const response = await api.post('/pengajuan', payload)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async getAllPengajuan(params) {
    try {
      const res = await api.get('/pengajuan-bansos', { params })
      return res.data // ⬅️ penting: return res.data (bukan res.data.data)
    } catch (error) {
      throw error.response?.data || { message: 'Gagal mengambil data pengajuan' }
    }
  },

  async updateStatus(id, payload) {
    try {
      const res = await api.put(`/pengajuan-bansos/${id}/status`, payload)
      return res.data
    } catch (error) {
      throw error.response?.data || { message: 'Gagal memperbarui status' }
    }
  },

  async cancelPengajuan(id) {
    try {
      const response = await api.put(`/pengajuan-bansos/${id}/batal`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async getPengajuanById(id) {
    const res = await api.get(`/pengajuan-bansos/${id}`)
    return res.data
  },

  // Di src/services/pengajuan.js
  async addTestimoni(id, payload) {
    try {
      const response = await api.post(`/pengajuan-bansos/${id}/rating`, payload)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },
}
