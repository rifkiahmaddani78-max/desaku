<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900 mb-2">Daftar Kepala Keluarga</h1>
      <p class="text-sm text-gray-600">
        Kelola data kepala keluarga yang terdaftar di sistem Desa Ku
      </p>
    </div>

    <!-- Add Button -->
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
            @keyup.enter="handleSearch"
          />
        </div>
      </div>

      <div class="ml-4">
        <router-link to="/admin/kepala-keluarga/tambah-kepala-keluarga">
          <Button variant="primary" class="flex items-center">
            <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah Kepala Keluarga
          </Button>
        </router-link>
      </div>
    </div>

    <!-- Stats Cards -->
    <div
      v-if="!loading && kepalaKeluargaList.length > 0"
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
            <p class="text-sm text-gray-500">Total Kepala Keluarga</p>
            <p class="text-xl font-semibold text-gray-900">{{ kepalaKeluargaList.length }}</p>
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Terverifikasi</p>
            <p class="text-xl font-semibold text-gray-900">{{ verifiedCount }}</p>
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Belum Terverifikasi</p>
            <p class="text-xl font-semibold text-gray-900">{{ unverifiedCount }}</p>
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Anggota Keluarga</p>
            <p class="text-xl font-semibold text-gray-900">{{ totalAnggotaKeluarga }}</p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
      ></div>
      <p class="mt-2 text-sm text-gray-500">Memuat data kepala keluarga...</p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredKepalaKeluarga.length === 0"
      class="text-center py-12 bg-white rounded-lg border border-gray-200"
    >
      <div class="mx-auto h-12 w-12 text-gray-400">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada kepala keluarga</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{
          searchQuery
            ? 'Tidak ditemukan kepala keluarga dengan pencarian tersebut'
            : 'Mulai tambah kepala keluarga pertama Anda'
        }}
      </p>
      <div class="mt-6">
        <router-link to="/admin/kepala-keluarga/tambah-kepala-keluarga">
          <Button variant="primary">
            <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah Kepala Keluarga
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
            Nama & NIK
          </div>
          <div class="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Kontak
          </div>
          <div class="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Pekerjaan
          </div>
          <div class="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Status
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
          v-for="kk in filteredKepalaKeluarga"
          :key="kk.id"
          class="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
        >
          <div class="grid grid-cols-12 gap-4 items-center">
            <!-- Nama & NIK -->
            <div class="col-span-4">
              <div class="flex items-center">
                <div
                  class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-3"
                >
                  <span class="text-primary-700 font-semibold text-sm">
                    {{ getInitials(kk.nama_lengkap) }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ kk.nama_lengkap }}</p>
                  <p class="text-xs text-gray-500">NIK: {{ kk.nik }}</p>
                  <p class="text-xs text-gray-400 mt-1">
                    {{ formatDate(kk.tanggal_lahir) }} •
                    {{ kk.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Kontak -->
            <div class="col-span-2">
              <div class="space-y-1">
                <p v-if="kk.email" class="text-sm text-gray-900 truncate" :title="kk.email">
                  {{ kk.email }}
                </p>
                <p v-else class="text-sm text-gray-400 italic">-</p>
                <p v-if="kk.telepon" class="text-xs text-gray-500">{{ kk.telepon }}</p>
                <p v-else class="text-xs text-gray-400 italic">-</p>
              </div>
            </div>

            <!-- Pekerjaan -->
            <div class="col-span-2">
              <p v-if="kk.pekerjaan" class="text-sm text-gray-900">{{ kk.pekerjaan }}</p>
              <p v-else class="text-sm text-gray-400 italic">-</p>
              <p v-if="kk.agama" class="text-xs text-gray-500">{{ kk.agama }}</p>
            </div>

            <!-- Status -->
            <div class="col-span-2">
              <div class="flex flex-col space-y-2">
                <Badge :variant="kk.is_verified ? 'success' : 'warning'" size="sm">
                  {{ kk.is_verified ? 'Terverifikasi' : 'Belum Terverifikasi' }}
                </Badge>
                <span class="text-xs text-gray-500">
                  {{ kk.jumlah_anggota_keluarga || 0 }} anggota
                </span>
              </div>
            </div>

            <!-- Aksi -->
            <div class="col-span-2">
              <div class="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  @click="router.push(`/admin/kepala-keluarga/${kk.id}`)"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                </Button>

                <Button variant="danger" size="sm" @click="confirmDelete(kk)">
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import { usersService } from '@/services/users'
import { getInitials, formatDate } from '@/utils/helpers'

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

    // Data sudah difilter oleh service, langsung assign
    kepalaKeluargaList.value = data || []

    console.log('Data kepala keluarga:', kepalaKeluargaList.value)
  } catch (error) {
    console.error('Error fetching kepala keluarga:', error)

    // Show user-friendly error
    if (error.message?.includes('Network Error')) {
      alert('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.')
    } else {
      alert('Gagal memuat data kepala keluarga: ' + (error.message || 'Terjadi kesalahan'))
    }

    // Set empty array on error
    kepalaKeluargaList.value = []
  } finally {
    loading.value = false
  }
}

const confirmDelete = async (kk) => {
  if (!confirm(`Yakin ingin menghapus kepala keluarga "${kk.nama_lengkap}" (${kk.nik})?`)) {
    return
  }

  try {
    const success = await usersService.deleteKepalaKeluarga(kk.id)

    if (success) {
      // Remove from local list
      kepalaKeluargaList.value = kepalaKeluargaList.value.filter((item) => item.id !== kk.id)

      // Show success message
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
  // Search is handled by computed property, this is just for enter key
  console.log('Searching for:', searchQuery.value)
}

// For future pagination implementation
const changePage = (page) => {
  console.log('Change to page:', page)
  // Implement pagination here
}
</script>

<style scoped>
/* Custom styles for table */
@media (max-width: 768px) {
  .grid-cols-12 {
    grid-template-columns: repeat(1, 1fr);
  }

  .col-span-4,
  .col-span-2 {
    grid-column: span 1;
  }
}
</style>
