import api from './api'

export const usersService = {
  async getStatistics() {
    try {
      const response = await api.get('/users/statistics')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async createKepalaKeluarga(payload) {
    const response = await api.post('/users', {
      ...payload,
      role_id: 2,
    })
    return response.data
  },

  // DAFTAR KEPALA KELUARGA
  async getKepalaKeluargaList() {
    const response = await api.get('/users')

    const users = response.data?.data?.data || []

    // filter role kepala_keluarga
    return users.filter((user) => user.role_name === 'kepala_keluarga')
  },

  async getDetailKepalaKeluarga(id) {
    try {
      const res = await api.get(`/users/${id}`)
      return res.data.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async deleteKepalaKeluarga(id) {
    try {
      await api.delete(`/users/${id}`)
      return true
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async verifyKepalaKeluarga(id) {
    try {
      const response = await api.post(`/auth/verify/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async updateKepalaKeluarga(id, payload) {
    try {
      const response = await api.put(`/users/${id}`, payload)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Di src/services/users.js
  async updateAddress(id, payload) {
    try {
      const response = await api.put(`/users/${id}/address`, payload)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },
}
