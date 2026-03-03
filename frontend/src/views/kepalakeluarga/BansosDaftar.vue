<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 mb-2">Bantuan Sosial Aktif</h1>
          <p class="text-sm text-gray-600">
            Ajukan bantuan sosial yang tersedia untuk keluarga Anda
          </p>
        </div>

        <!-- Riwayat Pengajuan Button -->
        <Button variant="outline" @click="router.push('/riwayat-pengajuan')">
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Riwayat Pengajuanku
        </Button>
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Bansos</p>
            <p class="text-xl font-semibold text-gray-900">{{ bansosList.length }}</p>
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
            <p class="text-sm text-gray-500">Bansos Tunai</p>
            <p class="text-xl font-semibold text-gray-900">{{ tunaiCount }}</p>
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Bansos Barang</p>
            <p class="text-xl font-semibold text-gray-900">{{ barangCount }}</p>
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
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Prioritas Tinggi</p>
            <p class="text-xl font-semibold text-gray-900">{{ prioritasTinggiCount }}</p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Filter & Search -->
    <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-600">Filter:</span>
        <select v-model="filterJenis" class="input-field w-36">
          <option value="all">Semua</option>
          <option value="TUNAI">Tunai</option>
          <option value="BARANG">Barang</option>
        </select>

        <select v-model="filterPrioritas" class="input-field w-36">
          <option value="all">Semua Prioritas</option>
          <option value="TINGGI">Prioritas Tinggi</option>
          <option value="SEDANG">Prioritas Sedang</option>
          <option value="RENDAH">Prioritas Rendah</option>
        </select>
      </div>

      <div class="relative w-full sm:w-64">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <!-- <SearchIcon class="h-5 w-5 text-gray-400" /> -->
        </div>
        <input
          type="search"
          v-model="searchQuery"
          placeholder="Cari bansos..."
          class="input-field pl-10"
        />
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
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada bansos aktif</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{
          searchQuery
            ? 'Tidak ditemukan bansos dengan pencarian tersebut'
            : 'Belum ada bansos aktif saat ini'
        }}
      </p>
    </div>

    <!-- Bansos Cards -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card
        v-for="bansos in filteredBansos"
        :key="bansos.id"
        class="overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <div class="h-12 w-12 rounded-lg" :class="getJenisWarna(bansos.jenis_bansos)">
                  <div class="h-full w-full flex items-center justify-center">
                    <span class="text-white font-bold text-lg">
                      {{ getInitials(bansos.nama_bansos) }}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ bansos.nama_bansos }}</h3>
                <p class="text-xs text-gray-500">Kode: {{ bansos.kode_bansos }}</p>
              </div>
            </div>

            <!-- Prioritas Badge -->
            <Badge :variant="getPrioritasVariant(bansos.prioritas)">
              {{ bansos.prioritas }}
            </Badge>
          </div>

          <!-- Description -->
          <p class="text-sm text-gray-600 mb-4 line-clamp-2">
            {{ bansos.deskripsi || 'Tidak ada deskripsi' }}
          </p>

          <!-- Info Penerima -->
          <div class="mb-4 p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center">
              <svg
                class="h-5 w-5 text-gray-400 mr-2"
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
              <span class="text-sm text-gray-700">
                <span class="font-medium">Penerima Manfaat:</span> {{ bansos.penerima_manfaat }}
              </span>
            </div>
          </div>

          <!-- Details Grid -->
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="bg-gray-50 p-3 rounded-lg">
              <p class="text-xs text-gray-500 mb-1">Jenis</p>
              <p class="text-sm font-medium text-gray-900">{{ bansos.jenis_bansos }}</p>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg">
              <p class="text-xs text-gray-500 mb-1">Kategori</p>
              <p class="text-sm font-medium text-gray-900">{{ bansos.kategori }}</p>
            </div>

            <!-- Nominal untuk Tunai -->
            <div v-if="bansos.jenis_bansos === 'TUNAI'" class="bg-gray-50 p-3 rounded-lg">
              <p class="text-xs text-gray-500 mb-1">Nominal</p>
              <p class="text-sm font-medium text-green-600">
                {{ formatCurrency(bansos.jumlah_nominal) }}
              </p>
            </div>

            <!-- Satuan untuk Barang -->
            <div v-else class="bg-gray-50 p-3 rounded-lg">
              <p class="text-xs text-gray-500 mb-1">Satuan</p>
              <p class="text-sm font-medium text-gray-900">{{ bansos.satuan_barang || '-' }}</p>
            </div>

            <!-- Kuota -->
            <div class="bg-gray-50 p-3 rounded-lg">
              <p class="text-xs text-gray-500 mb-1">Kuota</p>
              <p class="text-sm font-medium text-gray-900">{{ bansos.kuota }} orang</p>
            </div>
          </div>

          <!-- Periode -->
          <div class="mb-4 flex items-center text-sm text-gray-600">
            <svg
              class="h-4 w-4 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {{ formatDate(bansos.tanggal_mulai) }} - {{ formatDate(bansos.tanggal_selesai) }}
            </span>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <Button variant="outline" size="sm" @click="router.push(`/daftar-bansos/${bansos.id}`)">
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

            <Button
              variant="primary"
              size="sm"
              :loading="submitting === bansos.id"
              @click="ajukanBansos(bansos.id)"
            >
              <svg class="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Ajukan
            </Button>
          </div>
        </div>
      </Card>
    </div>

    <!-- Modal Input Alasan -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
      >
        <!-- Overlay -->
        <div class="fixed inset-0 transition-opacity" @click="showModal = false">
          <div class="absolute inset-0 bg-gray-500 bg-opacity-75"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <!-- Modal Content -->
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10"
              >
                <svg
                  class="h-6 w-6 text-primary-600"
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
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Alasan Pengajuan Bansos</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 mb-4">
                    Jelaskan alasan Anda membutuhkan bantuan sosial ini
                  </p>

                  <textarea
                    v-model="alasan"
                    rows="4"
                    class="input-field w-full"
                    placeholder="Contoh: Saya termasuk keluarga kurang mampu, memiliki tanggungan 3 anak, dan pekerjaan tidak tetap..."
                  ></textarea>

                  <!-- Karakter Counter -->
                  <div class="mt-2 text-right">
                    <span
                      class="text-xs"
                      :class="alasan.length >= 200 ? 'text-orange-500' : 'text-gray-400'"
                    >
                      {{ alasan.length }}/500 karakter
                    </span>
                  </div>

                  <!-- Tips -->
                  <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div class="flex">
                      <svg
                        class="h-5 w-5 text-blue-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p class="ml-3 text-xs text-blue-700">
                        <span class="font-medium">Tips:</span> Sertakan informasi tentang kondisi
                        ekonomi, jumlah tanggungan, dan alasan spesifik mengapa Anda membutuhkan
                        bansos ini.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button
              type="button"
              variant="primary"
              @click="submitPengajuan"
              :loading="submitting === selectedBansosId"
              :disabled="!alasan.trim() || alasan.length < 10"
            >
              {{ submitting === selectedBansosId ? 'Mengirim...' : 'Kirim Pengajuan' }}
            </Button>
            <Button type="button" variant="outline" @click="showModal = false" class="mr-3">
              Batal
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
import { bansosService } from '@/services/bansos'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
// import { SearchIcon } from '@heroicons/vue/24/outline'
import { getInitials, formatCurrency, formatDate } from '@/utils/helpers'

