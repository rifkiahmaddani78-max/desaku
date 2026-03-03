<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 mb-2">Detail Kepala Keluarga</h1>
          <p class="text-sm text-gray-600">Informasi lengkap data kepala keluarga</p>
        </div>
        <div class="flex space-x-3">
          <router-link :to="`/admin/kepala-keluarga/${data.id}/edit`">
            <Button variant="primary">
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Data
            </Button>
          </router-link>
          <Button variant="outline" @click="router.push('/admin/kepala-keluarga')">
            <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Kembali
          </Button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column - Personal Information -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Personal Info Card -->
        <Card title="Informasi Pribadi">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Avatar and Basic Info -->
            <div class="md:col-span-2 flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div class="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                <span class="text-primary-700 font-bold text-xl">
                  {{ getInitials(data.nama_lengkap) }}
                </span>
              </div>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">{{ data.nama_lengkap }}</h2>
                <div class="flex items-center space-x-4 mt-1">
                  <Badge :variant="data.is_verified ? 'success' : 'warning'">
                    {{ data.is_verified ? 'Terverifikasi' : 'Belum Terverifikasi' }}
                  </Badge>
                  <span class="text-sm text-gray-500">NIK: {{ data.nik }}</span>
                </div>
              </div>
            </div>

            <!-- Basic Details -->
            <DetailItem label="NIK" :value="data.nik" />
            <DetailItem label="Username" :value="data.username" />
            <DetailItem
              label="Jenis Kelamin"
              :value="data.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'"
            />
            <DetailItem label="Tempat Lahir" :value="data.tempat_lahir || '-'" />
            <DetailItem label="Tanggal Lahir" :value="formatDate(data.tanggal_lahir)" />
            <DetailItem label="Usia" :value="calculateAge(data.tanggal_lahir)" />
            <DetailItem label="Agama" :value="data.agama || '-'" />
          </div>
        </Card>

        <!-- Contact & Account Info -->
        <Card title="Kontak & Akun">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailItem label="Email" :value="data.email || '-'" />
            <DetailItem label="Nomor Telepon" :value="data.telepon || '-'" />
            <DetailItem label="Pekerjaan" :value="data.pekerjaan || '-'" />
            <DetailItem
              label="Status Perkawinan"
              :value="getMaritalStatus(data.status_perkawinan)"
            />
            <div class="md:col-span-2">
              <DetailItem label="Terdaftar Sejak" :value="formatDateTime(data.created_at)" />
            </div>
          </div>
        </Card>

        <!-- NEW: Alamat Card -->
        <Card title="Informasi Alamat">
          <div class="space-y-4">
            <!-- Alamat Lengkap -->
            <div class="bg-gradient-to-r from-primary-50 to-blue-50 p-4 rounded-lg">
              <div class="flex items-start space-x-3">
                <div class="p-2 bg-primary-100 rounded-lg">
                  <svg
                    class="h-5 w-5 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500 mb-1">Alamat Lengkap</p>
                  <p class="text-base font-semibold text-gray-900">
                    {{ data.alamat_lengkap || '-' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Wilayah Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <!-- Dusun -->
              <div
                class="border border-gray-200 rounded-lg p-3 hover:border-primary-300 transition-colors"
              >
                <div class="flex items-center space-x-2 mb-2">
                  <div class="p-1.5 bg-green-100 rounded">
                    <BuildingOfficeIcon class="h-4 w-4 text-green-600" />
                  </div>
                  <span class="text-xs font-medium text-gray-500">Dusun</span>
                </div>
                <p class="text-sm font-semibold text-gray-900">{{ data.nama_dusun || '-' }}</p>
              </div>

              <!-- RW -->
              <div
                class="border border-gray-200 rounded-lg p-3 hover:border-primary-300 transition-colors"
              >
                <div class="flex items-center space-x-2 mb-2">
                  <div class="p-1.5 bg-purple-100 rounded">
                    <HomeModernIcon class="h-4 w-4 text-purple-600" />
                  </div>
                  <span class="text-xs font-medium text-gray-500">RW</span>
                </div>
                <p class="text-sm font-semibold text-gray-900">
                  {{ data.nomor_rw ? `RW ${data.nomor_rw}` : '-' }}
                </p>
              </div>

              <!-- RT -->
              <div
                class="border border-gray-200 rounded-lg p-3 hover:border-primary-300 transition-colors"
              >
                <div class="flex items-center space-x-2 mb-2">
                  <div class="p-1.5 bg-blue-100 rounded">
                    <UsersIcon class="h-4 w-4 text-blue-600" />
                  </div>
                  <span class="text-xs font-medium text-gray-500">RT</span>
                </div>
                <p class="text-sm font-semibold text-gray-900">
                  {{ data.nomor_rt ? `RT ${data.nomor_rt}` : '-' }}
                </p>
              </div>
            </div>

            <!-- Koordinat (if available) -->
            <div
              v-if="data.koordinat_lat && data.koordinat_lng"
              class="border-t border-gray-100 pt-4"
            >
              <div class="grid grid-cols-2 gap-4">
                <div class="flex items-center space-x-2">
                  <div class="p-1.5 bg-gray-100 rounded">
                    <svg
                      class="h-4 w-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Latitude</p>
                    <p class="text-sm font-medium text-gray-900">{{ data.koordinat_lat }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="p-1.5 bg-gray-100 rounded">
                    <svg
                      class="h-4 w-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Longitude</p>
                    <p class="text-sm font-medium text-gray-900">{{ data.koordinat_lng }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Coordinates Message -->
            <div v-else class="text-center py-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-500">Tidak ada data koordinat</p>
              <p class="text-xs text-gray-400 mt-1">
                Koordinat dapat ditambahkan melalui menu edit
              </p>
            </div>

            <!-- Additional Info -->
            <div class="flex items-center justify-between text-xs text-gray-400 pt-2">
              <div class="flex items-center">
                <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Data alamat berdasarkan struktur wilayah RT/RW</span>
              </div>
            </div>
          </div>
        </Card>

        <!-- Anggota Keluarga Card -->
        <Card title="Anggota Keluarga">
          <div v-if="anggotaList.length > 0" class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-900"> Total Anggota Keluarga </span>
              <Badge variant="info"> {{ anggotaList.length }} orang </Badge>
            </div>

            <div class="space-y-4">
              <div
                v-for="anggota in anggotaList"
                :key="anggota.id"
                class="border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <!-- Header Card -->
                <div
                  class="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center"
                >
                  <div class="flex items-center space-x-3">
                    <div
                      class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center"
                    >
                      <span class="text-primary-700 font-semibold text-sm">
                        {{ getInitials(anggota.nama_lengkap) }}
                      </span>
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-900">{{ anggota.nama_lengkap }}</h3>
                      <div class="flex items-center space-x-2 mt-1">
                        <Badge :variant="getHubunganBadgeVariant(anggota.hubungan)" size="sm">
                          {{ formatHubungan(anggota.hubungan) }}
                        </Badge>
                        <Badge
                          :variant="anggota.jenis_kelamin === 'L' ? 'info' : 'warning'"
                          size="sm"
                        >
                          {{ anggota.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}
                        </Badge>
                        <Badge :variant="getStatusTinggalVariant(anggota.status_tinggal)" size="sm">
                          {{ formatStatusTinggal(anggota.status_tinggal) }}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <span class="text-xs text-gray-500 font-medium"> NIK: {{ anggota.nik }} </span>
                </div>

                <!-- Detail Content -->
                <div class="p-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Kolom Kiri: Data Personal -->
                    <div class="space-y-3">
                      <div class="flex justify-between items-start">
                        <span class="text-sm text-gray-500">Usia</span>
                        <span class="text-sm font-medium text-gray-900">
                          {{ calculateAge(anggota.tanggal_lahir) }}
                        </span>
                      </div>
                      <div class="flex justify-between items-start">
                        <span class="text-sm text-gray-500">Tempat/Tgl Lahir</span>
                        <span class="text-sm font-medium text-gray-900 text-right">
                          {{ anggota.tempat_lahir || '-' }}<br />
                          <span class="text-gray-500 text-xs">
                            {{ formatDate(anggota.tanggal_lahir) }}
                          </span>
                        </span>
                      </div>
                      <div class="flex justify-between items-start">
                        <span class="text-sm text-gray-500">Agama</span>
                        <Badge size="sm" variant="outline">
                          {{ formatAgama(anggota.agama) }}
                        </Badge>
                      </div>
                    </div>

                    <!-- Kolom Kanan: Data Status -->
                    <div class="space-y-3">
                      <div class="flex justify-between items-start">
                        <span class="text-sm text-gray-500">Pendidikan</span>
                        <Badge size="sm" variant="outline">
                          {{ formatPendidikan(anggota.pendidikan_terakhir) }}
                        </Badge>
                      </div>
                      <div class="flex justify-between items-start">
                        <span class="text-sm text-gray-500">Pekerjaan</span>
                        <span class="text-sm font-medium text-gray-900">
                          {{ anggota.pekerjaan || 'Tidak bekerja' }}
                        </span>
                      </div>
                      <div class="flex justify-between items-start">
                        <span class="text-sm text-gray-500">Status Kawin</span>
                        <Badge
                          size="sm"
                          :variant="getMaritalStatusVariant(anggota.status_perkawinan)"
                        >
                          {{ formatStatusKawin(anggota.status_perkawinan) }}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <!-- Footer Card -->
                  <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span class="text-xs text-gray-400">
                      ID: {{ anggota.id }} • Dibuat: {{ formatDate(anggota.created_at) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8">
            <div class="mb-4">
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <p class="text-gray-500 mb-2">Belum ada anggota keluarga</p>
            <p class="text-sm text-gray-400">Tambahkan anggota keluarga melalui menu edit</p>
          </div>
        </Card>
      </div>

      <!-- Right Column - Actions & Status -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <Card title="Aksi Cepat">
          <div class="space-y-3">
            <Button
              variant="primary"
              fullWidth
              @click="router.push(`/admin/kepala-keluarga/${data.id}/edit`)"
            >
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Data
            </Button>

            <Button
              v-if="!data.is_verified"
              variant="success"
              fullWidth
              @click="verifyUser"
              :loading="verifying"
            >
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Verifikasi
            </Button>

            <Button variant="danger" fullWidth @click="confirmDelete">
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Hapus Data
            </Button>

            <Button variant="outline" fullWidth @click="router.push('/admin/kepala-keluarga')">
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Kembali ke Daftar
            </Button>
          </div>
        </Card>

        <!-- Status Information -->
        <Card title="Status Informasi">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">Status Akun</span>
              <Badge :variant="data.is_verified ? 'success' : 'warning'">
                {{ data.is_verified ? 'Aktif' : 'Belum Aktif' }}
              </Badge>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">Terakhir Login</span>
              <span class="text-sm text-gray-500">
                {{ data.last_login ? formatDateTime(data.last_login) : 'Belum pernah login' }}
              </span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">ID User</span>
              <code class="text-xs bg-gray-100 px-2 py-1 rounded">{{ data.id }}</code>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">Role</span>
              <Badge variant="info">Kepala Keluarga</Badge>
            </div>
          </div>
        </Card>

        <!-- System Information -->
        <Card title="Informasi Sistem">
          <div class="space-y-3">
            <DetailItem label="Dibuat Pada" :value="formatDateTime(data.created_at)" />
            <DetailItem label="Terakhir Diperbarui" :value="formatDateTime(data.updated_at)" />

            <div class="pt-4 border-t border-gray-200">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Catatan:</h4>
              <ul class="text-xs text-gray-600 space-y-1">
                <li class="flex items-start">
                  <svg
                    class="h-3 w-3 text-gray-400 mt-0.5 mr-1"
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
                  Data dapat diedit kapan saja
                </li>
                <li class="flex items-start">
                  <svg
                    class="h-3 w-3 text-gray-400 mt-0.5 mr-1"
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
                  Penghapusan data tidak dapat dikembalikan
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usersService } from '@/services/users'
import { anggotaKeluargaService } from '@/services/anggotaKeluarga'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import DetailItem from '@/components/ui/DetailItem.vue'
import { getInitials, formatDate, formatDateTime } from '@/utils/helpers'
import { BuildingOfficeIcon, HomeModernIcon, UsersIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()

const anggotaList = ref([])

const data = ref({
  id: '',
  nama_lengkap: '',
  nik: '',
  username: '',
  jenis_kelamin: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  agama: '',
  pekerjaan: '',
  status_perkawinan: '',
  email: '',
  telepon: '',
  is_verified: 0,
  jumlah_anggota_keluarga: 0,
  created_at: '',
  updated_at: '',
  last_login: '',
  // New address fields
  alamat_lengkap: '',
  koordinat_lat: null,
  koordinat_lng: null,
  nama_dusun: '',
  nomor_rw: '',
  nomor_rt: '',
})

const loading = ref(true)
const verifying = ref(false)

onMounted(async () => {
  await fetchDetail()
})

const fetchDetail = async () => {
  try {
    loading.value = true
    const response = await usersService.getDetailKepalaKeluarga(route.params.id)

    // Check if response has data property (from your JSON structure)
    const userData = response.data || response

    // Map data to ensure all fields exist
    data.value = {
      id: userData.id || '',
      nama_lengkap: userData.nama_lengkap || '',
      nik: userData.nik || '',
      username: userData.username || '',
      jenis_kelamin: userData.jenis_kelamin || 'L',
      tempat_lahir: userData.tempat_lahir || '',
      tanggal_lahir: userData.tanggal_lahir || '',
      agama: userData.agama || '',
      pekerjaan: userData.pekerjaan || '',
      status_perkawinan: userData.status_perkawinan || 'BELUM_KAWIN',
      email: userData.email || '',
      telepon: userData.telepon || '',
      is_verified: userData.is_verified || 0,
      jumlah_anggota_keluarga: userData.jumlah_anggota_keluarga || 0,
      created_at: userData.created_at || '',
      updated_at: userData.updated_at || '',
      last_login: userData.last_login || '',
      // New address fields
      alamat_lengkap: userData.alamat_lengkap || '',
      koordinat_lat: userData.koordinat_lat || null,
      koordinat_lng: userData.koordinat_lng || null,
      nama_dusun: userData.nama_dusun || '',
      nomor_rw: userData.nomor_rw || '',
      nomor_rt: userData.nomor_rt || '',
    }

    anggotaList.value = await anggotaKeluargaService.getByKepalaKeluargaId(route.params.id)
  } catch (error) {
    console.error('Error fetching detail:', error)
    alert('Gagal memuat detail kepala keluarga: ' + (error.message || 'Terjadi kesalahan'))
  } finally {
    loading.value = false
  }
}

const calculateAge = (birthDate) => {
  if (!birthDate) return '-'

  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return `${age} tahun`
}

const getMaritalStatus = (status) => {
  const statusMap = {
    BELUM_KAWIN: 'Belum Kawin',
    KAWIN: 'Kawin',
    CERAI_HIDUP: 'Cerai Hidup',
    CERAI_MATI: 'Cerai Mati',
  }

  return statusMap[status] || status || '-'
}

// Fungsi-fungsi helper untuk anggota keluarga
const formatHubungan = (hubungan) => {
  const hubunganMap = {
    SUAMI: 'Suami',
    ISTRI: 'Istri',
    ANAK: 'Anak',
    CUCU: 'Cucu',
    ORANG_TUA: 'Orang Tua',
    MENANTU: 'Menantu',
    FAMILI_LAIN: 'Famili Lain',
  }
  return hubunganMap[hubungan] || hubungan || '-'
}

const formatStatusTinggal = (status) => {
  const statusMap = {
    TINGGAL: 'Tinggal',
    TIDAK_TINGGAL: 'Tidak Tinggal',
  }
  return statusMap[status] || status || '-'
}

const formatAgama = (agama) => {
  const agamaMap = {
    ISLAM: 'Islam',
    KRISTEN: 'Kristen',
    KATOLIK: 'Katolik',
    HINDU: 'Hindu',
    BUDDHA: 'Buddha',
    KONGHUCU: 'Konghucu',
  }
  return agamaMap[agama] || agama || '-'
}

const formatPendidikan = (pendidikan) => {
  const pendidikanMap = {
    TIDAK_SEKOLAH: 'Tidak Sekolah',
    SD: 'SD',
    SMP: 'SMP',
    SMA: 'SMA',
    D1: 'D1',
    D2: 'D2',
    D3: 'D3',
    D4: 'D4',
    S1: 'S1',
    S2: 'S2',
    S3: 'S3',
  }
  return pendidikanMap[pendidikan] || pendidikan || '-'
}

const formatStatusKawin = (status) => {
  const statusMap = {
    BELUM_KAWIN: 'Belum Kawin',
    KAWIN: 'Kawin',
    CERAI_HIDUP: 'Cerai Hidup',
    CERAI_MATI: 'Cerai Mati',
  }
  return statusMap[status] || status || '-'
}

const getHubunganBadgeVariant = (hubungan) => {
  const variantMap = {
    SUAMI: 'primary',
    ISTRI: 'warning',
    ANAK: 'info',
    CUCU: 'success',
    ORANG_TUA: 'danger',
  }
  return variantMap[hubungan] || 'outline'
}

const getStatusTinggalVariant = (status) => {
  return status === 'TINGGAL' ? 'success' : 'danger'
}

const getMaritalStatusVariant = (status) => {
  const variantMap = {
    KAWIN: 'success',
    BELUM_KAWIN: 'info',
    CERAI_HIDUP: 'warning',
    CERAI_MATI: 'danger',
  }
  return variantMap[status] || 'outline'
}

const viewAnggotaDetail = (id) => {
  // Implementasi view detail anggota
  alert(`View detail anggota dengan ID: ${id}`)
}

const editAnggota = (id) => {
  // Implementasi edit anggota
  alert(`Edit anggota dengan ID: ${id}`)
}

const verifyUser = async () => {
  if (!confirm(`Verifikasi kepala keluarga "${data.value.nama_lengkap}"?`)) return

  try {
    verifying.value = true

    const res = await usersService.verifyKepalaKeluarga(data.value.id)

    if (res?.success) {
      data.value.is_verified = 1
      alert('Kepala keluarga berhasil diverifikasi!')
    } else {
      throw new Error(res?.message || 'Verifikasi gagal')
    }
  } catch (error) {
    console.error('Error verifying user:', error)
    alert('Gagal memverifikasi: ' + (error.message || 'Terjadi kesalahan'))
  } finally {
    verifying.value = false
  }
}

const confirmDelete = async () => {
  if (
    !confirm(
      `Yakin ingin menghapus kepala keluarga "${data.value.nama_lengkap}" (${data.value.nik})?\n\nPenghapusan data tidak dapat dikembalikan.`,
    )
  ) {
    return
  }

  try {
    const success = await usersService.deleteKepalaKeluarga(data.value.id)

    if (success) {
      alert('Kepala keluarga berhasil dihapus!')
      router.push('/admin/kepala-keluarga')
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    alert('Gagal menghapus: ' + (error.message || 'Terjadi kesalahan'))
  }
}
</script>

<style scoped>
/* Custom styles if needed */
</style>
