import api from './api'

export const dusunService = {
  async getStatistics() {
    try {
      const response = await api.get('/wilayah/statistics')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get all dusun
  async getDusunList() {
    try {
      const response = await api.get('/wilayah/dusun')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get single dusun by ID
  async getDusunById(id) {
    try {
      const response = await api.get(`/wilayah/dusun/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Create new dusun
  async createDusun(payload) {
    try {
      const response = await api.post('/wilayah/dusun', payload)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Update dusun
  async updateDusun(id, payload) {
    try {
      const response = await api.put(`/wilayah/dusun/${id}`, payload)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Delete dusun
  async deleteDusun(id) {
    try {
      const response = await api.delete(`wilayah/dusun/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },
}
