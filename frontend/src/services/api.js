import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Buat instance axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor untuk menambahkan token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor untuk handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Jika error 401 (Unauthorized) dan belum di-retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')

        // Coba refresh token
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        })

        const { access_token } = response.data.data

        // Simpan token baru
        localStorage.setItem('access_token', access_token)

        // Update header untuk request asli
        originalRequest.headers.Authorization = `Bearer ${access_token}`

        // Coba request lagi
        return api(originalRequest)
      } catch (refreshError) {
        // Jika refresh gagal, logout user
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')

        // Redirect ke login page
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default api
