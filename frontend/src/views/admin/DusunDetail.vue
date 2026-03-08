<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Container dengan padding responsif -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- Header dengan desain modern -->
      <div class="mb-8">
        <!-- Header dengan action buttons yang lebih modern -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center space-x-3">
            <div
              class="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-200"
            >
              <BuildingOfficeIcon class="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Detail Dusun</h1>
              <p class="text-sm text-gray-500 mt-1">Informasi lengkap dan struktur wilayah</p>
            </div>
          </div>

          <!-- Action buttons dengan desain modern -->
          <div class="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              @click="router.push(`/admin/dusun/${route.params.id}/edit`)"
              class="group hover:border-primary-300 hover:bg-primary-50"
            >
              <svg
                class="mr-2 h-4 w-4 group-hover:text-primary-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Dusun
            </Button>

            <Button variant="danger" @click="confirmDeleteDusun" class="group hover:bg-red-600">
              <svg
                class="mr-2 h-4 w-4 group-hover:scale-90 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Hapus Dusun
            </Button>
          </div>
        </div>
      </div>

      <!-- Loading State dengan desain modern -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="relative">
          <div
            class="h-16 w-16 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"
          ></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="h-8 w-8 rounded-full bg-primary-100 animate-pulse"></div>
          </div>
        </div>
        <p class="mt-4 text-sm text-gray-500 font-medium">Memuat data dusun...</p>
      </div>

      <!-- Error State dengan desain modern -->
      <div v-else-if="error" class="rounded-2xl bg-red-50 p-8 text-center">
        <div class="flex flex-col items-center">
          <div class="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-red-800 mb-2">Gagal Memuat Data</h3>
          <p class="text-sm text-red-600 mb-4">{{ error }}</p>
          <Button
            variant="outline"
            @click="fetchDetail"
            class="border-red-300 text-red-700 hover:bg-red-100"
          >
            <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Coba Lagi
          </Button>
        </div>
      </div>

      <!-- Konten Utama dengan desain modern -->
      <div v-else class="space-y-6">
        <!-- Informasi Dusun Card dengan desain modern -->
        <Card class="overflow-hidden border-0 shadow-xl rounded-2xl">
          <div class="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
            <h2 class="text-lg font-semibold text-white flex items-center">
              <BuildingOfficeIcon class="h-5 w-5 mr-2" />
              Informasi Dusun
            </h2>
          </div>

          <div class="p-6">
            <div class="flex flex-col sm:flex-row items-start gap-6">
              <!-- Avatar dengan desain lebih menarik -->
              <div class="relative">
                <div
                  class="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-200"
                >
                  <span class="text-white font-bold text-3xl">
                    {{ getInitials(data.nama_dusun) }}
                  </span>
                </div>
                <div class="absolute -top-2 -right-2">
                  <Badge variant="primary" size="sm" class="shadow-lg">
                    {{ data.kode_dusun }}
                  </Badge>
                </div>
              </div>

              <!-- Detail dengan grid yang responsif -->
              <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div class="space-y-1">
                  <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Nama Dusun
                  </p>
                  <p class="text-lg font-semibold text-gray-900">{{ data.nama_dusun }}</p>
                </div>

                <div class="space-y-1">
                  <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">ID Dusun</p>
                  <p class="text-sm text-gray-600">{{ data.id }}</p>
                </div>

                <div class="space-y-1">
                  <p
                    class="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center"
                  >
                    <UserIcon class="h-3 w-3 mr-1" />
                    Kepala Dusun
                  </p>
                  <p class="text-sm text-gray-600">{{ data.kepala_dusun || '-' }}</p>
                </div>

                <div class="space-y-1">
                  <p
                    class="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center"
                  >
                    <PhoneIcon class="h-3 w-3 mr-1" />
                    Telepon
                  </p>
                  <p class="text-sm text-gray-600">{{ data.telepon || '-' }}</p>
                </div>

                <div class="sm:col-span-2 space-y-1">
                  <p
                    class="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center"
                  >
                    <MapPinIcon class="h-3 w-3 mr-1" />
                    Alamat
                  </p>
                  <p class="text-sm text-gray-600">{{ data.alamat || '-' }}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <!-- Statistik Card dengan desain modern -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            <div class="flex items-center">
              <div class="p-3 bg-blue-100 rounded-xl mr-4">
                <BuildingOfficeIcon class="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p class="text-sm text-gray-500 font-medium">Jumlah RW</p>
                <p class="text-2xl font-bold text-gray-900">{{ data.rw_list?.length || 0 }}</p>
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            <div class="flex items-center">
              <div class="p-3 bg-purple-100 rounded-xl mr-4">
                <HomeModernIcon class="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p class="text-sm text-gray-500 font-medium">Jumlah RT</p>
                <p class="text-2xl font-bold text-gray-900">{{ totalRt }}</p>
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            <div class="flex items-center">
              <div class="p-3 bg-green-100 rounded-xl mr-4">
                <UsersIcon class="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p class="text-sm text-gray-500 font-medium">Total KK</p>
                <p class="text-2xl font-bold text-gray-900">{{ totalKk }}</p>
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            <div class="flex items-center">
              <div class="p-3 bg-yellow-100 rounded-xl mr-4">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500 font-medium">Kepadatan</p>
                <p class="text-2xl font-bold text-gray-900">{{ kepadatan }} KK/RT</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Daftar RW dengan desain modern -->
        <div v-for="rw in data.rw_list" :key="rw.id" class="space-y-4">
          <Card class="overflow-hidden border-0 shadow-xl rounded-2xl">
            <!-- Header RW dengan desain modern -->
            <div class="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div class="flex items-center space-x-3">
                  <div
                    class="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg"
                  >
                    <span class="text-white font-bold text-lg">RW {{ rw.nomor_rw }}</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">RW {{ rw.nomor_rw }}</h3>
                    <p class="text-sm text-gray-500">Ketua: {{ rw.ketua_rw || '-' }}</p>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-4">
                  <!-- Statistik RW dengan desain compact -->
                  <div class="flex items-center space-x-4 bg-gray-50 px-4 py-2 rounded-xl">
                    <div class="flex items-center">
                      <HomeModernIcon class="h-4 w-4 text-purple-500 mr-1" />
                      <span class="text-sm font-medium text-gray-700">{{ getRtCount(rw) }} RT</span>
                    </div>
                    <div class="w-px h-4 bg-gray-200"></div>
                    <div class="flex items-center">
                      <UsersIcon class="h-4 w-4 text-green-500 mr-1" />
                      <span class="text-sm font-medium text-gray-700">{{ getKkCount(rw) }} KK</span>
                    </div>
                  </div>

                  <!-- Action Buttons RW dengan desain modern -->
                  <div class="flex space-x-2">
                    <button
                      @click="openDetailRWModal(rw)"
                      class="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                      title="Lihat Detail"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>

                    <button
                      @click="openEditRWModal(rw)"
                      class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      title="Edit RW"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>

                    <button
                      @click="confirmDeleteRW(rw)"
                      class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Hapus RW"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Daftar RT dengan desain modern -->
            <div class="p-6">
              <div class="flex justify-end mb-4">
                <Button variant="primary" size="sm" @click="openTambahRTModal(rw)" class="group">
                  <svg
                    class="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Tambah RT
                </Button>
              </div>

              <!-- Grid RT dengan desain modern -->
              <div
                v-if="!rw.rt_list || rw.rt_list.length === 0"
                class="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200"
              >
                <HomeModernIcon class="mx-auto h-12 w-12 text-gray-300" />
                <p class="mt-2 text-sm text-gray-500">Belum ada RT di RW {{ rw.nomor_rw }}</p>
                <p class="text-xs text-gray-400">Klik tombol "Tambah RT" untuk menambahkan</p>
              </div>

              <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  v-for="rt in rw.rt_list"
                  :key="rt.id"
                  class="group bg-white border border-gray-100 rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:border-primary-200"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-3">
                      <div class="relative">
                        <div
                          class="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md"
                        >
                          <span class="text-white font-bold text-xs">RT {{ rt.nomor_rt }}</span>
                        </div>
                      </div>
                      <div>
                        <h4 class="text-sm font-semibold text-gray-900">RT {{ rt.nomor_rt }}</h4>
                        <p class="text-xs text-gray-500 mt-0.5">{{ rt.ketua_rt || 'Ketua: -' }}</p>
                        <p v-if="rt.telepon" class="text-xs text-gray-400 mt-0.5">
                          {{ rt.telepon }}
                        </p>
                        <div class="mt-2">
                          <Badge variant="info" size="sm" class="bg-purple-100 text-purple-700">
                            {{ rt.jumlah_kk || 0 }} KK
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <!-- Action buttons RT dengan desain compact -->
                    <div
                      class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <button
                        @click="openDetailRTModal(rt, rw)"
                        class="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>

                      <button
                        @click="openEditRTModal(rt, rw)"
                        class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>

                      <button
                        @click="confirmDeleteRT(rt, rw)"
                        class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <!-- Tombol Tambah RW dengan desain modern -->
        <div class="flex justify-center pt-4">
          <Button
            variant="primary"
            @click="openTambahRWModal"
            class="px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <svg
              class="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah RW Baru
          </Button>
        </div>

        <!-- Informasi Sistem Card dengan desain minimalis -->
        <Card class="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900">
          <div class="p-6">
            <h2 class="text-lg font-semibold text-white mb-4 flex items-center">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Informasi Sistem
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="bg-white/10 rounded-lg p-4">
                <p class="text-xs text-gray-300 uppercase tracking-wider mb-1">Dibuat Pada</p>
                <p class="text-sm text-white font-medium">{{ formatDateTime(data.created_at) }}</p>
              </div>
              <div class="bg-white/10 rounded-lg p-4">
                <p class="text-xs text-gray-300 uppercase tracking-wider mb-1">
                  Terakhir Diperbarui
                </p>
                <p class="text-sm text-white font-medium">{{ formatDateTime(data.updated_at) }}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <!-- MODAL FORM RW dengan desain modern -->
    <div v-if="showRWModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
      >
        <div class="fixed inset-0 transition-opacity" @click="closeRWModal">
          <div class="absolute inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div
          class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <!-- Modal Header dengan gradient -->
          <div class="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div
                  class="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur"
                >
                  <BuildingOfficeIcon class="h-6 w-6 text-white" />
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-white">
                  {{
                    modalMode === 'tambah'
                      ? 'Tambah RW Baru'
                      : modalMode === 'edit'
                        ? 'Edit RW'
                        : 'Detail RW'
                  }}
                </h3>
                <p class="text-sm text-white/80">Dusun {{ data.nama_dusun }}</p>
              </div>
            </div>
          </div>

          <div class="px-6 py-6">
            <!-- Informasi Dusun -->
            <div class="bg-primary-50 rounded-xl p-4 mb-6">
              <div class="flex items-center">
                <div class="h-10 w-10 rounded-lg bg-primary-600 flex items-center justify-center">
                  <span class="text-white font-bold text-sm">{{
                    getInitials(data.nama_dusun)
                  }}</span>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-semibold text-primary-900">Dusun {{ data.nama_dusun }}</p>
                  <p class="text-xs text-primary-700">Kode: {{ data.kode_dusun }}</p>
                </div>
              </div>
            </div>

            <!-- Form Fields RW -->
            <div v-if="modalMode !== 'detail'" class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nomor RW <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <span
                    class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 font-medium"
                    >RW</span
                  >
                  <input
                    v-model="rwForm.nomor_rw"
                    type="text"
                    placeholder="01"
                    :class="['input-field pl-12', rwErrors.nomor_rw ? 'input-error' : '']"
                    maxlength="3"
                    required
                  />
                </div>
                <p v-if="rwErrors.nomor_rw" class="mt-1 text-sm text-red-600">
                  {{ rwErrors.nomor_rw }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Ketua RW</label>
                <input
                  v-model="rwForm.ketua_rw"
                  type="text"
                  placeholder="Contoh: Bapak Slamet"
                  class="input-field"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                <input
                  v-model="rwForm.telepon"
                  type="tel"
                  placeholder="0812 3456 7890"
                  class="input-field"
                />
              </div>
            </div>

            <!-- Detail View RW -->
            <div v-else class="space-y-4">
              <div class="bg-gray-50 rounded-xl p-5">
                <dl class="space-y-3">
                  <div>
                    <dt class="text-xs text-gray-500 mb-1">Nomor RW</dt>
                    <dd class="text-sm font-semibold text-gray-900">RW {{ rwForm.nomor_rw }}</dd>
                  </div>
                  <div>
                    <dt class="text-xs text-gray-500 mb-1">Jumlah RT</dt>
                    <dd class="text-sm font-semibold text-gray-900">{{ rwForm.jumlah_rt || 0 }}</dd>
                  </div>
                  <div>
                    <dt class="text-xs text-gray-500 mb-1">Ketua RW</dt>
                    <dd class="text-sm text-gray-900">{{ rwForm.ketua_rw || '-' }}</dd>
                  </div>
                  <div>
                    <dt class="text-xs text-gray-500 mb-1">Telepon</dt>
                    <dd class="text-sm text-gray-900">{{ rwForm.telepon || '-' }}</dd>
                  </div>
                  <div class="border-t border-gray-200 pt-3">
                    <dt class="text-xs text-gray-500 mb-1">Dibuat Pada</dt>
                    <dd class="text-sm text-gray-900">{{ formatDateTime(rwForm.created_at) }}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="rwSubmitError" class="mt-4 rounded-xl bg-red-50 p-4">
              <p class="text-sm text-red-700">{{ rwSubmitError }}</p>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3">
            <template v-if="modalMode === 'tambah' || modalMode === 'edit'">
              <Button
                type="button"
                variant="primary"
                @click="submitRWForm"
                :loading="rwSubmitting"
                class="min-w-[100px]"
              >
                {{ rwSubmitting ? 'Menyimpan...' : 'Simpan' }}
              </Button>
              <Button type="button" variant="outline" @click="closeRWModal"> Batal </Button>
            </template>
            <template v-else>
              <Button type="button" variant="primary" @click="closeRWModal"> Tutup </Button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL FORM RT dengan desain modern -->
    <div v-if="showRTModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
      >
        <div class="fixed inset-0 transition-opacity" @click="closeRTModal">
          <div class="absolute inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div
          class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <!-- Modal Header dengan gradient -->
          <div class="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div
                  class="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur"
                >
                  <HomeModernIcon class="h-6 w-6 text-white" />
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-white">
                  {{
                    rtModalMode === 'tambah'
                      ? 'Tambah RT Baru'
                      : rtModalMode === 'edit'
                        ? 'Edit RT'
                        : 'Detail RT'
                  }}
                </h3>
                <p class="text-sm text-white/80">
                  RW {{ selectedRw?.nomor_rw }} - Dusun {{ data.nama_dusun }}
                </p>
              </div>
            </div>
          </div>

          <div class="px-6 py-6">
            <!-- Informasi RW -->
            <div class="bg-purple-50 rounded-xl p-4 mb-6">
              <div class="flex items-center">
                <div class="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
                  <span class="text-white font-bold text-sm">RW {{ selectedRw?.nomor_rw }}</span>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-semibold text-purple-900">RW {{ selectedRw?.nomor_rw }}</p>
                  <p class="text-xs text-purple-700">Ketua: {{ selectedRw?.ketua_rw || '-' }}</p>
                </div>
              </div>
            </div>

            <!-- Form Fields RT -->
            <div v-if="rtModalMode !== 'detail'" class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nomor RT <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <span
                    class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 font-medium"
                    >RT</span
                  >
                  <input
                    v-model="rtForm.nomor_rt"
                    type="text"
                    placeholder="01"
                    :class="['input-field pl-12', rtErrors.nomor_rt ? 'input-error' : '']"
                    maxlength="3"
                    required
                  />
                </div>
                <p v-if="rtErrors.nomor_rt" class="mt-1 text-sm text-red-600">
                  {{ rtErrors.nomor_rt }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Ketua RT</label>
                <input
                  v-model="rtForm.ketua_rt"
                  type="text"
                  placeholder="Contoh: Bapak Ahmad"
                  class="input-field"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                <input
                  v-model="rtForm.telepon"
                  type="tel"
                  placeholder="0812 3456 7890"
                  class="input-field"
                />
              </div>
            </div>

            <!-- Detail View RT -->
            <div v-else class="space-y-4">
              <div class="bg-gray-50 rounded-xl p-5">
                <dl class="space-y-3">
                  <div>
                    <dt class="text-xs text-gray-500 mb-1">Nomor RT</dt>
                    <dd class="text-sm font-semibold text-gray-900">RT {{ rtForm.nomor_rt }}</dd>
                  </div>
                  <div>
                    <dt class="text-xs text-gray-500 mb-1">Jumlah KK</dt>
                    <dd class="text-sm font-semibold text-gray-900">{{ rtForm.jumlah_kk || 0 }}</dd>
                  </div>
                  <div>
                    <dt class="text-xs text-gray-500 mb-1">Ketua RT</dt>
                    <dd class="text-sm text-gray-900">{{ rtForm.ketua_rt || '-' }}</dd>
                  </div>
                  <div>
                    <dt class="text-xs text-gray-500 mb-1">Telepon</dt>
                    <dd class="text-sm text-gray-900">{{ rtForm.telepon || '-' }}</dd>
                  </div>
                  <div class="border-t border-gray-200 pt-3">
                    <dt class="text-xs text-gray-500 mb-1">Dibuat Pada</dt>
                    <dd class="text-sm text-gray-900">{{ formatDateTime(rtForm.created_at) }}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="rtSubmitError" class="mt-4 rounded-xl bg-red-50 p-4">
              <p class="text-sm text-red-700">{{ rtSubmitError }}</p>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3">
            <template v-if="rtModalMode === 'tambah' || rtModalMode === 'edit'">
              <Button
                type="button"
                variant="primary"
                @click="submitRTForm"
                :loading="rtSubmitting"
                class="min-w-[100px]"
              >
                {{ rtSubmitting ? 'Menyimpan...' : 'Simpan' }}
              </Button>
              <Button type="button" variant="outline" @click="closeRTModal"> Batal </Button>
            </template>
            <template v-else>
              <Button type="button" variant="primary" @click="closeRTModal"> Tutup </Button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dusunService } from '@/services/dusun'
import { rwService } from '@/services/rw'
import { rtService } from '@/services/rt'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import DetailItem from '@/components/ui/DetailItem.vue'
import {
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  HomeModernIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'
import { getInitials, formatDateTime } from '@/utils/helpers'

const route = useRoute()
const router = useRouter()

// State
const loading = ref(true)
const error = ref('')
const data = ref({
  rw_list: [],
})

// RW Modal state
const showRWModal = ref(false)
const modalMode = ref('tambah')
const rwForm = ref({
  id: null,
  nomor_rw: '',
  ketua_rw: '',
  telepon: '',
  jumlah_rt: 0,
  created_at: '',
  updated_at: '',
})
const rwSubmitting = ref(false)
const rwSubmitError = ref('')
const rwErrors = ref({
  nomor_rw: '',
})

// RT Modal state
const showRTModal = ref(false)
const rtModalMode = ref('tambah')
const selectedRw = ref(null)
const rtForm = ref({
  id: null,
  rw_id: null,
  nomor_rt: '',
  ketua_rt: '',
  telepon: '',
  jumlah_kk: 0,
  created_at: '',
  updated_at: '',
})
const rtSubmitting = ref(false)
const rtSubmitError = ref('')
const rtErrors = ref({
  nomor_rt: '',
})

// Computed
const totalRt = computed(() => {
  return data.value.rw_list?.reduce((acc, rw) => acc + getRtCount(rw), 0) || 0
})

const totalKk = computed(() => {
  return data.value.rw_list?.reduce((acc, rw) => acc + getKkCount(rw), 0) || 0
})

const kepadatan = computed(() => {
  if (totalRt.value === 0) return 0
  return Math.round(totalKk.value / totalRt.value)
})

// Helper functions
const getRtCount = (rw) => {
  return rw.rt_list?.length || 0
}

const getKkCount = (rw) => {
  return rw.rt_list?.reduce((acc, rt) => acc + (rt.jumlah_kk || 0), 0) || 0
}

// Fetch data
const fetchDetail = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await dusunService.getDusunById(route.params.id)

    if (response.success) {
      data.value = response.data
      // Ensure each RW has rt_list array
      data.value.rw_list =
        data.value.rw_list?.map((rw) => ({
          ...rw,
          rt_list: rw.rt_list || [],
        })) || []
    } else {
      error.value = response.message || 'Gagal memuat data dusun'
    }
  } catch (err) {
    console.error('Error fetching dusun detail:', err)
    error.value = err.message || 'Terjadi kesalahan saat memuat data'
  } finally {
    loading.value = false
  }
}

