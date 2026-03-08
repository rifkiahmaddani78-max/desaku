<template>
  <div class="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-6 sm:mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Dashboard Admin</h1>
            <p class="text-sm text-gray-600 mt-1">Selamat datang, {{ profile.nama_lengkap }}</p>
          </div>
          <div class="flex items-center space-x-3 text-sm">
            <div class="flex items-center px-3 py-2 bg-white rounded-lg shadow-sm">
              <CalendarIcon class="w-4 h-4 text-gray-400 mr-2" />
              <span class="text-gray-600">{{ currentDate }}</span>
            </div>
            <div class="flex items-center px-3 py-2 bg-primary-50 rounded-lg">
              <ClockIcon class="w-4 h-4 text-primary-600 mr-2" />
              <span class="text-primary-600 font-medium">{{ currentTime }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistik Utama -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <!-- Total Penduduk (dari statistik user) -->
        <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">Total Penduduk</p>
              <p class="text-2xl font-bold text-gray-900">{{ userStats.total }}</p>
              <p class="text-xs text-gray-400 mt-1">Terdaftar di sistem</p>
            </div>
            <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <UsersIcon class="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div class="mt-3 flex items-center text-xs">
            <span class="text-green-600 font-medium">{{ userStats.verified }} terverifikasi</span>
            <span class="mx-2 text-gray-300">•</span>
            <span class="text-yellow-600">{{ userStats.unverified }} belum</span>
          </div>
        </div>

        <!-- Total Kepala Keluarga (dari statistik user) -->
        <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">Kepala Keluarga</p>
              <p class="text-2xl font-bold text-gray-900">{{ userStats.kepalaKeluarga }}</p>
              <p class="text-xs text-gray-400 mt-1">Yang terdaftar</p>
            </div>
            <div class="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <UserGroupIcon class="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div class="mt-3 flex items-center text-xs">
            <span class="text-gray-500"
              >{{ wilayahStats.total_kk_terdaftar }} KK dengan anggota</span
            >
          </div>
        </div>

        <!-- Total Dusun (dari statistik wilayah) -->
        <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">Wilayah</p>
              <p class="text-2xl font-bold text-gray-900">{{ wilayahStats.total_dusun }}</p>
              <p class="text-xs text-gray-400 mt-1">
                {{ wilayahStats.total_rw }} RW • {{ wilayahStats.total_rt }} RT
              </p>
            </div>
            <div class="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <MapIcon class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <!-- Total Bansos (dari statistik bansos) -->
        <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">Program Bansos</p>
              <p class="text-2xl font-bold text-gray-900">{{ bansosStats.total_bansos }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ bansosStats.aktif }} aktif</p>
            </div>
            <div class="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <GiftIcon class="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div class="mt-3 flex items-center text-xs">
            <span class="text-gray-500">Kuota: {{ formatNumber(bansosStats.total_kuota) }}</span>
          </div>
        </div>
      </div>

      <!-- Statistik Detail -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <!-- Grafik Pengajuan Bansos -->
        <div class="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-base font-semibold text-gray-900">Statistik Pengajuan Bansos</h2>
            <div class="flex items-center space-x-2">
              <span class="text-xs text-gray-500">Total: {{ pengajuanStats.overall.total }}</span>
            </div>
          </div>

          <!-- Bar Chart -->
          <div class="space-y-4">
            <!-- Menunggu -->
            <div>
              <div class="flex justify-between text-xs mb-1">
                <span class="text-gray-600">Menunggu</span>
                <span class="font-medium text-gray-900">{{ pengajuanStats.overall.menunggu }}</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2">
                <div
                  class="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                  :style="{
                    width:
                      getPercentage(pengajuanStats.overall.menunggu, pengajuanStats.overall.total) +
                      '%',
                  }"
                ></div>
              </div>
            </div>

            <!-- Diproses -->
            <div>
              <div class="flex justify-between text-xs mb-1">
                <span class="text-gray-600">Diproses</span>
                <span class="font-medium text-gray-900">{{ pengajuanStats.overall.diproses }}</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2">
                <div
                  class="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  :style="{
                    width:
                      getPercentage(pengajuanStats.overall.diproses, pengajuanStats.overall.total) +
                      '%',
                  }"
                ></div>
              </div>
            </div>

            <!-- Diterima -->
            <div>
              <div class="flex justify-between text-xs mb-1">
                <span class="text-gray-600">Diterima</span>
                <span class="font-medium text-gray-900">{{ pengajuanStats.overall.diterima }}</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2">
                <div
                  class="bg-green-500 h-2 rounded-full transition-all duration-500"
                  :style="{
                    width:
                      getPercentage(pengajuanStats.overall.diterima, pengajuanStats.overall.total) +
                      '%',
                  }"
                ></div>
              </div>
            </div>

            <!-- Ditolak -->
            <div>
              <div class="flex justify-between text-xs mb-1">
                <span class="text-gray-600">Ditolak</span>
                <span class="font-medium text-gray-900">{{ pengajuanStats.overall.ditolak }}</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2">
                <div
                  class="bg-red-500 h-2 rounded-full transition-all duration-500"
                  :style="{
                    width:
                      getPercentage(pengajuanStats.overall.ditolak, pengajuanStats.overall.total) +
                      '%',
                  }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Rating Info -->
          <div
            v-if="pengajuanStats.overall.total_rating > 0"
            class="mt-4 pt-4 border-t border-gray-100"
          >
            <div class="flex items-center">
              <StarIcon class="w-5 h-5 text-yellow-400" />
              <span class="ml-2 text-sm text-gray-600">
                Rating rata-rata: {{ pengajuanStats.overall.avg_rating?.toFixed(1) || '0' }} ({{
                  pengajuanStats.overall.total_rating
                }}
                ulasan)
              </span>
            </div>
          </div>
        </div>

        <!-- Distribusi Bansos per Kategori -->
        <div class="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100">
          <h2 class="text-base font-semibold text-gray-900 mb-4">Distribusi Bansos per Kategori</h2>

          <!-- Pie Chart Alternative -->
          <div class="space-y-4">
            <div
              v-for="item in bansosStats.by_kategori"
              :key="item.kategori"
              class="flex items-center"
            >
              <div class="w-2 h-2 rounded-full" :class="getCategoryColor(item.kategori)"></div>
              <span class="ml-2 text-xs text-gray-600 flex-1">{{ item.kategori }}</span>
              <span class="text-xs font-medium text-gray-900">{{ item.jumlah }}</span>
              <span class="ml-2 text-xs text-gray-400">({{ item.total_kuota }} kuota)</span>
            </div>
          </div>

          <!-- Ringkasan Bansos -->
          <div class="mt-6 grid grid-cols-2 gap-3">
            <div class="bg-gray-50 p-3 rounded-lg">
              <p class="text-xs text-gray-500">Tunai</p>
              <p class="text-lg font-semibold text-gray-900">{{ bansosStats.tunai }}</p>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg">
              <p class="text-xs text-gray-500">Barang</p>
              <p class="text-lg font-semibold text-gray-900">{{ bansosStats.barang }}</p>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg">
              <p class="text-xs text-gray-500">Jasa</p>
              <p class="text-lg font-semibold text-gray-900">{{ bansosStats.jasa }}</p>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg">
              <p class="text-xs text-gray-500">Total Kuota</p>
              <p class="text-lg font-semibold text-gray-900">
                {{ formatNumber(bansosStats.total_kuota) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabel dan List -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <!-- Daftar Dusun -->
        <div
          class="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div class="p-4 sm:p-5 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <h2 class="text-base font-semibold text-gray-900">Daftar Dusun</h2>
              <router-link
                to="/admin/dusun"
                class="text-xs text-primary-600 hover:text-primary-700"
              >
                Lihat semua
              </router-link>
            </div>
          </div>
          <div class="divide-y divide-gray-100">
            <div
              v-for="dusun in dusunList"
              :key="dusun.id"
              class="p-4 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium text-gray-900">{{ dusun.nama_dusun }}</h3>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ dusun.kepala_dusun || 'Kepala dusun belum diisi' }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-xs text-gray-500">{{ dusun.jumlah_kk }} KK</p>
                  <p class="text-xs text-gray-400">
                    {{ dusun.jumlah_rw }} RW • {{ dusun.jumlah_rt }} RT
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pengajuan Terbaru -->
        <div
          class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div class="p-4 sm:p-5 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <h2 class="text-base font-semibold text-gray-900">Pengajuan Terbaru</h2>
              <router-link
                to="/admin/pengajuan-bansos"
                class="text-xs text-primary-600 hover:text-primary-700"
              >
                Lihat semua
              </router-link>
            </div>
          </div>
          <div class="divide-y divide-gray-100">
            <div
              v-for="pengajuan in recentPengajuan"
              :key="pengajuan.id"
              class="p-4 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0">
                    <div
                      class="w-8 h-8 rounded-full"
                      :class="getJenisWarna(pengajuan.jenis_bansos)"
                    >
                      <div class="w-full h-full flex items-center justify-center">
                        <span class="text-white text-xs font-bold">{{
                          getInitials(pengajuan.nama_bansos)
                        }}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 class="text-sm font-medium text-gray-900">{{ pengajuan.kk_nama }}</h3>
                    <p class="text-xs text-gray-500 mt-1">{{ pengajuan.nama_bansos }}</p>
                    <div class="flex items-center mt-2 space-x-2">
                      <Badge :variant="getStatusVariant(pengajuan.status)" size="sm">
                        {{ getStatusText(pengajuan.status) }}
                      </Badge>
                      <span class="text-xs text-gray-400">{{
                        formatDate(pengajuan.created_at, 'short')
                      }}</span>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-xs text-gray-500">{{ pengajuan.nama_dusun }}</p>
                  <p class="text-xs text-gray-400">
                    RW {{ pengajuan.nomor_rw }} / RT {{ pengajuan.nomor_rt }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Aktivitas Harian -->
      <div class="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div class="flex items-center">
            <div class="p-2 bg-blue-50 rounded-lg">
              <UserPlusIcon class="w-4 h-4 text-blue-600" />
            </div>
            <div class="ml-3">
              <p class="text-xs text-gray-500">Registrasi Hari Ini</p>
              <p class="text-lg font-semibold text-gray-900">{{ getTodayRegistrations }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div class="flex items-center">
            <div class="p-2 bg-green-50 rounded-lg">
              <CheckCircleIcon class="w-4 h-4 text-green-600" />
            </div>
            <div class="ml-3">
              <p class="text-xs text-gray-500">Pengajuan Diterima</p>
              <p class="text-lg font-semibold text-gray-900">
                {{ pengajuanStats.overall.diterima }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-50 rounded-lg">
              <ClockIcon class="w-4 h-4 text-yellow-600" />
            </div>
            <div class="ml-3">
              <p class="text-xs text-gray-500">Menunggu Verifikasi</p>
              <p class="text-lg font-semibold text-gray-900">
                {{ pengajuanStats.overall.menunggu }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div class="flex items-center">
            <div class="p-2 bg-purple-50 rounded-lg">
              <HomeIcon class="w-4 h-4 text-purple-600" />
            </div>
            <div class="ml-3">
              <p class="text-xs text-gray-500">Total KK</p>
              <p class="text-lg font-semibold text-gray-900">
                {{ wilayahStats.total_kk_terdaftar }}
              </p>
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
import { useAuthStore } from '@/stores/auth'
import { profileService } from '@/services/profile'
import { usersService } from '@/services/users'
import { dusunService } from '@/services/dusun'
import { bansosService } from '@/services/bansos'
import { pengajuanService } from '@/services/pengajuan'
import Badge from '@/components/ui/Badge.vue'
import {
  UsersIcon,
  UserGroupIcon,
  MapIcon,
  GiftIcon,
  CalendarIcon,
  ClockIcon,
  StarIcon,
  UserPlusIcon,
  CheckCircleIcon,
  HomeIcon,
} from '@heroicons/vue/24/outline'
import { getInitials, formatDate, formatNumber } from '@/utils/helpers'

const router = useRouter()
const authStore = useAuthStore()

// State
const loading = ref(true)
const profile = ref({})
const userStats = ref({
  total: 0,
  verified: 0,
  unverified: 0,
  kepalaKeluarga: 0,
  admin: 0,
})
const wilayahStats = ref({
  total_dusun: 0,
  total_rw: 0,
  total_rt: 0,
  total_kk_terdaftar: 0,
})
const bansosStats = ref({
  total_bansos: 0,
  aktif: 0,
  draft: 0,
  selesai: 0,
  dibatalkan: 0,
  tunai: 0,
  barang: 0,
  jasa: 0,
  total_kuota: 0,
  total_pengajuan: 0,
  total_diterima: 0,
  total_ditolak: 0,
  by_kategori: [],
})
const pengajuanStats = ref({
  overall: {
    total: 0,
    menunggu: 0,
    diproses: 0,
    diterima: 0,
    ditolak: 0,
    avg_rating: 0,
    total_rating: 0,
  },
  daily: [],
})
const dusunList = ref([])
const pengajuanList = ref([])

// Current date and time
const currentDate = ref(
  new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
)
const currentTime = ref(
  new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }),
)

// Update time every minute
setInterval(() => {
  currentTime.value = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })
}, 60000)

// Computed
const recentPengajuan = computed(() => {
  return pengajuanList.value.slice(0, 5)
})

const getTodayRegistrations = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  const daily = userStats.value.dailyRegistrations?.find(
    (d) => new Date(d.registration_date).toISOString().split('T')[0] === today,
  )
  return daily?.daily_registrations || 0
})

