<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 mb-2">Tambah Kepala Keluarga</h1>
          <p class="text-sm text-gray-600">
            Isi data diri kepala keluarga dengan benar sesuai dokumen resmi
          </p>
        </div>
        <router-link to="/admin/kepala-keluarga">
          <Button variant="outline">
            <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Kembali
          </Button>
        </router-link>
      </div>
    </div>

    <Card class="max-w-8xl mx-auto">
      <form @submit.prevent="handleSubmit" class="p-6">
        <!-- Form Sections -->
        <div class="space-y-8">
          <!-- Section 1: Data Pribadi -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
              1. Data Pribadi
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- NIK -->
              <div>
                <label for="nik" class="block text-sm font-medium text-gray-700 mb-1">
                  NIK <span class="text-red-500">*</span>
                </label>
                <input
                  id="nik"
                  v-model="form.nik"
                  type="text"
                  maxlength="16"
                  placeholder="16 digit NIK"
                  :class="['input-field', errors.nik ? 'input-error' : '']"
                  required
                />
                <p v-if="errors.nik" class="mt-1 text-sm text-red-600">{{ errors.nik }}</p>
                <p class="mt-1 text-xs text-gray-500">Nomor Induk Kependudukan (16 digit)</p>
              </div>

              <!-- Nama Lengkap -->
              <div>
                <label for="nama_lengkap" class="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap <span class="text-red-500">*</span>
                </label>
                <input
                  id="nama_lengkap"
                  v-model="form.nama_lengkap"
                  type="text"
                  placeholder="Nama lengkap sesuai KTP"
                  :class="['input-field', errors.nama_lengkap ? 'input-error' : '']"
                  required
                />
                <p v-if="errors.nama_lengkap" class="mt-1 text-sm text-red-600">
                  {{ errors.nama_lengkap }}
                </p>
              </div>

              <!-- Jenis Kelamin -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Kelamin <span class="text-red-500">*</span>
                </label>
                <div class="flex space-x-4 mt-2">
                  <label class="inline-flex items-center">
                    <input
                      v-model="form.jenis_kelamin"
                      type="radio"
                      value="L"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span class="ml-2 text-sm text-gray-700">Laki-laki</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input
                      v-model="form.jenis_kelamin"
                      type="radio"
                      value="P"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span class="ml-2 text-sm text-gray-700">Perempuan</span>
                  </label>
                </div>
              </div>

              <!-- Tempat Lahir -->
              <div>
                <label for="tempat_lahir" class="block text-sm font-medium text-gray-700 mb-1">
                  Tempat Lahir
                </label>
                <input
                  id="tempat_lahir"
                  v-model="form.tempat_lahir"
                  type="text"
                  placeholder="Kota/Kabupaten tempat lahir"
                  class="input-field"
                />
              </div>

              <!-- Tanggal Lahir -->
              <div>
                <label for="tanggal_lahir" class="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Lahir
                </label>
                <input
                  id="tanggal_lahir"
                  v-model="form.tanggal_lahir"
                  type="date"
                  class="input-field"
                  :max="today"
                />
                <p class="mt-1 text-xs text-gray-500">Format: YYYY-MM-DD</p>
              </div>
            </div>
          </div>

          <!-- Section 2: Akun & Kontak -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
              2. Akun & Kontak
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Username -->
              <div>
                <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
                  Username <span class="text-red-500">*</span>
                </label>
                <input
                  id="username"
                  v-model="form.username"
                  type="text"
                  placeholder="Username untuk login"
                  :class="['input-field', errors.username ? 'input-error' : '']"
                  required
                />
                <p v-if="errors.username" class="mt-1 text-sm text-red-600">
                  {{ errors.username }}
                </p>
                <p class="mt-1 text-xs text-gray-500">Minimal 3 karakter, tanpa spasi</p>
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                  Email (opsional)
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="email@contoh.com"
                  :class="['input-field', errors.email ? 'input-error' : '']"
                />
                <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
              </div>

              <!-- Telepon -->
              <div>
                <label for="telepon" class="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon (opsional)
                </label>
                <input
                  id="telepon"
                  v-model="form.telepon"
                  type="tel"
                  placeholder="0812 3456 7890"
                  class="input-field"
                />
              </div>
            </div>
          </div>

          <!-- Section 3: Detail Tambahan -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
              3. Detail Tambahan
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Agama -->
              <div>
                <label for="agama" class="block text-sm font-medium text-gray-700 mb-1">
                  Agama
                </label>
                <select id="agama" v-model="form.agama" class="input-field">
                  <option value="">Pilih Agama</option>
                  <option value="ISLAM">Islam</option>
                  <option value="KRISTEN">Kristen</option>
                  <option value="KATOLIK">Katolik</option>
                  <option value="HINDU">Hindu</option>
                  <option value="BUDDHA">Buddha</option>
                  <option value="KONGHUCU">Konghucu</option>
                </select>
              </div>

              <!-- Pekerjaan -->
              <div>
                <label for="pekerjaan" class="block text-sm font-medium text-gray-700 mb-1">
                  Pekerjaan
                </label>
                <input
                  id="pekerjaan"
                  v-model="form.pekerjaan"
                  type="text"
                  placeholder="Contoh: Petani, Pedagang, PNS"
                  class="input-field"
                />
              </div>

              <!-- Status Perkawinan -->
              <div>
                <label for="status_perkawinan" class="block text-sm font-medium text-gray-700 mb-1">
                  Status Perkawinan
                </label>
                <select id="status_perkawinan" v-model="form.status_perkawinan" class="input-field">
                  <option value="BELUM_KAWIN">Belum Kawin</option>
                  <option value="KAWIN">Kawin</option>
                  <option value="CERAI_HIDUP">Cerai Hidup</option>
                  <option value="CERAI_MATI">Cerai Mati</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Section 4: Password -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
              4. Password
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Password -->
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                  Password <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Password minimal 8 karakter"
                    :class="['input-field', errors.password ? 'input-error' : '']"
                    required
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg
                      class="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        v-if="showPassword"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                      <path
                        v-else
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </div>
                <p v-if="errors.password" class="mt-1 text-sm text-red-600">
                  {{ errors.password }}
                </p>
                <div v-if="passwordStrength.errors.length > 0" class="mt-2 space-y-1">
                  <p class="text-sm text-gray-600">Password harus mengandung:</p>
                  <ul class="text-sm text-red-600 space-y-1">
                    <li
                      v-for="error in passwordStrength.errors"
                      :key="error"
                      class="flex items-center"
                    >
                      <svg
                        class="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      {{ error }}
                    </li>
                  </ul>
                </div>
                <div v-else-if="form.password" class="mt-2">
                  <p class="text-sm text-green-600 font-medium">✓ Password kuat</p>
                </div>
              </div>

              <!-- Confirm Password -->
              <div>
                <label for="confirm_password" class="block text-sm font-medium text-gray-700 mb-1">
                  Konfirmasi Password <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    id="confirm_password"
                    v-model="confirmPassword"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Ulangi password"
                    :class="['input-field', errors.confirm_password ? 'input-error' : '']"
                    required
                  />
                </div>
                <p v-if="errors.confirm_password" class="mt-1 text-sm text-red-600">
                  {{ errors.confirm_password }}
                </p>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="submitError" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Gagal menambahkan kepala keluarga</h3>
                <div class="mt-2 text-sm text-red-700">
                  <p>{{ submitError }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <router-link to="/admin/kepala-keluarga">
              <Button variant="outline" type="button"> Batal </Button>
            </router-link>

            <Button type="submit" :loading="submitting" :disabled="!isFormValid">
              <svg
                v-if="!submitting"
                class="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {{ submitting ? 'Menyimpan...' : 'Simpan Data' }}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usersService } from '@/services/users'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import { validatePasswordStrength, isValidEmail, isValidNIK } from '@/utils/helpers'

const router = useRouter()

// Form state
const form = reactive({
  nik: '',
  nama_lengkap: '',
  username: '',
  email: '',
  telepon: '',
  jenis_kelamin: 'L',
  tempat_lahir: '',
  tanggal_lahir: '',
  agama: 'ISLAM',
  pekerjaan: '',
  status_perkawinan: 'KAWIN',
  password: '',
  role_id: 2, // kepala_keluarga
})

const confirmPassword = ref('')
const showPassword = ref(false)
const submitting = ref(false)
const submitError = ref('')

// Error state
const errors = reactive({
  nik: '',
  nama_lengkap: '',
  username: '',
  email: '',
  password: '',
  confirm_password: '',
})

// Get today's date for max date input
const today = ref(new Date().toISOString().split('T')[0])

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
    confirmPassword.value &&
    passwordStrength.value.isValid &&
    form.password === confirmPassword.value
  )
})