// RW Modal functions
const openTambahRWModal = () => {
  modalMode.value = 'tambah'
  rwForm.value = {
    id: null,
    nomor_rw: '',
    ketua_rw: '',
    telepon: '',
    jumlah_rt: 0,
    created_at: '',
    updated_at: '',
  }
  rwErrors.value = { nomor_rw: '' }
  rwSubmitError.value = ''
  showRWModal.value = true
}

const openEditRWModal = (rw) => {
  modalMode.value = 'edit'
  rwForm.value = { ...rw }
  rwErrors.value = { nomor_rw: '' }
  rwSubmitError.value = ''
  showRWModal.value = true
}

const openDetailRWModal = (rw) => {
  modalMode.value = 'detail'
  rwForm.value = { ...rw }
  showRWModal.value = true
}

const closeRWModal = () => {
  showRWModal.value = false
  rwForm.value = {
    id: null,
    nomor_rw: '',
    ketua_rw: '',
    telepon: '',
    jumlah_rt: 0,
    created_at: '',
    updated_at: '',
  }
  rwErrors.value = { nomor_rw: '' }
  rwSubmitError.value = ''
}

const validateRWForm = () => {
  rwErrors.value = { nomor_rw: '' }
  let isValid = true

  if (!rwForm.value.nomor_rw.trim()) {
    rwErrors.value.nomor_rw = 'Nomor RW diperlukan'
    isValid = false
  } else if (!/^\d{1,3}$/.test(rwForm.value.nomor_rw)) {
    rwErrors.value.nomor_rw = 'Nomor RW harus berupa angka (1-3 digit)'
    isValid = false
  }

  return isValid
}

