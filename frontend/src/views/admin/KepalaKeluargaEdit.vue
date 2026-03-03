<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 mb-2">Edit Kepala Keluarga</h1>
          <p class="text-sm text-gray-600">
            Perbarui data kepala keluarga dengan informasi yang benar
          </p>
        </div>
        <div class="flex space-x-3">
          <Button @click="router.push(`/admin/kepala-keluarga/${form.id}`)" variant="outline">
            <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Kembali ke Detail
          </Button>
        </div>
      </div>
    </div>

    <Card class="max-w-6xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
        ></div>
        <p class="mt-2 text-sm text-gray-500">Memuat data kepala keluarga...</p>
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
                  @click="router.push(`/admin/kepala-keluarga`)"
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
                <p v-if="errors.tanggal_lahir" class="mt-1 text-sm text-red-600">
                  {{ errors.tanggal_lahir }}
                </p>
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

              <!-- Password -->
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div class="relative">
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Kosongkan jika tidak ingin mengganti"
                    :class="['input-field', errors.password ? 'input-error' : '']"
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
                <p class="mt-1 text-xs text-gray-500">
                  Kosongkan jika tidak ingin mengganti password
                </p>
              </div>
            </div>
          </div>

          <!-- Section 3: Informasi Alamat -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
              3. Informasi Alamat
            </h3>

            <div class="space-y-4">
              <!-- Alamat Lengkap -->
              <div>
                <label for="alamat_lengkap" class="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  id="alamat_lengkap"
                  v-model="addressForm.alamat_lengkap"
                  rows="3"
                  placeholder="Contoh: Jl. Mawar No. 10, RT 01 RW 01"
                  class="input-field"
                ></textarea>
                <p class="mt-1 text-xs text-gray-500">Alamat lengkap sesuai domisili</p>
              </div>

              <!-- Grid Wilayah -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Dusun -->
                <div>
                  <label for="dusun_id" class="block text-sm font-medium text-gray-700 mb-1">
                    Dusun <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="dusun_id"
                    v-model="addressForm.dusun_id"
                    class="input-field"
                    @change="onDusunChange"
                  >
                    <option value="">Pilih Dusun</option>
                    <option v-for="dusun in dusunList" :key="dusun.id" :value="dusun.id">
                      {{ dusun.nama_dusun }} ({{ dusun.kode_dusun }})
                    </option>
                  </select>
                  <p v-if="addressErrors.dusun_id" class="mt-1 text-sm text-red-600">
                    {{ addressErrors.dusun_id }}
                  </p>
                </div>

                <!-- RW -->
                <div>
                  <label for="rw_id" class="block text-sm font-medium text-gray-700 mb-1">
                    RW
                  </label>
                  <select
                    id="rw_id"
                    v-model="addressForm.rw_id"
                    class="input-field"
                    :disabled="!addressForm.dusun_id"
                  >
                    <option value="">Pilih RW</option>
                    <option v-for="rw in rwList" :key="rw.id" :value="rw.id">
                      RW {{ rw.nomor_rw }} {{ rw.ketua_rw ? `- ${rw.ketua_rw}` : '' }}
                    </option>
                  </select>
                </div>

                <!-- RT -->
                <div>
                  <label for="rt_id" class="block text-sm font-medium text-gray-700 mb-1">
                    RT
                  </label>
                  <select
                    id="rt_id"
                    v-model="addressForm.rt_id"
                    class="input-field"
                    :disabled="!addressForm.rw_id"
                  >
                    <option value="">Pilih RT</option>
                    <option v-for="rt in rtList" :key="rt.id" :value="rt.id">
                      RT {{ rt.nomor_rt }} {{ rt.ketua_rt ? `- ${rt.ketua_rt}` : '' }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Koordinat -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="koordinat_lat" class="block text-sm font-medium text-gray-700 mb-1">
                    Latitude (Koordinat)
                  </label>
                  <input
                    id="koordinat_lat"
                    v-model="addressForm.koordinat_lat"
                    type="text"
                    placeholder="Contoh: -6.2088"
                    class="input-field"
                  />
                </div>
                <div>
                  <label for="koordinat_lng" class="block text-sm font-medium text-gray-700 mb-1">
                    Longitude (Koordinat)
                  </label>
                  <input
                    id="koordinat_lng"
                    v-model="addressForm.koordinat_lng"
                    type="text"
                    placeholder="Contoh: 106.8456"
                    class="input-field"
                  />
                </div>
              </div>

              <!-- Info Koordinat -->
              <div class="bg-blue-50 p-3 rounded-lg">
                <div class="flex items-start">
                  <svg
                    class="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p class="text-xs text-blue-700">
                    <span class="font-medium">Info:</span> Koordinat dapat diisi nanti atau
                    dikosongkan. Gunakan format desimal (contoh: -6.2088 untuk latitude, 106.8456
                    untuk longitude).
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 4: Detail Tambahan -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
              4. Detail Tambahan
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
                  <option value="">Pilih Status</option>
                  <option value="BELUM_KAWIN">Belum Kawin</option>
                  <option value="KAWIN">Kawin</option>
                  <option value="CERAI_HIDUP">Cerai Hidup</option>
                  <option value="CERAI_MATI">Cerai Mati</option>
                </select>
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
            <Button
              variant="outline"
              type="button"
              @click="router.push(`/admin/kepala-keluarga/${form.id}`)"
            >
              Batal
            </Button>

            <Button type="submit" variant="primary" :loading="submitting">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {{ submitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usersService } from '@/services/users'
import { dusunService } from '@/services/dusun'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import { isValidEmail, isValidNIK } from '@/utils/helpers'

const route = useRoute()
const router = useRouter()
const id = route.params.id

// State
const loading = ref(true)
const submitting = ref(false)
const submitError = ref('')
const showPassword = ref(false)
const today = ref(new Date().toISOString().split('T')[0])

// Wilayah data
const dusunList = ref([])
const rwList = ref([])
const rtList = ref([])

// Form state untuk data utama
const form = reactive({
  id: '',
  nik: '',
  nama_lengkap: '',
  username: '',
  email: '',
  password: '',
  jenis_kelamin: 'L',
  tempat_lahir: '',
  tanggal_lahir: '',
  agama: '',
  pekerjaan: '',
  status_perkawinan: '',
})

// Form state untuk alamat
const addressForm = reactive({
  alamat_lengkap: '',
  dusun_id: '',
  rw_id: '',
  rt_id: '',
  koordinat_lat: '',
  koordinat_lng: '',
})

// Error state
const errors = reactive({
  nik: '',
  nama_lengkap: '',
  username: '',
  email: '',
  password: '',
  tanggal_lahir: '',
})

const addressErrors = reactive({
  dusun_id: '',
})

// Watch for dusun change to load RW
const onDusunChange = async () => {
  addressForm.rw_id = ''
  addressForm.rt_id = ''
  rwList.value = []
  rtList.value = []

  if (addressForm.dusun_id) {
    await loadRwList(addressForm.dusun_id)
  }
}

// Watch for RW change to load RT
watch(
  () => addressForm.rw_id,
  async (newRwId) => {
    addressForm.rt_id = ''
    rtList.value = []

    if (newRwId) {
      await loadRtList(newRwId)
    }
  },
)

/* =========================
   LOAD WILAYAH DATA
========================= */
const loadDusunList = async () => {
  try {
    const response = await dusunService.getDusunList()
    if (response.success) {
      dusunList.value = response.data || []
    }
  } catch (err) {
    console.error('Error loading dusun:', err)
  }
}

const loadRwList = async (dusunId) => {
  try {
    const response = await dusunService.getRwList(dusunId)
    if (response.success) {
      rwList.value = response.data || []
    }
  } catch (err) {
    console.error('Error loading RW:', err)
  }
}

const loadRtList = async (rwId) => {
  try {
    const response = await dusunService.getRtList(rwId)
    if (response.success) {
      rtList.value = response.data || []
    }
  } catch (err) {
    console.error('Error loading RT:', err)
  }
}

/* =========================
   LOAD DATA DETAIL
========================= */
onMounted(async () => {
  try {
    loading.value = true
    await loadDusunList()

    const data = await usersService.getDetailKepalaKeluarga(id)

    // Map data utama
    form.id = data.id
    form.nik = data.nik || ''
    form.nama_lengkap = data.nama_lengkap || ''
    form.username = data.username || ''
    form.email = data.email || ''
    form.jenis_kelamin = data.jenis_kelamin || 'L'
    form.tempat_lahir = data.tempat_lahir || ''
    form.tanggal_lahir = data.tanggal_lahir ? data.tanggal_lahir.split('T')[0] : ''
    form.agama = data.agama || ''
    form.pekerjaan = data.pekerjaan || ''
    form.status_perkawinan = data.status_perkawinan || ''

    // Map data alamat
    addressForm.alamat_lengkap = data.alamat_lengkap || ''
    addressForm.dusun_id = data.dusun_id || ''
    addressForm.rw_id = data.rw_id || ''
    addressForm.rt_id = data.rt_id || ''
    addressForm.koordinat_lat = data.koordinat_lat || ''
    addressForm.koordinat_lng = data.koordinat_lng || ''

    // Load RW dan RT jika dusun sudah dipilih
    if (addressForm.dusun_id) {
      await loadRwList(addressForm.dusun_id)
      if (addressForm.rw_id) {
        await loadRtList(addressForm.rw_id)
      }
    }
  } catch (err) {
    console.error('Error loading data:', err)
    submitError.value = err.message || 'Gagal memuat data kepala keluarga'
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

  // Validate dusun
  if (!addressForm.dusun_id) {
    addressErrors.dusun_id = 'Dusun harus dipilih'
    isValid = false
  }

  return isValid
}

const clearErrors = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
  addressErrors.dusun_id = ''
  submitError.value = ''
}

/* =========================
   SUBMIT UPDATE
========================= */
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  submitting.value = true
  submitError.value = ''

  try {
    // 1. Update data utama
    const mainPayload = {
      nik: form.nik,
      nama_lengkap: form.nama_lengkap,
      username: form.username,
      email: form.email || undefined,
      password: form.password || undefined,
      role_id: 2,
      jenis_kelamin: form.jenis_kelamin,
      tempat_lahir: form.tempat_lahir || undefined,
      tanggal_lahir: form.tanggal_lahir || undefined,
      agama: form.agama || undefined,
      pekerjaan: form.pekerjaan || undefined,
      status_perkawinan: form.status_perkawinan || undefined,
    }

    const mainResponse = await usersService.updateKepalaKeluarga(id, mainPayload)

    if (!mainResponse.success) {
      throw new Error(mainResponse.message || 'Gagal memperbarui data utama')
    }

    // 2. Update alamat
    const addressPayload = {
      alamat_lengkap: addressForm.alamat_lengkap || undefined,
      dusun_id: parseInt(addressForm.dusun_id),
      rw_id: addressForm.rw_id ? parseInt(addressForm.rw_id) : null,
      rt_id: addressForm.rt_id ? parseInt(addressForm.rt_id) : null,
      koordinat_lat: addressForm.koordinat_lat || null,
      koordinat_lng: addressForm.koordinat_lng || null,
    }

    await usersService.updateAddress(id, addressPayload)

    alert('Data kepala keluarga berhasil diperbarui!')
    router.push(`/admin/kepala-keluarga/${form.id}`)
  } catch (err) {
    console.error('Error updating:', err)

    if (err.message?.includes('Network Error')) {
      submitError.value = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
    } else if (err.message?.includes('409')) {
      submitError.value = 'NIK atau username sudah terdaftar. Silakan gunakan data yang berbeda.'
    } else {
      submitError.value = err.message || 'Terjadi kesalahan saat menyimpan data'
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
