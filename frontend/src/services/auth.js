import api from './api'

export const authService = {
  // Login user
  async login(username, password) {
    try {
      const response = await api.post('/auth/login', { username, password })

      // Simpan token dan user data
      if (response.data.success) {
        localStorage.setItem('access_token', response.data.data.access_token)
        localStorage.setItem('user', JSON.stringify(response.data.data.user))

        // Note: Refresh token disimpan sebagai cookie oleh backend
        // Frontend tidak perlu menyimpannya
      }

      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Register kepala keluarga
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get current user profile
  async getProfile() {
    try {
      const response = await api.get('/auth/profile')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Logout
  async logout() {
    try {
      // Panggil API logout
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Selalu clear local storage
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
    }
  },

  // Refresh token (akan dihandle oleh interceptor)
  async refreshToken(refreshToken) {
    try {
      const response = await api.post('/auth/refresh', { refresh_token: refreshToken })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('access_token')
  },

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  // Get user role
  getUserRole() {
    const user = this.getCurrentUser()
    return user?.role_name || null
  },
}