// Watch for password confirmation
watch(
  () => confirmPassword.value,
  () => {
    if (confirmPassword.value && form.password !== confirmPassword.value) {
      errors.confirm_password = 'Password tidak cocok'
    } else {
      errors.confirm_password = ''
    }
  },
)

const handleSubmit = async () => {
  // Reset errors
  clearErrors()

  // Validate form
  if (!validateForm()) {
    return
  }

  submitting.value = true
  submitError.value = ''

  try {
    // Prepare data - include telepon
    const userData = {
      nik: form.nik,
      nama_lengkap: form.nama_lengkap,
      username: form.username,
      email: form.email || undefined,
      telepon: form.telepon || undefined,
      password: form.password,
      jenis_kelamin: form.jenis_kelamin,
      tempat_lahir: form.tempat_lahir || undefined,
      tanggal_lahir: form.tanggal_lahir || undefined,
      agama: form.agama || undefined,
      pekerjaan: form.pekerjaan || undefined,
      status_perkawinan: form.status_perkawinan || undefined,
      role_id: 2, // kepala_keluarga
    }

    // Submit data
    const response = await usersService.createKepalaKeluarga(userData)

    if (response.success) {
      // Show success message and redirect
      alert('Kepala keluarga berhasil ditambahkan!')
      router.push('/admin/kepala-keluarga')
    } else {
      submitError.value = response.message || 'Gagal menambahkan kepala keluarga'
    }
  } catch (error) {
    console.error('Error creating kepala keluarga:', error)

    // Handle specific error messages
    if (error.message?.includes('Network Error')) {
      submitError.value = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
    } else if (error.message?.includes('409')) {
      submitError.value = 'NIK atau username sudah terdaftar. Silakan gunakan data yang berbeda.'
    } else {
      submitError.value = error.message || 'Terjadi kesalahan saat menyimpan data'
    }
  } finally {
    submitting.value = false
  }
}

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
  } else if (/\s/.test(form.username)) {
    errors.username = 'Username tidak boleh mengandung spasi'
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
  if (!confirmPassword.value) {
    errors.confirm_password = 'Konfirmasi password diperlukan'
    isValid = false
  } else if (form.password !== confirmPassword.value) {
    errors.confirm_password = 'Password tidak cocok'
    isValid = false
  }

  // Validate age if date of birth provided
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

const clearErrors = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
  submitError.value = ''
}
</script>
