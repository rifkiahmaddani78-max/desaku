<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900 mb-2">Daftar Bantuan Sosial</h1>
      <p class="text-sm text-gray-600">Kelola program bantuan sosial yang tersedia di Desa Ku</p>
    </div>

    <!-- Action Bar -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex-1 max-w-sm">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              class="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>
      </div>

      <div class="ml-4">
        <router-link to="/admin/daftar-bansos/tambah">
          <Button variant="primary" class="flex items-center">
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

    <!-- Stats Cards -->
    <div
      v-if="!loading && bansosList.length > 0"
      class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
    >
      <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg mr-3">
            <svg
              class="h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Bansos</p>
            <p class="text-xl font-semibold text-gray-900">{{ bansosList.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg mr-3">
            <svg
              class="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Aktif</p>
            <p class="text-xl font-semibold text-gray-900">{{ activeCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg mr-3">
            <svg
              class="h-6 w-6 text-yellow-600"
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
          <div>
            <p class="text-sm text-gray-500">Selesai</p>
            <p class="text-xl font-semibold text-gray-900">{{ ongoingCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg mr-3">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Di batalkan</p>
            <p class="text-xl font-semibold text-gray-900">{{ inactiveCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
      ></div>
      <p class="mt-2 text-sm text-gray-500">Memuat data bansos...</p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredBansos.length === 0"
      class="text-center py-12 bg-white rounded-lg border border-gray-200"
    >
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
      <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada bansos</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{
          searchQuery
            ? 'Tidak ditemukan bansos dengan pencarian tersebut'
            : 'Mulai tambah kepala keluarga pertama Anda'
        }}
      </p>
      <div class="mt-6">
        <router-link to="/admin/daftar-bansos/tambah">
          <Button variant="primary" class="flex items-center mx-auto">
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

    <!-- Bansos Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="item in filteredBansos"
        :key="item.id"
        class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
      >
        <!-- Header with Status -->
        <div class="p-5 border-b border-gray-200">
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 line-clamp-1">
                {{ item.nama_bansos }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">Kode: {{ item.kode_bansos }}</p>
            </div>

            <!-- Status Badge -->
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="{
                'bg-green-100 text-green-800': item.status === 'AKTIF',
                'bg-yellow-100 text-yellow-800': item.status === 'SELESAI',
                'bg-red-100 text-red-800': item.status === 'DIBATALKAN',
                'bg-blue-100 text-blue-800': item.status === 'DRAFT',
                'bg-gray-100 text-gray-800': !item.status,
              }"
            >
              {{ item.status || 'DRAFT' }}
            </span>
          </div>

          <p class="text-sm text-gray-600 line-clamp-2">
            {{ item.deskripsi }}
          </p>
        </div>

        <!-- Details -->
        <div class="p-5">
          <div class="space-y-3">
            <!-- Jenis & Kategori -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <p class="text-xs text-gray-500">Jenis</p>
                <p class="text-sm font-medium text-gray-900">{{ item.jenis_bansos }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Kategori</p>
                <p class="text-sm font-medium text-gray-900">{{ item.kategori }}</p>
              </div>
            </div>

            <!-- Nominal or Satuan -->
            <div v-if="item.jumlah_nominal || item.satuan_barang" class="grid grid-cols-2 gap-3">
              <div v-if="item.jumlah_nominal">
                <p class="text-xs text-gray-500">Nominal</p>
                <p class="text-sm font-medium text-gray-900">
                  Rp {{ Number(item.jumlah_nominal).toLocaleString('id-ID') }}
                </p>
              </div>
              <div v-if="item.satuan_barang">
                <p class="text-xs text-gray-500">Satuan</p>
                <p class="text-sm font-medium text-gray-900">{{ item.satuan_barang }}</p>
              </div>
            </div>

            <!-- Kuota & Sisa -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <p class="text-xs text-gray-500">Kuota</p>
                <p class="text-sm font-medium text-gray-900">{{ item.kuota }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Terpakai</p>
                <p class="text-sm font-medium text-gray-900">{{ item.terpakai || 0 }}</p>
              </div>
            </div>

            <!-- Progress Bar -->
            <div v-if="item.kuota && item.kuota > 0" class="pt-2">
              <div class="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{{ calculateProgress(item) }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${calculateProgress(item)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="px-5 py-4 bg-gray-50 border-t border-gray-200">
          <div class="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              class="flex-1"
              @click="router.push(`/admin/daftar-bansos/${item.id}`)"
            >
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
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
              Detail
            </Button>

            <Button variant="danger" size="sm" class="flex-1" @click="confirmDelete(item)">
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Hapus
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.pages > 1" class="mt-8 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Menampilkan
        <span class="font-medium">{{ (pagination.page - 1) * pagination.limit + 1 }}</span>
        sampai
        <span class="font-medium">{{
          Math.min(pagination.page * pagination.limit, pagination.total)
        }}</span>
        dari
        <span class="font-medium">{{ pagination.total }}</span> bansos
      </div>
      <div class="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.page === 1"
          @click="changePage(pagination.page - 1)"
        >
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.page === pagination.pages"
          @click="changePage(pagination.page + 1)"
        >
          Berikutnya
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { bansosService } from '@/services/bansos'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'

const router = useRouter()

const searchQuery = ref('')
const bansosList = ref([])
const pagination = ref(null)
const loading = ref(true)

// Computed properties
const activeCount = computed(() => {
  return bansosList.value.filter((b) => b.status === 'AKTIF').length
})

const ongoingCount = computed(() => {
  return bansosList.value.filter((b) => b.status === 'SELESAI').length
})

const inactiveCount = computed(() => {
  return bansosList.value.filter((b) => b.status === 'DIBATALKAN').length
})

onMounted(async () => {
  await fetchBansosList()
})

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

const filteredBansos = computed(() => {
  if (!searchQuery.value) {
    return bansosList.value
  }

  const keyword = searchQuery.value.toLowerCase()

  return bansosList.value.filter((item) => {
    return (
      item.nama_bansos?.toLowerCase().includes(keyword) ||
      item.kode_bansos?.toLowerCase().includes(keyword)
    )
  })
})

const calculateProgress = (bansos) => {
  if (!bansos.kuota || bansos.kuota === 0) return 0
  const terpakai = bansos.terpakai || 0
  return Math.min(Math.round((terpakai / bansos.kuota) * 100), 100)
}

const confirmDelete = async (bansos) => {
  if (!confirm(`Yakin ingin menghapus bansos "${bansos.nama_bansos}" (${bansos.kode_bansos})?`)) {
    return
  }

  try {
    await bansosService.deleteBansos(bansos.id)

    // Remove from local list
    bansosList.value = bansosList.value.filter((b) => b.id !== bansos.id)

    // Show success message
    alert('Bansos berhasil dihapus')
  } catch (err) {
    console.error('Error deleting bansos:', err)
    alert('Gagal menghapus bansos: ' + (err.message || 'Terjadi kesalahan'))
  }
}

const changePage = async (page) => {
  if (page < 1 || page > pagination.value.pages) {
    return
  }

  // In a real app, fetch the new page from API
  console.log('Change to page:', page)
  // For now, we'll just log it
}
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

/* Progress bar animation */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
