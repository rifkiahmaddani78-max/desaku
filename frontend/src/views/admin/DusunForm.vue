<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 mb-2">
            {{ isEdit ? 'Edit Dusun' : 'Tambah Dusun' }}
          </h1>
          <p class="text-sm text-gray-600">
            {{ isEdit ? 'Perbarui data dusun' : 'Tambah data dusun baru' }}
          </p>
        </div>
        <router-link to="/admin/dusun">
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

    <Card class="max-w-8xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
        ></div>
        <p class="mt-2 text-sm text-gray-500">Memuat data dusun...</p>
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
            </div>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div v-else class="p-6">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- Informasi Dasar -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Informasi Dasar
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Kode Dusun -->
              <div>
                <label for="kode_dusun" class="block text-sm font-medium text-gray-700 mb-1">
                  Kode Dusun <span class="text-red-500">*</span>
                </label>
                <input
                  id="kode_dusun"
                  v-model="form.kode_dusun"
                  type="text"
                  placeholder="Contoh: D001"
                  :class="['input-field', errors.kode_dusun ? 'input-error' : '']"
                  required
                />
                <p v-if="errors.kode_dusun" class="mt-1 text-sm text-red-600">
                  {{ errors.kode_dusun }}
                </p>
                <p class="mt-1 text-xs text-gray-500">Kode unik untuk identifikasi dusun</p>
              </div>

              <!-- Nama Dusun -->
              <div>
                <label for="nama_dusun" class="block text-sm font-medium text-gray-700 mb-1">
                  Nama Dusun <span class="text-red-500">*</span>
                </label>
                <input
                  id="nama_dusun"
                  v-model="form.nama_dusun"
                  type="text"
                  placeholder="Contoh: Dusun Krajan"
                  :class="['input-field', errors.nama_dusun ? 'input-error' : '']"
                  required
                />
                <p v-if="errors.nama_dusun" class="mt-1 text-sm text-red-600">
                  {{ errors.nama_dusun }}
                </p>
              </div>
            </div>
          </div>

          <!-- Informasi Tambahan -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Informasi Tambahan
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Kepala Dusun -->
              <div>
                <label for="kepala_dusun" class="block text-sm font-medium text-gray-700 mb-1">
                  Kepala Dusun
                </label>
                <input
                  id="kepala_dusun"
                  v-model="form.kepala_dusun"
                  type="text"
                  placeholder="Nama kepala dusun"
                  class="input-field"
                />
              </div>

              <!-- Telepon -->
              <div>
                <label for="telepon" class="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon
                </label>
                <input
                  id="telepon"
                  v-model="form.telepon"
                  type="tel"
                  placeholder="0812 3456 7890"
                  class="input-field"
                />
                <p class="mt-1 text-xs text-gray-500">Nomor telepon yang bisa dihubungi</p>
              </div>

              <!-- Alamat -->
              <div class="md:col-span-2">
                <label for="alamat" class="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Kantor Dusun
                </label>
                <textarea
                  id="alamat"
                  v-model="form.alamat"
                  rows="3"
                  placeholder="Jl. Raya Dusun No. 123"
                  class="input-field"
                ></textarea>
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
                <h3 class="text-sm font-medium text-red-800">
                  {{ isEdit ? 'Gagal memperbarui data' : 'Gagal menambah data' }}
                </h3>
                <div class="mt-2 text-sm text-red-700">
                  <p>{{ submitError }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <router-link to="/admin/dusun">
              <Button variant="outline" type="button"> Batal </Button>
            </router-link>

            <Button type="submit" variant="primary" :loading="submitting" :disabled="!isFormValid">
              <svg
                v-if="!submitting"
                class="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  v-if="isEdit"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {{ isEdit ? 'Simpan Perubahan' : 'Simpan Data' }}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dusunService } from '@/services/dusun'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'

const route = useRoute()
const router = useRouter()

// Determine if edit mode
const isEdit = computed(() => route.path.includes('/edit'))

// State
const loading = ref(false)
const submitting = ref(false)
const error = ref('')
const submitError = ref('')

// Form state
const form = reactive({
  kode_dusun: '',
  nama_dusun: '',
  kepala_dusun: '',
  telepon: '',
  alamat: '',
  // For edit mode only (read-only)
  jumlah_rw: 0,
  jumlah_rt: 0,
  jumlah_kk: 0,
})

// Error state
const errors = reactive({
  kode_dusun: '',
  nama_dusun: '',
})

// Form validation
const isFormValid = computed(() => {
  return form.kode_dusun && form.nama_dusun
})

// Load data if edit mode
onMounted(async () => {
  if (isEdit.value) {
    await fetchDusun()
  }
})

const fetchDusun = async () => {
  loading.value = true
  try {
    const response = await dusunService.getDusunById(route.params.id)

    if (response.success) {
      const data = response.data
      form.kode_dusun = data.kode_dusun || ''
      form.nama_dusun = data.nama_dusun || ''
      form.kepala_dusun = data.kepala_dusun || ''
      form.telepon = data.telepon || ''
      form.alamat = data.alamat || ''
      form.jumlah_rw = data.jumlah_rw || 0
      form.jumlah_rt = data.jumlah_rt || 0
      form.jumlah_kk = data.jumlah_kk || 0
    }
  } catch (err) {
    console.error('Error fetching dusun:', err)
    error.value = err.message || 'Gagal memuat data dusun'
  } finally {
    loading.value = false
  }
}

const validateForm = () => {
  clearErrors()
  let isValid = true

  // Validate kode dusun
  if (!form.kode_dusun.trim()) {
    errors.kode_dusun = 'Kode dusun diperlukan'
    isValid = false
  } else if (!/^[A-Z0-9]{3,10}$/i.test(form.kode_dusun)) {
    errors.kode_dusun = 'Kode dusun minimal 3 karakter (huruf/angka)'
    isValid = false
  }

  // Validate nama dusun
  if (!form.nama_dusun.trim()) {
    errors.nama_dusun = 'Nama dusun diperlukan'
    isValid = false
  } else if (form.nama_dusun.trim().length < 3) {
    errors.nama_dusun = 'Nama dusun minimal 3 karakter'
    isValid = false
  }

  // Validate telepon if provided
  if (form.telepon && !/^[0-9\-\+\s]{10,15}$/.test(form.telepon)) {
    errors.telepon = 'Format nomor telepon tidak valid'
    isValid = false
  }

  return isValid
}

const clearErrors = () => {
  errors.kode_dusun = ''
  errors.nama_dusun = ''
  submitError.value = ''
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  submitting.value = true
  submitError.value = ''

  try {
    const payload = {
      kode_dusun: form.kode_dusun,
      nama_dusun: form.nama_dusun,
      kepala_dusun: form.kepala_dusun || undefined,
      telepon: form.telepon || undefined,
      alamat: form.alamat || undefined,
    }

    let response
    if (isEdit.value) {
      response = await dusunService.updateDusun(route.params.id, payload)
    } else {
      response = await dusunService.createDusun(payload)
    }

    if (response.success) {
      alert(isEdit.value ? 'Data dusun berhasil diperbarui!' : 'Dusun berhasil ditambahkan!')
      router.push('/admin/dusun')
    } else {
      submitError.value =
        response.message || (isEdit.value ? 'Gagal memperbarui data' : 'Gagal menambah data')
    }
  } catch (err) {
    console.error('Error submitting form:', err)

    if (err.message?.includes('Network Error')) {
      submitError.value = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
    } else if (err.message?.includes('409')) {
      submitError.value = 'Kode dusun sudah digunakan. Silakan gunakan kode yang berbeda.'
    } else {
      submitError.value =
        err.message || (isEdit.value ? 'Gagal memperbarui data' : 'Gagal menambah data')
    }
  } finally {
    submitting.value = false
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
