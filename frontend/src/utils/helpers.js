// Format tanggal
export function formatDate(dateString, format = 'id-ID') {
  if (!dateString) return ''

  const date = new Date(dateString)

  if (format === 'id-ID') {
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  if (format === 'short') {
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return date.toISOString().split('T')[0]
}

// Format waktu
export function formatTime(dateString) {
  if (!dateString) return ''

  const date = new Date(dateString)
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Format currency
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return 'Rp 0'

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

// Validasi email
export function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(email)
}

// Validasi NIK
export function isValidNIK(nik) {
  const pattern = /^[0-9]{16}$/
  return pattern.test(nik)
}

// Validasi password strength
export function validatePasswordStrength(password) {
  const errors = []

  if (password.length < 8) {
    errors.push('Minimal 8 karakter')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Minimal 1 huruf besar')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Minimal 1 huruf kecil')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Minimal 1 angka')
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Minimal 1 karakter spesial')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Debounce function
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Get initial from name
export function getInitials(name) {
  if (!name) return ''

  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Check if user has role
export function hasRole(user, role) {
  return user?.role_name === role
}

// Truncate text
export function truncateText(text, maxLength = 50) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// ... existing code ...

// Format date with time
export function formatDateTime(dateString) {
  if (!dateString) return '-'

  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
