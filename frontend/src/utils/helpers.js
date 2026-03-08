// Format tanggal
export function formatDate(dateString, format = 'id-ID') {
  if (!dateString) return '-'

  const date = new Date(dateString)

  // Cek apakah date valid
  if (isNaN(date.getTime())) return '-'

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

  if (format === 'time') {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return date.toISOString().split('T')[0]
}

// Format waktu (alias untuk konsistensi)
export function formatTime(dateString) {
  return formatDate(dateString, 'time')
}

// Format currency
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return 'Rp 0'

  // Konversi ke number jika string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  if (isNaN(numAmount)) return 'Rp 0'

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(numAmount)
}

// Format Rupiah tanpa simbol (untuk tampilan lebih simple)
export function formatRupiah(amount) {
  if (amount === null || amount === undefined) return '0'

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  if (isNaN(numAmount)) return '0'

  return new Intl.NumberFormat('id-ID').format(numAmount)
}

// Validasi email
export function isValidEmail(email) {
  if (!email) return false
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(email)
}

// Validasi NIK
export function isValidNIK(nik) {
  if (!nik) return false
  const pattern = /^[0-9]{16}$/
  return pattern.test(nik)
}

// Validasi password strength
export function validatePasswordStrength(password) {
  const errors = []

  if (!password) {
    errors.push('Password diperlukan')
    return { isValid: false, errors }
  }

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
  if (!name) return '??'

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
  if (!text) return '-'
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Format date with time
export function formatDateTime(dateString) {
  if (!dateString) return '-'

  const date = new Date(dateString)

  // Cek apakah date valid
  if (isNaN(date.getTime())) return '-'

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Hitung usia dari tanggal lahir
export function calculateAge(birthDate) {
  if (!birthDate) return '-'

  const date = new Date(birthDate)
  if (isNaN(date.getTime())) return '-'

  const today = new Date()
  let age = today.getFullYear() - date.getFullYear()
  const monthDiff = today.getMonth() - date.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--
  }

  return `${age} tahun`
}

// Format status (umum)
export function formatStatus(status, type = 'default') {
  const statusMap = {
    // Status pengajuan
    MENUNGGU: 'Menunggu',
    DIPROSES: 'Diproses',
    DITERIMA: 'Diterima',
    DITOLAK: 'Ditolak',

    // Status bansos
    AKTIF: 'Aktif',
    NONAKTIF: 'Non-Aktif',

    // Status perkawinan
    BELUM_KAWIN: 'Belum Kawin',
    KAWIN: 'Kawin',
    CERAI_HIDUP: 'Cerai Hidup',
    CERAI_MATI: 'Cerai Mati',

    // Status tinggal
    TINGGAL: 'Tinggal',
    TIDAK_TINGGAL: 'Tidak Tinggal',

    // Hubungan keluarga
    SUAMI: 'Suami',
    ISTRI: 'Istri',
    ANAK: 'Anak',
    CUCU: 'Cucu',
    ORANG_TUA: 'Orang Tua',
    MENANTU: 'Menantu',
    FAMILI_LAIN: 'Famili Lain',

    // Agama
    ISLAM: 'Islam',
    KRISTEN: 'Kristen',
    KATOLIK: 'Katolik',
    HINDU: 'Hindu',
    BUDDHA: 'Buddha',
    KONGHUCU: 'Konghucu',

    // Jenis bansos
    TUNAI: 'Tunai',
    BARANG: 'Barang',
    JASA: 'Jasa',

    // Prioritas
    TINGGI: 'Tinggi',
    SEDANG: 'Sedang',
    RENDAH: 'Rendah',
  }

  return statusMap[status] || status || '-'
}

// Dapatkan warna badge berdasarkan status
export function getStatusBadgeVariant(status) {
  const variantMap = {
    // Status pengajuan
    MENUNGGU: 'warning',
    DIPROSES: 'info',
    DITERIMA: 'success',
    DITOLAK: 'danger',

    // Status bansos
    AKTIF: 'success',
    NONAKTIF: 'warning',

    // Prioritas
    TINGGI: 'danger',
    SEDANG: 'warning',
    RENDAH: 'info',

    // Status tinggal
    TINGGAL: 'success',
    TIDAK_TINGGAL: 'warning',

    // Verifikasi
    true: 'success',
    false: 'warning',
    1: 'success',
    0: 'warning',
  }

  return variantMap[status] || 'gray'
}

// Format array to string dengan separator
export function formatList(items, separator = ', ') {
  if (!items || !Array.isArray(items) || items.length === 0) return '-'
  return items.join(separator)
}

// Capitalize first letter
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Safe parse JSON
export function safeJsonParse(str, defaultValue = null) {
  try {
    return JSON.parse(str)
  } catch {
    return defaultValue
  }
}

// Generate random color based on string (untuk avatar)
export function stringToColor(str) {
  if (!str) return '#3B82F6'

  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  const colors = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#EC4899',
    '#14B8A6',
    '#F97316',
    '#6366F1',
    '#84CC16',
  ]

  const index = Math.abs(hash) % colors.length
  return colors[index]
}

// Download file from blob
export function downloadFile(blob, filename) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

// Format Number (untuk angka biasa, tanpa mata uang)
export function formatNumber(number, options = {}) {
  if (number === null || number === undefined) return '0'

  const numValue = typeof number === 'string' ? parseFloat(number) : number
  
  if (isNaN(numValue)) return '0'

  const defaultOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }

  const mergedOptions = { ...defaultOptions, ...options }

  return new Intl.NumberFormat('id-ID', mergedOptions).format(numValue)
}
