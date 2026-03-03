<template>
  <div>
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <!-- Total Penduduk Card -->
      <Card>
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-blue-100 rounded-lg">
              <UserGroupIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Total Terverifikasi</dt>
              <dd class="text-lg font-semibold text-gray-900">{{ totalKepalaKeluarga }}</dd>
            </dl>
          </div>
        </div>
      </Card>

      <!-- Total Keluarga Card -->
      <Card>
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-green-100 rounded-lg">
              <HomeIcon class="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Jumlah Dusun</dt>
              <dd class="text-lg font-semibold text-gray-900">
                {{ totalDusun }}
              </dd>
            </dl>
          </div>
        </div>
      </Card>

      <!-- Bansos Aktif Card -->
      <Card>
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-yellow-100 rounded-lg">
              <CurrencyDollarIcon class="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Bansos Aktif</dt>
              <dd class="text-lg font-semibold text-gray-900">
                {{ totalBansos }}
              </dd>
            </dl>
          </div>
        </div>
      </Card>

      <!-- Pengaduan Card -->
      <Card>
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-red-100 rounded-lg">
              <ExclamationCircleIcon class="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Bansos Ditolak</dt>
              <dd class="text-lg font-semibold text-gray-900">
                {{ bansosdiTolak }}
              </dd>
            </dl>
          </div>
        </div>
      </Card>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Welcome Message -->
        <Card title="Selamat Datang" :padding="'lg'">
          <div class="space-y-4">
            <p class="text-gray-600">
              Selamat datang kembali, <span class="font-semibold">{{ user?.nama_lengkap }}</span
              >! Berikut adalah ringkasan aktivitas terbaru di sistem Desa Ku.
            </p>

            <div v-if="isAdmin" class="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <ShieldCheckIcon class="h-5 w-5 text-blue-400" />
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-blue-800">
                    Anda login sebagai Administrator
                  </h3>
                  <div class="mt-2 text-sm text-blue-700">
                    <p>
                      Anda memiliki akses penuh untuk mengelola data penduduk, keluarga, bansos, dan
                      pengaduan.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="bg-green-50 border border-green-100 rounded-lg p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <UserIcon class="h-5 w-5 text-green-400" />
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800">
                    Anda login sebagai Kepala Keluarga
                  </h3>
                  <div class="mt-2 text-sm text-green-700">
                    <p>
                      Anda dapat melihat data keluarga, mengajukan bansos, dan membuat pengaduan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <!-- Recent Activities -->
        <Card title="Aktivitas Terbaru" subtitle="Update terbaru dari sistem">
          <div class="flow-root">
            <ul role="list" class="-mb-8">
              <li v-for="(activity, index) in activities" :key="activity.id">
                <div class="relative pb-8">
                  <span
                    v-if="index !== activities.length - 1"
                    class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                  <div class="relative flex space-x-3">
                    <div>
                      <span
                        :class="[
                          activity.iconBackground,
                          'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white',
                        ]"
                      >
                        <component :is="activity.icon" class="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p class="text-sm text-gray-800">
                          {{ activity.content }}
                          <span v-if="activity.href" class="font-medium text-gray-900">
                            {{ activity.target }}
                          </span>
                        </p>
                        <p class="mt-1 text-xs text-gray-500">
                          {{ activity.time }}
                        </p>
                      </div>
                      <div class="whitespace-nowrap text-right text-sm text-gray-500">
                        <time :datetime="activity.datetime">{{ activity.date }}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div class="mt-6">
            <Button variant="outline" size="sm" fullWidth> Lihat Semua Aktivitas </Button>
          </div>
        </Card>
      </div>

      <!-- Right Column -->
      <div class="space-y-8">
        <!-- Quick Actions -->
        <Card title="Aksi Cepat" subtitle="Tindakan yang sering digunakan">
          <div class="space-y-3">
            <Button
              v-for="action in quickActions"
              :key="action.name"
              @click="action.handler"
              :variant="action.variant"
              size="sm"
              fullWidth
              class="justify-start"
            >
              <component :is="action.icon" class="mr-2 h-4 w-4" />
              {{ action.name }}
            </Button>
          </div>
        </Card>

        <!-- Status Bansos -->
        <Card title="Status Bansos" subtitle="Status bantuan sosial Anda">
          <div v-if="isKepalaKeluarga">
            <div v-if="bansosStatus" class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-900">Status Terakhir:</span>
                <Badge :variant="bansosStatus.variant">
                  {{ bansosStatus.text }}
                </Badge>
              </div>
              <div class="text-sm text-gray-600">
                <p>{{ bansosStatus.message }}</p>
              </div>
              <Button v-if="bansosStatus.action" @click="bansosStatus.handler" size="sm" fullWidth>
                {{ bansosStatus.action }}
              </Button>
            </div>
            <div v-else class="text-center py-6">
              <CurrencyDollarIcon class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada bansos</h3>
              <p class="mt-1 text-sm text-gray-500">
                Mulai ajukan bansos untuk mendapatkan bantuan.
              </p>
              <div class="mt-4">
                <Button @click="goToBansos" size="sm"> Ajukan Bansos </Button>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-6">
            <ShieldCheckIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">Panel Admin</h3>
            <p class="mt-1 text-sm text-gray-500">
              Anda dapat mengelola semua bansos dari menu Bansos.
            </p>
          </div>
        </Card>

        <!-- System Info -->
        <Card title="Info Sistem" subtitle="Informasi sistem terbaru">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Versi Aplikasi</span>
              <span class="text-sm font-medium text-gray-900">v1.0.0</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Terakhir Update</span>
              <span class="text-sm font-medium text-gray-900">2 hari lalu</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Status Server</span>
              <Badge variant="success">Online</Badge>
            </div>
          </div>

          <div class="mt-6 pt-6 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Pemakaian Storage</span>
              <span class="text-sm font-medium text-gray-900">45%</span>
            </div>
            <div class="mt-2">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-primary-600 h-2 rounded-full" style="width: 45%"></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import { usersService } from '@/services/users'
