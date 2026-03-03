<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- NIK Field -->
    <div>
      <label for="nik" class="block text-sm font-medium text-gray-700">
        NIK (Nomor Induk Kependudukan)
      </label>
      <div class="mt-1">
        <input
          id="nik"
          v-model="form.nik"
          type="text"
          required
          :disabled="loading"
          maxlength="16"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          :class="{ 'border-red-300': errors.nik }"
          placeholder="16 digit NIK"
        />
        <p v-if="errors.nik" class="mt-1 text-sm text-red-600">
          {{ errors.nik }}
        </p>
      </div>
    </div>

    <!-- Full Name Field -->
    <div>
      <label for="nama_lengkap" class="block text-sm font-medium text-gray-700">
        Nama Lengkap
      </label>
      <div class="mt-1">
        <input
          id="nama_lengkap"
          v-model="form.nama_lengkap"
          type="text"
          required
          :disabled="loading"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          :class="{ 'border-red-300': errors.nama_lengkap }"
        />
        <p v-if="errors.nama_lengkap" class="mt-1 text-sm text-red-600">
          {{ errors.nama_lengkap }}
        </p>
      </div>
    </div>

    <!-- Username Field -->
    <div>
      <label for="username" class="block text-sm font-medium text-gray-700">
        Username
      </label>
      <div class="mt-1">
        <input
          id="username"
          v-model="form.username"
          type="text"
          required
          :disabled="loading"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          :class="{ 'border-red-300': errors.username }"
        />
        <p v-if="errors.username" class="mt-1 text-sm text-red-600">
          {{ errors.username }}
        </p>
      </div>
    </div>

    <!-- Email Field -->
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">
        Email (opsional)
      </label>
      <div class="mt-1">
        <input
          id="email"
          v-model="form.email"
          type="email"
          :disabled="loading"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          :class="{ 'border-red-300': errors.email }"
        />
        <p v-if="errors.email" class="mt-1 text-sm text-red-600">
          {{ errors.email }}
        </p>
      </div>
    </div>

    <!-- Password Field -->
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">
        Password
      </label>
      <div class="mt-1">
        <input
          id="password"
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          required
          :disabled="loading"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          :class="{ 'border-red-300': errors.password }"
        />
        <p v-if="errors.password" class="mt-1 text-sm text-red-600">
          {{ errors.password }}
        </p>
        <div v-if="passwordStrength.errors.length > 0" class="mt-2 space-y-1">
          <p class="text-sm text-gray-600">Password harus mengandung:</p>
          <ul class="text-sm text-red-600 space-y-1">
            <li v-for="error in passwordStrength.errors" :key="error" class="flex items-center">
              <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {{ error }}
            </li>
          </ul>
        </div>
        <div v-else-if="form.password" class="mt-2">
          <p class="text-sm text-green-600 font-medium">
            ✓ Password kuat
          </p>
        </div>
      </div>
      <div class="mt-2 flex items-center">
        <input
          id="show-password-register"
          v-model="showPassword"
          type="checkbox"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label for="show-password-register" class="ml-2 block text-sm text-gray-700">
          Tampilkan password
        </label>
      </div>
    </div>

    <!-- Confirm Password Field -->
    <div>
      <label for="confirm_password" class="block text-sm font-medium text-gray-700">
        Konfirmasi Password
      </label>
      <div class="mt-1">
        <input
          id="confirm_password"
          v-model="form.confirm_password"
          :type="showPassword ? 'text' : 'password'"
          required
          :disabled="loading"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          :class="{ 'border-red-300': errors.confirm_password }"
        />
        <p v-if="errors.confirm_password" class="mt-1 text-sm text-red-600">
          {{ errors.confirm_password }}
        </p>
      </div>
    </div>

    <!-- Gender Field -->
    <div>
      <label class="block text-sm font-medium text-gray-700">
        Jenis Kelamin
      </label>
      <div class="mt-2 space-y-2">
        <div class="flex items-center">
          <input
            id="jenis_kelamin_l"
            v-model="form.jenis_kelamin"
            type="radio"
            value="L"
            :disabled="loading"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
          />
          <label for="jenis_kelamin_l" class="ml-3 block text-sm font-medium text-gray-700">
            Laki-laki
          </label>
        </div>
        <div class="flex items-center">
          <input
            id="jenis_kelamin_p"
            v-model="form.jenis_kelamin"
            type="radio"
            value="P"
            :disabled="loading"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
          />
          <label for="jenis_kelamin_p" class="ml-3 block text-sm font-medium text-gray-700">
            Perempuan
          </label>
        </div>
      </div>
      <p v-if="errors.jenis_kelamin" class="mt-1 text-sm text-red-600">
        {{ errors.jenis_kelamin }}
      </p>
    </div>

    <!-- Place of Birth Field -->
    <div>
      <label for="tempat_lahir" class="block text-sm font-medium text-gray-700">
        Tempat Lahir
      </label>
      <div class="mt-1">
        <input
          id="tempat_lahir"
          v-model="form.tempat_lahir"
          type="text"
          :disabled="loading"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          :class="{ 'border-red-300': errors.tempat_lahir }"
        />
        <p v-if="errors.tempat_lahir" class="mt-1 text-sm text-red-600">
          {{ errors.tempat_lahir }}
        </p>
      </div>
    </div>

    <!-- Date of Birth Field -->
    <div>
      <label for="tanggal_lahir" class="block text-sm font-medium text-gray-700">
        Tanggal Lahir
      </label>
      <div class="mt-1">
        <input
          id="tanggal_lahir"
          v-model="form.tanggal_lahir"
          type="date"
          :disabled="loading"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          :class="{ 'border-red-300': errors.tanggal_lahir }"
        />
        <p v-if="errors.tanggal_lahir" class="mt-1 text-sm text-red-600">
          {{ errors.tanggal_lahir }}
        </p>
      </div>
    </div>

    <!-- Phone Field -->
    <div>
      <label for="telepon" class="block text-sm font-medium text-gray-700">
        Nomor Telepon (opsional)
      </label>
      <div class="mt-1">
        <input
          id="telepon"
          v-model="form.telepon"
          type="tel"
          :disabled="loading"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          :class="{ 'border-red-300': errors.telepon }"
        />
        <p v-if="errors.telepon" class="mt-1 text-sm text-red-600">
          {{ errors.telepon }}
        </p>
      </div>
    </div>

    <!-- Religion Field -->
    <div>
      <label for="agama" class="block text-sm font-medium text-gray-700">
        Agama (opsional)
      </label>
      <div class="mt-1">
        <select
          id="agama"
          v-model="form.agama"
          :disabled="loading"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          :class="{ 'border-red-300': errors.agama }"
        >
          <option value="">Pilih Agama</option>
          <option value="ISLAM">Islam</option>
          <option value="KRISTEN">Kristen</option>
          <option value="KATOLIK">Katolik</option>
          <option value="HINDU">Hindu</option>
          <option value="BUDDHA">Buddha</option>
          <option value="KONGHUCU">Konghucu</option>
        </select>
        <p v-if="errors.agama" class="mt-1 text-sm text-red-600">
          {{ errors.agama }}
        </p>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="authError" class="rounded-md bg-red-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            Registrasi gagal
          </h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{{ authError }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <div>
      <button
        type="submit"
        :disabled="loading || !isFormValid"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Memproses...
        </span>
        <span v-else>
          Daftar
        </span>
      </button>
    </div>

    <!-- Login Link -->
    <div class="text-center text-sm">
      <span class="text-gray-600">Sudah punya akun?</span>
      {{ ' ' }}
      <router-link
        to="/login"
        class="font-medium text-primary-600 hover:text-primary-500"
      >
        Masuk di sini
      </router-link>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { validatePasswordStrength, isValidEmail, isValidNIK } from '@/utils/helpers'

const router = useRouter()
const authStore = useAuthStore()

// Form state
const form = reactive({
  nik: '',
  nama_lengkap: '',
  username: '',
  email: '',
  password: '',
  confirm_password: '',
  jenis_kelamin: 'L',
  tempat_lahir: '',
  tanggal_lahir: '',
  telepon: '',
  agama: '',
  pekerjaan: '',
  status_perkawinan: 'BELUM_KAWIN'
})

// UI state
const showPassword = ref(false)
const loading = computed(() => authStore.loading)
const authError = computed(() => authStore.error)

// Validation errors
const errors = reactive({
  nik: '',
  nama_lengkap: '',
  username: '',
  email: '',
  password: '',
  confirm_password: '',
  jenis_kelamin: '',
  tanggal_lahir: ''
})

// Password strength
const passwordStrength = computed(() => {
  if (!form.password) {
    return { isValid: false, errors: [] }
  }
  return validatePasswordStrength(form.password)
})

// Form validation
const isFormValid = computed(() => {
  return (
    form.nik &&
    form.nama_lengkap &&
    form.username &&
    form.password &&
    form.confirm_password &&
    form.jenis_kelamin &&
    passwordStrength.value.isValid &&
    form.password === form.confirm_password
  )
})

// Watch for password confirmation
watch(
  () => form.confirm_password,
  () => {
    if (form.confirm_password && form.password !== form.confirm_password) {
      errors.confirm_password = 'Password tidak cocok'
    } else {
      errors.confirm_password = ''
    }
  }
)

// Handle form submission
const handleSubmit = async () => {
  // Reset errors
  clearErrors()

  // Validate form
  if (!validateForm()) {
    return
  }

  // Prepare data for API
  const userData = {
    nik: form.nik,
    nama_lengkap: form.nama_lengkap,
    username: form.username,
    password: form.password,
    jenis_kelamin: form.jenis_kelamin,
    tempat_lahir: form.tempat_lahir || undefined,
    tanggal_lahir: form.tanggal_lahir || undefined,
    telepon: form.telepon || undefined,
    agama: form.agama || undefined,
    pekerjaan: form.pekerjaan || undefined,
    status_perkawinan: form.status_perkawinan || undefined
  }

  // Add email if provided and valid
  if (form.email && isValidEmail(form.email)) {
    userData.email = form.email
  }

  // Call register action
  const result = await authStore.register(userData)

  if (result.success) {
    // Redirect to login with success message
    router.push({
      path: '/login',
      query: { registered: 'true' }
    })
  }
}

// Validate form
const validateForm = () => {
  let isValid = true

  // Validate NIK
  if (!form.nik.trim()) {
    errors.nik = 'NIK diperlukan'
    isValid = false
  } else if (!isValidNIK(form.nik)) {
    errors.nik = 'NIK harus 16 digit angka'
    isValid = false
  }

  // Validate full name
  if (!form.nama_lengkap.trim()) {
    errors.nama_lengkap = 'Nama lengkap diperlukan'
    isValid = false
  } else if (form.nama_lengkap.trim().length < 3) {
    errors.nama_lengkap = 'Nama minimal 3 karakter'
    isValid = false
  }

  // Validate username
  if (!form.username.trim()) {
    errors.username = 'Username diperlukan'
    isValid = false
  } else if (form.username.trim().length < 3) {
    errors.username = 'Username minimal 3 karakter'
    isValid = false
  }

  // Validate email if provided
  if (form.email && !isValidEmail(form.email)) {
    errors.email = 'Format email tidak valid'
    isValid = false
  }

  // Validate password
  if (!form.password) {
    errors.password = 'Password diperlukan'
    isValid = false
  } else if (!passwordStrength.value.isValid) {
    errors.password = 'Password tidak memenuhi kriteria keamanan'
    isValid = false
  }

  // Validate password confirmation
  if (!form.confirm_password) {
    errors.confirm_password = 'Konfirmasi password diperlukan'
    isValid = false
  } else if (form.password !== form.confirm_password) {
    errors.confirm_password = 'Password tidak cocok'
    isValid = false
  }

  // Validate gender
  if (!form.jenis_kelamin) {
    errors.jenis_kelamin = 'Jenis kelamin diperlukan'
    isValid = false
  }

  // Validate date of birth if provided
  if (form.tanggal_lahir) {
    const birthDate = new Date(form.tanggal_lahir)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()

    if (age < 17) {
      errors.tanggal_lahir = 'Usia minimal 17 tahun'
      isValid = false
    }
  }

  return isValid
}

// Clear errors
const clearErrors = () => {
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  authStore.clearError()
}
</script>
