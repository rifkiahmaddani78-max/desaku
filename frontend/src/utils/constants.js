export const ROLES = {
  ADMIN: 'admin',
  KEPALA_KELUARGA: 'kepala_keluarga'
}

export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error'
}

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard'
}

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER: 'user'
}

export const VALIDATION_RULES = {
  NIK: {
    required: true,
    length: 16,
    pattern: /^[0-9]{16}$/
  },
  PASSWORD: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true
  },
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
}
