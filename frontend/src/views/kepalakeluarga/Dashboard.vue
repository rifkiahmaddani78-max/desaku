<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900 mb-2">Dashboard Kepala Keluarga</h1>
      <p class="text-sm text-gray-600">
        Selamat datang kembali, {{ user?.nama_lengkap || 'Kepala Keluarga' }}!
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Anggota Keluarga -->
      <Card class="hover-lift transition-all duration-200">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="p-3 bg-blue-100 rounded-lg">
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.76.554-1.645.897-2.59.897H17m-7 0a6 6 0 016-6v0a6 6 0 016 6v0"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-5 flex-1">
              <dt class="text-sm font-medium text-gray-500 truncate">Total Anggota Keluarga</dt>
              <dd class="text-2xl font-semibold text-gray-900">
                {{ stats.totalAnggotaKeluarga || 0 }}
              </dd>
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center text-sm text-gray-500">
              <svg
                class="flex-shrink-0 mr-1.5 h-4 w-4 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              Data keluarga Anda
            </div>
          </div>
        </div>
      </Card>

      <!-- Status Bansos -->
      <Card class="hover-lift transition-all duration-200">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="p-3 bg-green-100 rounded-lg">
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-5 flex-1">
              <dt class="text-sm font-medium text-gray-500 truncate">Status Bansos</dt>
              <dd class="text-2xl font-semibold text-gray-900">
                {{ stats.totalBansos || 0 }}
              </dd>
            </div>
          </div>
          <div class="mt-4">
            <Badge
              :variant="
                stats.bansosStatus === 'disetujui'
                  ? 'success'
                  : stats.bansosStatus === 'ditolak'
                    ? 'danger'
                    : 'warning'
              "
            >
              {{ getBansosStatusText(stats.bansosStatus) }}
            </Badge>
          </div>
        </div>
      </Card>

      <!-- Pengaduan Aktif -->
      <Card class="hover-lift transition-all duration-200">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="p-3 bg-yellow-100 rounded-lg">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-5 flex-1">
              <dt class="text-sm font-medium text-gray-500 truncate">Pengaduan Aktif</dt>
              <dd class="text-2xl font-semibold text-gray-900">
                {{ stats.totalPengaduan || 0 }}
              </dd>
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center text-sm text-gray-500">
              <svg
                class="flex-shrink-0 mr-1.5 h-4 w-4 text-blue-500"
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
              {{ stats.pengaduanTerbaru || 'Tidak ada' }}
            </div>
          </div>
        </div>
      </Card>

      <!-- Verifikasi Status -->
      <Card class="hover-lift transition-all duration-200">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="p-3 bg-purple-100 rounded-lg">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-5 flex-1">
              <dt class="text-sm font-medium text-gray-500 truncate">Status Verifikasi</dt>
              <dd class="text-2xl font-semibold text-gray-900">
                {{ user?.is_verified ? 'Aktif' : 'Pending' }}
              </dd>
            </div>
          </div>
          <div class="mt-4">
            <Badge :variant="user?.is_verified ? 'success' : 'warning'">
              {{ user?.is_verified ? 'Terverifikasi' : 'Menunggu Verifikasi' }}
            </Badge>
          </div>
        </div>
      </Card>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Welcome Message -->
        <Card title="Selamat Datang di Desa Ku" :padding="'lg'">
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <div class="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                <span class="text-primary-700 font-bold text-lg">
                  {{ getInitials(user?.nama_lengkap) }}
                </span>
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ user?.nama_lengkap }}</h3>
                <p class="text-sm text-gray-500">Kepala Keluarga • NIK: {{ user?.nik }}</p>
              </div>
            </div>

            <div class="bg-green-50 border border-green-100 rounded-lg p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg
                    class="h-5 w-5 text-green-400"
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
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800">
                    Akses Penuh sebagai Kepala Keluarga
                  </h3>
                  <div class="mt-2 text-sm text-green-700 space-y-1">
                    <p>• Kelola data anggota keluarga</p>
                    <p>• Ajukan bantuan sosial (Bansos)</p>
                    <p>• Buat pengaduan dan permohonan</p>
                    <p>• Pantau status verifikasi</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 pt-4">
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-600">Terakhir Login</p>
                <p class="text-lg font-semibold text-gray-900">
                  {{ formatLastLogin(user?.last_login) }}
                </p>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-600">Akun Dibuat</p>
                <p class="text-lg font-semibold text-gray-900">
                  {{ formatDate(user?.created_at) }}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <!-- Quick Actions -->
        <Card title="Aksi Cepat" subtitle="Tindakan yang sering Anda butuhkan">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="primary"
              fullWidth
              class="justify-start h-14"
              @click="router.push('/kepala-keluarga/anggota-keluarga')"
            >
              <div class="flex items-center">
                <div class="p-2 bg-blue-100 rounded-lg mr-3">
                  <svg
                    class="h-5 w-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.76.554-1.645.897-2.59.897H17m-7 0a6 6 0 016-6v0a6 6 0 016 6v0"
                    />
                  </svg>
                </div>
                <div class="text-left">
                  <p class="font-medium">Kelola Anggota Keluarga</p>
                  <p class="text-xs text-gray-500">Tambah atau edit data anggota</p>
                </div>
              </div>
            </Button>

            <Button
              variant="success"
              fullWidth
              class="justify-start h-14"
              @click="router.push('/kepala-keluarga/bansos/ajukan')"
            >
              <div class="flex items-center">
                <div class="p-2 bg-green-100 rounded-lg mr-3">
                  <svg
                    class="h-5 w-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div class="text-left">
                  <p class="font-medium">Ajukan Bansos</p>
                  <p class="text-xs text-gray-500">Pengajuan bantuan sosial</p>
                </div>
              </div>
            </Button>

            <Button
              variant="warning"
              fullWidth
              class="justify-start h-14"
              @click="router.push('/kepala-keluarga/pengaduan/baru')"
            >
              <div class="flex items-center">
                <div class="p-2 bg-yellow-100 rounded-lg mr-3">
                  <svg
                    class="h-5 w-5 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div class="text-left">
                  <p class="font-medium">Buat Pengaduan</p>
                  <p class="text-xs text-gray-500">Laporkan masalah atau keluhan</p>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              fullWidth
              class="justify-start h-14"
              @click="router.push('/kepala-keluarga/profil')"
            >
              <div class="flex items-center">
                <div class="p-2 bg-gray-100 rounded-lg mr-3">
                  <svg
                    class="h-5 w-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div class="text-left">
                  <p class="font-medium">Profil Saya</p>
                  <p class="text-xs text-gray-500">Lihat dan edit data pribadi</p>
                </div>
              </div>
            </Button>
          </div>
        </Card>

        <!-- Recent Activities -->
        <Card title="Aktivitas Terbaru" subtitle="Riwayat kegiatan Anda">
          <div class="space-y-4">
            <div v-if="activities.length === 0" class="text-center py-8">
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
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
              <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada aktivitas</h3>
              <p class="mt-1 text-sm text-gray-500">Mulai gunakan layanan Desa Ku</p>
            </div>

            <div v-else>
              <div
                v-for="activity in activities"
                :key="activity.id"
                class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150"
              >
                <div
                  :class="[
                    'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                    activity.type === 'success'
                      ? 'bg-green-100 text-green-600'
                      : activity.type === 'warning'
                        ? 'bg-yellow-100 text-yellow-600'
                        : activity.type === 'error'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-blue-100 text-blue-600',
                  ]"
                >
                  <component :is="activity.icon" class="h-4 w-4" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ activity.description }}</p>
                  <p class="text-xs text-gray-400 mt-1">{{ activity.time }}</p>
                </div>
                <Badge v-if="activity.status" :variant="getBadgeVariant(activity.status)" size="sm">
                  {{ activity.status }}
                </Badge>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              @click="router.push('/kepala-keluarga/aktivitas')"
            >
              Lihat Semua Aktivitas
            </Button>
          </div>
        </Card>
      </div>

      <!-- Right Column -->
      <div class="space-y-8">
        <!-- Status Bansos Detail -->
        <Card title="Detail Bansos" subtitle="Status pengajuan Anda">
          <div v-if="stats.bansosDetail" class="space-y-4">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">Status Terakhir:</span>
                <Badge
                  :variant="
                    stats.bansosDetail.status === 'disetujui'
                      ? 'success'
                      : stats.bansosDetail.status === 'ditolak'
                        ? 'danger'
                        : 'warning'
                  "
                >
                  {{ getBansosStatusText(stats.bansosDetail.status) }}
                </Badge>
              </div>

              <div v-if="stats.bansosDetail.nama_program" class="space-y-2">
                <p class="text-sm text-gray-600">
                  Program:
                  <span class="font-medium text-gray-900">{{
                    stats.bansosDetail.nama_program
                  }}</span>
                </p>
                <p class="text-sm text-gray-600">
                  Nominal:
                  <span class="font-medium text-gray-900">{{
                    formatCurrency(stats.bansosDetail.nominal)
                  }}</span>
                </p>
                <p class="text-sm text-gray-600">
                  Periode:
                  <span class="font-medium text-gray-900">{{ stats.bansosDetail.periode }}</span>
                </p>
              </div>

              <div v-if="stats.bansosDetail.catatan" class="p-3 bg-blue-50 rounded-lg">
                <p class="text-xs text-blue-700">{{ stats.bansosDetail.catatan }}</p>
              </div>
            </div>

            <Button
              @click="router.push('/kepala-keluarga/bansos')"
              variant="primary"
              fullWidth
              size="sm"
            >
              Lihat Detail Lengkap
            </Button>
          </div>
          <div v-else class="text-center py-8">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada pengajuan bansos</h3>
            <p class="mt-1 text-sm text-gray-500">Mulai ajukan bansos untuk mendapatkan bantuan.</p>
            <div class="mt-4">
              <Button @click="router.push('/kepala-keluarga/bansos/ajukan')" size="sm">
                Ajukan Bansos
              </Button>
            </div>
          </div>
        </Card>

        <!-- Notifikasi -->
        <Card title="Notifikasi" subtitle="Pemberitahuan penting">
          <div class="space-y-3">
            <div v-if="notifications.length === 0" class="text-center py-4">
              <p class="text-sm text-gray-500">Tidak ada notifikasi baru</p>
            </div>

            <div v-else>
              <div
                v-for="notification in notifications.slice(0, 3)"
                :key="notification.id"
                class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150"
              >
                <div
                  :class="[
                    'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center',
                    notification.read
                      ? 'bg-gray-200 text-gray-600'
                      : 'bg-primary-100 text-primary-600',
                  ]"
                >
                  <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ notification.message }}</p>
                  <p class="text-xs text-gray-400 mt-1">{{ notification.time }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              @click="router.push('/kepala-keluarga/notifikasi')"
            >
              Lihat Semua Notifikasi
            </Button>
          </div>
        </Card>

        <!-- Info Penting -->
        <Card title="Info Penting" subtitle="Pengumuman dari desa">
          <div class="space-y-4">
            <div class="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg
                    class="h-5 w-5 text-yellow-400"
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
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-yellow-800">Periode Bansos</h3>
                  <div class="mt-2 text-sm text-yellow-700">
                    <p>Pengajuan bansos periode Januari-Maret 2024 dibuka hingga 31 Maret 2024.</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg
                    class="h-5 w-5 text-blue-400"
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
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-blue-800">Verifikasi Data</h3>
                  <div class="mt-2 text-sm text-blue-700">
                    <p>Pastikan data keluarga Anda sudah lengkap dan terverifikasi.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              @click="router.push('/kepala-keluarga/info')"
            >
              Lihat Semua Pengumuman
            </Button>
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
import { getInitials, formatDate, formatCurrency } from '@/utils/helpers'

// Icons for activities
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

// State
const loading = ref(true)
const stats = ref({
  totalAnggotaKeluarga: 0,
  totalBansos: 0,
  bansosStatus: 'pending',
  bansosDetail: null,
  totalPengaduan: 0,
  pengaduanTerbaru: '',
})

// Mock data (in production, fetch from API)
const activities = ref([
  {
    id: 1,
    title: 'Pengajuan Bansos',
    description: 'Pengajuan bansos bulan Januari telah diajukan',
    type: 'info',
    icon: ClockIcon,
    time: '2 hari lalu',
    status: 'diproses',
  },
  {
    id: 2,
    title: 'Verifikasi Data',
    description: 'Data keluarga telah diverifikasi oleh admin',
    type: 'success',
    icon: CheckCircleIcon,
    time: '1 minggu lalu',
    status: 'selesai',
  },
  {
    id: 3,
    title: 'Pengaduan',
    description: 'Pengaduan mengenai fasilitas umum dibuat',
    type: 'warning',
    icon: ExclamationTriangleIcon,
    time: '2 minggu lalu',
    status: 'ditanggapi',
  },
])

const notifications = ref([
  {
    id: 1,
    title: 'Pengingat Bansos',
    message: 'Periode pengajuan bansos akan segera berakhir',
    time: '1 jam lalu',
    read: false,
  },
  {
    id: 2,
    title: 'Verifikasi Berhasil',
    message: 'Data keluarga Anda telah diverifikasi',
    time: '2 hari lalu',
    read: true,
  },
])

// Computed
const user = computed(() => authStore.user)

onMounted(async () => {
  await fetchDashboardData()
})

const fetchDashboardData = async () => {
  try {
    loading.value = true

    // In production, fetch from API
    // For now, use mock data
    await new Promise((resolve) => setTimeout(resolve, 1000))

    stats.value = {
      totalAnggotaKeluarga: 4,
      totalBansos: 1,
      bansosStatus: 'diproses',
      bansosDetail: {
        nama_program: 'Bantuan Langsung Tunai (BLT)',
        nominal: 600000,
        periode: 'Januari 2024',
        status: 'diproses',
        catatan: 'Sedang dalam proses verifikasi oleh admin desa',
      },
      totalPengaduan: 2,
      pengaduanTerbaru: '1 minggu lalu',
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const getBansosStatusText = (status) => {
  const statusMap = {
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
    diproses: 'Dalam Proses',
    pending: 'Menunggu',
  }
  return statusMap[status] || status
}

const getBadgeVariant = (status) => {
  const variantMap = {
    selesai: 'success',
    diproses: 'warning',
    ditanggapi: 'info',
    ditolak: 'danger',
  }
  return variantMap[status] || 'info'
}

const formatLastLogin = (dateString) => {
  if (!dateString) return 'Belum pernah login'

  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 60) return `${diffMins} menit lalu`
  if (diffHours < 24) return `${diffHours} jam lalu`
  if (diffDays < 7) return `${diffDays} hari lalu`

  return formatDate(dateString)
}
</script>

<style scoped>
.hover-lift {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
