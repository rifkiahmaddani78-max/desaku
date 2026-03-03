<template>
  <div class="max-w-full overflow-hidden">
    <!-- Page Header -->
    <div class="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-gray-900 mb-2">Daftar Pengajuan Bansos</h1>
        <p class="text-sm text-gray-600">Kelola dan verifikasi pengajuan bansos</p>
      </div>

      <!-- Filter & Search - Compact -->
      <div class="flex flex-col xs:flex-row gap-2">
        <select v-model="filterStatus" class="input-field text-sm py-1.5 px-2 min-w-[120px]">
          <option value="all">Semua</option>
          <option value="MENUNGGU">Menunggu</option>
          <option value="DIPROSES">Diproses</option>
          <option value="DITERIMA">Diterima</option>
          <option value="DITOLAK">Ditolak</option>
        </select>

        <div class="relative">
          <input
            type="search"
            v-model="searchQuery"
            placeholder="Cari nama/NIK..."
            class="input-field text-sm py-1.5 pl-8 pr-2 w-full xs:w-48"
          />
          <svg
            class="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
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
      </div>
    </div>

    <!-- Stats Cards - Compact Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
      <Card class="p-2 sm:p-3">
        <div class="flex items-center gap-2">
          <div class="p-1.5 bg-blue-100 rounded-lg">
            <svg
              class="h-4 w-4 text-blue-600"
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
          <div class="min-w-0">
            <p class="text-xs text-gray-500 truncate">Total</p>
            <p class="text-base font-semibold text-gray-900">{{ totalPengajuan }}</p>
          </div>
        </div>
      </Card>

      <Card class="p-2 sm:p-3">
        <div class="flex items-center gap-2">
          <div class="p-1.5 bg-yellow-100 rounded-lg">
            <svg
              class="h-4 w-4 text-yellow-600"
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
            <p class="text-xs text-gray-500">Menunggu</p>
            <p class="text-base font-semibold text-gray-900">{{ statusCounts.MENUNGGU || 0 }}</p>
          </div>
        </div>
      </Card>

      <Card class="p-2 sm:p-3">
        <div class="flex items-center gap-2">
          <div class="p-1.5 bg-blue-100 rounded-lg">
            <svg
              class="h-4 w-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <p class="text-xs text-gray-500">Diproses</p>
            <p class="text-base font-semibold text-gray-900">{{ statusCounts.DIPROSES || 0 }}</p>
          </div>
        </div>
      </Card>

      <Card class="p-2 sm:p-3">
        <div class="flex items-center gap-2">
          <div class="p-1.5 bg-green-100 rounded-lg">
            <svg
              class="h-4 w-4 text-green-600"
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
            <p class="text-xs text-gray-500">Diterima</p>
            <p class="text-base font-semibold text-gray-900">{{ statusCounts.DITERIMA || 0 }}</p>
          </div>
        </div>
      </Card>

      <Card class="p-2 sm:p-3">
        <div class="flex items-center gap-2">
          <div class="p-1.5 bg-red-100 rounded-lg">
            <svg class="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p class="text-xs text-gray-500">Ditolak</p>
            <p class="text-base font-semibold text-gray-900">{{ statusCounts.DITOLAK || 0 }}</p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div
        class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"
      ></div>
      <p class="mt-2 text-xs text-gray-500">Memuat data...</p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredPengajuan.length === 0"
      class="text-center py-8 bg-white rounded-lg border border-gray-200"
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
      <p class="mt-2 text-sm font-medium text-gray-900">Tidak ada pengajuan</p>
      <p class="mt-1 text-xs text-gray-500">
        {{
          searchQuery ? 'Tidak ditemukan dengan pencarian tersebut' : 'Belum ada pengajuan bansos'
        }}
      </p>
    </div>

    <!-- Table - Compact & Responsive -->
    <div v-else class="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                No
              </th>
              <th
                class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kepala Keluarga
              </th>
              <th
                class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
              >
                Wilayah
              </th>
              <th
                class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
              >
                Bansos
              </th>
              <th
                class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
              >
                Tanggal
              </th>
              <th
                class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in filteredPengajuan" :key="item.id" class="hover:bg-gray-50">
              <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                {{ (pagination.page - 1) * pagination.limit + index + 1 }}
              </td>

              <!-- Kepala Keluarga - Compact -->
              <td class="px-3 py-2">
                <div class="flex items-center gap-2">
                  <div
                    class="h-7 w-7 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0"
                  >
                    <span class="text-primary-700 font-semibold text-xs">{{
                      getInitials(item.kk_nama)
                    }}</span>
                  </div>
                  <div class="min-w-0">
                    <div
                      class="text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none"
                    >
                      {{ item.kk_nama }}
                    </div>
                    <div class="text-xs text-gray-500 truncate">
                      NIK: {{ item.kk_nik.slice(-4) }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Wilayah - Hidden on mobile -->
              <td class="px-3 py-2 whitespace-nowrap hidden sm:table-cell">
                <div class="text-sm text-gray-900 truncate max-w-[100px]">
                  {{ item.nama_dusun }}
                </div>
                <div class="text-xs text-gray-500">
                  RW {{ item.nomor_rw || '-' }}/RT {{ item.nomor_rt || '-' }}
                </div>
              </td>

              <!-- Bansos - Hidden on tablet -->
              <td class="px-3 py-2 hidden md:table-cell">
                <div class="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                  {{ item.nama_bansos }}
                </div>
                <div class="text-xs text-gray-500 truncate">{{ item.kode_bansos }}</div>
              </td>

              <!-- Tanggal - Hidden on desktop -->
              <td class="px-3 py-2 whitespace-nowrap hidden lg:table-cell">
                <div class="text-sm text-gray-900">{{ formatDate(item.created_at) }}</div>
                <div class="text-xs text-gray-500">{{ formatTime(item.created_at) }}</div>
              </td>

              <!-- Status -->
              <td class="px-3 py-2 whitespace-nowrap">
                <Badge
                  :variant="getStatusVariant(item.status)"
                  size="sm"
                  class="text-xs px-1.5 py-0.5"
                >
                  {{ getStatusText(item.status) }}
                </Badge>
              </td>

              <!-- Actions - Compact -->
              <td class="px-3 py-2 whitespace-nowrap">
                <div class="flex items-center justify-center gap-1">
                  <Button
                    variant="outline"
                    size="xs"
                    @click="router.push(`/admin/pengajuan-bansos/${item.id}`)"
                    class="inline-flex items-center px-2 py-1 text-xs gap-1"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <span class="hidden xs:inline">Detail</span>
                  </Button>

                  <Button
                    v-if="item.status === 'MENUNGGU' || item.status === 'DIPROSES'"
                    variant="primary"
                    size="xs"
                    @click="openModal(item)"
                    class="inline-flex items-center px-2 py-1 text-xs gap-1"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    <span class="hidden xs:inline">Ubah</span>
                  </Button>

                  <div
                    v-else
                    class="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center"
                  >
                    <svg
                      class="h-4 w-4 text-green-600"
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

      <!-- Compact Pagination -->
      <div
        v-if="pagination && pagination.pages > 1"
        class="px-3 py-2 border-t border-gray-200 bg-gray-50"
      >
        <div class="flex items-center justify-between">
          <div class="text-xs text-gray-700">
            {{ (pagination.page - 1) * pagination.limit + 1 }}-{{
              Math.min(pagination.page * pagination.limit, pagination.total)
            }}
            dari {{ pagination.total }}
          </div>
          <div class="flex gap-1">
            <Button
              variant="outline"
              size="xs"
              :disabled="pagination.page === 1"
              @click="changePage(pagination.page - 1)"
              class="px-2 py-1 text-xs inline-flex items-center"
            >
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Button>
            <span class="px-2 py-1 text-xs bg-white border rounded min-w-[28px] text-center">{{
              pagination.page
            }}</span>
            <Button
              variant="outline"
              size="xs"
              :disabled="pagination.page === pagination.pages"
              @click="changePage(pagination.page + 1)"
              class="px-2 py-1 text-xs inline-flex items-center"
            >
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Compact Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="showModal = false"
    >
      <div class="flex items-center justify-center min-h-screen px-2 py-4">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div
          class="relative bg-white rounded-lg max-w-md w-full mx-auto shadow-xl transform transition-all"
        >
          <div class="p-4">
            <div class="flex items-center gap-3 mb-4">
              <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <svg
                  class="h-4 w-4 text-primary-600"
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
              <h3 class="text-base font-medium text-gray-900">Ubah Status Pengajuan</h3>
              <button @click="showModal = false" class="ml-auto text-gray-400 hover:text-gray-500">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div class="bg-gray-50 p-3 rounded-lg mb-4 text-sm">
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <p class="text-xs text-gray-500">Nama</p>
                  <p class="font-medium text-gray-900 truncate">{{ selectedItem?.kk_nama }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Bansos</p>
                  <p class="font-medium text-gray-900 truncate">{{ selectedItem?.nama_bansos }}</p>
                </div>
              </div>
            </div>

            <!-- Form -->
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Status Baru</label>
                <select v-model="form.status" class="input-field text-sm py-1.5 px-2 w-full">
                  <option value="DIPROSES">Diproses</option>
                  <option value="DITERIMA">Diterima</option>
                  <option value="DITOLAK">Ditolak</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Keterangan</label>
                <textarea
                  v-model="form.keterangan"
                  rows="2"
                  class="input-field text-sm py-1.5 px-2 w-full"
                  placeholder="Opsional..."
                ></textarea>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Catatan Admin</label>
                <textarea
                  v-model="form.catatan_admin"
                  rows="2"
                  class="input-field text-sm py-1.5 px-2 w-full"
                  placeholder="Internal..."
                ></textarea>
              </div>

              <!-- Info Status -->
              <div
                v-if="form.status === 'DITERIMA'"
                class="p-2 bg-green-50 rounded-lg text-xs text-green-700 flex items-center gap-2"
              >
                <svg
                  class="h-4 w-4 text-green-600"
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
                Pastikan dokumen lengkap
              </div>
              <div
                v-if="form.status === 'DITOLAK'"
                class="p-2 bg-red-50 rounded-lg text-xs text-red-700 flex items-center gap-2"
              >
                <svg
                  class="h-4 w-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Berikan alasan jelas
              </div>
            </div>
          </div>

          <div class="border-t px-4 py-3 flex justify-end gap-2 bg-gray-50 rounded-b-lg">
            <Button
              type="button"
              variant="outline"
              size="sm"
              @click="showModal = false"
              class="px-3 py-1 text-sm"
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              @click="updateStatus"
              :loading="submitting"
              class="px-3 py-1 text-sm inline-flex items-center gap-1"
              :disabled="submitting"
            >
              <svg v-if="submitting" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ submitting ? 'Menyimpan...' : 'Simpan' }}
            </Button>
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
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import { getInitials, formatDate, formatTime } from '@/utils/helpers'

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
  const counts = {}
  pengajuanList.value.forEach((item) => {
    counts[item.status] = (counts[item.status] || 0) + 1
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
  const variants = { MENUNGGU: 'warning', DIPROSES: 'info', DITERIMA: 'success', DITOLAK: 'danger' }
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
    alert('Gagal memuat data: ' + (err.message || 'Terjadi kesalahan'))
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
    alert('Status berhasil diperbarui!')
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
.input-field {
  @apply block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200;
}

/* Scrollbar styling */
.scrollbar-thin::-webkit-scrollbar {
  height: 4px;
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Responsive breakpoints */
@media (max-width: 480px) {
  .xs\:inline {
    display: inline;
  }
  .xs\:w-48 {
    width: 12rem;
  }
  .xs\:flex-row {
    flex-direction: row;
  }
}

/* Modal animation */
.fixed {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Table hover effect */
tbody tr {
  transition: background-color 0.15s ease;
}

/* Badge styling */
:deep(.badge) {
  font-weight: 500;
  letter-spacing: 0.025em;
}
</style>