// Helper functions
const getPercentage = (value, total) => {
  if (!total) return 0
  return (value / total) * 100
}

const getCategoryColor = (kategori) => {
  const colors = {
    TUNAI: 'bg-green-500',
    BARANG: 'bg-purple-500',
    JASA: 'bg-blue-500',
    SEMBAKO: 'bg-orange-500',
    KESEHATAN: 'bg-red-500',
  }
  return colors[kategori] || 'bg-gray-500'
}

const getJenisWarna = (jenis) => {
  const colors = {
    TUNAI: 'bg-green-600',
    BARANG: 'bg-purple-600',
    JASA: 'bg-blue-600',
  }
  return colors[jenis] || 'bg-primary-600'
}

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

// Fetch all data
const fetchDashboardData = async () => {
  loading.value = true

  try {
    // Fetch all data in parallel
    const [
      profileRes,
      userStatsRes,
      userListRes,
      wilayahStatsRes,
      dusunRes,
      bansosStatsRes,
      bansosListRes,
      pengajuanStatsRes,
      pengajuanListRes,
    ] = await Promise.allSettled([
      profileService.getProfile(),
      usersService.getStatistics(),
      usersService.getKepalaKeluargaList(),
      dusunService.getStatistics(),
      dusunService.getDusunList(),
      bansosService.getStatistics(),
      bansosService.getBansosList(),
      pengajuanService.getStatistics(),
      pengajuanService.getAllPengajuan({ limit: 10 }),
    ])

    // Profile
    if (profileRes.status === 'fulfilled' && profileRes.value.success) {
      profile.value = profileRes.value.data
    }

    // User Statistics
    if (userStatsRes.status === 'fulfilled' && userStatsRes.value.success) {
      const stats = userStatsRes.value.data.statistics
      userStats.value = {
        total: stats.total || 0,
        verified: stats.verified || 0,
        unverified: stats.unverified || 0,
        admin: stats.admin || 0,
        kepalaKeluarga: stats.total - (stats.admin || 0),
        dailyRegistrations: stats.dailyRegistrations || [],
      }
    }

    // User List untuk hitung kepala keluarga (fallback)
    if (userListRes.status === 'fulfilled' && userListRes.value.success) {
      const users = userListRes.value.data.data || []
      const kepalaKeluarga = users.filter((u) => u.role_name === 'kepala_keluarga').length
      if (!userStats.value.kepalaKeluarga) {
        userStats.value.kepalaKeluarga = kepalaKeluarga
      }
    }

    // Wilayah Statistics
    if (wilayahStatsRes.status === 'fulfilled' && wilayahStatsRes.value.success) {
      wilayahStats.value = wilayahStatsRes.value.data
    }

    // Dusun List
    if (dusunRes.status === 'fulfilled' && dusunRes.value.success) {
      dusunList.value = dusunRes.value.data || []
    }

    // Bansos Statistics
    if (bansosStatsRes.status === 'fulfilled' && bansosStatsRes.value.success) {
      bansosStats.value = bansosStatsRes.value.data
    }

    // Bansos List (for additional data)
    if (bansosListRes.status === 'fulfilled' && bansosListRes.value.success) {
      const bansos = bansosListRes.value.data.data || []
      if (!bansosStats.value.total_bansos) {
        bansosStats.value.total_bansos = bansos.length
      }
    }

    // Pengajuan Statistics
    if (pengajuanStatsRes.status === 'fulfilled' && pengajuanStatsRes.value.success) {
      pengajuanStats.value = pengajuanStatsRes.value.data
    }

    // Pengajuan List
    if (pengajuanListRes.status === 'fulfilled' && pengajuanListRes.value.success) {
      pengajuanList.value = pengajuanListRes.value.data.data || []
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
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