const submitRWForm = async () => {
  if (!validateRWForm()) {
    return
  }

  rwSubmitting.value = true
  rwSubmitError.value = ''

  try {
    const payload = {
      nomor_rw: rwForm.value.nomor_rw,
      ketua_rw: rwForm.value.ketua_rw || undefined,
      telepon: rwForm.value.telepon || undefined,
    }

    let response
    if (modalMode.value === 'tambah') {
      payload.dusun_id = parseInt(route.params.id)
      response = await rwService.createRw(payload)
    } else {
      response = await rwService.updateRw(rwForm.value.id, payload)
    }

    if (response.success) {
      alert(modalMode.value === 'tambah' ? 'RW berhasil ditambahkan!' : 'RW berhasil diperbarui!')
      closeRWModal()
      await fetchDetail()
    } else {
      rwSubmitError.value = response.message || 'Gagal menyimpan data'
    }
  } catch (err) {
    console.error('Error submitting RW:', err)
    if (err.message?.includes('Network Error')) {
      rwSubmitError.value = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
    } else if (err.message?.includes('409')) {
      rwSubmitError.value = 'Nomor RW sudah digunakan. Silakan gunakan nomor yang berbeda.'
    } else {
      rwSubmitError.value = err.message || 'Gagal menyimpan data'
    }
  } finally {
    rwSubmitting.value = false
  }
}

