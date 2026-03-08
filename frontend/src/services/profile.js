import api from './api'

export const profileService = {
  // Get profile
  async getProfile() {
    try {
      const response = await api.get('/auth/profile')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Update profile
  async updateProfile(payload) {
    try {
      const response = await api.put('/auth/profile', payload)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Update password
  async updatePassword(payload) {
    try {
      const response = await api.post('/auth/change-password', payload)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Upload photo
  async uploadPhoto(formData) {
    try {
      const response = await api.post('/profile/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Delete photo
  async deletePhoto() {
    try {
      const response = await api.delete('/profile/photo')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },
}
