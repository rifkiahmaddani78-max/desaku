<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <button
              @click="router.push('/admin/daftar-bansos')"
              class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Kembali
            </button>
          </div>
          <h1 class="text-xl sm:text-2xl font-semibold text-gray-900 break-words">
            {{ bansos?.nama_bansos || 'Detail Bansos' }}
          </h1>
          <p class="text-sm text-gray-600 mt-1">Kode: {{ bansos?.kode_bansos || '-' }}</p>
        </div>

        <!-- Action Buttons - Stack on mobile -->
        <div class="flex flex-col sm:flex-row gap-2 sm:space-x-3">
          <router-link :to="`/admin/daftar-bansos/${bansos?.id}/edit`" class="w-full sm:w-auto">
            <Button variant="primary" class="w-full sm:w-auto">
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </Button>
          </router-link>
          <router-link to="/admin/daftar-bansos" class="w-full sm:w-auto">
            <Button variant="outline" class="w-full sm:w-auto">
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Daftar
            </Button>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="flex items-center space-x-2 text-gray-500">
        <div
          class="w-5 h-5 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin"
        ></div>
        <span class="text-sm">Memuat detail bansos...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="!bansos" class="text-center py-12 bg-white rounded-xl border border-gray-200">
      <div class="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 class="text-sm font-medium text-gray-900 mb-2">Data tidak ditemukan</h3>
      <p class="text-sm text-gray-500 mb-4">
        Bansos yang Anda cari tidak ditemukan atau telah dihapus
      </p>
      <router-link to="/admin/daftar-bansos">
        <Button variant="primary" size="sm">Kembali ke Daftar</Button>
      </router-link>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-6">
      <!-- Status Banner -->
      <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center space-x-3">
            <div class="p-2 sm:p-3 rounded-lg" :class="getStatusColor(bansos.status).bg">
              <component
                :is="getStatusIcon(bansos.status)"
                class="w-5 h-5 sm:w-6 sm:h-6"
                :class="getStatusColor(bansos.status).text"
              />
            </div>
            <div>
              <p class="text-xs sm:text-sm text-gray-500">Status Program</p>
              <div class="flex items-center flex-wrap gap-2 mt-1">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium"
                  :class="getStatusClass(bansos.status)"
                >
                  {{ bansos.status || 'DRAFT' }}
                </span>
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium"
                  :class="getPrioritasClass(bansos.prioritas)"
                >
                  {{ bansos.prioritas || 'Normal' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Info Singkat -->
          <div class="grid grid-cols-2 sm:flex gap-3 sm:space-x-4 text-sm">
            <div class="text-center sm:text-left">
              <p class="text-gray-500 text-xs">Kuota</p>
              <p class="font-semibold text-gray-900">{{ bansos.kuota }}</p>
            </div>
            <div class="text-center sm:text-left">
              <p class="text-gray-500 text-xs">Pengajuan</p>
              <p class="font-semibold text-gray-900">{{ bansos.total_pengajuan || 0 }}</p>
            </div>
            <div class="text-center sm:text-left">
              <p class="text-gray-500 text-xs">Diterima</p>
              <p class="font-semibold text-green-600">{{ bansos.total_diterima || 0 }}</p>
            </div>
            <div class="text-center sm:text-left">
              <p class="text-gray-500 text-xs">Ditolak</p>
              <p class="font-semibold text-red-600">{{ bansos.total_ditolak || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Grid 2 Kolom -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - 2/3 width -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Informasi Detail -->
          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
              <h3 class="text-sm sm:text-base font-semibold text-gray-900">Informasi Program</h3>
            </div>
            <div class="p-4 sm:p-6">
              <!-- Deskripsi -->
              <div class="mb-6">
                <h4 class="text-xs sm:text-sm font-medium text-gray-500 mb-2">Deskripsi</h4>
                <p class="text-sm text-gray-700 whitespace-pre-line break-words">
                  {{ bansos.deskripsi || '-' }}
                </p>
              </div>

              <!-- Grid Detail -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <!-- Jenis Bansos -->
                <div class="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <p class="text-xs text-gray-500 mb-1">Jenis Bansos</p>
                  <div class="flex items-center flex-wrap gap-2">
                    <span class="text-sm sm:text-base font-medium text-gray-900">{{
                      bansos.jenis_bansos
                    }}</span>
                    <span
                      v-if="bansos.jenis_bansos === 'TUNAI'"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      <svg
                        class="mr-1 h-3 w-3"
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
                      Tunai
                    </span>
                  </div>
                </div>

                <!-- Kategori -->
                <div class="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <p class="text-xs text-gray-500 mb-1">Kategori</p>
                  <p class="text-sm sm:text-base font-medium text-gray-900">
                    {{ bansos.kategori }}
                  </p>
                </div>

                <!-- Penerima Manfaat -->
                <div class="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <p class="text-xs text-gray-500 mb-1">Penerima Manfaat</p>
                  <p class="text-sm sm:text-base font-medium text-gray-900">
                    {{ formatPenerimaManfaat(bansos.penerima_manfaat) }}
                  </p>
                </div>

                <!-- Nominal/Satuan -->
                <div class="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <p class="text-xs text-gray-500 mb-1">
                    {{ bansos.jenis_bansos === 'TUNAI' ? 'Nominal' : 'Satuan Barang' }}
                  </p>
                  <p
                    v-if="bansos.jenis_bansos === 'TUNAI'"
                    class="text-sm sm:text-base font-semibold text-green-600 break-words"
                  >
                    {{ formatRupiah(bansos.jumlah_nominal) }}
                  </p>
                  <p v-else class="text-sm sm:text-base font-medium text-gray-900 break-words">
                    {{ bansos.satuan_barang || '-' }}
                  </p>
                </div>

                <!-- Dokumen Panduan -->
                <div class="bg-gray-50 p-3 sm:p-4 rounded-lg sm:col-span-2">
                  <p class="text-xs text-gray-500 mb-1">Dokumen Panduan</p>
                  <p v-if="bansos.dokumen_panduan_url" class="break-words">
                    <a
                      :href="bansos.dokumen_panduan_url"
                      target="_blank"
                      class="text-primary-600 hover:text-primary-700 inline-flex items-center text-sm"
                    >
                      <svg
                        class="mr-1.5 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Lihat Dokumen
                    </a>
                  </p>
                  <p v-else class="text-sm text-gray-500">Tidak ada dokumen</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Timeline -->
          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
              <h3 class="text-sm sm:text-base font-semibold text-gray-900">Timeline Program</h3>
            </div>
            <div class="p-4 sm:p-6">
              <div class="space-y-4 sm:space-y-6">
                <div class="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div class="flex items-center sm:items-start">
                    <div class="flex-shrink-0">
                      <div
                        class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-100 flex items-center justify-center"
                      >
                        <svg
                          class="w-4 h-4 sm:w-5 sm:h-5 text-primary-600"
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
                      </div>
                    </div>
                    <div class="ml-3 flex-1">
                      <p class="text-xs sm:text-sm font-medium text-gray-500">Tanggal Mulai</p>
                      <p class="text-sm sm:text-base font-semibold text-gray-900">
                        {{ formatDate(bansos.tanggal_mulai) }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center sm:items-start">
                    <div class="flex-shrink-0">
                      <div
                        class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-100 flex items-center justify-center"
                      >
                        <svg
                          class="w-4 h-4 sm:w-5 sm:h-5 text-primary-600"
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
                    </div>
                    <div class="ml-3 flex-1">
                      <p class="text-xs sm:text-sm font-medium text-gray-500">Tanggal Selesai</p>
                      <p class="text-sm sm:text-base font-semibold text-gray-900">
                        {{ formatDate(bansos.tanggal_selesai) }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Days Remaining -->
                <div class="bg-primary-50 rounded-lg p-3 sm:p-4">
                  <div class="flex items-center justify-between">
                    <span class="text-xs sm:text-sm text-primary-700">Hari tersisa</span>
                    <span class="text-lg sm:text-xl font-bold text-primary-700"
                      >{{ calculateDaysRemaining() }} hari</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Kuota Wilayah (Table Responsif) -->
          <div
            v-if="bansos.kuota_wilayah?.length > 0"
            class="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 class="text-sm sm:text-base font-semibold text-gray-900">
                  Distribusi Kuota Wilayah
                </h3>
                <span class="text-xs text-gray-500"
                  >Total: {{ bansos.total_kuota_wilayah || 0 }} / {{ bansos.kuota }}</span
                >
              </div>
            </div>

            <!-- Card View untuk Mobile -->
            <div class="block sm:hidden divide-y divide-gray-200">
              <div v-for="wilayah in bansos.kuota_wilayah" :key="wilayah.id" class="p-4">
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <h4 class="font-medium text-gray-900">{{ wilayah.nama_dusun }}</h4>
                    <p
                      v-if="wilayah.nomor_rw || wilayah.nomor_rt"
                      class="text-xs text-gray-500 mt-1"
                    >
                      RW {{ wilayah.nomor_rw || '-' }} / RT {{ wilayah.nomor_rt || '-' }}
                    </p>
                  </div>
                  <span
                    class="text-xs font-medium"
                    :class="wilayah.sisa_kuota > 0 ? 'text-green-600' : 'text-red-600'"
                  >
                    Sisa {{ wilayah.sisa_kuota }}
                  </span>
                </div>

                <div class="grid grid-cols-3 gap-2 text-center mb-3">
                  <div class="bg-gray-50 p-2 rounded">
                    <p class="text-[10px] text-gray-500">Kuota</p>
                    <p class="text-xs font-semibold">{{ wilayah.kuota }}</p>
                  </div>
                  <div class="bg-gray-50 p-2 rounded">
                    <p class="text-[10px] text-gray-500">Terpakai</p>
                    <p class="text-xs font-semibold">{{ wilayah.terpakai }}</p>
                  </div>
                  <div class="bg-gray-50 p-2 rounded">
                    <p class="text-[10px] text-gray-500">%</p>
                    <p class="text-xs font-semibold">
                      {{ Math.round((wilayah.terpakai / wilayah.kuota) * 100) }}%
                    </p>
                  </div>
                </div>

                <div class="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    class="bg-primary-600 h-1.5 rounded-full"
                    :style="{
                      width: Math.min((wilayah.terpakai / wilayah.kuota) * 100, 100) + '%',
                    }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Table View untuk Desktop -->
            <div class="hidden sm:block overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      Wilayah
                    </th>
                    <th
                      class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      Kuota
                    </th>
                    <th
                      class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      Terpakai
                    </th>
                    <th
                      class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      Sisa
                    </th>
                    <th
                      class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="wilayah in bansos.kuota_wilayah" :key="wilayah.id">
                    <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ wilayah.nama_dusun }}</div>
                      <div
                        v-if="wilayah.nomor_rw || wilayah.nomor_rt"
                        class="text-xs text-gray-500"
                      >
                        RW {{ wilayah.nomor_rw || '-' }} / RT {{ wilayah.nomor_rt || '-' }}
                      </div>
                    </td>
                    <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">{{ wilayah.kuota }}</td>
                    <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                      {{ wilayah.terpakai }}
                    </td>
                    <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                      <span :class="wilayah.sisa_kuota > 0 ? 'text-green-600' : 'text-red-600'">
                        {{ wilayah.sisa_kuota }}
                      </span>
                    </td>
                    <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center w-32">
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div
                            class="bg-primary-600 h-2 rounded-full"
                            :style="{
                              width: Math.min((wilayah.terpakai / wilayah.kuota) * 100, 100) + '%',
                            }"
                          ></div>
                        </div>
                        <span class="ml-2 text-xs text-gray-500">
                          {{ Math.round((wilayah.terpakai / wilayah.kuota) * 100) }}%
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Right Column - 1/3 width -->
        <div class="space-y-6">
          <!-- Statistik Progress -->
          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
              <h3 class="text-sm sm:text-base font-semibold text-gray-900">Statistik</h3>
            </div>
            <div class="p-4 sm:p-6 space-y-4">
              <!-- Total Kuota -->
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-600">Total Kuota</span>
                  <span class="font-semibold">{{ bansos.kuota }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-primary-600 h-2 rounded-full" :style="{ width: '100%' }"></div>
                </div>
              </div>

              <!-- Pengajuan -->
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-600">Pengajuan</span>
                  <span class="font-semibold">{{ bansos.total_pengajuan || 0 }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-yellow-500 h-2 rounded-full"
                    :style="{ width: calculatePercentage(bansos.total_pengajuan) + '%' }"
                  ></div>
                </div>
              </div>

              <!-- Diterima -->
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-600">Diterima</span>
                  <span class="font-semibold text-green-600">{{ bansos.total_diterima || 0 }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-green-500 h-2 rounded-full"
                    :style="{ width: calculatePercentage(bansos.total_diterima) + '%' }"
                  ></div>
                </div>
              </div>

              <!-- Ditolak -->
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-600">Ditolak</span>
                  <span class="font-semibold text-red-600">{{ bansos.total_ditolak || 0 }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-red-500 h-2 rounded-full"
                    :style="{ width: calculatePercentage(bansos.total_ditolak) + '%' }"
                  ></div>
                </div>
              </div>

              <div class="pt-4 border-t border-gray-200">
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-gray-50 p-3 rounded-lg text-center">
                    <p class="text-xs text-gray-500">Kuota Wilayah</p>
                    <p class="text-lg font-semibold text-gray-900">
                      {{ bansos.total_kuota_wilayah || 0 }}
                    </p>
                  </div>
                  <div class="bg-gray-50 p-3 rounded-lg text-center">
                    <p class="text-xs text-gray-500">Terpakai</p>
                    <p class="text-lg font-semibold text-gray-900">
                      {{ bansos.total_terpakai_wilayah || 0 }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Aksi Cepat -->
          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
              <h3 class="text-sm sm:text-base font-semibold text-gray-900">Aksi Cepat</h3>
            </div>
            <div class="p-4 sm:p-6 space-y-3">
              <Button
                variant="primary"
                fullWidth
                @click="router.push(`/admin/daftar-bansos/${bansos.id}/edit`)"
              >
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Bansos
              </Button>

              <Button variant="outline" fullWidth @click="viewPenerima">
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Lihat Penerima
              </Button>

              <Button variant="outline" fullWidth @click="router.push('/admin/daftar-bansos')">
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
          </div>

          <!-- Informasi Sistem -->
          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
              <h3 class="text-sm sm:text-base font-semibold text-gray-900">Informasi Sistem</h3>
            </div>
            <div class="p-4 sm:p-6 space-y-3">
              <div>
                <p class="text-xs text-gray-500">Dibuat Oleh</p>
                <p class="text-sm font-medium text-gray-900 break-words">
                  {{ bansos.created_by_name || '-' }}
                </p>
                <p class="text-xs text-gray-500">{{ bansos.created_by_username || '' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Dibuat Pada</p>
                <p class="text-sm text-gray-900">{{ formatDateTime(bansos.created_at) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Terakhir Diperbarui</p>
                <p class="text-sm text-gray-900">{{ formatDateTime(bansos.updated_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { bansosService } from '@/services/bansos'
import Button from '@/components/ui/Button.vue'
import { formatDate, formatDateTime } from '@/utils/helpers'
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  DocumentTextIcon,
  BanknotesIcon,
  GiftIcon,
  WrenchIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const bansos = ref(null)

onMounted(async () => {
  try {
    const id = route.params.id
    const response = await bansosService.getBansosById(id)
    bansos.value = response
  } catch (error) {
    console.error('Error fetching bansos:', error)
  } finally {
    loading.value = false
  }
})

// Helper functions
const calculatePercentage = (value) => {
  if (!bansos.value?.kuota || bansos.value.kuota === 0) return 0
  return Math.min(Math.round((value / bansos.value.kuota) * 100), 100)
}

const calculateDaysRemaining = () => {
  if (!bansos.value?.tanggal_selesai) return 0
  const endDate = new Date(bansos.value.tanggal_selesai)
  const today = new Date()
  const timeDiff = endDate.getTime() - today.getTime()
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24))
  return daysRemaining > 0 ? daysRemaining : 0
}

const formatRupiah = (value) => {
  if (!value && value !== 0) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatPenerimaManfaat = (value) => {
  if (!value) return '-'
  const formatMap = {
    KELUARGA_MISKIN: 'Keluarga Miskin',
    LANSIA: 'Lansia',
    DISABILITAS: 'Disabilitas',
    ANAK_YATIM: 'Anak Yatim',
    JANDA: 'Janda',
    DUAFA: 'Duafa',
    SEMUA_WARGA: 'Semua Warga',
  }
  return formatMap[value] || value
}

const getStatusColor = (status) => {
  const colors = {
    DRAFT: { bg: 'bg-gray-100', text: 'text-gray-600' },
    AKTIF: { bg: 'bg-green-100', text: 'text-green-600' },
    SELESAI: { bg: 'bg-blue-100', text: 'text-blue-600' },
    DIBATALKAN: { bg: 'bg-red-100', text: 'text-red-600' },
  }
  return colors[status] || colors.DRAFT
}

const getStatusIcon = (status) => {
  const icons = {
    DRAFT: DocumentTextIcon,
    AKTIF: CheckCircleIcon,
    SELESAI: ClockIcon,
    DIBATALKAN: XCircleIcon,
  }
  return icons[status] || DocumentTextIcon
}

const getStatusClass = (status) => {
  const classes = {
    DRAFT: 'bg-gray-100 text-gray-800',
    AKTIF: 'bg-green-100 text-green-800',
    SELESAI: 'bg-blue-100 text-blue-800',
    DIBATALKAN: 'bg-red-100 text-red-800',
  }
  return classes[status] || classes.DRAFT
}

const getPrioritasClass = (prioritas) => {
  const classes = {
    TINGGI: 'bg-orange-100 text-orange-800',
    SEDANG: 'bg-yellow-100 text-yellow-800',
    RENDAH: 'bg-green-100 text-green-800',
    DARURAT: 'bg-red-100 text-red-800',
  }
  return classes[prioritas] || 'bg-gray-100 text-gray-800'
}

const viewPenerima = () => {
  alert('Fitur melihat penerima akan tersedia dalam pengembangan selanjutnya')
}
</script>

<style scoped>
.whitespace-pre-line {
  white-space: pre-line;
  word-wrap: break-word;
}

.break-words {
  word-break: break-word;
  overflow-wrap: break-word;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .grid {
    gap: 1rem;
  }
}
</style>
