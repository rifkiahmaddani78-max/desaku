<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center space-x-3 mb-2">
            <router-link to="/daftar-bansos" class="text-gray-400 hover:text-gray-500">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </router-link>
            <h1 class="text-2xl font-semibold text-gray-900">Detail Bantuan Sosial</h1>
          </div>
          <p class="text-sm text-gray-600">Informasi lengkap dan pengajuan bantuan sosial</p>
        </div>

        <!-- Status Badge -->
        <div class="flex items-center space-x-2">
          <Badge :variant="bansos.status === 'AKTIF' ? 'success' : 'warning'">
            {{ bansos.status }}
          </Badge>
          <Badge :variant="getPrioritasVariant(bansos.prioritas)">
            Prioritas {{ bansos.prioritas }}
          </Badge>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
      ></div>
      <p class="mt-2 text-sm text-gray-500">Memuat detail bansos...</p>
    </div>

    <div v-else>
      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Main Info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Info Card -->
          <Card>
            <div class="p-6">
              <!-- Header with Avatar -->
              <div class="flex items-start space-x-4 mb-6">
                <div class="flex-shrink-0">
                  <div class="h-16 w-16 rounded-lg" :class="getJenisWarna(bansos.jenis_bansos)">
                    <div class="h-full w-full flex items-center justify-center">
                      <span class="text-white font-bold text-xl">
                        {{ getInitials(bansos.nama_bansos) }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex-1">
                  <h2 class="text-2xl font-bold text-gray-900 mb-1">{{ bansos.nama_bansos }}</h2>
                  <p class="text-sm text-gray-500">Kode: {{ bansos.kode_bansos }}</p>
                  <p class="mt-2 text-gray-600">{{ bansos.deskripsi }}</p>
                </div>
              </div>

              <!-- Info Grid -->
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div class="bg-gray-50 p-3 rounded-lg">
                  <p class="text-xs text-gray-500 mb-1">Jenis</p>
                  <p class="text-sm font-medium text-gray-900">{{ bansos.jenis_bansos }}</p>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg">
                  <p class="text-xs text-gray-500 mb-1">Kategori</p>
                  <p class="text-sm font-medium text-gray-900">{{ bansos.kategori }}</p>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg">
                  <p class="text-xs text-gray-500 mb-1">Penerima Manfaat</p>
                  <p class="text-sm font-medium text-gray-900">{{ bansos.penerima_manfaat }}</p>
                </div>

                <!-- Nominal untuk TUNAI -->
                <div v-if="bansos.jenis_bansos === 'TUNAI'" class="bg-gray-50 p-3 rounded-lg">
                  <p class="text-xs text-gray-500 mb-1">Nominal</p>
                  <p class="text-sm font-medium text-green-600">
                    {{ formatCurrency(bansos.jumlah_nominal) }}
                  </p>
                </div>

                <!-- Satuan untuk BARANG -->
                <div v-else class="bg-gray-50 p-3 rounded-lg">
                  <p class="text-xs text-gray-500 mb-1">Satuan</p>
                  <p class="text-sm font-medium text-gray-900">{{ bansos.satuan_barang || '-' }}</p>
                </div>

                <div class="bg-gray-50 p-3 rounded-lg">
                  <p class="text-xs text-gray-500 mb-1">Total Kuota</p>
                  <p class="text-sm font-medium text-gray-900">{{ bansos.kuota }} orang</p>
                </div>

                <div class="bg-gray-50 p-3 rounded-lg">
                  <p class="text-xs text-gray-500 mb-1">Dibuat Oleh</p>
                  <p class="text-sm font-medium text-gray-900">{{ bansos.created_by_name }}</p>
                </div>
              </div>

              <!-- Periode -->
              <div class="mt-4 p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center">
                  <svg
                    class="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span class="text-sm text-gray-700">
                    <span class="font-medium">Periode:</span>
                    {{ formatDate(bansos.tanggal_mulai) }} -
                    {{ formatDate(bansos.tanggal_selesai) }}
                  </span>
                </div>
              </div>

              <!-- Dokumen Panduan -->
              <div v-if="bansos.dokumen_panduan_url" class="mt-4">
                <a
                  :href="bansos.dokumen_panduan_url"
                  target="_blank"
                  class="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                >
                  <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download Dokumen Panduan
                </a>
              </div>
            </div>
          </Card>

          <!-- Kuota per Wilayah -->
          <Card title="Kuota Per Wilayah">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Dusun
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      RW/RT
                    </th>
                    <th
                      class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Kuota
                    </th>
                    <th
                      class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Terpakai
                    </th>
                    <th
                      class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Sisa
                    </th>
                    <th
                      class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="w in bansos.kuota_wilayah" :key="w.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ w.nama_dusun }}</div>
                      <div class="text-xs text-gray-500">{{ w.kode_dusun }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ w.nomor_rw ? `RW ${w.nomor_rw}` : '-' }}
                      {{ w.nomor_rt ? `/ RT ${w.nomor_rt}` : '' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {{ w.kuota }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {{ w.terpakai }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                      <span :class="w.sisa_kuota > 0 ? 'text-green-600' : 'text-red-600'">
                        {{ w.sisa_kuota }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-1 h-2 bg-gray-200 rounded-full">
                          <div
                            class="h-2 rounded-full"
                            :class="w.terpakai / w.kuota > 0.8 ? 'bg-red-500' : 'bg-green-500'"
                            :style="{ width: `${(w.terpakai / w.kuota) * 100}%` }"
                          ></div>
                        </div>
                        <span class="ml-2 text-xs text-gray-500">
                          {{ Math.round((w.terpakai / w.kuota) * 100) }}%
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50 font-medium">
                  <tr>
                    <td colspan="2" class="px-6 py-4 text-sm text-gray-900">Total</td>
                    <td class="px-6 py-4 text-sm text-gray-900 text-right">
                      {{ bansos.total_kuota_wilayah }}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900 text-right">
                      {{ bansos.total_terpakai_wilayah }}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900 text-right">
                      {{ bansos.total_kuota_wilayah - bansos.total_terpakai_wilayah }}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>

        <!-- Right Column - Stats & Actions -->
        <div class="space-y-6">
          <!-- Stats Card -->
          <Card title="Statistik Pengajuan">
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-gray-50 p-3 rounded-lg text-center">
                  <p class="text-2xl font-bold text-gray-900">{{ bansos.total_pengajuan || 0 }}</p>
                  <p class="text-xs text-gray-500">Total Pengajuan</p>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg text-center">
                  <p class="text-2xl font-bold text-green-600">{{ bansos.total_diterima || 0 }}</p>
                  <p class="text-xs text-gray-500">Diterima</p>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg text-center">
                  <p class="text-2xl font-bold text-yellow-600">
                    {{
                      bansos.total_pengajuan - (bansos.total_diterima + bansos.total_ditolak) || 0
                    }}
                  </p>
                  <p class="text-xs text-gray-500">Menunggu</p>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg text-center">
                  <p class="text-2xl font-bold text-red-600">{{ bansos.total_ditolak || 0 }}</p>
                  <p class="text-xs text-gray-500">Ditolak</p>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="pt-4 border-t border-gray-200">
                <div class="flex items-center justify-between text-sm mb-1">
                  <span class="text-gray-600">Kuota Terisi</span>
                  <span class="font-semibold text-gray-900">
                    {{ Math.round((bansos.total_terpakai_wilayah / bansos.kuota) * 100) || 0 }}%
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-primary-600 h-2.5 rounded-full transition-all duration-500"
                    :style="{
                      width: `${(bansos.total_terpakai_wilayah / bansos.kuota) * 100 || 0}%`,
                    }"
                  ></div>
                </div>
                <div class="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>Terisi: {{ bansos.total_terpakai_wilayah || 0 }}</span>
                  <span>Sisa: {{ bansos.kuota - bansos.total_terpakai_wilayah || 0 }}</span>
                </div>
              </div>
            </div>
          </Card>

          <!-- Action Card (Hanya untuk KK) -->
          <Card v-if="isKK" title="Ajukan Bansos">
            <div class="space-y-4">
              <div class="bg-blue-50 p-3 rounded-lg">
                <div class="flex">
                  <svg
                    class="h-5 w-5 text-blue-400 mr-2 flex-shrink-0"
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
                    Pastikan Anda memenuhi kriteria penerima manfaat sebelum mengajukan bansos ini.
                  </p>
                </div>
              </div>

              <Button variant="primary" fullWidth @click="openModal" :disabled="hasApplied">
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {{ hasApplied ? 'Sudah Mengajukan' : 'Ajukan Bansos' }}
              </Button>

              <p v-if="hasApplied" class="text-xs text-green-600 text-center">
                ✓ Anda sudah mengajukan bansos ini. Silakan cek status di riwayat pengajuan.
              </p>
            </div>
          </Card>

          <!-- Info Card -->
          <Card title="Informasi Tambahan">
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Dibuat Pada</span>
                <span class="text-gray-900">{{ formatDateTime(bansos.created_at) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Diperbarui</span>
                <span class="text-gray-900">{{ formatDateTime(bansos.updated_at) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Pembuat</span>
                <span class="text-gray-900">{{ bansos.created_by_name }}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <!-- Daftar Pengajuan (Admin View) -->
      <div v-if="isAdmin" class="mt-6">
        <Card title="Daftar Pengajuan">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nama KK
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Alasan
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tanggal
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="p in pengajuanList" :key="p.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900">{{ p.kk_nama }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-500 line-clamp-2">{{ p.alasan_pengajuan }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <Badge :variant="getStatusVariant(p.status)">
                      {{ p.status }}
                    </Badge>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    {{ formatDateTime(p.created_at) }}
                  </td>
                  <td class="px-6 py-4">
                    <Button size="sm" variant="outline" @click="viewPengajuan(p.id)">
                      Detail
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>

    <!-- Modal Input Alasan -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
      >
        <!-- Overlay -->
        <div class="fixed inset-0 transition-opacity" @click="showModal = false">
          <div class="absolute inset-0 bg-gray-500 bg-opacity-75"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <!-- Modal Content -->
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10"
              >
                <svg
                  class="h-6 w-6 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Alasan Pengajuan Bansos</h3>

                <div class="mt-4">
                  <div class="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 class="text-sm font-medium text-gray-700 mb-2">{{ bansos.nama_bansos }}</h4>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span class="text-gray-500">Jenis:</span>
                        <span class="ml-1 text-gray-700">{{ bansos.jenis_bansos }}</span>
                      </div>
                      <div>
                        <span class="text-gray-500">Penerima:</span>
                        <span class="ml-1 text-gray-700">{{ bansos.penerima_manfaat }}</span>
                      </div>
                    </div>
                  </div>

                  <textarea
                    v-model="alasan"
                    rows="4"
                    class="input-field w-full"
                    placeholder="Contoh: Saya termasuk keluarga kurang mampu, memiliki tanggungan 3 anak, dan pekerjaan tidak tetap..."
                  ></textarea>

                  <!-- Karakter Counter -->
                  <div class="mt-2 text-right">
                    <span
                      class="text-xs"
                      :class="alasan.length >= 500 ? 'text-orange-500' : 'text-gray-400'"
                    >
                      {{ alasan.length }}/500 karakter
                    </span>
                  </div>

                  <!-- Tips -->
                  <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div class="flex">
                      <svg
                        class="h-5 w-5 text-blue-400 flex-shrink-0"
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
                      <p class="ml-3 text-xs text-blue-700">
                        <span class="font-medium">Tips:</span> Sertakan informasi tentang kondisi
                        ekonomi, jumlah tanggungan, dan alasan spesifik mengapa Anda membutuhkan
                        bansos ini.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button
              type="button"
              variant="primary"
              @click="submitPengajuan"
              :loading="submitting"
              :disabled="!alasan.trim() || alasan.length < 10"
            >
              {{ submitting ? 'Mengirim...' : 'Kirim Pengajuan' }}
            </Button>
            <Button type="button" variant="outline" @click="showModal = false" class="mr-3">
              Batal
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { bansosService } from '@/services/bansos'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import { getInitials, formatCurrency, formatDate, formatDateTime } from '@/utils/helpers'
import { pengajuanService } from '@/services/pengajuan'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const bansosId = route.params.id

// State
const bansos = ref({
  kuota_wilayah: [],
  total_pengajuan: 0,
  total_diterima: 0,
  total_ditolak: 0,
  total_kuota_wilayah: 0,
  total_terpakai_wilayah: 0,
})
const pengajuanList = ref([])
const loading = ref(true)
const showModal = ref(false)
const alasan = ref('')
const submitting = ref(false)

// Check user role
const user = computed(() => authStore.user)
const isKK = computed(() => user.value?.role_name === 'kepala_keluarga')
const isAdmin = computed(() => user.value?.role_name === 'admin')

// Check if user has already applied
const hasApplied = computed(() => {
  // Implement logic to check if current user has applied
  return pengajuanList.value.some((p) => p.kk_id === user.value?.id)
})

// Get warna berdasarkan jenis bansos
const getJenisWarna = (jenis) => {
  return jenis === 'TUNAI' ? 'bg-green-600' : 'bg-purple-600'
}

// Get variant untuk prioritas badge
const getPrioritasVariant = (prioritas) => {
  const variants = {
    TINGGI: 'danger',
    SEDANG: 'warning',
    RENDAH: 'info',
  }
  return variants[prioritas] || 'gray'
}

// Get variant untuk status badge
const getStatusVariant = (status) => {
  const variants = {
    MENUNGGU: 'warning',
    DISETUJUI: 'success',
    DITOLAK: 'danger',
    SELESAI: 'info',
  }
  return variants[status] || 'gray'
}

const fetchBansosDetail = async () => {
  loading.value = true
  try {
    const response = await bansosService.getBansosByIdKk(bansosId)

    if (response.success) {
      bansos.value = response.data
      pengajuanList.value = response.data.total_pengajuan_data || []

      // Calculate totals if not provided
      if (!bansos.value.total_kuota_wilayah) {
        bansos.value.total_kuota_wilayah =
          bansos.value.kuota_wilayah?.reduce((sum, w) => sum + w.kuota, 0) || 0
      }
      if (!bansos.value.total_terpakai_wilayah) {
        bansos.value.total_terpakai_wilayah =
          bansos.value.kuota_wilayah?.reduce((sum, w) => sum + w.terpakai, 0) || 0
      }
    }
  } catch (err) {
    console.error('Gagal memuat detail bansos:', err)
    alert('Gagal memuat detail bansos: ' + (err.message || 'Terjadi kesalahan'))
  } finally {
    loading.value = false
  }
}

const openModal = () => {
  alasan.value = ''
  showModal.value = true
}

const submitPengajuan = async () => {
  if (!alasan.value.trim()) {
    alert('Alasan pengajuan wajib diisi')
    return
  }

  if (alasan.value.length < 10) {
    alert('Alasan minimal 10 karakter')
    return
  }

  if (alasan.value.length > 500) {
    alert('Alasan maksimal 500 karakter')
    return
  }

  submitting.value = true
  try {
    await pengajuanService.createPengajuanBansos({
      bansos_id: bansosId,
      alasan_pengajuan: alasan.value.trim(),
    })

    alert('Pengajuan bansos berhasil dikirim!')
    showModal.value = false

    // Refresh data
    await fetchBansosDetail()
  } catch (err) {
    alert(err.message || 'Gagal mengajukan bansos')
  } finally {
    submitting.value = false
  }
}

const viewPengajuan = (pengajuanId) => {
  router.push(`/pengajuan/${pengajuanId}`)
}

onMounted(() => {
  fetchBansosDetail()
})
</script>

<style scoped>
.input-field {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors duration-200;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Modal animation */
.fixed {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
