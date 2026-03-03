import { defineStore } from 'pinia'
import { authService } from '@/services/auth'
import { ROLES } from '@/utils/constants'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  getters: {
    // Get current user
    currentUser: (state) => state.user,

    // Check if user is authenticated
    isLoggedIn: (state) => state.isAuthenticated,

    // Check user role
    isAdmin: (state) => state.user?.role_name === ROLES.ADMIN,
    isKepalaKeluarga: (state) => state.user?.role_name === ROLES.KEPALA_KELUARGA,

    // Get user initials for avatar
    userInitials: (state) => {
      if (!state.user?.nama_lengkap) return ''
      return state.user.nama_lengkap
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    }
  },

  actions: {
    // Initialize auth state from localStorage
    initialize() {
      const user = authService.getCurrentUser()
      const isAuthenticated = authService.isAuthenticated()

      this.user = user
      this.isAuthenticated = isAuthenticated
    },

    // Login action
    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        const response = await authService.login(
          credentials.username,
          credentials.password
        )

        if (response.success) {
          this.user = response.data.user
          this.isAuthenticated = true
          this.error = null

          return { success: true, data: response.data }
        }

      } catch (error) {
        this.error = error.message || 'Login gagal'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Register action
    async register(userData) {
      this.loading = true
      this.error = null

      try {
        const response = await authService.register(userData)

        if (response.success) {
          return { success: true, data: response.data }
        }

      } catch (error) {
        this.error = error.message || 'Registrasi gagal'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Logout action
    async logout() {
      try {
        await authService.logout()
        this.reset()

        return { success: true }
      } catch (error) {
        console.error('Logout error:', error)
        this.reset() // Tetap reset state meski error
        return { success: false, error: error.message }
      }
    },

    // Get profile
    async getProfile() {
      try {
        const response = await authService.getProfile()

        if (response.success) {
          this.user = response.data
          localStorage.setItem('user', JSON.stringify(response.data))
          return { success: true, data: response.data }
        }

      } catch (error) {
        console.error('Get profile error:', error)
        return { success: false, error: error.message }
      }
    },

    // Reset state
    reset() {
      this.user = null
      this.isAuthenticated = false
      this.loading = false
      this.error = null
    },

    // Set error
    setError(error) {
      this.error = error
    },

    // Clear error
    clearError() {
      this.error = null
    }
  }
})
