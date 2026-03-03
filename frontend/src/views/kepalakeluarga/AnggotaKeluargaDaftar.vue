<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 mb-2">Daftar Anggota Keluarga</h1>
          <p class="text-sm text-gray-600">
            Kelola data anggota keluarga yang terdaftar di sistem Desa Ku
          </p>
        </div>
        <router-link to="/anggota-keluarga/tambah">
          <Button variant="primary" class="flex items-center">
            <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah Anggota
          </Button>
        </router-link>
      </div>
    </div>

    <!-- Stats Cards -->
    <div
      v-if="!loading && anggotaList.length > 0"
      class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
    >
      <Card class="p-4">
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Anggota</p>
            <p class="text-xl font-semibold text-gray-900">{{ anggotaList.length }}</p>
          </div>
        </div>
      </Card>

      <Card class="p-4">
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.76.554-1.645.897-2.59.897H17m-7 0a6 6 0 016-6v0a6 6 0 016 6v0"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Tinggal</p>
            <p class="text-xl font-semibold text-gray-900">{{ countByStatus('TINGGAL') }}</p>
          </div>
        </div>
      </Card>

      <Card class="p-4">
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Tidak Tinggal</p>
            <p class="text-xl font-semibold text-gray-900">{{ countByStatus('TIDAK_TINGGAL') }}</p>
          </div>
        </div>
      </Card>

      <Card class="p-4">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg mr-3">
            <svg
              class="h-6 w-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Status Kawin</p>
            <p class="text-xl font-semibold text-gray-900">{{ countByMaritalStatus('KAWIN') }}</p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Search Bar -->
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
            type="search"
            v-model="searchQuery"
            placeholder="Cari nama atau NIK..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
      ></div>
      <p class="mt-2 text-sm text-gray-500">Memuat data anggota keluarga...</p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredAnggota.length === 0"
      class="text-center py-12 bg-white rounded-lg border border-gray-200"
    >
      <div class="mx-auto h-12 w-12 text-gray-400">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.76.554-1.645.897-2.59.897H17m-7 0a6 6 0 016-6v0a6 6 0 016 6v0"
          />
        </svg>
      </div>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada anggota keluarga</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{
          searchQuery
            ? 'Tidak ditemukan anggota keluarga dengan pencarian tersebut'
            : 'Mulai tambah anggota keluarga pertama Anda'
        }}
      </p>
      <div class="mt-6">
        <router-link to="/anggota-keluarga/tambah">
          <Button variant="primary">
            <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah Anggota
          </Button>
        </router-link>
      </div>
    </div>

    <!-- Data Table -->
    <div v-else class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <!-- Table Header -->
      <div class="px-6 py-3 border-b border-gray-200 bg-gray-50">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Nama & Hubungan
          </div>
          <div class="col-span-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Info Pribadi
          </div>
          <div class="col-span-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Pendidikan & Pekerjaan
          </div>
          <div
            class="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right"
          >
            Aksi
          </div>
        </div>
      </div>

      <!-- Table Body -->
      <div class="divide-y divide-gray-200">
        <div
          v-for="anggota in filteredAnggota"
          :key="anggota.id"
          class="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
        >
          <div class="grid grid-cols-12 gap-4 items-center">
            <!-- Nama & Hubungan -->
            <div class="col-span-4">
              <div class="flex items-center">
                <div
                  class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3"
                >
                  <span class="text-blue-700 font-semibold text-sm">
                    {{ getInitials(anggota.nama_lengkap) }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ anggota.nama_lengkap }}</p>
                  <p class="text-xs text-gray-500">NIK: {{ anggota.nik }}</p>
                  <div class="mt-1 flex items-center">
                    <span
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {{ getHubunganLabel(anggota.hubungan) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Info Pribadi -->
            <div class="col-span-3">
              <div class="space-y-1">
                <p class="text-sm text-gray-900">
                  {{ anggota.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ formatDate(anggota.tanggal_lahir) }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ anggota.agama || '-' }}
                </p>
              </div>
            </div>

            <!-- Pendidikan & Pekerjaan -->
            <div class="col-span-3">
              <div class="space-y-2">
                <div>
                  <p class="text-sm text-gray-900">{{ anggota.pendidikan_terakhir || '-' }}</p>
                  <p class="text-xs text-gray-500">Pendidikan</p>
                </div>
                <div>
                  <p class="text-sm text-gray-900">{{ anggota.pekerjaan || '-' }}</p>
                  <p class="text-xs text-gray-500">Pekerjaan</p>
                </div>
              </div>
            </div>

            <!-- Status & Aksi -->
            <div class="col-span-2">
              <div class="flex flex-col space-y-3">
                <!-- Status Tinggal -->
                <span
                  :class="[
                    'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                    anggota.status_tinggal === 'TINGGAL'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800',
                  ]"
                >
                  {{ getStatusTinggalLabel(anggota.status_tinggal) }}
                </span>

                <!-- Status Perkawinan -->
                <span
                  v-if="anggota.status_perkawinan"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                >
                  {{ getStatusPerkawinanLabel(anggota.status_perkawinan) }}
                </span>

                <!-- Action Buttons -->
                <div class="flex justify-end space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    @click="router.push(`/anggota-keluarga/${anggota.id}`)"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </Button>

                  <Button variant="danger" size="sm" @click="confirmDelete(anggota)">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
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
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
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
  if (
    !confirm(`Yakin ingin menghapus anggota keluarga "${anggota.nama_lengkap}" (${anggota.nik})?`)
  ) {
    return
  }

  try {
    const success = await anggotaKeluargaService.deleteAnggotaKeluarga(anggota.id)

    if (success) {
      // Remove from local list
      anggotaList.value = anggotaList.value.filter((item) => item.id !== anggota.id)

      // Show success message
      alert('Anggota keluarga berhasil dihapus')
    }
  } catch (error) {
    console.error('Error deleting anggota keluarga:', error)
    alert('Gagal menghapus anggota keluarga: ' + (error.message || 'Terjadi kesalahan'))
  }
}
</script>

<style scoped>
/* Custom styles for table */
@media (max-width: 768px) {
  .grid-cols-12 {
    grid-template-columns: repeat(1, 1fr);
  }

  .col-span-4,
  .col-span-3,
  .col-span-2 {
    grid-column: span 1;
  }
}
</style>
