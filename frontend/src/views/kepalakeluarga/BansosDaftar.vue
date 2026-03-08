<template>
  <div>
    <!-- Header Section -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Bantuan Sosial Aktif</h1>
        <p class="mt-2 text-sm text-gray-600">
          Ajukan bantuan sosial yang tersedia untuk keluarga Anda
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <router-link to="/pengajuan-bansos-saya">
          <button
            class="inline-flex items-center px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <svg
              class="w-5 h-5 mr-2 text-gray-400"
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
            Riwayat Pengajuanku
          </button>
        </router-link>
      </div>
    </div>

    <!-- Stats Summary -->
    <div class="flex flex-wrap items-center gap-3 mb-6">
      <div class="flex items-center px-3 py-1.5 bg-blue-50 rounded-full">
        <span class="text-sm font-medium text-blue-700">{{ bansosList.length }}</span>
        <span class="ml-1.5 text-xs text-gray-600">Total</span>
      </div>
      <div class="flex items-center px-3 py-1.5 bg-green-50 rounded-full">
        <span class="text-sm font-medium text-green-700">{{ tunaiCount }}</span>
        <span class="ml-1.5 text-xs text-gray-600">Tunai</span>
      </div>
      <div class="flex items-center px-3 py-1.5 bg-purple-50 rounded-full">
        <span class="text-sm font-medium text-purple-700">{{ barangCount }}</span>
        <span class="ml-1.5 text-xs text-gray-600">Barang</span>
      </div>
      <div class="flex items-center px-3 py-1.5 bg-yellow-50 rounded-full">
        <span class="text-sm font-medium text-yellow-700">{{ prioritasTinggiCount }}</span>
        <span class="ml-1.5 text-xs text-gray-600">Prioritas</span>
      </div>
    </div>

    <!-- Filter & Search -->
    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <div class="flex flex-wrap gap-2">
        <select
          v-model="filterJenis"
          class="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="all">Semua Jenis</option>
          <option value="TUNAI">Tunai</option>
          <option value="BARANG">Barang</option>
          <option value="JASA">Jasa</option>
        </select>

        <select
          v-model="filterPrioritas"
          class="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="all">Semua Prioritas</option>
          <option value="TINGGI">Tinggi</option>
          <option value="SEDANG">Sedang</option>
          <option value="RENDAH">Rendah</option>
        </select>
      </div>

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
          placeholder="Cari bansos..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="flex items-center space-x-2 text-gray-500">
        <div
          class="w-5 h-5 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin"
        ></div>
        <span class="text-sm">Memuat data bansos...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredBansos.length === 0"
      class="text-center py-12 bg-white rounded-lg border border-gray-100"
    >
      <div class="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>
      <h3 class="text-sm font-medium text-gray-900 mb-1">Tidak ada bansos aktif</h3>
      <p class="text-sm text-gray-500">
        {{
          searchQuery
            ? 'Tidak ditemukan dengan pencarian tersebut'
            : 'Belum ada bansos aktif saat ini'
        }}
      </p>
    </div>

    <!-- Bansos Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="bansos in filteredBansos"
        :key="bansos.id"
        class="bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors overflow-hidden"
      >
        <!-- Mobile Layout (≤768px) -->
        <div class="sm:hidden p-4">
          <!-- Header -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center">
              <div
                :class="[
                  'w-12 h-12 rounded-lg flex items-center justify-center mr-3',
                  getJenisWarna(bansos.jenis_bansos),
                ]"
              >
                <span class="text-white font-semibold">{{ getInitials(bansos.nama_bansos) }}</span>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">{{ bansos.nama_bansos }}</h3>
                <p class="text-xs text-gray-500 mt-0.5">{{ bansos.kode_bansos }}</p>
              </div>
            </div>
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                getPrioritasClass(bansos.prioritas),
              ]"
            >
              {{ bansos.prioritas }}
            </span>
          </div>

          <!-- Info -->
          <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ bansos.deskripsi || '-' }}</p>

          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Penerima:</span>
              <span class="text-gray-900">{{ bansos.penerima_manfaat }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Jenis:</span>
              <span class="text-gray-900">{{ bansos.jenis_bansos }}</span>
            </div>
            <div v-if="bansos.jenis_bansos === 'TUNAI'" class="flex justify-between">
              <span class="text-gray-500">Nominal:</span>
              <span class="text-green-600 font-medium">{{
                formatRupiah(bansos.jumlah_nominal)
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Kuota:</span>
              <span class="text-gray-900">{{ bansos.kuota }} orang</span>
            </div>
            <div class="flex justify-between text-xs text-gray-400">
              <span>{{ formatDate(bansos.tanggal_mulai, 'short') }}</span>
              <span>-</span>
              <span>{{ formatDate(bansos.tanggal_selesai, 'short') }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 mt-4 pt-3 border-t border-gray-100">
            <button
              @click="router.push(`/daftar-bansos/${bansos.id}`)"
              class="flex-1 px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Detail
            </button>
            <button
              @click="ajukanBansos(bansos.id)"
              :disabled="submitting === bansos.id"
              class="flex-1 px-3 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ submitting === bansos.id ? '...' : 'Ajukan' }}
            </button>
          </div>
        </div>

        <!-- Desktop Layout (>768px) -->
        <div class="hidden sm:block p-5">
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center">
              <div
                :class="[
                  'w-12 h-12 rounded-lg flex items-center justify-center mr-3',
                  getJenisWarna(bansos.jenis_bansos),
                ]"
              >
                <span class="text-white font-semibold">{{ getInitials(bansos.nama_bansos) }}</span>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">{{ bansos.nama_bansos }}</h3>
                <p class="text-xs text-gray-500 mt-0.5">{{ bansos.kode_bansos }}</p>
              </div>
            </div>
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                getPrioritasClass(bansos.prioritas),
              ]"
            >
              {{ bansos.prioritas }}
            </span>
          </div>

          <!-- Description -->
          <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ bansos.deskripsi || '-' }}</p>

          <!-- Info Grid -->
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div>
              <p class="text-xs text-gray-400 mb-1">Penerima</p>
              <p class="text-sm text-gray-900">{{ bansos.penerima_manfaat }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400 mb-1">Kategori</p>
              <p class="text-sm text-gray-900">{{ bansos.kategori }}</p>
            </div>
            <div v-if="bansos.jenis_bansos === 'TUNAI'">
              <p class="text-xs text-gray-400 mb-1">Nominal</p>
              <p class="text-sm text-green-600 font-medium">
                {{ formatRupiah(bansos.jumlah_nominal) }}
              </p>
            </div>
            <div v-else>
              <p class="text-xs text-gray-400 mb-1">Satuan</p>
              <p class="text-sm text-gray-900">{{ bansos.satuan_barang || '-' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400 mb-1">Kuota</p>
              <p class="text-sm text-gray-900">{{ bansos.kuota }} orang</p>
            </div>
            <div>
              <p class="text-xs text-gray-400 mb-1">Periode</p>
              <p class="text-xs text-gray-600">
                {{ formatDate(bansos.tanggal_mulai, 'short') }} -
                {{ formatDate(bansos.tanggal_selesai, 'short') }}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button
              @click="router.push(`/daftar-bansos/${bansos.id}`)"
              class="px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Detail
            </button>
            <button
              @click="ajukanBansos(bansos.id)"
              :disabled="submitting === bansos.id"
              class="px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ submitting === bansos.id ? 'Mengirim...' : 'Ajukan' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Input Alasan -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-50" @click="showModal = false"></div>

        <div class="relative bg-white rounded-lg w-full max-w-md p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Alasan Pengajuan</h3>

          <textarea
            v-model="alasan"
            rows="4"
            class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Jelaskan alasan Anda membutuhkan bansos ini..."
          ></textarea>

          <div class="flex justify-end gap-2 mt-4">
            <button
              @click="showModal = false"
              class="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              @click="submitPengajuan"
              :disabled="!alasan.trim() || alasan.length < 10 || submitting"
              class="px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ submitting ? 'Mengirim...' : 'Kirim' }}
            </button>
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
import { pengajuanService } from '@/services/pengajuan'
import { getInitials, formatDate, formatRupiah } from '@/utils/helpers'

const router = useRouter()

// State
const bansosList = ref([])
const loading = ref(true)
const submitting = ref(false)
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

  if (filterJenis.value !== 'all') {
    filtered = filtered.filter((b) => b.jenis_bansos === filterJenis.value)
  }

  if (filterPrioritas.value !== 'all') {
    filtered = filtered.filter((b) => b.prioritas === filterPrioritas.value)
  }

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

const getJenisWarna = (jenis) => {
  const colors = {
    TUNAI: 'bg-green-600',
    BARANG: 'bg-purple-600',
    JASA: 'bg-blue-600',
  }
  return colors[jenis] || 'bg-gray-600'
}

const getPrioritasClass = (prioritas) => {
  const classes = {
    TINGGI: 'bg-red-50 text-red-700',
    SEDANG: 'bg-yellow-50 text-yellow-700',
    RENDAH: 'bg-blue-50 text-blue-700',
  }
  return classes[prioritas] || 'bg-gray-50 text-gray-700'
}

const fetchBansos = async () => {
  try {
    loading.value = true
    const res = await bansosService.getBansosActive()
    bansosList.value = res.data || res.list || res || []
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
  if (!alasan.value.trim() || alasan.value.length < 10) return

  submitting.value = true

  try {
    await pengajuanService.createPengajuanBansos({
      bansos_id: selectedBansosId.value,
      alasan_pengajuan: alasan.value.trim(),
    })

    alert('Pengajuan berhasil dikirim!')
    showModal.value = false
  } catch (err) {
    alert(err.message || 'Gagal mengajukan bansos')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchBansos()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
