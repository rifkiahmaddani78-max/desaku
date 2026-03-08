import api from './api'

export const rwService = {
  // Create new RW
  async createRw(payload) {
    try {
      const response = await api.post('/wilayah/rw', payload)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get RW list by dusun
  async getRwList(dusunId) {
    try {
      const response = await api.get(`/wilayah/dusun/${dusunId}/rw`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Update RW
  async updateRw(id, payload) {
    try {
      const response = await api.put(`/wilayah/rw/${id}`, payload)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Delete RW
  async deleteRw(id) {
    try {
      const response = await api.delete(`/wilayah/rw/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },
}
