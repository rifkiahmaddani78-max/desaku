<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 mb-2">Detail Bansos</h1>
          <p class="text-sm text-gray-600">Informasi lengkap program bantuan sosial</p>
        </div>
        <div class="flex space-x-3">
          <router-link :to="`/admin/daftar-bansos/${bansos?.id}/edit`">
            <Button variant="primary">
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Bansos
            </Button>
          </router-link>
          <router-link to="/admin/daftar-bansos">
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
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
      ></div>
      <p class="mt-2 text-sm text-gray-500">Memuat detail bansos...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="!bansos" class="text-center py-12 bg-white rounded-lg border border-gray-200">
      <div class="mx-auto h-12 w-12 text-gray-400">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Data tidak ditemukan</h3>
      <p class="mt-1 text-sm text-gray-500">
        Bansos yang Anda cari tidak ditemukan atau telah dihapus
      </p>
      <div class="mt-6">
        <router-link to="/admin/daftar-bansos">
          <Button variant="primary"> Kembali ke Daftar Bansos </Button>
        </router-link>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column - Bansos Information -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Bansos Overview Card -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <!-- Header with Status -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-semibold text-gray-900">{{ bansos.nama_bansos }}</h2>
                <p class="text-sm text-gray-500 mt-1">Kode: {{ bansos.kode_bansos }}</p>
              </div>
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                :class="{
                  'bg-blue-100 text-blue-800': bansos.status === 'DRAFT',
                  'bg-green-100 text-green-800': bansos.status === 'AKTIF',
                  'bg-yellow-100 text-yellow-800': bansos.status === 'SELESAI',
                  'bg-red-100 text-red-800': bansos.status === 'DIBATALKAN',
                  'bg-gray-100 text-gray-800': !bansos.status,
                }"
              >
                {{ bansos.status || 'DRAFT' }}
              </span>
            </div>
          </div>

          <!-- Basic Information -->
          <div class="p-6">
            <!-- Description -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                Deskripsi
              </h3>
              <p class="text-gray-700 whitespace-pre-line">{{ bansos.deskripsi }}</p>
            </div>

            <!-- Grid of Details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Left Column -->
              <div class="space-y-4">
                <div>
                  <p class="text-sm font-medium text-gray-500">Jenis Bansos</p>
                  <div class="flex items-center">
                    <p class="text-gray-900 font-medium">{{ bansos.jenis_bansos }}</p>
                    <!-- Badge untuk bansos tunai -->
                    <span 
                      v-if="bansos.jenis_bansos === 'TUNAI'" 
                      class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      <svg class="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Nominal
                    </span>
                  </div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Kategori</p>
                  <p class="text-gray-900 font-medium">{{ bansos.kategori }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Penerima Manfaat</p>
                  <p class="text-gray-900 font-medium">{{ formatPenerimaManfaat(bansos.penerima_manfaat) }}</p>
                </div>
              </div>

              <!-- Right Column -->
              <div class="space-y-4">
                <div>
                  <p class="text-sm font-medium text-gray-500">Prioritas</p>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-orange-100 text-orange-800': bansos.prioritas === 'TINGGI',
                      'bg-yellow-100 text-yellow-800': bansos.prioritas === 'SEDANG',
                      'bg-green-100 text-green-800': bansos.prioritas === 'RENDAH',
                      'bg-red-100 text-red-800': bansos.prioritas === 'DARURAT',
                      'bg-gray-100 text-gray-800': !bansos.prioritas,
                    }"
                  >
                    {{ bansos.prioritas || 'Belum Ditentukan' }}
                  </span>
                </div>
                
                <!-- Tampilan Jumlah Nominal untuk bansos tunai -->
                <div v-if="bansos.jenis_bansos === 'TUNAI'">
                  <p class="text-sm font-medium text-gray-500">Jumlah Nominal</p>
                  <p class="text-gray-900 font-semibold text-lg">
                    {{ formatRupiah(bansos.jumlah_nominal) }}
                  </p>
                </div>
                
                <!-- Tampilan Satuan Barang untuk bansos non-tunai -->
                <div v-else>
                  <p class="text-sm font-medium text-gray-500">Satuan Barang</p>
                  <p class="text-gray-900 font-medium">{{ bansos.satuan_barang || 'Tidak ada' }}</p>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-gray-500">Dokumen Panduan</p>
                  <p class="text-gray-900 font-medium">
                    <span v-if="bansos.dokumen_panduan_url">
                      <a
                        :href="bansos.dokumen_panduan_url"
                        target="_blank"
                        class="text-primary-600 hover:text-primary-500 inline-flex items-center"
                      >
                        <svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Lihat Dokumen
                      </a>
                    </span>
                    <span v-else class="text-gray-500">Tidak ada dokumen</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Timeline Card -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Timeline Program</h3>
          </div>
          <div class="p-6">
            <div class="space-y-6">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div
                    class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center"
                  >
                    <svg
                      class="h-5 w-5 text-primary-600"
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
                  </div>
                </div>
                <div class="ml-4">
                  <h4 class="text-sm font-medium text-gray-900">Tanggal Mulai</h4>
                  <p class="mt-1 text-sm text-gray-600">{{ formatDate(bansos.tanggal_mulai) }}</p>
                  <p class="text-xs text-gray-500 mt-1">Program dimulai pada tanggal ini</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div
                    class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center"
                  >
                    <svg
                      class="h-5 w-5 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h4 class="text-sm font-medium text-gray-900">Tanggal Selesai</h4>
                  <p class="mt-1 text-sm text-gray-600">{{ formatDate(bansos.tanggal_selesai) }}</p>
                  <p class="text-xs text-gray-500 mt-1">Program berakhir pada tanggal ini</p>
                </div>
              </div>

              <div class="relative">
                <div class="absolute inset-0 flex items-center" aria-hidden="true">
                  <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center">
                  <span class="px-2 bg-white text-sm text-gray-500">
                    {{ calculateDaysRemaining() }} hari tersisa
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Stats & Actions -->
      <div class="space-y-6">
        <!-- Stats Card -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Statistik</h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <!-- Total Kuota -->
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-gray-700">Total Kuota</span>
                  <span class="text-sm font-semibold text-gray-900">{{ bansos.kuota }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    :style="{ width: '100%' }"
                  ></div>
                </div>
              </div>

              <!-- Pengajuan -->
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-gray-700">Total Pengajuan</span>
                  <span class="text-sm font-semibold text-gray-900">{{
                    bansos.total_pengajuan || 0
                  }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    :style="{ width: calculatePercentage(bansos.total_pengajuan) + '%' }"
                  ></div>
                </div>
              </div>

              <!-- Diterima -->
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-gray-700">Diterima</span>
                  <span class="text-sm font-semibold text-green-600">{{
                    bansos.total_diterima || 0
                  }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-green-500 h-2 rounded-full transition-all duration-300"
                    :style="{ width: calculatePercentage(bansos.total_diterima) + '%' }"
                  ></div>
                </div>
              </div>

              <!-- Ditolak -->
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-gray-700">Ditolak</span>
                  <span class="text-sm font-semibold text-red-600">{{
                    bansos.total_ditolak || 0
                  }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-red-500 h-2 rounded-full transition-all duration-300"
                    :style="{ width: calculatePercentage(bansos.total_ditolak) + '%' }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Summary Stats -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Kuota Wilayah</p>
                  <p class="text-lg font-semibold text-gray-900">
                    {{ bansos.total_kuota_wilayah || 0 }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Terpakai Wilayah</p>
                  <p class="text-lg font-semibold text-gray-900">
                    {{ bansos.total_terpakai_wilayah || 0 }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions Card -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Aksi Cepat</h3>
          </div>
          <div class="p-6">
            <div class="space-y-3">
              <Button
                variant="primary"
                fullWidth
                @click="router.push(`/admin/daftar-bansos/${bansos.id}/edit`)"
              >
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Bansos
              </Button>

              <Button variant="outline" fullWidth @click="viewPenerima">
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Lihat Penerima
              </Button>

              <Button variant="outline" fullWidth @click="router.push('/admin/daftar-bansos')">
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
            </div>
          </div>
        </div>

        <!-- Created Info -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Informasi Sistem</h3>
          </div>
          <div class="p-6">
            <div class="space-y-3">
              <div>
                <p class="text-sm font-medium text-gray-500">Dibuat Oleh</p>
                <p class="text-gray-900">{{ bansos.created_by_name || '-' }}</p>
                <p class="text-xs text-gray-500">{{ bansos.created_by_username || '' }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Dibuat Pada</p>
                <p class="text-gray-900">{{ formatDateTime(bansos.created_at) }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Terakhir Diperbarui</p>
                <p class="text-gray-900">{{ formatDateTime(bansos.updated_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Kuota Wilayah Section -->
    <div v-if="bansos?.kuota_wilayah?.length > 0" class="mt-6">
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">Distribusi Kuota Wilayah</h3>
            <span class="text-sm text-gray-500">
              Total: {{ bansos.total_kuota_wilayah || 0 }} dari {{ bansos.kuota }} kuota
            </span>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Wilayah
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Kuota
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Terpakai
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sisa
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Persentase
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="wilayah in bansos.kuota_wilayah" :key="wilayah.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ wilayah.nama_dusun }}</div>
                  <div v-if="wilayah.nomor_rw || wilayah.nomor_rt" class="text-xs text-gray-500">
                    {{ wilayah.nomor_rw ? 'RW ' + wilayah.nomor_rw : '' }}
                    {{ wilayah.nomor_rt ? '/ RT ' + wilayah.nomor_rt : '' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ wilayah.kuota }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ wilayah.terpakai }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span :class="wilayah.sisa_kuota > 0 ? 'text-green-600' : 'text-red-600'">
                    {{ wilayah.sisa_kuota }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-primary-600 h-2 rounded-full"
                        :style="{
                          width: Math.min((wilayah.terpakai / wilayah.kuota) * 100, 100) + '%',
                        }"
                      ></div>
                    </div>
                    <span class="ml-2 text-xs text-gray-500">
                      {{ Math.round((wilayah.terpakai / wilayah.kuota) * 100) }}%
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { bansosService } from '@/services/bansos'
import Button from '@/components/ui/Button.vue'
import { formatDate, formatDateTime } from '@/utils/helpers'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const bansos = ref(null)

onMounted(async () => {
  try {
    const id = route.params.id
    const response = await bansosService.getBansosById(id)

    bansos.value = response
  } catch (error) {
    console.error('Error fetching bansos:', error)
  } finally {
    loading.value = false
  }
})

const calculatePercentage = (value) => {
  if (!bansos.value?.kuota || bansos.value.kuota === 0) return 0
  return Math.min(Math.round((value / bansos.value.kuota) * 100), 100)
}

const calculateDaysRemaining = () => {
  if (!bansos.value?.tanggal_selesai) return 0

  const endDate = new Date(bansos.value.tanggal_selesai)
  const today = new Date()
  const timeDiff = endDate.getTime() - today.getTime()
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24))

  return daysRemaining > 0 ? daysRemaining : 0
}

const formatRupiah = (value) => {
  if (!value && value !== 0) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const formatPenerimaManfaat = (value) => {
  if (!value) return '-'
  
  const formatMap = {
    'KELUARGA_MISKIN': 'Keluarga Miskin',
    'LANSIA': 'Lansia',
    'DISABILITAS': 'Disabilitas',
    'ANAK_YATIM': 'Anak Yatim',
    'JANDA': 'Janda',
    'DUAFA': 'Duafa',
    'SEMUA_WARGA': 'Semua Warga'
  }
  
  return formatMap[value] || value
}

const viewPenerima = () => {
  // This will be implemented later
  alert('Fitur melihat penerima akan tersedia dalam pengembangan selanjutnya')
}
</script>

<style scoped>
.whitespace-pre-line {
  white-space: pre-line;
}

/* Smooth transitions for progress bars */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Table responsive */
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}
</style>