const confirmDeleteRW = async (rw) => {
  if (
    !confirm(
      `Yakin ingin menghapus RW ${rw.nomor_rw}?\n\nSemua RT di dalamnya juga akan ikut terhapus.`,
    )
  ) {
    return
  }

  try {
    await rwService.deleteRw(rw.id)
    alert('RW berhasil dihapus')
    await fetchDetail()
  } catch (err) {
    console.error('Error deleting RW:', err)
    alert('Gagal menghapus RW: ' + (err.message || 'Terjadi kesalahan'))
  }
}

// RT Modal functions
const openTambahRTModal = (rw) => {
  rtModalMode.value = 'tambah'
  selectedRw.value = rw
  rtForm.value = {
    id: null,
    rw_id: rw.id,
    nomor_rt: '',
    ketua_rt: '',
    telepon: '',
    jumlah_kk: 0,
    created_at: '',
    updated_at: '',
  }
  rtErrors.value = { nomor_rt: '' }
  rtSubmitError.value = ''
  showRTModal.value = true
}

const openEditRTModal = (rt, rw) => {
  rtModalMode.value = 'edit'
  selectedRw.value = rw
  rtForm.value = { ...rt }
  rtErrors.value = { nomor_rt: '' }
  rtSubmitError.value = ''
  showRTModal.value = true
}