const router = useRouter()

// State
const bansosList = ref([])
const loading = ref(true)
const submitting = ref(null)
const showModal = ref(false)
const selectedBansosId = ref(null)
const alasan = ref('')
const searchQuery = ref('')
const filterJenis = ref('all')
const filterPrioritas = ref('all')

// Computed stats
const tunaiCount = computed(() => bansosList.value.filter((b) => b.jenis_bansos === 'TUNAI').length)
const barangCount = computed(
  () => bansosList.value.filter((b) => b.jenis_bansos === 'BARANG').length,
)
const prioritasTinggiCount = computed(
  () => bansosList.value.filter((b) => b.prioritas === 'TINGGI').length,
)

// Filtered bansos
const filteredBansos = computed(() => {
  let filtered = bansosList.value

  // Filter by jenis
  if (filterJenis.value !== 'all') {
    filtered = filtered.filter((b) => b.jenis_bansos === filterJenis.value)
  }

  // Filter by prioritas
  if (filterPrioritas.value !== 'all') {
    filtered = filtered.filter((b) => b.prioritas === filterPrioritas.value)
  }

  // Filter by search
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (b) =>
        b.nama_bansos.toLowerCase().includes(query) ||
        b.kode_bansos.toLowerCase().includes(query) ||
        b.kategori.toLowerCase().includes(query),
    )
  }

  return filtered
})

// Get warna berdasarkan jenis bansos
const getJenisWarna = (jenis) => {
  return jenis === 'TUNAI' ? 'bg-green-600' : 'bg-purple-600'
}

// Get variant untuk prioritas badge
const getPrioritasVariant = (prioritas) => {
  const variants = {
    TINGGI: 'danger',
    SEDANG: 'warning',
    RENDAH: 'info',
  }
  return variants[prioritas] || 'gray'
}

const fetchBansos = async () => {
  try {
    loading.value = true
    const res = await bansosService.getBansosActive()
    bansosList.value = res.list || res || []
  } catch (err) {
    console.error('Gagal memuat bansos:', err)
  } finally {
    loading.value = false
  }
}

const ajukanBansos = (bansosId) => {
  selectedBansosId.value = bansosId
  alasan.value = ''
  showModal.value = true
}

const submitPengajuan = async () => {
  if (!alasan.value.trim()) {
    alert('Alasan pengajuan wajib diisi')
    return
  }

  if (alasan.value.length < 10) {
    alert('Alasan minimal 10 karakter')
    return
  }

  if (alasan.value.length > 500) {
    alert('Alasan maksimal 500 karakter')
    return
  }

  submitting.value = selectedBansosId.value

  try {
    await bansosService.createPengajuanBansos({
      bansos_id: selectedBansosId.value,
      alasan_pengajuan: alasan.value.trim(),
    })

    alert('Pengajuan bansos berhasil dikirim!')
    showModal.value = false

    // Optional: Redirect ke riwayat pengajuan
    // router.push('/riwayat-pengajuan')
  } catch (err) {
    alert(err.message || 'Gagal mengajukan bansos')
  } finally {
    submitting.value = null
  }
}

onMounted(() => {
  fetchBansos()
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
</style>
