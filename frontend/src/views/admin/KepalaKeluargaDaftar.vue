<template>
  <div>
    <!-- Page Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6 sm:mb-8">
      <div>
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">Kepala Keluarga</h1>
        <p class="text-sm text-gray-600 mt-1">
          Kelola data kepala keluarga yang terdaftar di sistem
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <router-link to="/admin/kepala-keluarga/tambah-kepala-keluarga">
          <Button variant="primary" class="w-full sm:w-auto">
            <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Tambah KK
          </Button>
        </router-link>
      </div>
    </div>

    <!-- Search & Filter Section -->
    <div class="mb-6">
      <div class="relative max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="search"
          v-model="searchQuery"
          placeholder="Cari nama atau NIK..."
          class="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow text-sm"
        />
      </div>
    </div>

    <!-- Stats Cards -->
    <div v-if="!loading && kepalaKeluargaList.length > 0" 
         class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      <!-- Total KK -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 border border-gray-100">
        <div class="flex items-center">
          <div class="p-2 sm:p-2.5 bg-blue-50 rounded-lg">
            <UsersIcon class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div class="ml-3 min-w-0">
            <p class="text-xs text-gray-500 truncate">Total KK</p>
            <p class="text-base sm:text-lg font-semibold text-gray-900">{{ kepalaKeluargaList.length }}</p>
          </div>
        </div>
      </div>

      <!-- Terverifikasi -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 border border-gray-100">
        <div class="flex items-center">
          <div class="p-2 sm:p-2.5 bg-green-50 rounded-lg">
            <CheckBadgeIcon class="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          </div>
          <div class="ml-3 min-w-0">
            <p class="text-xs text-gray-500 truncate">Terverifikasi</p>
            <p class="text-base sm:text-lg font-semibold text-gray-900">{{ verifiedCount }}</p>
          </div>
        </div>
      </div>

      <!-- Belum Verifikasi -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 border border-gray-100">
        <div class="flex items-center">
          <div class="p-2 sm:p-2.5 bg-yellow-50 rounded-lg">
            <ClockIcon class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
          </div>
          <div class="ml-3 min-w-0">
            <p class="text-xs text-gray-500 truncate">Belum Verif</p>
            <p class="text-base sm:text-lg font-semibold text-gray-900">{{ unverifiedCount }}</p>
          </div>
        </div>
      </div>

      <!-- Total Anggota -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 border border-gray-100">
        <div class="flex items-center">
          <div class="p-2 sm:p-2.5 bg-purple-50 rounded-lg">
            <UserGroupIcon class="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
          </div>
          <div class="ml-3 min-w-0">
            <p class="text-xs text-gray-500 truncate">Total Anggota</p>
            <p class="text-base sm:text-lg font-semibold text-gray-900">{{ totalAnggotaKeluarga }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="flex items-center space-x-2 text-gray-500">
        <div class="w-5 h-5 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin"></div>
        <span class="text-sm">Memuat data...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredKepalaKeluarga.length === 0" 
         class="text-center py-12 bg-white rounded-xl border border-gray-200">
      <div class="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <UsersIcon class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-sm font-medium text-gray-900 mb-1">Tidak ada kepala keluarga</h3>
      <p class="text-sm text-gray-500 mb-4">
        {{ searchQuery ? 'Tidak ditemukan dengan pencarian tersebut' : 'Mulai tambah kepala keluarga pertama' }}
      </p>
      <router-link to="/admin/kepala-keluarga/tambah-kepala-keluarga" 
                   class="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Tambah KK
      </router-link>
    </div>

    <!-- List View -->
    <div v-else class="space-y-3">
      <div v-for="kk in filteredKepalaKeluarga" :key="kk.id"
           class="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors overflow-hidden">
        
        <!-- Mobile Layout (≤640px) -->
        <div class="sm:hidden p-4">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center mr-3">
                <span class="text-primary-600 font-semibold text-sm">{{ getInitials(kk.nama_lengkap) }}</span>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">{{ kk.nama_lengkap }}</h3>
                <p class="text-xs text-gray-500 mt-0.5">NIK: {{ kk.nik }}</p>
              </div>
            </div>
            <Badge :variant="kk.is_verified ? 'success' : 'warning'" size="sm">
              {{ kk.is_verified ? 'Terverifikasi' : 'Belum Verif' }}
            </Badge>
          </div>

          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-xs text-gray-500 block">Kontak</span>
              <span class="text-gray-900 text-xs">{{ kk.email || '-' }}</span>
              <span class="text-gray-500 text-xs block">{{ kk.telepon || '-' }}</span>
            </div>
            <div>
              <span class="text-xs text-gray-500 block">Pekerjaan</span>
              <span class="text-gray-900 text-xs">{{ kk.pekerjaan || '-' }}</span>
            </div>
            <div>
              <span class="text-xs text-gray-500 block">Jenis Kelamin</span>
              <span class="text-gray-900 text-xs">{{ kk.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}</span>
            </div>
            <div>
              <span class="text-xs text-gray-500 block">Anggota</span>
              <span class="text-gray-900 text-xs">{{ kk.jumlah_anggota_keluarga || 0 }} orang</span>
            </div>
          </div>

          <div class="mt-3 pt-3 border-t border-gray-100 flex justify-end space-x-2">
            <button @click="router.push(`/admin/kepala-keluarga/${kk.id}`)"
                    class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button @click="confirmDelete(kk)"
                    class="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Desktop Layout (>640px) -->
        <div class="hidden sm:block">
          <div class="flex items-center px-6 py-4">
            <!-- Avatar & Nama -->
            <div class="flex items-center w-[35%]">
              <div class="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center mr-3 flex-shrink-0">
                <span class="text-primary-600 font-semibold text-sm">{{ getInitials(kk.nama_lengkap) }}</span>
              </div>
              <div class="min-w-0">
                <div class="flex items-center">
                  <h3 class="font-medium text-gray-900 truncate">{{ kk.nama_lengkap }}</h3>
                  <span class="ml-2 text-xs text-gray-500">({{ kk.jenis_kelamin === 'L' ? 'L' : 'P' }})</span>
                </div>
                <p class="text-xs text-gray-500 mt-0.5 truncate">NIK: {{ kk.nik }}</p>
              </div>
            </div>

            <!-- Kontak -->
            <div class="w-[20%] px-2">
              <p class="text-sm text-gray-900 truncate" :title="kk.email">{{ kk.email || '-' }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ kk.telepon || '-' }}</p>
            </div>

            <!-- Pekerjaan & Agama -->
            <div class="w-[15%] px-2">
              <p class="text-sm text-gray-900 truncate">{{ kk.pekerjaan || '-' }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ kk.agama || '-' }}</p>
            </div>

            <!-- Status -->
            <div class="w-[15%] px-2">
              <Badge :variant="kk.is_verified ? 'success' : 'warning'" size="sm" class="mb-2">
                {{ kk.is_verified ? 'Terverifikasi' : 'Belum Verif' }}
              </Badge>
              <p class="text-xs text-gray-500">{{ kk.jumlah_anggota_keluarga || 0 }} anggota</p>
            </div>

            <!-- Actions -->
            <div class="w-[15%] flex justify-end space-x-2">
              <button @click="router.push(`/admin/kepala-keluarga/${kk.id}`)"
                      class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
                      title="Detail">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button @click="router.push(`/admin/kepala-keluarga/${kk.id}/edit`)"
                      class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
                      title="Edit">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button @click="confirmDelete(kk)"
                      class="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                      title="Hapus">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import { usersService } from '@/services/users'