const openDetailRTModal = (rt, rw) => {
  rtModalMode.value = 'detail'
  selectedRw.value = rw
  rtForm.value = { ...rt }
  showRTModal.value = true
}

const closeRTModal = () => {
  showRTModal.value = false
  selectedRw.value = null
  rtForm.value = {
    id: null,
    rw_id: null,
    nomor_rt: '',
    ketua_rt: '',
    telepon: '',
    jumlah_kk: 0,
    created_at: '',
    updated_at: '',
  }
  rtErrors.value = { nomor_rt: '' }
  rtSubmitError.value = ''
}

const validateRTForm = () => {
  rtErrors.value = { nomor_rt: '' }
  let isValid = true

  if (!rtForm.value.nomor_rt.trim()) {
    rtErrors.value.nomor_rt = 'Nomor RT diperlukan'
    isValid = false
  } else if (!/^\d{1,3}$/.test(rtForm.value.nomor_rt)) {
    rtErrors.value.nomor_rt = 'Nomor RT harus berupa angka (1-3 digit)'
    isValid = false
  }

  return isValid
}

const submitRTForm = async () => {
  if (!validateRTForm()) {
    return
  }

  rtSubmitting.value = true
  rtSubmitError.value = ''

  try {
    const payload = {
      nomor_rt: rtForm.value.nomor_rt,
      ketua_rt: rtForm.value.ketua_rt || undefined,
      telepon: rtForm.value.telepon || undefined,
    }

    let response
    if (rtModalMode.value === 'tambah') {
      payload.rw_id = selectedRw.value.id
      response = await rtService.createRt(payload)
    } else {
      response = await rtService.updateRt(rtForm.value.id, payload)
    }

    if (response.success) {
      alert(rtModalMode.value === 'tambah' ? 'RT berhasil ditambahkan!' : 'RT berhasil diperbarui!')
      closeRTModal()
      await fetchDetail()
    } else {
      rtSubmitError.value = response.message || 'Gagal menyimpan data'
    }
  } catch (err) {
    console.error('Error submitting RT:', err)
    if (err.message?.includes('Network Error')) {
      rtSubmitError.value = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
    } else if (err.message?.includes('409')) {
      rtSubmitError.value = 'Nomor RT sudah digunakan. Silakan gunakan nomor yang berbeda.'
    } else {
      rtSubmitError.value = err.message || 'Gagal menyimpan data'
    }
  } finally {
    rtSubmitting.value = false
  }
}

