<template>
  <div>
    <!-- Header Section -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Anggota Keluarga</h1>
        <p class="mt-2 text-sm text-gray-600">Kelola data anggota keluarga yang terdaftar</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <router-link to="/anggota-keluarga/tambah">
          <button
            class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah Anggota
          </button>
        </router-link>
      </div>
    </div>

    <!-- Search & Filter Section -->
    <div class="mb-6">
      <div class="relative">
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
          type="search"
          v-model="searchQuery"
          placeholder="Cari berdasarkan nama atau NIK..."
          class="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
        />
      </div>
    </div>

    <!-- Stats Summary -->
    <div class="flex flex-wrap items-center gap-4 mb-6 text-sm">
      <div class="flex items-center px-3 py-1.5 bg-gray-50 rounded-full">
        <span class="font-medium text-gray-900">{{ anggotaList.length }}</span>
        <span class="ml-1.5 text-gray-500">Total</span>
      </div>
      <div class="flex items-center px-3 py-1.5 bg-green-50 rounded-full">
        <span class="font-medium text-green-700">{{ countByStatus('TINGGAL') }}</span>
        <span class="ml-1.5 text-gray-500">Tinggal</span>
      </div>
      <div class="flex items-center px-3 py-1.5 bg-yellow-50 rounded-full">
        <span class="font-medium text-yellow-700">{{ countByStatus('TIDAK_TINGGAL') }}</span>
        <span class="ml-1.5 text-gray-500">Tidak Tinggal</span>
      </div>
      <div class="flex items-center px-3 py-1.5 bg-purple-50 rounded-full">
        <span class="font-medium text-purple-700">{{ countByMaritalStatus('KAWIN') }}</span>
        <span class="ml-1.5 text-gray-500">Kawin</span>
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
      v-else-if="filteredAnggota.length === 0"
      class="text-center py-12 bg-white rounded-lg border border-gray-100"
    >
      <div class="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.76.554-1.645.897-2.59.897H17m-7 0a6 6 0 016-6v0a6 6 0 016 6v0"
          />
        </svg>
      </div>
      <h3 class="text-sm font-medium text-gray-900 mb-1">Tidak ada anggota keluarga</h3>
      <p class="text-sm text-gray-500 mb-4">
        {{
          searchQuery
            ? 'Tidak ditemukan dengan pencarian tersebut'
            : 'Mulai tambah anggota keluarga pertama'
        }}
      </p>
      <router-link
        to="/anggota-keluarga/tambah"
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
        Tambah Anggota
      </router-link>
    </div>

    <!-- List View -->
    <div v-else class="space-y-3">
      <div
        v-for="anggota in filteredAnggota"
        :key="anggota.id"
        class="bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors overflow-hidden"
      >
        <!-- Mobile Layout (≤640px) -->
        <div class="sm:hidden p-4">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center">
              <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                <span class="text-blue-600 font-semibold">{{
                  getInitials(anggota.nama_lengkap)
                }}</span>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">{{ anggota.nama_lengkap }}</h3>
                <p class="text-xs text-gray-500 mt-0.5">NIK: {{ anggota.nik }}</p>
              </div>
            </div>
            <div class="flex space-x-1">
              <button
                @click="router.push(`/anggota-keluarga/${anggota.id}/edit`)"
                class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                @click="confirmDelete(anggota)"
                class="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-xs text-gray-500 block">Jenis Kelamin</span>
              <span class="text-gray-900">{{
                anggota.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'
              }}</span>
            </div>
            <div>
              <span class="text-xs text-gray-500 block">Tanggal Lahir</span>
              <span class="text-gray-900">{{ formatDate(anggota.tanggal_lahir, 'short') }}</span>
            </div>
            <div>
              <span class="text-xs text-gray-500 block">Hubungan</span>
              <span class="inline-flex px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">
                {{ getHubunganLabel(anggota.hubungan) }}
              </span>
            </div>
            <div>
              <span class="text-xs text-gray-500 block">Status</span>
              <span
                :class="[
                  'inline-flex px-2 py-0.5 rounded-full text-xs',
                  anggota.status_tinggal === 'TINGGAL'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-yellow-50 text-yellow-700',
                ]"
              >
                {{ getStatusTinggalLabel(anggota.status_tinggal) }}
              </span>
            </div>
          </div>

          <div class="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-xs text-gray-500 block">Pendidikan</span>
              <span class="text-gray-900">{{ anggota.pendidikan_terakhir || '-' }}</span>
            </div>
            <div>
              <span class="text-xs text-gray-500 block">Pekerjaan</span>
              <span class="text-gray-900">{{ anggota.pekerjaan || '-' }}</span>
            </div>
          </div>
        </div>

        <!-- Desktop Layout (>640px) -->
        <div class="hidden sm:block">
          <div class="flex items-center px-6 py-4">
            <!-- Avatar & Nama -->
            <div class="flex items-center w-[30%]">
              <div
                class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3 flex-shrink-0"
              >
                <span class="text-blue-600 font-semibold text-sm">{{
                  getInitials(anggota.nama_lengkap)
                }}</span>
              </div>
              <div class="min-w-0">
                <div class="flex items-center">
                  <h3 class="font-medium text-gray-900 truncate">{{ anggota.nama_lengkap }}</h3>
                  <span
                    class="ml-2 inline-flex px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs whitespace-nowrap"
                  >
                    {{ getHubunganLabel(anggota.hubungan) }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 mt-0.5">NIK: {{ anggota.nik }}</p>
              </div>
            </div>

            <!-- Info Pribadi -->
            <div class="w-[20%]">
              <p class="text-sm text-gray-900">
                {{ anggota.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ formatDate(anggota.tanggal_lahir, 'short') }}
              </p>
            </div>

            <!-- Pendidikan & Pekerjaan -->
            <div class="w-[20%]">
              <p class="text-sm text-gray-900">{{ anggota.pendidikan_terakhir || '-' }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ anggota.pekerjaan || '-' }}</p>
            </div>

            <!-- Status -->
            <div class="w-[15%]">
              <span
                :class="[
                  'inline-flex px-2 py-1 rounded-full text-xs',
                  anggota.status_tinggal === 'TINGGAL'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-yellow-50 text-yellow-700',
                ]"
              >
                {{ getStatusTinggalLabel(anggota.status_tinggal) }}
              </span>
              <p v-if="anggota.status_perkawinan" class="text-xs text-gray-500 mt-1">
                {{ getStatusPerkawinanLabel(anggota.status_perkawinan) }}
              </p>
            </div>

            <!-- Actions -->
            <div class="w-[15%] flex justify-end space-x-2">
              <button
                @click="router.push(`/anggota-keluarga/${anggota.id}`)"
                class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
                title="Edit"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                @click="confirmDelete(anggota)"
                class="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                title="Hapus"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
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
import { anggotaKeluargaService } from '@/services/anggotaKeluarga'
import { getInitials, formatDate } from '@/utils/helpers'

