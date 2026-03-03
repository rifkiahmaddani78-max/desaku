<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 mb-2">Edit Anggota Keluarga</h1>
          <p class="text-sm text-gray-600">
            Perbarui data anggota keluarga dengan informasi yang benar
          </p>
        </div>
        <router-link to="/anggota-keluarga">
          <Button variant="outline">
            <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Kembali ke Daftar
          </Button>
        </router-link>
      </div>
    </div>

    <Card class="max-w-6xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
        ></div>
        <p class="mt-2 text-sm text-gray-500">Memuat data anggota keluarga...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="mx-6 mt-6">
        <div class="rounded-md bg-red-50 p-4">
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
              <h3 class="text-sm font-medium text-red-800">Gagal memuat data</h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{{ error }}</p>
              </div>
              <div class="mt-4">
                <button
                  @click="router.push('/anggota-keluarga')"
                  class="text-sm font-medium text-red-800 hover:text-red-900"
                >
                  ← Kembali ke daftar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div v-else class="p-6">
        <form @submit.prevent="handleSubmit" class="space-y-8">
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

              <!-- Hubungan -->
              <div>
                <label for="hubungan" class="block text-sm font-medium text-gray-700 mb-1">
                  Hubungan dengan Kepala Keluarga <span class="text-red-500">*</span>
                </label>
                <select
                  id="hubungan"
                  v-model="form.hubungan"
                  :class="['input-field', errors.hubungan ? 'input-error' : '']"
                  required
                >
                  <option value="">Pilih Hubungan</option>
                  <option value="SUAMI">Suami</option>
                  <option value="ISTRI">Istri</option>
                  <option value="ANAK">Anak</option>
                  <option value="MENANTU">Menantu</option>
                  <option value="CUCU">Cucu</option>
                  <option value="ORANG_TUA">Orang Tua</option>
                  <option value="MERTUA">Mertua</option>
                  <option value="FAMILI_LAIN">Famili Lain</option>
                  <option value="LAINNYA">Lainnya</option>
                </select>
                <p v-if="errors.hubungan" class="mt-1 text-sm text-red-600">
                  {{ errors.hubungan }}
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
                <p v-if="errors.jenis_kelamin" class="mt-1 text-sm text-red-600">
                  {{ errors.jenis_kelamin }}
                </p>
              </div>

              <!-- Tempat Lahir -->
              <div>
                <label for="tempat_lahir" class="block text-sm font-medium text-gray-700 mb-1">
                  Tempat Lahir <span class="text-red-500">*</span>
                </label>
                <input
                  id="tempat_lahir"
                  v-model="form.tempat_lahir"
                  type="text"
                  placeholder="Kota/Kabupaten tempat lahir"
                  :class="['input-field', errors.tempat_lahir ? 'input-error' : '']"
                  required
                />
                <p v-if="errors.tempat_lahir" class="mt-1 text-sm text-red-600">
                  {{ errors.tempat_lahir }}
                </p>
              </div>

              <!-- Tanggal Lahir -->
              <div>
                <label for="tanggal_lahir" class="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Lahir <span class="text-red-500">*</span>
                </label>
                <input
                  id="tanggal_lahir"
                  v-model="form.tanggal_lahir"
                  type="date"
                  class="input-field"
                  :max="today"
                />
                <p v-if="errors.tanggal_lahir" class="mt-1 text-sm text-red-600">
                  {{ errors.tanggal_lahir }}
                </p>
                <p class="mt-1 text-xs text-gray-500">Format: YYYY-MM-DD</p>
              </div>
            </div>
          </div>

          <!-- Section 2: Data Pendidikan & Pekerjaan -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
              2. Pendidikan & Pekerjaan
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Agama -->
              <div>
                <label for="agama" class="block text-sm font-medium text-gray-700 mb-1">
                  Agama <span class="text-red-500">*</span>
                </label>
                <select
                  id="agama"
                  v-model="form.agama"
                  :class="['input-field', errors.agama ? 'input-error' : '']"
                  required
                >
                  <option value="">Pilih Agama</option>
                  <option value="ISLAM">Islam</option>
                  <option value="KRISTEN">Kristen</option>
                  <option value="KATOLIK">Katolik</option>
                  <option value="HINDU">Hindu</option>
                  <option value="BUDDHA">Buddha</option>
                  <option value="KONGHUCU">Konghucu</option>
                </select>
                <p v-if="errors.agama" class="mt-1 text-sm text-red-600">{{ errors.agama }}</p>
              </div>

              <!-- Pendidikan Terakhir -->
              <div>
                <label
                  for="pendidikan_terakhir"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Pendidikan Terakhir
                </label>
                <select
                  id="pendidikan_terakhir"
                  v-model="form.pendidikan_terakhir"
                  class="input-field"
                >
                  <option value="">Pilih Pendidikan</option>
                  <option value="TIDAK_SEKOLAH">Tidak Sekolah</option>
                  <option value="SD">SD</option>
                  <option value="SMP">SMP</option>
                  <option value="SMA">SMA</option>
                  <option value="D1">D1</option>
                  <option value="D2">D2</option>
                  <option value="D3">D3</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
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
                  placeholder="Contoh: Pelajar, Karyawan, Wiraswasta"
                  class="input-field"
                />
                <p class="mt-1 text-xs text-gray-500">Kosongkan jika tidak bekerja</p>
              </div>
            </div>
          </div>

          <!-- Section 3: Status -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
              3. Status
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Status Perkawinan -->
              <div>
                <label for="status_perkawinan" class="block text-sm font-medium text-gray-700 mb-1">
                  Status Perkawinan <span class="text-red-500">*</span>
                </label>
                <select
                  id="status_perkawinan"
                  v-model="form.status_perkawinan"
                  :class="['input-field', errors.status_perkawinan ? 'input-error' : '']"
                  required
                >
                  <option value="">Pilih Status</option>
                  <option value="BELUM_KAWIN">Belum Kawin</option>
                  <option value="KAWIN">Kawin</option>
                  <option value="CERAI_HIDUP">Cerai Hidup</option>
                  <option value="CERAI_MATI">Cerai Mati</option>
                </select>
                <p v-if="errors.status_perkawinan" class="mt-1 text-sm text-red-600">
                  {{ errors.status_perkawinan }}
                </p>
              </div>

              <!-- Status Tinggal -->
              <div>
                <label for="status_tinggal" class="block text-sm font-medium text-gray-700 mb-1">
                  Status Tinggal <span class="text-red-500">*</span>
                </label>
                <select
                  id="status_tinggal"
                  v-model="form.status_tinggal"
                  :class="['input-field', errors.status_tinggal ? 'input-error' : '']"
                  required
                >
                  <option value="">Pilih Status</option>
                  <option value="TINGGAL">Tinggal</option>
                  <option value="TIDAK_TINGGAL">Tidak Tinggal</option>
                  <option value="PINDAH">Pindah</option>
                  <option value="MENINGGAL">Meninggal</option>
                </select>
                <p v-if="errors.status_tinggal" class="mt-1 text-sm text-red-600">
                  {{ errors.status_tinggal }}
                </p>
                <p class="mt-1 text-xs text-gray-500">Status tempat tinggal saat ini</p>
              </div>
            </div>
          </div>

          <!-- Submit Error -->
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
                <h3 class="text-sm font-medium text-red-800">Gagal memperbarui data</h3>
                <div class="mt-2 text-sm text-red-700">
                  <p>{{ submitError }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <router-link to="/anggota-keluarga">
              <Button variant="outline" type="button"> Batal </Button>
            </router-link>

            <Button type="submit" variant="primary" :loading="saving" :disabled="!isFormValid">
              <svg
                v-if="!saving"
                class="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { anggotaKeluargaService } from '@/services/anggotaKeluarga'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import { isValidNIK } from '@/utils/helpers'

const route = useRoute()
const router = useRouter()

// State
const loading = ref(true)
const saving = ref(false)
const submitError = ref('')
const today = ref(new Date().toISOString().split('T')[0])

// Form state
const form = reactive({
  nik: '',
  nama_lengkap: '',
  hubungan: '',
  jenis_kelamin: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  agama: '',
  pendidikan_terakhir: '',
  pekerjaan: '',
  status_perkawinan: '',
  status_tinggal: '',
})

// Error state
const errors = reactive({
  nik: '',
  nama_lengkap: '',
  hubungan: '',
  jenis_kelamin: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  agama: '',
  status_perkawinan: '',
  status_tinggal: '',
})

// Form validation
const isFormValid = computed(() => {
  return (
    form.nik &&
    form.nama_lengkap &&
    form.hubungan &&
    form.jenis_kelamin &&
    form.tempat_lahir &&
    form.tanggal_lahir &&
    form.agama &&
    form.status_perkawinan &&
    form.status_tinggal
  )
})

onMounted(async () => {
  try {
    loading.value = true
    const data = await anggotaKeluargaService.getDetailAnggotaKeluarga(route.params.id)

    // Map data to form
    form.nik = data.nik || ''
    form.nama_lengkap = data.nama_lengkap || ''
    form.hubungan = data.hubungan || ''
    form.jenis_kelamin = data.jenis_kelamin || 'L'
    form.tempat_lahir = data.tempat_lahir || ''
    form.tanggal_lahir = data.tanggal_lahir ? data.tanggal_lahir.split('T')[0] : ''
    form.agama = data.agama || ''
    form.pendidikan_terakhir = data.pendidikan_terakhir || ''
    form.pekerjaan = data.pekerjaan || ''
    form.status_perkawinan = data.status_perkawinan || ''
    form.status_tinggal = data.status_tinggal || ''
  } catch (err) {
    console.error('Error loading data:', err)
    submitError.value = err.message || 'Gagal memuat data anggota keluarga'
  } finally {
    loading.value = false
  }
})

/* =========================
   VALIDATE FORM
========================= */
const validateForm = () => {
  clearErrors()
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

  // Validate hubungan
  if (!form.hubungan) {
    errors.hubungan = 'Hubungan diperlukan'
    isValid = false
  }

  // Validate jenis kelamin
  if (!form.jenis_kelamin) {
    errors.jenis_kelamin = 'Jenis kelamin diperlukan'
    isValid = false
  }

  // Validate tempat lahir
  if (!form.tempat_lahir.trim()) {
    errors.tempat_lahir = 'Tempat lahir diperlukan'
    isValid = false
  }

  // Validate tanggal lahir
  if (!form.tanggal_lahir) {
    errors.tanggal_lahir = 'Tanggal lahir diperlukan'
    isValid = false
  } else {
    const birthDate = new Date(form.tanggal_lahir)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()

    if (age < 0) {
      errors.tanggal_lahir = 'Tanggal lahir tidak valid'
      isValid = false
    }
  }

  // Validate agama
  if (!form.agama) {
    errors.agama = 'Agama diperlukan'
    isValid = false
  }

  // Validate status perkawinan
  if (!form.status_perkawinan) {
    errors.status_perkawinan = 'Status perkawinan diperlukan'
    isValid = false
  }

  // Validate status tinggal
  if (!form.status_tinggal) {
    errors.status_tinggal = 'Status tinggal diperlukan'
    isValid = false
  }

  return isValid
}

const clearErrors = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
  submitError.value = ''
}

/* =========================
   SUBMIT FORM
========================= */
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  saving.value = true
  submitError.value = ''

  try {
    await anggotaKeluargaService.updateAnggotaKeluarga(route.params.id, form)
    alert('Data anggota keluarga berhasil diperbarui!')
    router.push('/anggota-keluarga')
  } catch (err) {
    console.error('Error updating:', err)

    // Handle specific error messages
    if (err.message?.includes('Network Error')) {
      submitError.value = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
    } else if (err.message?.includes('409')) {
      submitError.value = 'NIK sudah terdaftar. Silakan gunakan NIK yang berbeda.'
    } else {
      submitError.value = err.message || 'Terjadi kesalahan saat menyimpan data'
    }
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.input-field {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors duration-200;
}

.input-error {
  @apply border-red-300 focus:border-red-500 focus:ring-red-500;
}
</style>
