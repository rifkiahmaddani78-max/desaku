<template>
  <div class="h-full flex flex-col">
    <!-- Page Header - Responsif -->
    <div class="flex-shrink-0 mb-3">
      <!-- Header untuk desktop -->
      <div class="hidden md:flex md:items-center md:justify-between">
        <div class="mb-6">
          <h1 class="text-2xl font-semibold text-gray-900 mb-2">Daftar Dusun</h1>
          <p class="text-sm text-gray-600">Kelola data dusun, RW, RT, dan statistik kependudukan</p>
        </div>

        <!-- Add Button -->
        <Button
          variant="primary"
          @click="router.push('/admin/dusun/tambah')"
          class="!px-3 !py-1.5 text-sm"
        >
          <svg class="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tambah Dusun
        </Button>
      </div>

      <!-- Header untuk mobile -->
      <div class="md:hidden space-y-2">
        <h1 class="text-lg font-semibold text-gray-900">Daftar Dusun</h1>
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-600">Kelola data dusun</p>
          <Button
            variant="primary"
            @click="router.push('/admin/dusun/tambah')"
            class="!px-2 !py-1 text-xs"
          >
            <svg class="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah
          </Button>
        </div>
      </div>
    </div>

    <!-- Stats Cards - Compact Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 flex-shrink-0">
      <Card class="p-2 lg:p-3">
        <div class="flex items-center gap-2">
          <div class="p-1.5 bg-blue-100 rounded-lg">
            <svg
              class="h-4 w-4 lg:h-5 lg:w-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-[10px] lg:text-xs text-gray-500 truncate">Total Dusun</p>
            <p class="text-sm lg:text-base font-semibold text-gray-900">{{ dusunList.length }}</p>
          </div>
        </div>
      </Card>

      <Card class="p-2 lg:p-3">
        <div class="flex items-center gap-2">
          <div class="p-1.5 bg-green-100 rounded-lg">
            <svg
              class="h-4 w-4 lg:h-5 lg:w-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <p class="text-[10px] lg:text-xs text-gray-500">Total RW</p>
            <p class="text-sm lg:text-base font-semibold text-gray-900">{{ totalRw }}</p>
          </div>
        </div>
      </Card>

      <Card class="p-2 lg:p-3">
        <div class="flex items-center gap-2">
          <div class="p-1.5 bg-purple-100 rounded-lg">
            <svg
              class="h-4 w-4 lg:h-5 lg:w-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2"
              />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <p class="text-[10px] lg:text-xs text-gray-500">Total RT</p>
            <p class="text-sm lg:text-base font-semibold text-gray-900">{{ totalRt }}</p>
          </div>
        </div>
      </Card>

      <Card class="p-2 lg:p-3">
        <div class="flex items-center gap-2">
          <div class="p-1.5 bg-yellow-100 rounded-lg">
            <svg
              class="h-4 w-4 lg:h-5 lg:w-5 text-yellow-600"
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
            <p class="text-[10px] lg:text-xs text-gray-500">Total KK</p>
            <p class="text-sm lg:text-base font-semibold text-gray-900">{{ totalKk }}</p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Search Bar -->
    <div class="flex-shrink-0 mb-3">
      <div class="relative w-full sm:w-64 ml-auto">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          placeholder="Cari dusun..."
          class="input-field pl-9 py-1.5 text-sm w-full"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div
          class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"
        ></div>
        <p class="mt-2 text-xs text-gray-500">Memuat data dusun...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredDusun.length === 0"
      class="flex-1 flex items-center justify-center bg-white rounded-lg border border-gray-200"
    >
      <div class="text-center py-8 px-4">
        <div class="mx-auto h-10 w-10 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </div>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada dusun</h3>
        <p class="mt-1 text-xs text-gray-500">
          {{ searchQuery ? 'Tidak ditemukan dengan pencarian tersebut' : 'Belum ada data dusun' }}
        </p>
        <div v-if="!searchQuery" class="mt-4">
          <Button variant="primary" size="sm" @click="router.push('/admin/dusun/tambah')">
            <svg class="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah Dusun
          </Button>
        </div>
      </div>
    </div>

    <!-- Table Section - Scrollable -->
    <div v-else class="flex-1 min-h-0 bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div class="h-full flex flex-col">
        <!-- Table dengan horizontal scroll -->
        <div class="flex-1 overflow-auto scrollbar-thin">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th
                  class="px-2 lg:px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase whitespace-nowrap"
                >
                  No
                </th>
                <th
                  class="px-2 lg:px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase whitespace-nowrap"
                >
                  Kode
                </th>
                <th
                  class="px-2 lg:px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase whitespace-nowrap"
                >
                  Nama Dusun
                </th>
                <th
                  class="px-2 lg:px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase whitespace-nowrap hidden sm:table-cell"
                >
                  Kadus
                </th>
                <th
                  class="px-2 lg:px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase whitespace-nowrap hidden md:table-cell"
                >
                  Alamat
                </th>
                <th
                  class="px-2 lg:px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase whitespace-nowrap"
                >
                  RW
                </th>
                <th
                  class="px-2 lg:px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase whitespace-nowrap"
                >
                  RT
                </th>
                <th
                  class="px-2 lg:px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase whitespace-nowrap"
                >
                  KK
                </th>
                <th
                  class="px-2 lg:px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase whitespace-nowrap"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(item, index) in filteredDusun"
                :key="item.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-2 lg:px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                  {{ index + 1 }}
                </td>

                <!-- Kode -->
                <td class="px-2 lg:px-3 py-2 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-primary-100 text-primary-800"
                  >
                    {{ item.kode_dusun }}
                  </span>
                </td>

                <!-- Nama Dusun -->
                <td class="px-2 lg:px-3 py-2 whitespace-nowrap">
                  <div class="flex items-center gap-1.5">
                    <div
                      class="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0"
                    >
                      <span class="text-primary-700 font-semibold text-[9px]">
                        {{ getInitials(item.nama_dusun) }}
                      </span>
                    </div>
                    <div
                      class="text-xs font-medium text-gray-900 truncate max-w-[80px] sm:max-w-[120px]"
                    >
                      {{ item.nama_dusun }}
                    </div>
                  </div>
                </td>

                <!-- Kepala Dusun -->
                <td class="px-2 lg:px-3 py-2 whitespace-nowrap hidden sm:table-cell">
                  <div class="text-xs text-gray-900 truncate max-w-[100px]">
                    {{ item.kepala_dusun || '-' }}
                  </div>
                  <div v-if="item.telepon" class="text-[9px] text-gray-500 truncate">
                    {{ item.telepon }}
                  </div>
                </td>

                <!-- Alamat -->
                <td class="px-2 lg:px-3 py-2 hidden md:table-cell">
                  <div class="text-xs text-gray-500 truncate max-w-[150px]" :title="item.alamat">
                    {{ item.alamat || '-' }}
                  </div>
                </td>

                <!-- RW -->
                <td class="px-2 lg:px-3 py-2 whitespace-nowrap text-center">
                  <span class="text-xs font-medium text-gray-900">{{ item.jumlah_rw }}</span>
                </td>

                <!-- RT -->
                <td class="px-2 lg:px-3 py-2 whitespace-nowrap text-center">
                  <span class="text-xs font-medium text-gray-900">{{ item.jumlah_rt }}</span>
                </td>

                <!-- KK -->
                <td class="px-2 lg:px-3 py-2 whitespace-nowrap text-center">
                  <span class="text-xs font-medium text-gray-900">{{ item.jumlah_kk }}</span>
                </td>

                <!-- Actions - Compact -->
                <td class="px-2 lg:px-3 py-2 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center gap-0.5">
                    <Button
                      variant="outline"
                      size="xs"
                      @click="router.push(`/admin/dusun/${item.id}`)"
                      class="!px-1.5 !py-0.5 h-6 w-6"
                      title="Detail"
                    >
                      <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                    <Button
                      variant="outline"
                      size="xs"
                      @click="router.push(`/admin/dusun/${item.id}/edit`)"
                      class="!px-1.5 !py-0.5 h-6 w-6"
                      title="Edit"
                    >
                      <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Info jumlah data -->
        <div class="flex-shrink-0 px-2 lg:px-3 py-1.5 border-t border-gray-200 bg-gray-50">
          <div class="text-[10px] text-gray-500">
            Menampilkan {{ filteredDusun.length }} dari {{ dusunList.length }} dusun
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Konfirmasi Hapus -->
    <Teleport to="body">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="showDeleteModal = false"
      >
        <div class="flex items-center justify-center min-h-screen px-2 py-4">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <div class="relative bg-white rounded-lg max-w-sm w-full mx-auto shadow-xl">
            <div class="p-4">
              <div class="flex items-center gap-3 mb-3">
                <div class="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
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
                </div>
                <h3 class="text-sm font-medium text-gray-900">Hapus Dusun</h3>
                <button
                  @click="showDeleteModal = false"
                  class="ml-auto text-gray-400 hover:text-gray-600"
                >
                  <span class="text-lg">✕</span>
                </button>
              </div>

              <div class="mb-4">
                <p class="text-sm text-gray-600">
                  Yakin ingin menghapus dusun
                  <span class="font-semibold text-gray-900">"{{ selectedItem?.nama_dusun }}"</span>
                  ({{ selectedItem?.kode_dusun }})?
                </p>
                <p class="text-xs text-red-600 mt-2">
                  ⚠️ Penghapusan data tidak dapat dikembalikan.
                </p>
              </div>

              <div class="bg-gray-50 p-2 rounded-lg mb-4">
                <div class="grid grid-cols-3 gap-1 text-center">
                  <div>
                    <p class="text-[10px] text-gray-500">RW</p>
                    <p class="text-xs font-semibold">{{ selectedItem?.jumlah_rw || 0 }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] text-gray-500">RT</p>
                    <p class="text-xs font-semibold">{{ selectedItem?.jumlah_rt || 0 }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] text-gray-500">KK</p>
                    <p class="text-xs font-semibold">{{ selectedItem?.jumlah_kk || 0 }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t px-4 py-3 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                @click="showDeleteModal = false"
                class="!px-3 !py-1 text-xs"
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                @click="handleDelete"
                :loading="deleting"
                class="!px-3 !py-1 text-xs"
              >
                {{ deleting ? '...' : 'Hapus' }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { dusunService } from '@/services/dusun'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import { getInitials } from '@/utils/helpers'

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

// Filtered dusun
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
    alert('Gagal memuat data dusun: ' + (err.message || 'Terjadi kesalahan'))
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
    alert('Dusun berhasil dihapus')
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
.input-field {
  @apply block w-full border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200;
}

/* Scrollbar styling */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Modal animation */
.fixed {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive table */
@media (max-width: 640px) {
  table {
    font-size: 11px;
  }
}
</style>