const router = useRouter()

const anggotaList = ref([])
const loading = ref(true)
const searchQuery = ref('')

// Computed properties
const filteredAnggota = computed(() => {
  if (!searchQuery.value.trim()) {
    return anggotaList.value
  }

  const query = searchQuery.value.toLowerCase()
  return anggotaList.value.filter(
    (anggota) =>
      anggota.nama_lengkap.toLowerCase().includes(query) ||
      anggota.nik.toLowerCase().includes(query) ||
      (anggota.pekerjaan && anggota.pekerjaan.toLowerCase().includes(query)),
  )
})

const countByStatus = (status) => {
  return anggotaList.value.filter((anggota) => anggota.status_tinggal === status).length
}

const countByMaritalStatus = (status) => {
  return anggotaList.value.filter((anggota) => anggota.status_perkawinan === status).length
}

const getHubunganLabel = (hubungan) => {
  const hubunganLabels = {
    ISTRI: 'Istri',
    SUAMI: 'Suami',
    ANAK: 'Anak',
    MENANTU: 'Menantu',
    CUCU: 'Cucu',
    ORANG_TUA: 'Orang Tua',
    MERTUA: 'Mertua',
    FAMILI_LAIN: 'Famili Lain',
    LAINNYA: 'Lainnya',
  }
  return hubunganLabels[hubungan] || hubungan
}

const getStatusTinggalLabel = (status) => {
  return status === 'TINGGAL' ? 'Tinggal' : 'Tidak Tinggal'
}

const getStatusPerkawinanLabel = (status) => {
  const statusLabels = {
    BELUM_KAWIN: 'Belum Kawin',
    KAWIN: 'Kawin',
    CERAI_HIDUP: 'Cerai Hidup',
    CERAI_MATI: 'Cerai Mati',
  }
  return statusLabels[status] || status
}

onMounted(async () => {
  await fetchAnggotaKeluarga()
})

const fetchAnggotaKeluarga = async () => {
  try {
    loading.value = true
    anggotaList.value = await anggotaKeluargaService.getAnggotaKeluargaList()
  } catch (error) {
    console.error('Error fetching anggota keluarga:', error)
    anggotaList.value = []
    alert('Gagal memuat data anggota keluarga: ' + (error.message || 'Terjadi kesalahan'))
  } finally {
    loading.value = false
  }
}

const confirmDelete = async (anggota) => {
  if (!confirm(`Yakin ingin menghapus ${anggota.nama_lengkap}?`)) {
    return
  }

  try {
    const success = await anggotaKeluargaService.deleteAnggotaKeluarga(anggota.id)

    if (success) {
      anggotaList.value = anggotaList.value.filter((item) => item.id !== anggota.id)
      alert('Anggota keluarga berhasil dihapus')
    }
  } catch (error) {
    console.error('Error deleting anggota keluarga:', error)
    alert('Gagal menghapus: ' + (error.message || 'Terjadi kesalahan'))
  }
}
</script>
