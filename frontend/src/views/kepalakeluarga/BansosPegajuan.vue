<template>
  <div>
    <!-- Header Section -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Pengajuan Bansos Saya</h1>
        <p class="mt-2 text-sm text-gray-600">
          Daftar pengajuan bantuan sosial yang telah Anda ajukan
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center gap-3">
        <select
          v-model="filterStatus"
          class="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="all">Semua Status</option>
          <option value="MENUNGGU">Menunggu</option>
          <option value="DIPROSES">Diproses</option>
          <option value="DITERIMA">Diterima</option>
          <option value="DITOLAK">Ditolak</option>
        </select>
      </div>
    </div>

    <!-- Stats Summary -->
    <div class="flex flex-wrap items-center gap-3 mb-6">
      <div class="flex items-center px-3 py-1.5 bg-blue-50 rounded-full">
        <span class="text-sm font-medium text-blue-700">{{ pengajuanList.length }}</span>
        <span class="ml-1.5 text-xs text-gray-600">Total</span>
      </div>
      <div class="flex items-center px-3 py-1.5 bg-yellow-50 rounded-full">
        <span class="text-sm font-medium text-yellow-700">{{ statusCounts.MENUNGGU || 0 }}</span>
        <span class="ml-1.5 text-xs text-gray-600">Menunggu</span>
      </div>
      <div class="flex items-center px-3 py-1.5 bg-blue-100 rounded-full">
        <span class="text-sm font-medium text-blue-700">{{ statusCounts.DIPROSES || 0 }}</span>
        <span class="ml-1.5 text-xs text-gray-600">Diproses</span>
      </div>
      <div class="flex items-center px-3 py-1.5 bg-green-50 rounded-full">
        <span class="text-sm font-medium text-green-700">{{ statusCounts.DITERIMA || 0 }}</span>
        <span class="ml-1.5 text-xs text-gray-600">Diterima</span>
      </div>
      <div class="flex items-center px-3 py-1.5 bg-red-50 rounded-full">
        <span class="text-sm font-medium text-red-700">{{ statusCounts.DITOLAK || 0 }}</span>
        <span class="ml-1.5 text-xs text-gray-600">Ditolak</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="flex items-center space-x-2 text-gray-500">
        <div
          class="w-5 h-5 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin"
        ></div>
        <span class="text-sm">Memuat data pengajuan...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredPengajuan.length === 0"
      class="text-center py-12 bg-white rounded-lg border border-gray-100"
    >
      <div class="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 class="text-sm font-medium text-gray-900 mb-1">Belum ada pengajuan</h3>
      <p class="text-sm text-gray-500 mb-4">
        {{
          filterStatus !== 'all'
            ? 'Tidak ada pengajuan dengan status tersebut'
            : 'Anda belum pernah mengajukan bansos'
        }}
      </p>
      <router-link
        to="/daftar-bansos"
        class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Ajukan Bansos
      </router-link>
    </div>

    <!-- Pengajuan List -->
    <div v-else class="space-y-3">
      <div
        v-for="item in filteredPengajuan"
        :key="item.id"
        class="bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors overflow-hidden"
      >
        <!-- Mobile Layout (≤640px) -->
        <div class="sm:hidden p-4">
          <!-- Header -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center">
              <div
                :class="[
                  'w-12 h-12 rounded-lg flex items-center justify-center mr-3',
                  getJenisWarna(item.jenis_bansos),
                ]"
              >
                <span class="text-white font-semibold">{{ getInitials(item.nama_bansos) }}</span>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">{{ item.nama_bansos }}</h3>
                <p class="text-xs text-gray-500 mt-0.5">{{ item.kode_bansos }}</p>
              </div>
            </div>
            <span
              :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusClass(item.status)]"
            >
              {{ getStatusText(item.status) }}
            </span>
          </div>

          <!-- Alasan -->
          <p class="text-sm text-gray-600 mb-3">
            <span class="font-medium">Alasan:</span> {{ item.alasan_pengajuan }}
          </p>

          <!-- Info Grid -->
          <div class="grid grid-cols-2 gap-3 text-sm mb-3">
            <div>
              <span class="text-xs text-gray-400 block">Tanggal</span>
              <span class="text-gray-900">{{ formatDate(item.created_at, 'short') }}</span>
            </div>
            <div>
              <span class="text-xs text-gray-400 block">Jenis</span>
              <span class="text-gray-900">{{ item.jenis_bansos }}</span>
            </div>
            <div v-if="item.jenis_bansos === 'TUNAI'">
              <span class="text-xs text-gray-400 block">Nominal</span>
              <span class="text-green-600 font-medium">{{
                formatRupiah(item.jumlah_nominal)
              }}</span>
            </div>
            <div>
              <span class="text-xs text-gray-400 block">Kategori</span>
              <span class="text-gray-900">{{ item.kategori }}</span>
            </div>
          </div>

          <!-- Catatan Admin (if any) -->
          <div v-if="item.catatan_admin" class="mb-3 p-2 bg-blue-50 rounded-lg">
            <p class="text-xs text-blue-700">{{ item.catatan_admin }}</p>
          </div>

          <!-- Action -->
          <button
            @click="router.push(`/pengajuan-bansos-saya/${item.id}`)"
            class="w-full px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Lihat Detail
          </button>
        </div>

        <!-- Desktop Layout (>640px) -->
        <div class="hidden sm:block p-5">
          <div class="flex items-start gap-4">
            <!-- Avatar -->
            <div
              :class="[
                'w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center',
                getJenisWarna(item.jenis_bansos),
              ]"
            >
              <span class="text-white font-semibold">{{ getInitials(item.nama_bansos) }}</span>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <!-- Header -->
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <h3 class="font-medium text-gray-900">{{ item.nama_bansos }}</h3>
                  <span class="text-xs text-gray-500">{{ item.kode_bansos }}</span>
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-full text-xs font-medium',
                      getJenisClass(item.jenis_bansos),
                    ]"
                  >
                    {{ item.jenis_bansos }}
                  </span>
                </div>
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    getStatusClass(item.status),
                  ]"
                >
                  {{ getStatusText(item.status) }}
                </span>
              </div>

              <!-- Alasan -->
              <p class="text-sm text-gray-600 mb-3 line-clamp-2">
                <span class="font-medium">Alasan:</span> {{ item.alasan_pengajuan }}
              </p>

              <!-- Info Grid -->
              <div class="grid grid-cols-4 gap-4 mb-3">
                <div>
                  <p class="text-xs text-gray-400 mb-1">Tanggal</p>
                  <p class="text-sm text-gray-900">{{ formatDate(item.created_at, 'short') }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-400 mb-1">Kategori</p>
                  <p class="text-sm text-gray-900">{{ item.kategori }}</p>
                </div>
                <div v-if="item.jenis_bansos === 'TUNAI'">
                  <p class="text-xs text-gray-400 mb-1">Nominal</p>
                  <p class="text-sm text-green-600 font-medium">
                    {{ formatRupiah(item.jumlah_nominal) }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-400 mb-1">Status Bansos</p>
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-full text-xs font-medium',
                      item.bansos_status === 'AKTIF'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-yellow-50 text-yellow-700',
                    ]"
                  >
                    {{ item.bansos_status }}
                  </span>
                </div>
              </div>

              <!-- Catatan Admin (if any) -->
              <div v-if="item.catatan_admin" class="mb-3 p-2 bg-blue-50 rounded-lg">
                <p class="text-xs text-blue-700">{{ item.catatan_admin }}</p>
              </div>

              <!-- Tanggal Verifikasi (if any) -->
              <div
                v-if="item.tanggal_diterima || item.tanggal_ditolak"
                class="flex gap-3 text-xs text-gray-400"
              >
                <span v-if="item.tanggal_diterima"
                  >✓ Diterima: {{ formatDate(item.tanggal_diterima, 'short') }}</span
                >
                <span v-if="item.tanggal_ditolak"
                  >✗ Ditolak: {{ formatDate(item.tanggal_ditolak, 'short') }}</span
                >
              </div>
            </div>

            <!-- Action Button -->
            <button
              @click="router.push(`/pengajuan-bansos-saya/${item.id}`)"
              class="px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Detail
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { pengajuanService } from '@/services/pengajuan'
import { getInitials, formatDate, formatRupiah } from '@/utils/helpers'

const router = useRouter()

// State
const pengajuanList = ref([])
const loading = ref(true)
const filterStatus = ref('all')

// Computed stats
const statusCounts = computed(() => {
  const counts = {}
  pengajuanList.value.forEach((item) => {
    counts[item.status] = (counts[item.status] || 0) + 1
  })
  return counts
})

// Filtered pengajuan
const filteredPengajuan = computed(() => {
  if (filterStatus.value === 'all') {
    return pengajuanList.value
  }
  return pengajuanList.value.filter((item) => item.status === filterStatus.value)
})

// Helper functions
const getJenisWarna = (jenis) => {
  const colors = {
    TUNAI: 'bg-green-600',
    BARANG: 'bg-purple-600',
    JASA: 'bg-blue-600',
  }
  return colors[jenis] || 'bg-gray-600'
}

const getJenisClass = (jenis) => {
  const classes = {
    TUNAI: 'bg-green-50 text-green-700',
    BARANG: 'bg-purple-50 text-purple-700',
    JASA: 'bg-blue-50 text-blue-700',
  }
  return classes[jenis] || 'bg-gray-50 text-gray-700'
}

const getStatusClass = (status) => {
  const classes = {
    MENUNGGU: 'bg-yellow-50 text-yellow-700',
    DIPROSES: 'bg-blue-50 text-blue-700',
    DITERIMA: 'bg-green-50 text-green-700',
    DITOLAK: 'bg-red-50 text-red-700',
  }
  return classes[status] || 'bg-gray-50 text-gray-700'
}

const getStatusText = (status) => {
  const texts = {
    MENUNGGU: 'Menunggu',
    DIPROSES: 'Diproses',
    DITERIMA: 'Diterima',
    DITOLAK: 'Ditolak',
  }
  return texts[status] || status
}

const fetchPengajuan = async () => {
  loading.value = true
  try {
    const response = await pengajuanService.getMyPengajuan()
    pengajuanList.value = response.data || response || []
  } catch (err) {
    console.error('Error fetching pengajuan:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPengajuan()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
