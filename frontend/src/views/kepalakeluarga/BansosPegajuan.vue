<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 mb-2">Pengajuan Bansos Saya</h1>
          <p class="text-sm text-gray-600">
            Daftar pengajuan bantuan sosial yang telah Anda ajukan
          </p>
        </div>

        <!-- Filter Status -->
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-600">Filter:</span>
          <select v-model="filterStatus" class="input-field w-32">
            <option value="all">Semua</option>
            <option value="MENUNGGU">Menunggu</option>
            <option value="DIPROSES">Diproses</option>
            <option value="DITERIMA">Diterima</option>
            <option value="DITOLAK">Ditolak</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Pengajuan</p>
            <p class="text-xl font-semibold text-gray-900">{{ pengajuanList.length }}</p>
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
            <p class="text-sm text-gray-500">Menunggu</p>
            <p class="text-xl font-semibold text-gray-900">{{ statusCounts.MENUNGGU || 0 }}</p>
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
            <p class="text-sm text-gray-500">Diterima</p>
            <p class="text-xl font-semibold text-gray-900">{{ statusCounts.DITERIMA || 0 }}</p>
          </div>
        </div>
      </Card>

      <Card class="p-4">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg mr-3">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Ditolak</p>
            <p class="text-xl font-semibold text-gray-900">{{ statusCounts.DITOLAK || 0 }}</p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
      ></div>
      <p class="mt-2 text-sm text-gray-500">Memuat data pengajuan...</p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredPengajuan.length === 0"
      class="text-center py-12 bg-white rounded-lg border border-gray-200"
    >
      <div class="mx-auto h-12 w-12 text-gray-400">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada pengajuan</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{
          filterStatus !== 'all'
            ? 'Tidak ada pengajuan dengan status tersebut'
            : 'Anda belum pernah mengajukan bansos'
        }}
      </p>
      <div class="mt-6">
        <Button variant="primary" @click="router.push('/daftar-bansos')">
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Ajukan Bansos
        </Button>
      </div>
    </div>

    <!-- Pengajuan List -->
    <div v-else class="space-y-4">
      <Card
        v-for="item in filteredPengajuan"
        :key="item.id"
        class="overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <div class="p-6">
          <div class="flex items-start justify-between">
            <!-- Left Content -->
            <div class="flex-1">
              <div class="flex items-start space-x-4">
                <!-- Avatar -->
                <div class="flex-shrink-0">
                  <div class="h-12 w-12 rounded-lg" :class="getJenisWarna(item.jenis_bansos)">
                    <div class="h-full w-full flex items-center justify-center">
                      <span class="text-white font-bold text-lg">
                        {{ getInitials(item.nama_bansos) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Info -->
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-1">
                    <h3 class="text-lg font-semibold text-gray-900">{{ item.nama_bansos }}</h3>
                    <Badge :variant="getJenisVariant(item.jenis_bansos)" size="sm">
                      {{ item.jenis_bansos }}
                    </Badge>
                  </div>

                  <p class="text-xs text-gray-500 mb-2">Kode: {{ item.kode_bansos }}</p>

                  <p class="text-sm text-gray-600 mb-3 line-clamp-2">
                    <span class="font-medium">Alasan:</span> {{ item.alasan_pengajuan }}
                  </p>

                  <!-- Detail Grid -->
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    <div class="bg-gray-50 p-2 rounded">
                      <p class="text-xs text-gray-500">Tanggal</p>
                      <p class="text-sm font-medium">{{ formatDate(item.created_at) }}</p>
                    </div>

                    <div v-if="item.jenis_bansos === 'TUNAI'" class="bg-gray-50 p-2 rounded">
                      <p class="text-xs text-gray-500">Nominal</p>
                      <p class="text-sm font-medium text-green-600">
                        {{ formatCurrency(item.jumlah_nominal) }}
                      </p>
                    </div>

                    <div v-else class="bg-gray-50 p-2 rounded">
                      <p class="text-xs text-gray-500">Satuan</p>
                      <p class="text-sm font-medium">{{ item.satuan_barang || '-' }}</p>
                    </div>

                    <div class="bg-gray-50 p-2 rounded">
                      <p class="text-xs text-gray-500">Kategori</p>
                      <p class="text-sm font-medium">{{ item.kategori }}</p>
                    </div>

                    <div class="bg-gray-50 p-2 rounded">
                      <p class="text-xs text-gray-500">Status Bansos</p>
                      <Badge
                        :variant="item.bansos_status === 'AKTIF' ? 'success' : 'warning'"
                        size="sm"
                      >
                        {{ item.bansos_status }}
                      </Badge>
                    </div>
                  </div>

                  <!-- Keterangan & Catatan Admin -->
                  <div v-if="item.keterangan || item.catatan_admin" class="mt-3 space-y-2">
                    <div v-if="item.keterangan" class="text-xs text-gray-600">
                      <span class="font-medium">Keterangan:</span> {{ item.keterangan }}
                    </div>
                    <div
                      v-if="item.catatan_admin"
                      class="text-xs bg-blue-50 text-blue-700 p-2 rounded"
                    >
                      <span class="font-medium">Catatan Admin:</span> {{ item.catatan_admin }}
                    </div>
                  </div>

                  <!-- Tanggal Verifikasi -->
                  <div
                    v-if="item.tanggal_diterima || item.tanggal_ditolak"
                    class="mt-2 text-xs text-gray-500"
                  >
                    <span v-if="item.tanggal_diterima">
                      Diterima: {{ formatDateTime(item.tanggal_diterima) }}
                    </span>
                    <span v-if="item.tanggal_ditolak">
                      Ditolak: {{ formatDateTime(item.tanggal_ditolak) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Content - Status & Actions -->
            <div class="ml-6 flex flex-col items-end space-y-3">
              <!-- Status Badge -->
              <Badge :variant="getStatusVariant(item.status)" size="md">
                {{ getStatusText(item.status) }}
              </Badge>

              <!-- Action Buttons -->
              <div class="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  @click="router.push(`/pengajuan-bansos-saya/${item.id}`)"
                >
                  <svg class="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { pengajuanService } from '@/services/pengajuan'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import { getInitials, formatCurrency, formatDate, formatDateTime } from '@/utils/helpers'

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

// Get warna berdasarkan jenis bansos
const getJenisWarna = (jenis) => {
  const colors = {
    TUNAI: 'bg-green-600',
    BARANG: 'bg-purple-600',
    JASA: 'bg-blue-600',
  }
  return colors[jenis] || 'bg-primary-600'
}

// Get variant untuk jenis bansos badge
const getJenisVariant = (jenis) => {
  const variants = {
    TUNAI: 'success',
    BARANG: 'info',
    JASA: 'warning',
  }
  return variants[jenis] || 'gray'
}

// Status helpers
const getStatusVariant = (status) => {
  const variants = {
    MENUNGGU: 'warning',
    DIPROSES: 'info',
    DITERIMA: 'success',
    DITOLAK: 'danger',
  }
  return variants[status] || 'gray'
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

    pengajuanList.value = response || []
  } catch (err) {
    console.error('Error fetching pengajuan:', err)
    alert('Gagal memuat data pengajuan: ' + (err.message || 'Terjadi kesalahan'))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPengajuan()
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
</style>