import { wilayahService } from '@/services/wilayah'
import { bansosService } from '@/services/bansos'

// Icons
import {
  UserGroupIcon,
  HomeIcon,
  CurrencyDollarIcon,
  ExclamationCircleIcon,
  UserIcon,
  ShieldCheckIcon,
  DocumentPlusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const isAdmin = computed(() => authStore.isAdmin)
const isKepalaKeluarga = computed(() => authStore.isKepalaKeluarga)
const totalKepalaKeluarga = ref(0)
const totalDusun = ref(0)
const totalBansos = ref(0)
const bansosdiTolak = ref(0)

onMounted(async () => {
  const [kk, dusun, bansos, ditolak] = await Promise.all([
    usersService.getTotalKepalaKeluarga(),
    wilayahService.getTotalDusun(),
    bansosService.getTotalBansos(),
    bansosService.getBansosTolak(),
  ])

  totalKepalaKeluarga.value = kk
  totalDusun.value = dusun
  totalBansos.value = bansos
  bansosdiTolak.value = ditolak
})

// Stats data
const stats = ref({
  totalPenduduk: 1245,
  totalKeluarga: 312,
  bansosAktif: 8,
  pengaduanBaru: 3,
})

// Activities data
const activities = ref([
  {
    id: 1,
    content: 'Bansos bulan Januari telah',
    target: 'disetujui',
    href: '#',
    icon: CheckCircleIcon,
    iconBackground: 'bg-green-500',
    datetime: '2024-01-15T10:00',
    date: '15 Jan',
    time: '10:00 WIB',
  },
  {
    id: 2,
    content: 'Pengaduan baru dari',
    target: 'Budi Santoso',
    href: '#',
    icon: ExclamationTriangleIcon,
    iconBackground: 'bg-yellow-500',
    datetime: '2024-01-14T14:30',
    date: '14 Jan',
    time: '14:30 WIB',
  },
  {
    id: 3,
    content: 'Data penduduk telah',
    target: 'diperbarui',
    href: '#',
    icon: DocumentPlusIcon,
    iconBackground: 'bg-blue-500',
    datetime: '2024-01-13T09:15',
    date: '13 Jan',
    time: '09:15 WIB',
  },
  {
    id: 4,
    content: 'Pembaruan sistem',
    target: 'versi 1.0.0',
    href: '#',
    icon: ShieldCheckIcon,
    iconBackground: 'bg-purple-500',
    datetime: '2024-01-12T16:45',
    date: '12 Jan',
    time: '16:45 WIB',
  },
])

// Bansos status
const bansosStatus = computed(() => {
  if (!isKepalaKeluarga.value) return null

  return {
    text: 'Disetujui',
    variant: 'success',
    message:
      'Pengajuan bansos bulan Januari 2024 telah disetujui. Dana akan dicairkan dalam 3-5 hari kerja.',
    action: 'Lihat Detail',
    handler: () => router.push('/bansos/1'),
  }
})

// Quick actions
const quickActions = computed(() => {
  const actions = [
    {
      name: 'Tambah Data',
      icon: DocumentPlusIcon,
      variant: 'primary',
      handler: () => router.push(isAdmin.value ? '/penduduk/baru' : '/profil-keluarga'),
      show: isAdmin.value,
    },
    {
      name: 'Ajukan Bansos',
      icon: CurrencyDollarIcon,
      variant: 'success',
      handler: () => router.push('/bansos/ajukan'),
      show: isKepalaKeluarga.value,
    },
    {
      name: 'Buat Pengaduan',
      icon: ExclamationTriangleIcon,
      variant: 'warning',
      handler: () => router.push('/pengaduan/baru'),
      show: true,
    },
    {
      name: 'Lihat Laporan',
      icon: ArrowRightIcon,
      variant: 'outline',
      handler: () => router.push('/laporan'),
      show: isAdmin.value,
    },
  ]

  return actions.filter((action) => action.show)
})

const goToBansos = () => {
  router.push('/bansos')
}

// onMounted(() => {
//   // Fetch dashboard data
//   fetchDashboardData()
// })

// const fetchDashboardData = async () => {
//   // In production, fetch from API
//   // For now, use mock data
//   await new Promise((resolve) => setTimeout(resolve, 1000))
// }
</script>
