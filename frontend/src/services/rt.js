import api from './api'

export const rtService = {
  // Create new RT
  async createRt(payload) {
    try {
      const response = await api.post('wilayah/rt', payload)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get RT list by dusun
  async getRtList(rwId) {
    try {
      const response = await api.get(`/wilayah/rw/${rwId}/rt`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Update RT
  async updateRt(id, payload) {
    try {
      const response = await api.put(`/wilayah/rt/${id}`, payload)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Delete RT
  async deleteRt(id) {
    try {
      const response = await api.delete(`/wilayah/rt/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },
}
