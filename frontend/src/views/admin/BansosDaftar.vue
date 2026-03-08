<template>
  <div>
    <!-- Page Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6 sm:mb-8">
      <div>
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">Bantuan Sosial</h1>
        <p class="text-sm text-gray-600 mt-1">
          Kelola program bantuan sosial yang tersedia di Desa Ku
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <router-link to="/admin/daftar-bansos/tambah">
          <Button variant="primary" class="w-full sm:w-auto">
            <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah Bansos
          </Button>
        </router-link>
      </div>
    </div>

    <!-- Search & Filter Section -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
      <div class="relative flex-1 max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Cari nama atau kode bansos..."
          class="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow text-sm"
        />
      </div>

      <!-- Filter Status -->
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-500 whitespace-nowrap">Status:</span>
        <select
          v-model="filterStatus"
          class="block w-32 py-2.5 px-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        >
          <option value="all">Semua</option>
          <option value="AKTIF">Aktif</option>
          <option value="SELESAI">Selesai</option>
          <option value="DIBATALKAN">Dibatalkan</option>
        </select>
      </div>
    </div>

    <!-- Stats Cards -->
    <div
      v-if="!loading && bansosList.length > 0"
      class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
    >
      <!-- Total Bansos -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 border border-gray-100">
        <div class="flex items-center">
          <div class="p-2 sm:p-2.5 bg-blue-50 rounded-lg">
            <GiftIcon class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div class="ml-3 min-w-0">
            <p class="text-xs text-gray-500 truncate">Total Program</p>
            <p class="text-base sm:text-lg font-semibold text-gray-900">{{ bansosList.length }}</p>
          </div>
        </div>
      </div>

      <!-- Aktif -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 border border-gray-100">
        <div class="flex items-center">
          <div class="p-2 sm:p-2.5 bg-green-50 rounded-lg">
            <CheckBadgeIcon class="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          </div>
          <div class="ml-3 min-w-0">
            <p class="text-xs text-gray-500 truncate">Aktif</p>
            <p class="text-base sm:text-lg font-semibold text-gray-900">{{ activeCount }}</p>
          </div>
        </div>
      </div>

      <!-- Selesai -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 border border-gray-100">
        <div class="flex items-center">
          <div class="p-2 sm:p-2.5 bg-yellow-50 rounded-lg">
            <CheckCircleIcon class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
          </div>
          <div class="ml-3 min-w-0">
            <p class="text-xs text-gray-500 truncate">Selesai</p>
            <p class="text-base sm:text-lg font-semibold text-gray-900">{{ completedCount }}</p>
          </div>
        </div>
      </div>

      <!-- Dibatalkan -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 border border-gray-100">
        <div class="flex items-center">
          <div class="p-2 sm:p-2.5 bg-red-50 rounded-lg">
            <XCircleIcon class="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
          </div>
          <div class="ml-3 min-w-0">
            <p class="text-xs text-gray-500 truncate">Dibatalkan</p>
            <p class="text-base sm:text-lg font-semibold text-gray-900">{{ cancelledCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="flex items-center space-x-2 text-gray-500">
        <div
          class="w-5 h-5 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin"
        ></div>
        <span class="text-sm">Memuat data...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredBansos.length === 0"
      class="text-center py-12 bg-white rounded-xl border border-gray-200"
    >
      <div class="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <GiftIcon class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-sm font-medium text-gray-900 mb-1">Tidak ada program bansos</h3>
      <p class="text-sm text-gray-500 mb-4">
        {{
          searchQuery || filterStatus !== 'all'
            ? 'Tidak ditemukan dengan filter tersebut'
            : 'Mulai tambah program bansos pertama'
        }}
      </p>
      <router-link
        to="/admin/daftar-bansos/tambah"
        class="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Tambah Bansos
      </router-link>
    </div>

    <!-- Bansos Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <div
        v-for="item in filteredBansos"
        :key="item.id"
        class="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      >
        <!-- Header with Status -->
        <div class="p-4 sm:p-5 border-b border-gray-100">
          <div class="flex items-start justify-between">
            <div class="min-w-0 flex-1">
              <h3 class="text-sm sm:text-base font-semibold text-gray-900 truncate">
                {{ item.nama_bansos }}
              </h3>
              <p class="text-xs text-gray-500 mt-1">Kode: {{ item.kode_bansos }}</p>
            </div>
            <Badge
              :variant="getStatusVariant(item.status)"
              size="sm"
              class="ml-2 whitespace-nowrap"
            >
              {{ getStatusText(item.status) }}
            </Badge>
          </div>
          <p class="text-xs sm:text-sm text-gray-600 mt-3 line-clamp-2">
            {{ item.deskripsi || '-' }}
          </p>
        </div>

        <!-- Details -->
        <div class="p-4 sm:p-5 space-y-3 sm:space-y-4">
          <!-- Jenis & Kategori -->
          <div class="grid grid-cols-2 gap-2 sm:gap-3">
            <div class="bg-gray-50 p-2 sm:p-3 rounded-lg">
              <p class="text-xs text-gray-500">Jenis</p>
              <p class="text-xs sm:text-sm font-medium text-gray-900">
                {{ item.jenis_bansos || '-' }}
              </p>
            </div>
            <div class="bg-gray-50 p-2 sm:p-3 rounded-lg">
              <p class="text-xs text-gray-500">Kategori</p>
              <p class="text-xs sm:text-sm font-medium text-gray-900">{{ item.kategori || '-' }}</p>
            </div>
          </div>

          <!-- Nominal or Satuan -->
          <div
            v-if="item.jumlah_nominal || item.satuan_barang"
            class="grid grid-cols-2 gap-2 sm:gap-3"
          >
            <div v-if="item.jumlah_nominal" class="bg-gray-50 p-2 sm:p-3 rounded-lg">
              <p class="text-xs text-gray-500">Nominal</p>
              <p class="text-xs sm:text-sm font-medium text-green-600 truncate">
                {{ formatRupiah(item.jumlah_nominal) }}
              </p>
            </div>
            <div v-if="item.satuan_barang" class="bg-gray-50 p-2 sm:p-3 rounded-lg">
              <p class="text-xs text-gray-500">Satuan</p>
              <p class="text-xs sm:text-sm font-medium text-gray-900">{{ item.satuan_barang }}</p>
            </div>
          </div>

          <!-- Kuota Info -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-500">Kuota</span>
              <span class="font-medium text-gray-900">{{ formatNumber(item.kuota) }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-500">Terpakai</span>
              <span class="font-medium text-gray-900">{{ formatNumber(item.terpakai || 0) }}</span>
            </div>

            <!-- Progress Bar -->
            <div v-if="item.kuota && item.kuota > 0" class="pt-1">
              <div class="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{{ calculateProgress(item) }}%</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-1.5 sm:h-2">
                <div
                  class="bg-primary-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${calculateProgress(item)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border-t border-gray-100">
          <div class="flex space-x-2">
            <button
              @click="router.push(`/admin/daftar-bansos/${item.id}`)"
              class="flex-1 flex items-center justify-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Detail
            </button>

            <button
              @click="router.push(`/admin/daftar-bansos/${item.id}/edit`)"
              class="flex-1 flex items-center justify-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>

            <button
              @click="confirmDelete(item)"
              class="flex-1 flex items-center justify-center px-3 py-2 bg-white border border-red-300 rounded-lg text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="pagination && pagination.pages > 1"
      class="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      <div class="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
        Menampilkan {{ (pagination.page - 1) * pagination.limit + 1 }} -
        {{ Math.min(pagination.page * pagination.limit, pagination.total) }}
        dari {{ pagination.total }} program
      </div>
      <div class="flex items-center space-x-2 order-1 sm:order-2">
        <button
          @click="changePage(pagination.page - 1)"
          :disabled="pagination.page === 1"
          class="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Sebelumnya
        </button>
        <span class="text-xs sm:text-sm text-gray-700 px-2">Hlm {{ pagination.page }}</span>
        <button
          @click="changePage(pagination.page + 1)"
          :disabled="pagination.page === pagination.pages"
          class="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Berikutnya
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { bansosService } from '@/services/bansos'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import { formatNumber, formatRupiah } from '@/utils/helpers'
import { GiftIcon, CheckBadgeIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

const searchQuery = ref('')
const filterStatus = ref('all')
const bansosList = ref([])
const pagination = ref(null)
const loading = ref(true)

// Computed properties
const activeCount = computed(() => bansosList.value.filter((b) => b.status === 'AKTIF').length)
const completedCount = computed(() => bansosList.value.filter((b) => b.status === 'SELESAI').length)
const cancelledCount = computed(
  () => bansosList.value.filter((b) => b.status === 'DIBATALKAN').length,
)

const filteredBansos = computed(() => {
  let filtered = bansosList.value

  // Filter by search
  if (searchQuery.value) {
    const keyword = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (item) =>
        item.nama_bansos?.toLowerCase().includes(keyword) ||
        item.kode_bansos?.toLowerCase().includes(keyword),
    )
  }

  // Filter by status
  if (filterStatus.value !== 'all') {
    filtered = filtered.filter((item) => item.status === filterStatus.value)
  }

  return filtered
})

// Helper functions
const getStatusVariant = (status) => {
  const variants = {
    AKTIF: 'success',
    SELESAI: 'info',
    DIBATALKAN: 'danger',
    DRAFT: 'warning',
  }
  return variants[status] || 'gray'
}

const getStatusText = (status) => {
  const texts = {
    AKTIF: 'Aktif',
    SELESAI: 'Selesai',
    DIBATALKAN: 'Dibatalkan',
    DRAFT: 'Draft',
  }
  return texts[status] || status || '-'
}

const calculateProgress = (bansos) => {
  if (!bansos.kuota || bansos.kuota === 0) return 0
  const terpakai = bansos.terpakai || 0
  return Math.min(Math.round((terpakai / bansos.kuota) * 100), 100)
}

const fetchBansosList = async () => {
  try {
    loading.value = true
    const res = await bansosService.getBansosList()
    bansosList.value = res.list || []
    pagination.value = res.pagination || null
  } catch (err) {
    console.error('Error fetching bansos:', err)
    bansosList.value = []
  } finally {
    loading.value = false
  }
}

const confirmDelete = async (bansos) => {
  if (!confirm(`Yakin ingin menghapus ${bansos.nama_bansos}?`)) {
    return
  }

  try {
    await bansosService.deleteBansos(bansos.id)
    bansosList.value = bansosList.value.filter((b) => b.id !== bansos.id)
    alert('Bansos berhasil dihapus')
  } catch (err) {
    console.error('Error deleting bansos:', err)
    alert('Gagal menghapus bansos: ' + (err.message || 'Terjadi kesalahan'))
  }
}

const changePage = (page) => {
  if (page < 1 || page > pagination.value.pages) return
  // In a real app, fetch the new page from API
  console.log('Change to page:', page)
}

onMounted(fetchBansosList)
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions */
.hover\:shadow-md {
  transition: box-shadow 0.2s ease-in-out;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
