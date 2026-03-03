import api from './api'

export const dusunService = {
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

  // Get RW list by dusun
  async getRwList(dusunId) {
    try {
      const response = await api.get(`/wilayah/dusun/${dusunId}/rw`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get RT list by dusun
  async getRtList(dusunId) {
    try {
      const response = await api.get(`/wilayah/rw/${dusunId}/rt`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Create new RW
  async createRw(payload) {
    try {
      const response = await api.post('/wilayah/rw', payload)
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

  async getRwById(id) {
    try {
      const response = await api.get(`/wilayah/rw/${id}/rt`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async getRtList(rwId) {
    try {
      const response = await api.get(`/wilayah/rw/${rwId}/rt`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get single RT by ID
  async getRtById(id) {
    try {
      const response = await api.get(`/wilayah/rt/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Create new RT
  async createRt(payload) {
    try {
      const response = await api.post('wilayah/rt', payload)
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
