<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header with Welcome Section -->
    <div class="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div class="flex items-center space-x-4">
            <!-- Avatar -->
            <div class="relative">
              <div
                class="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center ring-4 ring-white/30"
              >
                <span v-if="!profile.foto_profil" class="text-2xl font-bold text-white">
                  {{ getInitials(profile.nama_lengkap) }}
                </span>
                <img
                  v-else
                  :src="profile.foto_profil"
                  :alt="profile.nama_lengkap"
                  class="w-full h-full rounded-full object-cover"
                />
              </div>
              <div
                class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full"
              ></div>
            </div>

            <!-- Welcome Text -->
            <div>
              <h1 class="text-2xl font-bold">Selamat Datang, {{ profile.nama_lengkap }}!</h1>
              <p class="text-primary-100 mt-1 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {{ profile.nama_dusun }} • RW {{ profile.nomor_rw }} / RT {{ profile.nomor_rt }}
              </p>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="mt-4 md:mt-0 flex flex-wrap gap-4">
            <div class="bg-white/10 backdrop-blur rounded-lg px-4 py-2">
              <p class="text-xs text-primary-200">NIK</p>
              <p class="text-sm font-semibold">{{ profile.nik }}</p>
            </div>
            <div class="bg-white/10 backdrop-blur rounded-lg px-4 py-2">
              <p class="text-xs text-primary-200">Terakhir Login</p>
              <p class="text-sm font-semibold">{{ formatDate(profile.last_login, 'short') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <!-- Total Anggota Keluarga -->
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">Anggota Keluarga</p>
              <p class="text-2xl font-bold text-gray-900">{{ anggotaKeluarga.length }}</p>
              <p class="text-xs text-gray-400 mt-1">
                Kepala Keluarga + {{ anggotaKeluarga.length - 1 }}
              </p>
            </div>
            <div class="p-3 bg-blue-50 rounded-lg">
              <UsersIcon class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <!-- Total Bansos Aktif -->
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">Bansos Aktif</p>
              <p class="text-2xl font-bold text-gray-900">{{ bansosAktif.length }}</p>
              <p class="text-xs text-gray-400 mt-1">Program tersedia</p>
            </div>
            <div class="p-3 bg-green-50 rounded-lg">
              <GiftIcon class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <!-- Total Pengajuan -->
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">Total Pengajuan</p>
              <p class="text-2xl font-bold text-gray-900">{{ pengajuanList.length }}</p>
              <p class="text-xs text-gray-400 mt-1">Semua waktu</p>
            </div>
            <div class="p-3 bg-purple-50 rounded-lg">
              <DocumentTextIcon class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <!-- Pengajuan Diterima -->
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">Pengajuan Diterima</p>
              <p class="text-2xl font-bold text-gray-900">{{ pengajuanDiterima }}</p>
              <p class="text-xs text-green-600 mt-1">
                {{ ((pengajuanDiterima / pengajuanList.length) * 100 || 0).toFixed(0) }}% success
                rate
              </p>
            </div>
            <div class="p-3 bg-green-50 rounded-lg">
              <CheckBadgeIcon class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Main Grid - 2 Columns -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - 2/3 width -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Pengajuan Terbaru Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">Pengajuan Terbaru</h2>
              <router-link
                to="/pengajuan-bansos-saya"
                class="text-sm text-primary-600 hover:text-primary-700 flex items-center"
              >
                Lihat Semua
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </router-link>
            </div>

            <div class="divide-y divide-gray-100">
              <div
                v-for="item in pengajuanTerbaru"
                :key="item.id"
                class="p-4 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-start justify-between">
                  <div class="flex items-start space-x-3">
                    <!-- Avatar Bansos -->
                    <div class="flex-shrink-0">
                      <div
                        :class="[
                          'w-10 h-10 rounded-lg flex items-center justify-center',
                          item.jenis_bansos === 'TUNAI'
                            ? 'bg-green-100'
                            : item.jenis_bansos === 'BARANG'
                              ? 'bg-purple-100'
                              : 'bg-blue-100',
                        ]"
                      >
                        <span
                          class="text-sm font-bold"
                          :class="[
                            item.jenis_bansos === 'TUNAI'
                              ? 'text-green-600'
                              : item.jenis_bansos === 'BARANG'
                                ? 'text-purple-600'
                                : 'text-blue-600',
                          ]"
                        >
                          {{ getInitials(item.nama_bansos) }}
                        </span>
                      </div>
                    </div>

                    <!-- Content -->
                    <div class="flex-1">
                      <div class="flex items-center space-x-2">
                        <h3 class="text-sm font-semibold text-gray-900">{{ item.nama_bansos }}</h3>
                        <Badge :variant="getStatusVariant(item.status)" size="sm">
                          {{ getStatusText(item.status) }}
                        </Badge>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">{{ item.kode_bansos }}</p>
                      <p class="text-xs text-gray-600 mt-2 line-clamp-2">
                        {{ item.alasan_pengajuan }}
                      </p>
                      <div class="flex items-center mt-2 text-xs text-gray-400">
                        <svg
                          class="w-3 h-3 mr-1"
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
                        {{ formatDate(item.created_at) }}
                      </div>
                    </div>
                  </div>

                  <!-- Nominal jika TUNAI -->
                  <div v-if="item.jenis_bansos === 'TUNAI'" class="text-right">
                    <p class="text-sm font-semibold text-green-600">
                      Rp {{ formatRupiah(item.jumlah_nominal) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Anggota Keluarga Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">Anggota Keluarga</h2>
              <span class="text-sm text-gray-500">{{ anggotaKeluarga.length }} orang</span>
            </div>

            <div class="p-4">
              <!-- Kepala Keluarga (highlight) -->
              <div class="bg-primary-50 rounded-lg p-4 mb-3 border border-primary-100">
                <div class="flex items-center">
                  <div
                    class="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-lg"
                  >
                    {{ getInitials(profile.nama_lengkap) }}
                  </div>
                  <div class="ml-4 flex-1">
                    <div class="flex items-center">
                      <h3 class="font-semibold text-gray-900">{{ profile.nama_lengkap }}</h3>
                      <Badge variant="primary" size="sm" class="ml-2">Kepala Keluarga</Badge>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">NIK: {{ profile.nik }}</p>
                  </div>
                </div>
              </div>

              <!-- Anggota Lainnya -->
              <div
                v-for="anggota in anggotaLainnya"
                :key="anggota.id"
                class="flex items-center py-3 border-b border-gray-100 last:border-0"
              >
                <div
                  class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold"
                >
                  {{ getInitials(anggota.nama_lengkap) }}
                </div>
                <div class="ml-3 flex-1">
                  <div class="flex items-center">
                    <h4 class="text-sm font-medium text-gray-900">{{ anggota.nama_lengkap }}</h4>
                    <Badge :variant="getHubunganVariant(anggota.hubungan)" size="sm" class="ml-2">
                      {{ formatHubungan(anggota.hubungan) }}
                    </Badge>
                  </div>
                  <div class="flex items-center mt-1 text-xs text-gray-500">
                    <span>{{ anggota.nik }}</span>
                    <span class="mx-2">•</span>
                    <span>{{ calculateAge(anggota.tanggal_lahir) }}</span>
                    <span class="mx-2">•</span>
                    <Badge
                      :variant="anggota.status_tinggal === 'TINGGAL' ? 'success' : 'warning'"
                      size="sm"
                    >
                      {{ formatStatusTinggal(anggota.status_tinggal) }}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - 1/3 width -->
        <div class="space-y-6">
          <!-- Profile Info Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-semibold text-gray-900">Informasi Pribadi</h2>
            </div>
            <div class="p-4">
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-sm text-gray-500">NIK</span>
                  <span class="text-sm font-medium text-gray-900">{{ profile.nik }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-sm text-gray-500">Email</span>
                  <span class="text-sm font-medium text-gray-900">{{ profile.email || '-' }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-sm text-gray-500">Telepon</span>
                  <span class="text-sm font-medium text-gray-900">{{
                    profile.telepon || '-'
                  }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-sm text-gray-500">Tempat/Tgl Lahir</span>
                  <span class="text-sm font-medium text-gray-900"
                    >{{ profile.tempat_lahir || '-' }},
                    {{ formatDate(profile.tanggal_lahir) }}</span
                  >
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-sm text-gray-500">Agama</span>
                  <span class="text-sm font-medium text-gray-900">{{
                    formatAgama(profile.agama)
                  }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-sm text-gray-500">Pekerjaan</span>
                  <span class="text-sm font-medium text-gray-900">{{
                    profile.pekerjaan || '-'
                  }}</span>
                </div>
                <div class="flex justify-between py-2">
                  <span class="text-sm text-gray-500">Status Kawin</span>
                  <span class="text-sm font-medium text-gray-900">{{
                    formatStatusKawin(profile.status_perkawinan)
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Bansos Aktif Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-semibold text-gray-900">Bansos Aktif</h2>
            </div>
            <div class="divide-y divide-gray-100">
              <div
                v-for="bansos in bansosAktif"
                :key="bansos.id"
                class="p-4 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-start">
                  <div
                    :class="[
                      'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                      bansos.jenis_bansos === 'TUNAI'
                        ? 'bg-green-100'
                        : bansos.jenis_bansos === 'BARANG'
                          ? 'bg-purple-100'
                          : 'bg-blue-100',
                    ]"
                  >
                    <span
                      :class="[
                        'text-sm font-bold',
                        bansos.jenis_bansos === 'TUNAI'
                          ? 'text-green-600'
                          : bansos.jenis_bansos === 'BARANG'
                            ? 'text-purple-600'
                            : 'text-blue-600',
                      ]"
                    >
                      {{ getInitials(bansos.nama_bansos) }}
                    </span>
                  </div>
                  <div class="ml-3 flex-1">
                    <h3 class="text-sm font-semibold text-gray-900">{{ bansos.nama_bansos }}</h3>
                    <p class="text-xs text-gray-500 mt-1">{{ bansos.kode_bansos }}</p>
                    <div class="flex items-center mt-2 text-xs">
                      <Badge
                        :variant="bansos.prioritas === 'TINGGI' ? 'danger' : 'warning'"
                        size="sm"
                      >
                        {{ bansos.prioritas }}
                      </Badge>
                      <span class="mx-2 text-gray-300">|</span>
                      <span class="text-gray-500">Kuota: {{ bansos.kuota }}</span>
                    </div>
                    <p class="text-xs text-gray-400 mt-2">
                      {{ formatDate(bansos.tanggal_mulai) }} -
                      {{ formatDate(bansos.tanggal_selesai) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-semibold text-gray-900">Aksi Cepat</h2>
            </div>
            <div class="p-4 space-y-3">
              <router-link
                to="/daftar-bansos"
                class="flex items-center p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
              >
                <div class="p-2 bg-primary-600 rounded-lg">
                  <GiftIcon class="w-5 h-5 text-white" />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-semibold text-gray-900">Ajukan Bansos</p>
                  <p class="text-xs text-gray-500">Lihat bansos tersedia</p>
                </div>
              </router-link>

              <router-link
                to="/pengajuan-bansos-saya"
                class="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <div class="p-2 bg-purple-600 rounded-lg">
                  <DocumentTextIcon class="w-5 h-5 text-white" />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-semibold text-gray-900">Riwayat Pengajuan</p>
                  <p class="text-xs text-gray-500">Cek status pengajuan</p>
                </div>
              </router-link>

              <router-link
                to="/profile"
                class="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div class="p-2 bg-green-600 rounded-lg">
                  <UserIcon class="w-5 h-5 text-white" />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-semibold text-gray-900">Edit Profil</p>
                  <p class="text-xs text-gray-500">Perbarui data diri</p>
                </div>
              </router-link>
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
import { anggotaKeluargaService } from '@/services/anggotaKeluarga'
import { bansosService } from '@/services/bansos'
import { pengajuanService } from '@/services/pengajuan'
import Badge from '@/components/ui/Badge.vue'
import {
  UsersIcon,
  GiftIcon,
  DocumentTextIcon,
  CheckBadgeIcon,
  UserIcon,
} from '@heroicons/vue/24/outline'
import { getInitials, formatDate, calculateAge, formatRupiah } from '@/utils/helpers'

const router = useRouter()
const authStore = useAuthStore()

// State
const loading = ref(true)
const profile = ref({})
const anggotaKeluarga = ref([])
const bansosAktif = ref([])
const pengajuanList = ref([])

// Computed
const anggotaLainnya = computed(() => {
  return anggotaKeluarga.value.filter((a) => a.hubungan !== 'KEPALA_KELUARGA')
})

const pengajuanDiterima = computed(() => {
  return pengajuanList.value.filter((p) => p.status === 'DITERIMA').length
})

const pengajuanTerbaru = computed(() => {
  return pengajuanList.value
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3)
})

// Helper functions
const formatHubungan = (hubungan) => {
  const map = {
    ISTRI: 'Istri',
    ANAK: 'Anak',
    SUAMI: 'Suami',
    CUCU: 'Cucu',
    ORANG_TUA: 'Orang Tua',
    MENANTU: 'Menantu',
    FAMILI_LAIN: 'Famili Lain',
  }
  return map[hubungan] || hubungan
}

const formatStatusTinggal = (status) => {
  return status === 'TINGGAL' ? 'Tinggal' : 'Tidak Tinggal'
}

const formatAgama = (agama) => {
  const map = {
    ISLAM: 'Islam',
    KRISTEN: 'Kristen',
    KATOLIK: 'Katolik',
    HINDU: 'Hindu',
    BUDDHA: 'Buddha',
    KONGHUCU: 'Konghucu',
  }
  return map[agama] || agama
}

const formatStatusKawin = (status) => {
  const map = {
    BELUM_KAWIN: 'Belum Kawin',
    KAWIN: 'Kawin',
    CERAI_HIDUP: 'Cerai Hidup',
    CERAI_MATI: 'Cerai Mati',
  }
  return map[status] || status
}

const getHubunganVariant = (hubungan) => {
  const map = {
    ISTRI: 'warning',
    ANAK: 'info',
    SUAMI: 'primary',
    CUCU: 'success',
    ORANG_TUA: 'danger',
  }
  return map[hubungan] || 'gray'
}

const getStatusVariant = (status) => {
  const map = {
    MENUNGGU: 'warning',
    DIPROSES: 'info',
    DITERIMA: 'success',
    DITOLAK: 'danger',
  }
  return map[status] || 'gray'
}

const getStatusText = (status) => {
  const map = {
    MENUNGGU: 'Menunggu',
    DIPROSES: 'Diproses',
    DITERIMA: 'Diterima',
    DITOLAK: 'Ditolak',
  }
  return map[status] || status
}

// Fetch all data
const fetchData = async () => {
  loading.value = true

  try {
    // Fetch all data in parallel
    const [profileRes, anggotaRes, bansosRes, pengajuanRes] = await Promise.all([
      profileService.getProfile(),
      anggotaKeluargaService.getAnggotaKeluargaList(),
      bansosService.getBansosActive(),
      pengajuanService.getMyPengajuan(),
    ])

    if (profileRes.success) {
      profile.value = profileRes.data
    }

    anggotaKeluarga.value = anggotaRes || []

    bansosAktif.value = bansosRes || []

    pengajuanList.value = pengajuanRes || []
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* Smooth transitions */
.hover\:shadow-md {
  transition: box-shadow 0.2s ease;
}

/* Line clamp for text */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