import { getInitials, formatDate } from '@/utils/helpers'
import {
  UsersIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

const kepalaKeluargaList = ref([])
const loading = ref(true)
const searchQuery = ref('')

// Computed properties
const filteredKepalaKeluarga = computed(() => {
  if (!searchQuery.value.trim()) {
    return kepalaKeluargaList.value
  }

  const query = searchQuery.value.toLowerCase()
  return kepalaKeluargaList.value.filter(
    (kk) =>
      kk.nama_lengkap.toLowerCase().includes(query) ||
      kk.nik.toLowerCase().includes(query) ||
      (kk.email && kk.email.toLowerCase().includes(query)) ||
      (kk.pekerjaan && kk.pekerjaan.toLowerCase().includes(query)),
  )
})

const verifiedCount = computed(() => {
  return kepalaKeluargaList.value.filter((kk) => kk.is_verified === 1).length
})

const unverifiedCount = computed(() => {
  return kepalaKeluargaList.value.filter((kk) => kk.is_verified === 0).length
})

const totalAnggotaKeluarga = computed(() => {
  return kepalaKeluargaList.value.reduce(
    (total, kk) => total + (kk.jumlah_anggota_keluarga || 0),
    0,
  )
})

onMounted(async () => {
  await fetchKepalaKeluarga()
})

const fetchKepalaKeluarga = async () => {
  try {
    loading.value = true
    const data = await usersService.getKepalaKeluargaList()
    kepalaKeluargaList.value = data || []
  } catch (error) {
    console.error('Error fetching kepala keluarga:', error)
    if (error.message?.includes('Network Error')) {
      alert('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.')
    } else {
      alert('Gagal memuat data kepala keluarga: ' + (error.message || 'Terjadi kesalahan'))
    }
    kepalaKeluargaList.value = []
  } finally {
    loading.value = false
  }
}

const confirmDelete = async (kk) => {
  if (!confirm(`Yakin ingin menghapus ${kk.nama_lengkap}?`)) {
    return
  }

  try {
    const success = await usersService.deleteKepalaKeluarga(kk.id)
    if (success) {
      kepalaKeluargaList.value = kepalaKeluargaList.value.filter((item) => item.id !== kk.id)
      alert('Kepala keluarga berhasil dihapus')
    }
  } catch (error) {
    console.error('Error deleting kepala keluarga:', error)
    if (error.message?.includes('Network Error')) {
      alert('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.')
    } else {
      alert('Gagal menghapus kepala keluarga: ' + (error.message || 'Terjadi kesalahan'))
    }
  }
}

const handleSearch = () => {
  // Search is handled by computed property
  console.log('Searching for:', searchQuery.value)
}
</script>