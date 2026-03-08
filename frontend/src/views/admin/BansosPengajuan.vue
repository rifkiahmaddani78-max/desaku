<template>
  <div>
    <!-- Page Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6 sm:mb-8">
      <div>
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">Pengajuan Bansos</h1>
        <p class="text-sm text-gray-600 mt-1">Kelola dan verifikasi pengajuan bantuan sosial</p>
      </div>
    </div>

    <!-- Filter & Search Section -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
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
          type="search"
          v-model="searchQuery"
          placeholder="Cari nama atau NIK..."
          class="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow text-sm"
        />
      </div>

      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-500 whitespace-nowrap">Status:</span>
        <select
          v-model="filterStatus"
          class="block w-32 py-2.5 px-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        >
          <option value="all">Semua</option>
          <option value="MENUNGGU">Menunggu</option>
          <option value="DIPROSES">Diproses</option>
          <option value="DITERIMA">Diterima</option>
          <option value="DITOLAK">Ditolak</option>
        </select>
      </div>
    </div>

    <!-- Stats Cards -->
    <div
      v-if="!loading && pengajuanList.length > 0"
      class="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8"
    >
      <!-- Total -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100">
        <div class="flex items-center">
          <div class="p-2 sm:p-2.5 bg-blue-50 rounded-lg">
            <DocumentTextIcon class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div class="ml-2 sm:ml-3 min-w-0">
            <p class="text-xs text-gray-500 truncate">Total</p>
            <p class="text-base sm:text-lg font-semibold text-gray-900">{{ totalPengajuan }}</p>
          </div>
        </div>
      </div>

      <!-- Menunggu -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100">
        <div class="flex items-center">
          <div class="p-2 sm:p-2.5 bg-yellow-50 rounded-lg">
            <ClockIcon class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
          </div>
          <div class="ml-2 sm:ml-3 min-w-0">
            <p class="text-xs text-gray-500 truncate">Menunggu</p>
            <p class="text-base sm:text-lg font-semibold text-gray-900">
              {{ statusCounts.MENUNGGU || 0 }}
            </p>
          </div>
        </div>
      </div>

      <!-- Diproses -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100">
        <div class="flex items-center">
          <div class="p-2 sm:p-2.5 bg-blue-50 rounded-lg">
            <ArrowPathIcon class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div class="ml-2 sm:ml-3 min-w-0">
            <p class="text-xs text-gray-500 truncate">Diproses</p>
            <p class="text-base sm:text-lg font-semibold text-gray-900">
              {{ statusCounts.DIPROSES || 0 }}
            </p>
          </div>
        </div>
      </div>

      <!-- Diterima -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100">
        <div class="flex items-center">
          <div class="p-2 sm:p-2.5 bg-green-50 rounded-lg">
            <CheckBadgeIcon class="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          </div>
          <div class="ml-2 sm:ml-3 min-w-0">
            <p class="text-xs text-gray-500 truncate">Diterima</p>
            <p class="text-base sm:text-lg font-semibold text-gray-900">
              {{ statusCounts.DITERIMA || 0 }}
            </p>
          </div>
        </div>
      </div>

      <!-- Ditolak -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100">
        <div class="flex items-center">
          <div class="p-2 sm:p-2.5 bg-red-50 rounded-lg">
            <XCircleIcon class="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
          </div>
          <div class="ml-2 sm:ml-3 min-w-0">
            <p class="text-xs text-gray-500 truncate">Ditolak</p>
            <p class="text-base sm:text-lg font-semibold text-gray-900">
              {{ statusCounts.DITOLAK || 0 }}
            </p>
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
      v-else-if="filteredPengajuan.length === 0"
      class="text-center py-12 bg-white rounded-xl border border-gray-200"
    >
      <div class="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <DocumentTextIcon class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-sm font-medium text-gray-900 mb-1">Tidak ada pengajuan</h3>
      <p class="text-sm text-gray-500 mb-4">
        {{
          searchQuery || filterStatus !== 'all'
            ? 'Tidak ditemukan dengan filter tersebut'
            : 'Belum ada pengajuan bansos'
        }}
      </p>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                No
              </th>
              <th
                scope="col"
                class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kepala Keluarga
              </th>
              <th
                scope="col"
                class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
              >
                Wilayah
              </th>
              <th
                scope="col"
                class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
              >
                Bansos
              </th>
              <th
                scope="col"
                class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell"
              >
                Tanggal
              </th>
              <th
                scope="col"
                class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                class="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(item, index) in filteredPengajuan"
              :key="item.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <!-- No -->
              <td
                class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500"
              >
                {{ (pagination.page - 1) * pagination.limit + index + 1 }}
              </td>

              <!-- Kepala Keluarga -->
              <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                    <div
                      class="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary-100 flex items-center justify-center"
                    >
                      <span class="text-primary-700 font-semibold text-xs sm:text-sm">
                        {{ getInitials(item.kk_nama) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-3">
                    <div class="text-xs sm:text-sm font-medium text-gray-900">
                      {{ item.kk_nama }}
                    </div>
                    <div class="text-xs text-gray-500">NIK: {{ item.kk_nik.slice(-4) }}</div>
                  </div>
                </div>
              </td>

              <!-- Wilayah -->
              <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden md:table-cell">
                <div class="text-xs sm:text-sm text-gray-900">{{ item.nama_dusun }}</div>
                <div class="text-xs text-gray-500">
                  RW {{ item.nomor_rw || '-' }} / RT {{ item.nomor_rt || '-' }}
                </div>
              </td>

              <!-- Bansos -->
              <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden lg:table-cell">
                <div class="text-xs sm:text-sm font-medium text-gray-900">
                  {{ item.nama_bansos }}
                </div>
                <div class="text-xs text-gray-500">{{ item.kode_bansos }}</div>
              </td>

              <!-- Tanggal -->
              <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden xl:table-cell">
                <div class="text-xs sm:text-sm text-gray-900">
                  {{ formatDate(item.created_at, 'short') }}
                </div>
                <div class="text-xs text-gray-500">{{ formatTime(item.created_at) }}</div>
              </td>

              <!-- Status -->
              <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                <Badge :variant="getStatusVariant(item.status)" size="sm">
                  {{ getStatusText(item.status) }}
                </Badge>
              </td>

              <!-- Actions -->
              <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center space-x-1 sm:space-x-2">
                  <!-- Detail Button -->
                  <button
                    @click="router.push(`/admin/pengajuan-bansos/${item.id}`)"
                    class="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    title="Detail"
                  >
                    <svg
                      class="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>

                  <!-- Edit Status Button (hanya untuk MENUNGGU/DIPROSES) -->
                  <button
                    v-if="item.status === 'MENUNGGU' || item.status === 'DIPROSES'"
                    @click="openModal(item)"
                    class="p-1.5 sm:p-2 text-primary-400 hover:text-primary-600 rounded-full hover:bg-primary-50 transition-colors"
                    title="Ubah Status"
                  >
                    <svg
                      class="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>

                  <!-- Check Icon untuk status selesai -->
                  <div
                    v-else
                    class="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-green-100 flex items-center justify-center"
                  >
                    <svg
                      class="w-4 h-4 sm:w-5 sm:h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="pagination && pagination.pages > 1"
        class="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50"
      >
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-xs sm:text-sm text-gray-700 order-2 sm:order-1">
            Menampilkan {{ (pagination.page - 1) * pagination.limit + 1 }} -
            {{ Math.min(pagination.page * pagination.limit, pagination.total) }}
            dari {{ pagination.total }} pengajuan
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
    </div>

    <!-- Modal Ubah Status -->
    <Transition name="modal">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="showModal = false"
      >
        <div class="flex items-center justify-center min-h-screen px-4 py-4">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <div
            class="relative bg-white rounded-xl max-w-md w-full mx-auto shadow-xl transform transition-all"
          >
            <div class="p-5 sm:p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div
                    class="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary-100 flex items-center justify-center"
                  >
                    <svg
                      class="h-4 w-4 sm:h-5 sm:w-5 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                  <h3 class="text-base sm:text-lg font-medium text-gray-900">
                    Ubah Status Pengajuan
                  </h3>
                </div>
                <button @click="showModal = false" class="text-gray-400 hover:text-gray-500">
                  <svg
                    class="h-5 w-5 sm:h-6 sm:w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <!-- Info Ringkas -->
              <div class="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <p class="text-xs text-gray-500">Nama KK</p>
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {{ selectedItem?.kk_nama }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Bansos</p>
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {{ selectedItem?.nama_bansos }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Form -->
              <div class="space-y-4">
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Status Baru <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.status"
                    class="block w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  >
                    <option value="DIPROSES">Diproses</option>
                    <option value="DITERIMA">Diterima</option>
                    <option value="DITOLAK">Ditolak</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Keterangan (opsional)
                  </label>
                  <textarea
                    v-model="form.keterangan"
                    rows="2"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    placeholder="Tambahkan keterangan..."
                  ></textarea>
                </div>

                <div>
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Catatan Admin (opsional)
                  </label>
                  <textarea
                    v-model="form.catatan_admin"
                    rows="2"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    placeholder="Catatan internal..."
                  ></textarea>
                </div>

                <!-- Info Status -->
                <div
                  v-if="form.status === 'DITERIMA'"
                  class="p-3 bg-green-50 rounded-lg flex items-start space-x-2"
                >
                  <CheckCircleIcon class="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p class="text-xs sm:text-sm text-green-700">
                    Pastikan semua dokumen lengkap sebelum menerima pengajuan.
                  </p>
                </div>

                <div
                  v-if="form.status === 'DITOLAK'"
                  class="p-3 bg-red-50 rounded-lg flex items-start space-x-2"
                >
                  <ExclamationCircleIcon class="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p class="text-xs sm:text-sm text-red-700">
                    Berikan alasan penolakan yang jelas pada keterangan.
                  </p>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div
              class="border-t px-5 sm:px-6 py-3 sm:py-4 bg-gray-50 rounded-b-xl flex justify-end space-x-2"
            >
              <Button type="button" variant="outline" size="sm" @click="showModal = false">
                Batal
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                @click="updateStatus"
                :loading="submitting"
              >
                {{ submitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { pengajuanService } from '@/services/pengajuan'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import { getInitials, formatDate, formatTime } from '@/utils/helpers'
import {
  DocumentTextIcon,
  ClockIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  XCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

// State
const pengajuanList = ref([])
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  pages: 1,
})
const loading = ref(true)
const submitting = ref(false)
const searchQuery = ref('')
const filterStatus = ref('all')

// Modal state
const showModal = ref(false)
const selectedItem = ref(null)
const form = ref({
  status: 'DIPROSES',
  keterangan: '',
  catatan_admin: '',
})

// Computed stats
const statusCounts = computed(() => {
  const counts = { MENUNGGU: 0, DIPROSES: 0, DITERIMA: 0, DITOLAK: 0 }
  pengajuanList.value.forEach((item) => {
    if (counts[item.status] !== undefined) {
      counts[item.status]++
    }
  })
  return counts
})

const totalPengajuan = computed(() => pengajuanList.value.length)

// Filtered pengajuan
const filteredPengajuan = computed(() => {
  let filtered = pengajuanList.value
  if (filterStatus.value !== 'all') {
    filtered = filtered.filter((item) => item.status === filterStatus.value)
  }
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (item) =>
        item.kk_nama.toLowerCase().includes(query) ||
        item.kk_nik.includes(query) ||
        item.nama_bansos.toLowerCase().includes(query),
    )
  }
  return filtered
})

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

// Methods
const fetchData = async (page = 1) => {
  loading.value = true
  try {
    const res = await pengajuanService.getAllPengajuan({ page, limit: 10 })
    if (res.success) {
      pengajuanList.value = res.data.data || []
      pagination.value = res.data.pagination || {
        page: 1,
        limit: 10,
        total: pengajuanList.value.length,
        pages: 1,
      }
    }
  } catch (err) {
    console.error('Error fetching pengajuan:', err)
  } finally {
    loading.value = false
  }
}

const openModal = (item) => {
  selectedItem.value = item
  form.value = {
    status: item.status === 'MENUNGGU' ? 'DIPROSES' : item.status,
    keterangan: item.keterangan || '',
    catatan_admin: item.catatan_admin || '',
  }
  showModal.value = true
}

const updateStatus = async () => {
  if (!selectedItem.value) return
  submitting.value = true
  try {
    await pengajuanService.updateStatus(selectedItem.value.id, {
      status: form.value.status,
      keterangan: form.value.keterangan,
      catatan_admin: form.value.catatan_admin,
    })
    showModal.value = false
    await fetchData(pagination.value.page)
  } catch (err) {
    console.error('Error updating status:', err)
    alert('Gagal memperbarui status: ' + (err.message || 'Terjadi kesalahan'))
  } finally {
    submitting.value = false
  }
}

const changePage = (page) => {
  if (page < 1 || page > pagination.value.pages) return
  fetchData(page)
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
