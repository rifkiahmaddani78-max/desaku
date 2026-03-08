<template>
  <div >
    <!-- Page Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6 sm:mb-8">
      <div>
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">Daftar Dusun</h1>
        <p class="text-sm text-gray-600 mt-1">
          Kelola data dusun, RW, RT, dan statistik kependudukan
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <router-link to="/admin/dusun/tambah">
          <Button variant="primary" class="w-full sm:w-auto">
            <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah Dusun
          </Button>
        </router-link>
      </div>
    </div>

    <!-- Stats Cards -->
    <div
      v-if="!loading && dusunList.length > 0"
      class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
    >
      <!-- Total Dusun -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100">
        <div class="flex items-center">
          <div class="p-2 sm:p-2.5 bg-blue-50 rounded-lg flex-shrink-0">
            <HomeIcon class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div class="ml-2 sm:ml-3 min-w-0 flex-1">
            <p class="text-xs text-gray-500 truncate">Total Dusun</p>
            <p class="text-base sm:text-lg font-semibold text-gray-900">{{ dusunList.length }}</p>
          </div>
        </div>
      </div>

      <!-- Total RW -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100">
        <div class="flex items-center">
          <div class="p-2 sm:p-2.5 bg-green-50 rounded-lg flex-shrink-0">
            <BuildingOfficeIcon class="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          </div>
          <div class="ml-2 sm:ml-3 min-w-0 flex-1">
            <p class="text-xs text-gray-500 truncate">Total RW</p>
            <p class="text-base sm:text-lg font-semibold text-gray-900">{{ totalRw }}</p>
          </div>
        </div>
      </div>

      <!-- Total RT -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100">
        <div class="flex items-center">
          <div class="p-2 sm:p-2.5 bg-purple-50 rounded-lg flex-shrink-0">
            <HomeModernIcon class="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
          </div>
          <div class="ml-2 sm:ml-3 min-w-0 flex-1">
            <p class="text-xs text-gray-500 truncate">Total RT</p>
            <p class="text-base sm:text-lg font-semibold text-gray-900">{{ totalRt }}</p>
          </div>
        </div>
      </div>

      <!-- Total KK -->
      <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100">
        <div class="flex items-center">
          <div class="p-2 sm:p-2.5 bg-yellow-50 rounded-lg flex-shrink-0">
            <UsersIcon class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
          </div>
          <div class="ml-2 sm:ml-3 min-w-0 flex-1">
            <p class="text-xs text-gray-500 truncate">Total KK</p>
            <p class="text-base sm:text-lg font-semibold text-gray-900">{{ totalKk }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="mb-6">
      <div class="relative w-full sm:max-w-md">
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
          placeholder="Cari nama dusun atau kode..."
          class="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow text-sm"
        />
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
      v-else-if="filteredDusun.length === 0"
      class="text-center py-12 bg-white rounded-xl border border-gray-200"
    >
      <div class="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <HomeIcon class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-sm font-medium text-gray-900 mb-1">Tidak ada dusun</h3>
      <p class="text-sm text-gray-500 mb-4">
        {{ searchQuery ? 'Tidak ditemukan dengan pencarian tersebut' : 'Belum ada data dusun' }}
      </p>
      <router-link
        to="/admin/dusun/tambah"
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
        Tambah Dusun
      </router-link>
    </div>

    <!-- Table - Tanpa overflow horizontal -->
    <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full table-fixed divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="w-[5%] px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                No
              </th>
              <th
                scope="col"
                class="w-[10%] px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kode
              </th>
              <th
                scope="col"
                class="w-[20%] px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nama Dusun
              </th>
              <th
                scope="col"
                class="w-[20%] px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
              >
                Kepala Dusun
              </th>
              <th
                scope="col"
                class="w-[20%] px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
              >
                Alamat
              </th>
              <th
                scope="col"
                class="w-[7%] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                RW
              </th>
              <th
                scope="col"
                class="w-[7%] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                RT
              </th>
              <th
                scope="col"
                class="w-[7%] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                KK
              </th>
              <th
                scope="col"
                class="w-[14%] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(item, index) in filteredDusun"
              :key="item.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <!-- No -->
              <td class="px-2 py-3 whitespace-nowrap text-xs text-gray-500">
                {{ index + 1 }}
              </td>

              <!-- Kode -->
              <td class="px-2 py-3 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {{ item.kode_dusun }}
                </span>
              </td>

              <!-- Nama Dusun -->
              <td class="px-2 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <div
                      class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center"
                    >
                      <span class="text-primary-700 font-semibold text-xs">
                        {{ getInitials(item.nama_dusun) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-2 truncate max-w-[100px] sm:max-w-[150px]">
                    <div class="text-xs font-medium text-gray-900 truncate">
                      {{ item.nama_dusun }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Kepala Dusun -->
              <td class="px-2 py-3 whitespace-nowrap hidden md:table-cell">
                <div class="text-xs text-gray-900 truncate max-w-[120px]">
                  {{ item.kepala_dusun || '-' }}
                </div>
                <div v-if="item.telepon" class="text-[10px] text-gray-500 truncate max-w-[120px]">
                  {{ item.telepon }}
                </div>
              </td>

              <!-- Alamat -->
              <td class="px-2 py-3 hidden lg:table-cell">
                <div class="text-xs text-gray-500 truncate max-w-[150px]" :title="item.alamat">
                  {{ item.alamat || '-' }}
                </div>
              </td>

              <!-- RW -->
              <td class="px-2 py-3 whitespace-nowrap text-center">
                <span class="text-xs font-medium text-gray-900">{{ item.jumlah_rw }}</span>
              </td>

              <!-- RT -->
              <td class="px-2 py-3 whitespace-nowrap text-center">
                <span class="text-xs font-medium text-gray-900">{{ item.jumlah_rt }}</span>
              </td>

              <!-- KK -->
              <td class="px-2 py-3 whitespace-nowrap text-center">
                <span class="text-xs font-medium text-gray-900">{{ item.jumlah_kk }}</span>
              </td>

              <!-- Actions -->
              <td class="px-2 py-3 whitespace-nowrap text-center">
                <div class="flex items-center justify-center space-x-1">
                  <!-- Detail Button -->
                  <button
                    @click="router.push(`/admin/dusun/${item.id}`)"
                    class="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    title="Detail"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>

                  <!-- Edit Button -->
                  <button
                    @click="router.push(`/admin/dusun/${item.id}/edit`)"
                    class="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
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

                  <!-- Delete Button -->
                  <button
                    @click="confirmDelete(item)"
                    class="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
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
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Info jumlah data -->
      <div class="px-4 sm:px-6 py-2 sm:py-3 border-t border-gray-200 bg-gray-50">
        <div class="text-xs text-gray-500">
          Menampilkan {{ filteredDusun.length }} dari {{ dusunList.length }} dusun
        </div>
      </div>
    </div>

    <!-- Modal Konfirmasi Hapus -->
    <Transition name="modal">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="showDeleteModal = false"
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
                    class="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-red-100 flex items-center justify-center"
                  >
                    <svg
                      class="h-4 w-4 sm:h-5 sm:w-5 text-red-600"
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
                  </div>
                  <h3 class="text-base sm:text-lg font-medium text-gray-900">Hapus Dusun</h3>
                </div>
                <button @click="showDeleteModal = false" class="text-gray-400 hover:text-gray-500">
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

              <div class="mb-4">
                <p class="text-sm text-gray-600">
                  Yakin ingin menghapus dusun
                  <span class="font-semibold text-gray-900">"{{ selectedItem?.nama_dusun }}"</span>
                  ({{ selectedItem?.kode_dusun }})?
                </p>
                <p class="text-xs text-red-600 mt-2 flex items-center">
                  <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  Penghapusan data tidak dapat dikembalikan
                </p>
              </div>

              <!-- Statistik Singkat -->
              <div class="bg-gray-50 p-3 rounded-lg mb-4">
                <div class="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p class="text-xs text-gray-500">RW</p>
                    <p class="text-sm font-semibold text-gray-900">
                      {{ selectedItem?.jumlah_rw || 0 }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">RT</p>
                    <p class="text-sm font-semibold text-gray-900">
                      {{ selectedItem?.jumlah_rt || 0 }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">KK</p>
                    <p class="text-sm font-semibold text-gray-900">
                      {{ selectedItem?.jumlah_kk || 0 }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div
              class="border-t px-5 sm:px-6 py-3 sm:py-4 bg-gray-50 rounded-b-xl flex justify-end space-x-2"
            >
              <Button type="button" variant="outline" size="sm" @click="showDeleteModal = false">
                Batal
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                @click="handleDelete"
                :loading="deleting"
              >
                {{ deleting ? 'Menghapus...' : 'Hapus Dusun' }}
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
import { dusunService } from '@/services/dusun'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import { getInitials } from '@/utils/helpers'
import { HomeIcon, BuildingOfficeIcon, HomeModernIcon, UsersIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

// State
const dusunList = ref([])
const loading = ref(true)
const searchQuery = ref('')
const showDeleteModal = ref(false)
const selectedItem = ref(null)
const deleting = ref(false)

// Computed totals
const totalRw = computed(() => {
  return dusunList.value.reduce((acc, dusun) => acc + (dusun.jumlah_rw || 0), 0)
})

const totalRt = computed(() => {
  return dusunList.value.reduce((acc, dusun) => acc + (dusun.jumlah_rt || 0), 0)
})

const totalKk = computed(() => {
  return dusunList.value.reduce((acc, dusun) => acc + (dusun.jumlah_kk || 0), 0)
})

// Filtered dusun dengan search
const filteredDusun = computed(() => {
  if (!searchQuery.value.trim()) {
    return dusunList.value
  }

  const query = searchQuery.value.toLowerCase()
  return dusunList.value.filter(
    (item) =>
      item.nama_dusun.toLowerCase().includes(query) ||
      item.kode_dusun.toLowerCase().includes(query) ||
      (item.kepala_dusun && item.kepala_dusun.toLowerCase().includes(query)),
  )
})

const fetchDusun = async () => {
  loading.value = true
  try {
    const response = await dusunService.getDusunList()
    if (response.success) {
      dusunList.value = response.data || []
    }
  } catch (err) {
    console.error('Error fetching dusun:', err)
  } finally {
    loading.value = false
  }
}

const confirmDelete = (item) => {
  selectedItem.value = item
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!selectedItem.value) return

  deleting.value = true
  try {
    await dusunService.deleteDusun(selectedItem.value.id)
    dusunList.value = dusunList.value.filter((d) => d.id !== selectedItem.value.id)
    showDeleteModal.value = false
  } catch (err) {
    console.error('Error deleting dusun:', err)
    alert('Gagal menghapus dusun: ' + (err.message || 'Terjadi kesalahan'))
  } finally {
    deleting.value = false
    selectedItem.value = null
  }
}

onMounted(() => {
  fetchDusun()
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

/* Memastikan tabel tidak overflow */
table {
  table-layout: fixed;
  width: 100%;
}

/* Truncate untuk teks panjang */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