const confirmDeleteRT = async (rt, rw) => {
  if (!confirm(`Yakin ingin menghapus RT ${rt.nomor_rt} dari RW ${rw.nomor_rw}?`)) {
    return
  }

  try {
    await rtService.deleteRt(rt.id)
    alert('RT berhasil dihapus')
    await fetchDetail()
  } catch (err) {
    console.error('Error deleting RT:', err)
    alert('Gagal menghapus RT: ' + (err.message || 'Terjadi kesalahan'))
  }
}

const confirmDeleteDusun = async () => {
  if (
    !confirm(
      `Yakin ingin menghapus dusun "${data.value.nama_dusun}"?\n\nSemua data RW dan RT di dalamnya juga akan ikut terhapus.`,
    )
  ) {
    return
  }

  try {
    await dusunService.deleteDusun(route.params.id)
    alert('Dusun berhasil dihapus')
    router.push('/admin/dusun')
  } catch (err) {
    console.error('Error deleting dusun:', err)
    alert('Gagal menghapus dusun: ' + (err.message || 'Terjadi kesalahan'))
  }
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.input-field {
  @apply block w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200;
}

.input-error {
  @apply border-red-300 focus:border-red-500 focus:ring-red-500;
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

/* Hover effects */
.hover-lift {
  @apply transition-transform duration-200 hover:-translate-y-1;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded-full;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full hover:bg-gray-400 transition-colors;
}
</style>
