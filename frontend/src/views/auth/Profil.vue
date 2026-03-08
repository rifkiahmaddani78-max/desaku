<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-6 lg:py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="relative">
          <div
            class="w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"
          ></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-2 h-2 sm:w-3 sm:h-3 bg-primary-600 rounded-full animate-ping"></div>
          </div>
        </div>
        <p class="ml-3 text-sm text-gray-500">Memuat profil...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="max-w-2xl mx-auto">
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
          <div class="bg-gradient-to-r from-red-500 to-red-600 p-4 sm:p-6 text-center">
            <div
              class="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-white rounded-full flex items-center justify-center"
            >
              <svg
                class="w-8 h-8 sm:w-10 sm:h-10 text-red-500"
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
          </div>
          <div class="p-6 sm:p-8 text-center">
            <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2">Oops! Terjadi Kesalahan</h3>
            <p class="text-sm sm:text-base text-gray-600 mb-6">{{ error }}</p>
            <Button
              @click="fetchProfile"
              variant="primary"
              size="sm"
              sm-size="md"
              class="inline-flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </div>

      <!-- Main Content -->
      <div v-else class="space-y-4 sm:space-y-6">
        <!-- Profile Header Card -->
        <div
          class="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 shadow-xl"
        >
          <div class="relative p-4 sm:p-6 lg:p-8">
            <div class="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 lg:gap-8">
              <!-- Avatar -->
              <div class="relative group self-center sm:self-start">
                <div
                  class="absolute -inset-1 bg-gradient-to-r from-primary-300 to-primary-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"
                ></div>
                <div
                  class="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full bg-white flex items-center justify-center overflow-hidden ring-4 ring-white shadow-xl"
                >
                  <img
                    v-if="profile.foto_profil_url || previewImage"
                    :src="previewImage || profile.foto_profil_url"
                    :alt="profile.nama_lengkap"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-600">
                    {{ getInitials(profile.nama_lengkap) }}
                  </span>
                </div>
                <label
                  for="photo-upload"
                  class="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 border border-gray-200 group"
                  title="Upload foto profil"
                >
                  <svg
                    class="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 group-hover:text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handlePhotoUpload"
                  ref="fileInput"
                />
              </div>

              <!-- Info Utama -->
              <div class="flex-1 text-white min-w-0">
                <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 truncate">
                  {{ profile.nama_lengkap }}
                </h1>
                <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                  <Badge variant="white" size="sm" sm-size="md">
                    <span class="flex items-center text-xs sm:text-sm">
                      <svg
                        class="w-3 h-3 sm:w-4 sm:h-4 mr-1"
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
                      {{ profile.role_description || profile.role_name }}
                    </span>
                  </Badge>
                  <Badge
                    :variant="profile.is_verified ? 'success' : 'warning'"
                    size="sm"
                    sm-size="md"
                  >
                    <span class="flex items-center text-xs sm:text-sm">
                      <svg
                        class="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          v-if="profile.is_verified"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                        <path
                          v-else
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {{ profile.is_verified ? 'Terverifikasi' : 'Belum Verifikasi' }}
                    </span>
                  </Badge>
                </div>

                <!-- Upload Progress -->
                <div v-if="uploadProgress > 0" class="max-w-md">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs sm:text-sm text-white/80">Mengupload...</span>
                    <span class="text-xs sm:text-sm font-medium text-white"
                      >{{ uploadProgress }}%</span
                    >
                  </div>
                  <div class="w-full bg-white/20 rounded-full h-1.5 sm:h-2">
                    <div
                      class="bg-white h-1.5 sm:h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${uploadProgress}%` }"
                    ></div>
                  </div>
                </div>
                <p v-if="uploadError" class="mt-1 sm:mt-2 text-xs sm:text-sm text-red-200">
                  {{ uploadError }}
                </p>
              </div>

              <!-- Quick Stats -->
              <div
                class="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-2 text-white/80 mt-2 sm:mt-0"
              >
                <div
                  class="text-xs sm:text-sm bg-white/10 px-2 py-1 rounded-lg sm:bg-transparent sm:px-0"
                >
                  ID: {{ profile.id }}
                </div>
                <div
                  class="text-xs sm:text-sm bg-white/10 px-2 py-1 rounded-lg sm:bg-transparent sm:px-0"
                >
                  NIK: {{ profile.nik }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Info Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div class="bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 lg:p-6">
            <div class="flex items-center">
              <div class="p-2 sm:p-3 bg-primary-100 rounded-lg sm:rounded-xl">
                <svg
                  class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div class="ml-2 sm:ml-3 lg:ml-4 min-w-0">
                <p class="text-xs sm:text-sm text-gray-500 truncate">Email</p>
                <p class="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                  {{ profile.email || '-' }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 lg:p-6">
            <div class="flex items-center">
              <div class="p-2 sm:p-3 bg-green-100 rounded-lg sm:rounded-xl">
                <svg
                  class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div class="ml-2 sm:ml-3 lg:ml-4 min-w-0">
                <p class="text-xs sm:text-sm text-gray-500 truncate">Telepon</p>
                <p class="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                  {{ profile.telepon || '-' }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 lg:p-6">
            <div class="flex items-center">
              <div class="p-2 sm:p-3 bg-purple-100 rounded-lg sm:rounded-xl">
                <svg
                  class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600"
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
              <div class="ml-2 sm:ml-3 lg:ml-4 min-w-0">
                <p class="text-xs sm:text-sm text-gray-500 truncate">Username</p>
                <p class="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                  {{ profile.username }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 lg:p-6">
            <div class="flex items-center">
              <div class="p-2 sm:p-3 bg-yellow-100 rounded-lg sm:rounded-xl">
                <svg
                  class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-600"
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
              <div class="ml-2 sm:ml-3 lg:ml-4 min-w-0">
                <p class="text-xs sm:text-sm text-gray-500 truncate">Bergabung</p>
                <p class="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                  {{ formatDate(profile.created_at, 'short') }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Card dengan Tabs -->
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
          <!-- Tabs Navigation - Responsif -->
          <div class="border-b border-gray-200 overflow-x-auto">
            <nav
              class="flex space-x-4 sm:space-x-6 lg:space-x-8 px-4 sm:px-6 lg:px-8 min-w-max sm:min-w-0"
              aria-label="Tabs"
            >
              <button
                @click="activeTab = 'profile'"
                :class="[
                  activeTab === 'profile'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-200',
                ]"
              >
                <span class="flex items-center">
                  <svg
                    class="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
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
                  <span class="hidden xs:inline">Data Pribadi</span>
                  <span class="xs:hidden">Pribadi</span>
                </span>
              </button>
              <button
                @click="activeTab = 'address'"
                :class="[
                  activeTab === 'address'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-200',
                ]"
              >
                <span class="flex items-center">
                  <svg
                    class="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
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
                  <span class="hidden xs:inline">Alamat</span>
                  <span class="xs:hidden">Alamat</span>
                </span>
              </button>
              <button
                @click="activeTab = 'security'"
                :class="[
                  activeTab === 'security'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-200',
                ]"
              >
                <span class="flex items-center">
                  <svg
                    class="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span class="hidden xs:inline">Keamanan</span>
                  <span class="xs:hidden">Keamanan</span>
                </span>
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="p-4 sm:p-6 lg:p-8">
            <!-- Tab: Data Pribadi -->
            <div v-if="activeTab === 'profile'">
              <form @submit.prevent="handleSubmitProfile">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <!-- NIK (readonly) -->
                  <div class="space-y-1 sm:space-y-2">
                    <label class="block text-xs sm:text-sm font-medium text-gray-700">NIK</label>
                    <div
                      class="flex items-center p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <svg
                        class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-1 sm:mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                        />
                      </svg>
                      <span class="text-xs sm:text-sm text-gray-900 truncate">{{
                        profile.nik
                      }}</span>
                    </div>
                  </div>

                  <!-- Nama Lengkap -->
                  <div class="space-y-1 sm:space-y-2">
                    <label class="block text-xs sm:text-sm font-medium text-gray-700">
                      Nama Lengkap <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="editForm.nama_lengkap"
                      type="text"
                      class="w-full px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      :class="{ 'border-red-500 ring-2 ring-red-200': errors.nama_lengkap }"
                    />
                    <p v-if="errors.nama_lengkap" class="text-xs text-red-600">
                      {{ errors.nama_lengkap }}
                    </p>
                  </div>

                  <!-- Jenis Kelamin -->
                  <div class="space-y-1 sm:space-y-2">
                    <label class="block text-xs sm:text-sm font-medium text-gray-700"
                      >Jenis Kelamin</label
                    >
                    <div class="flex flex-wrap gap-3 sm:gap-4">
                      <label class="inline-flex items-center">
                        <input
                          v-model="editForm.jenis_kelamin"
                          type="radio"
                          value="L"
                          class="w-3 h-3 sm:w-4 sm:h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <span class="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-700">Laki-laki</span>
                      </label>
                      <label class="inline-flex items-center">
                        <input
                          v-model="editForm.jenis_kelamin"
                          type="radio"
                          value="P"
                          class="w-3 h-3 sm:w-4 sm:h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <span class="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-700">Perempuan</span>
                      </label>
                    </div>
                  </div>

                  <!-- Tempat Lahir -->
                  <div class="space-y-1 sm:space-y-2">
                    <label class="block text-xs sm:text-sm font-medium text-gray-700"
                      >Tempat Lahir</label
                    >
                    <input
                      v-model="editForm.tempat_lahir"
                      type="text"
                      class="w-full px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    />
                  </div>

                  <!-- Tanggal Lahir -->
                  <div class="space-y-1 sm:space-y-2">
                    <label class="block text-xs sm:text-sm font-medium text-gray-700"
                      >Tanggal Lahir</label
                    >
                    <input
                      v-model="editForm.tanggal_lahir"
                      type="date"
                      class="w-full px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      :max="today"
                    />
                    <p v-if="errors.tanggal_lahir" class="text-xs text-red-600">
                      {{ errors.tanggal_lahir }}
                    </p>
                  </div>

                  <!-- Agama -->
                  <div class="space-y-1 sm:space-y-2">
                    <label class="block text-xs sm:text-sm font-medium text-gray-700">Agama</label>
                    <select
                      v-model="editForm.agama"
                      class="w-full px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    >
                      <option value="">Pilih Agama</option>
                      <option value="ISLAM">Islam</option>
                      <option value="KRISTEN">Kristen</option>
                      <option value="KATOLIK">Katolik</option>
                      <option value="HINDU">Hindu</option>
                      <option value="BUDDHA">Buddha</option>
                      <option value="KONGHUCU">Konghucu</option>
                    </select>
                  </div>

                  <!-- Pekerjaan -->
                  <div class="space-y-1 sm:space-y-2">
                    <label class="block text-xs sm:text-sm font-medium text-gray-700"
                      >Pekerjaan</label
                    >
                    <input
                      v-model="editForm.pekerjaan"
                      type="text"
                      class="w-full px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      placeholder="Contoh: Petani, Pedagang"
                    />
                  </div>

                  <!-- Status Perkawinan -->
                  <div class="space-y-1 sm:space-y-2">
                    <label class="block text-xs sm:text-sm font-medium text-gray-700"
                      >Status Perkawinan</label
                    >
                    <select
                      v-model="editForm.status_perkawinan"
                      class="w-full px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    >
                      <option value="">Pilih Status</option>
                      <option value="BELUM_KAWIN">Belum Kawin</option>
                      <option value="KAWIN">Kawin</option>
                      <option value="CERAI_HIDUP">Cerai Hidup</option>
                      <option value="CERAI_MATI">Cerai Mati</option>
                    </select>
                  </div>

                  <!-- Email -->
                  <div class="space-y-1 sm:space-y-2">
                    <label class="block text-xs sm:text-sm font-medium text-gray-700">Email</label>
                    <input
                      v-model="editForm.email"
                      type="email"
                      class="w-full px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      :class="{ 'border-red-500 ring-2 ring-red-200': errors.email }"
                    />
                    <p v-if="errors.email" class="text-xs text-red-600">{{ errors.email }}</p>
                  </div>

                  <!-- Telepon -->
                  <div class="space-y-1 sm:space-y-2">
                    <label class="block text-xs sm:text-sm font-medium text-gray-700"
                      >Telepon</label
                    >
                    <input
                      v-model="editForm.telepon"
                      type="tel"
                      class="w-full px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <!-- Action Buttons -->
                <div
                  class="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200"
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    sm-size="md"
                    @click="resetProfileForm"
                    class="w-full sm:w-auto"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    sm-size="md"
                    :loading="submitting.profile"
                    class="w-full sm:w-auto"
                  >
                    <svg
                      v-if="!submitting.profile"
                      class="w-4 h-4 mr-2"
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
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </div>

            <!-- Tab: Alamat -->
            <div v-if="activeTab === 'address'" class="space-y-4 sm:space-y-6 lg:space-y-8">
              <!-- Alamat Lengkap Card -->
              <div
                class="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg sm:rounded-xl p-4 sm:p-6"
              >
                <div class="flex items-start">
                  <div class="p-2 sm:p-3 bg-primary-600 rounded-lg sm:rounded-xl">
                    <svg
                      class="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
                  <div class="ml-3 sm:ml-4 min-w-0">
                    <p class="text-xs sm:text-sm font-medium text-primary-600 mb-1">
                      Alamat Lengkap
                    </p>
                    <p
                      class="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 break-words"
                    >
                      {{ profile.alamat_lengkap || '-' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Grid Wilayah -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                <div
                  class="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden"
                >
                  <div class="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                    <div class="flex items-center">
                      <div class="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                        <svg
                          class="w-4 h-4 sm:w-5 sm:h-5 text-green-600"
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
                      <h3 class="ml-2 sm:ml-3 text-xs sm:text-sm font-medium text-gray-900">
                        Dusun
                      </h3>
                    </div>
                  </div>
                  <div class="p-3 sm:p-4 lg:p-6">
                    <p class="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                      {{ profile.nama_dusun || '-' }}
                    </p>
                    <p v-if="profile.dusun_id" class="text-xs text-gray-500 mt-1">
                      ID: {{ profile.dusun_id }}
                    </p>
                  </div>
                </div>

                <div
                  class="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden"
                >
                  <div class="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                    <div class="flex items-center">
                      <div class="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
                        <svg
                          class="w-4 h-4 sm:w-5 sm:h-5 text-purple-600"
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
                      <h3 class="ml-2 sm:ml-3 text-xs sm:text-sm font-medium text-gray-900">RW</h3>
                    </div>
                  </div>
                  <div class="p-3 sm:p-4 lg:p-6">
                    <p class="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                      {{ profile.nomor_rw ? `RW ${profile.nomor_rw}` : '-' }}
                    </p>
                    <p v-if="profile.rw_id" class="text-xs text-gray-500 mt-1">
                      ID: {{ profile.rw_id }}
                    </p>
                  </div>
                </div>

                <div
                  class="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden"
                >
                  <div class="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                    <div class="flex items-center">
                      <div class="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                        <svg
                          class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"
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
                      <h3 class="ml-2 sm:ml-3 text-xs sm:text-sm font-medium text-gray-900">RT</h3>
                    </div>
                  </div>
                  <div class="p-3 sm:p-4 lg:p-6">
                    <p class="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                      {{ profile.nomor_rt ? `RT ${profile.nomor_rt}` : '-' }}
                    </p>
                    <p v-if="profile.rt_id" class="text-xs text-gray-500 mt-1">
                      ID: {{ profile.rt_id }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Koordinat -->
              <div class="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6">
                <h3 class="text-sm sm:text-base lg:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                  Koordinat Lokasi
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-500 mb-1"
                      >Latitude</label
                    >
                    <div class="flex items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <span class="text-xs sm:text-sm font-mono text-gray-900 break-all">{{
                        profile.koordinat_lat || '-'
                      }}</span>
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-500 mb-1"
                      >Longitude</label
                    >
                    <div class="flex items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <span class="text-xs sm:text-sm font-mono text-gray-900 break-all">{{
                        profile.koordinat_lng || '-'
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tab: Keamanan -->
            <div v-if="activeTab === 'security'">
              <form @submit.prevent="handleSubmitPassword">
                <div class="space-y-4 sm:space-y-6">
                  <!-- Current Password -->
                  <div class="space-y-1 sm:space-y-2">
                    <label class="block text-xs sm:text-sm font-medium text-gray-700">
                      Password Saat Ini <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <input
                        v-model="passwordForm.current_password"
                        :type="showPassword ? 'text' : 'password'"
                        class="w-full px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 pr-10"
                        :class="{
                          'border-red-500 ring-2 ring-red-200': passwordErrors.current_password,
                        }"
                        placeholder="Masukkan password saat ini"
                        required
                      />
                      <button
                        type="button"
                        @click="showPassword = !showPassword"
                        class="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <svg
                          class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            v-if="showPassword"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                          <path
                            v-else
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
                      </button>
                    </div>
                    <p v-if="passwordErrors.current_password" class="text-xs text-red-600">
                      {{ passwordErrors.current_password }}
                    </p>
                  </div>

                  <!-- New Password -->
                  <div class="space-y-1 sm:space-y-2">
                    <label class="block text-xs sm:text-sm font-medium text-gray-700">
                      Password Baru <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="passwordForm.new_password"
                      :type="showPassword ? 'text' : 'password'"
                      class="w-full px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      :class="{ 'border-red-500 ring-2 ring-red-200': passwordErrors.new_password }"
                      placeholder="Minimal 8 karakter"
                      required
                    />
                    <p v-if="passwordErrors.new_password" class="text-xs text-red-600">
                      {{ passwordErrors.new_password }}
                    </p>
                  </div>

                  <!-- Confirm Password -->
                  <div class="space-y-1 sm:space-y-2">
                    <label class="block text-xs sm:text-sm font-medium text-gray-700">
                      Konfirmasi Password Baru <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="passwordForm.confirm_password"
                      :type="showPassword ? 'text' : 'password'"
                      class="w-full px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      :class="{
                        'border-red-500 ring-2 ring-red-200': passwordErrors.confirm_password,
                      }"
                      placeholder="Ulangi password baru"
                      required
                    />
                    <p v-if="passwordErrors.confirm_password" class="text-xs text-red-600">
                      {{ passwordErrors.confirm_password }}
                    </p>
                  </div>
                </div>

                <!-- Password Requirements Info -->
                <div class="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50 rounded-lg">
                  <div class="flex">
                    <svg
                      class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0"
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
                    <p class="ml-2 sm:ml-3 text-xs sm:text-sm text-yellow-700">
                      Password harus mengandung minimal 8 karakter, huruf besar, huruf kecil, angka,
                      dan karakter spesial.
                    </p>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div
                  class="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200"
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    sm-size="md"
                    @click="resetPasswordForm"
                    class="w-full sm:w-auto"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    sm-size="md"
                    :loading="submitting.password"
                    class="w-full sm:w-auto"
                  >
                    <svg
                      v-if="!submitting.password"
                      class="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Update Password
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Success Notification -->
        <transition name="slide-up">
          <div
            v-if="submitSuccess"
            class="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-4 bg-green-500 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-lg shadow-lg flex items-center text-sm sm:text-base z-50"
          >
            <svg
              class="w-5 h-5 mr-2 flex-shrink-0"
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
            <span class="flex-1">{{ submitSuccess }}</span>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { profileService } from '@/services/profile'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import {
  getInitials,
  formatDate,
  formatDateTime,
  validatePasswordStrength,
  isValidEmail,
} from '@/utils/helpers'

const router = useRouter()
const authStore = useAuthStore()

// State
const loading = ref(true)
const error = ref('')
const activeTab = ref('profile')
const showPassword = ref(false)
const today = ref(new Date().toISOString().split('T')[0])

// Submit states per tab
const submitting = ref({
  profile: false,
  password: false,
})

// Messages
const submitError = ref('')
const submitSuccess = ref('')

// Foto profil
const fileInput = ref(null)
const previewImage = ref('')
const uploadProgress = ref(0)
const uploadError = ref('')

// Data profile
const profile = ref({})

// Edit form untuk profile
const editForm = reactive({
  nama_lengkap: '',
  email: '',
  telepon: '',
  jenis_kelamin: 'L',
  tempat_lahir: '',
  tanggal_lahir: '',
  agama: '',
  pekerjaan: '',
  status_perkawinan: '',
})

// Password form (sesuai dengan format API)
const passwordForm = reactive({
  current_password: '',
  new_password: '',
  confirm_password: '',
})

// Validation errors
const errors = reactive({
  nama_lengkap: '',
  email: '',
  tanggal_lahir: '',
})

const passwordErrors = reactive({
  current_password: '',
  new_password: '',
  confirm_password: '',
})

// Fetch profile data
const fetchProfile = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await profileService.getProfile()

    if (response.success) {
      profile.value = response.data

      // Map to edit form
      editForm.nama_lengkap = response.data.nama_lengkap || ''
      editForm.email = response.data.email || ''
      editForm.telepon = response.data.telepon || ''
      editForm.jenis_kelamin = response.data.jenis_kelamin || 'L'
      editForm.tempat_lahir = response.data.tempat_lahir || ''
      editForm.tanggal_lahir = response.data.tanggal_lahir
        ? response.data.tanggal_lahir.split('T')[0]
        : ''
      editForm.agama = response.data.agama || ''
      editForm.pekerjaan = response.data.pekerjaan || ''
      editForm.status_perkawinan = response.data.status_perkawinan || ''
    } else {
      error.value = response.message || 'Gagal memuat profil'
    }
  } catch (err) {
    console.error('Error fetching profile:', err)
    error.value = err.message || 'Terjadi kesalahan saat memuat profil'
  } finally {
    loading.value = false
  }
}

// Handle foto upload
const handlePhotoUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validasi file
  if (!file.type.startsWith('image/')) {
    uploadError.value = 'File harus berupa gambar'
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    // 2MB
    uploadError.value = 'Ukuran file maksimal 2MB'
    return
  }

  // Preview
  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target.result
  }
  reader.readAsDataURL(file)

  // Upload
  uploadError.value = ''
  uploadProgress.value = 0

  try {
    const formData = new FormData()
    formData.append('foto', file)

    uploadProgress.value = 50

    const response = await profileService.uploadPhoto(formData)

    if (response.success) {
      uploadProgress.value = 100
      profile.value.foto_profil_url = response.data.foto_url

      // Update auth store
      if (authStore.user) {
        authStore.user.foto_profil = response.data.foto_url
      }

      setTimeout(() => {
        uploadProgress.value = 0
        previewImage.value = ''
      }, 2000)
    } else {
      throw new Error(response.message || 'Gagal upload foto')
    }
  } catch (err) {
    console.error('Error uploading photo:', err)
    uploadError.value = err.message || 'Gagal upload foto'
    uploadProgress.value = 0
    previewImage.value = ''
  }
}

// Validasi form profile
const validateProfileForm = () => {
  let isValid = true
  errors.nama_lengkap = ''
  errors.email = ''
  errors.tanggal_lahir = ''

  // Nama lengkap
  if (!editForm.nama_lengkap.trim()) {
    errors.nama_lengkap = 'Nama lengkap diperlukan'
    isValid = false
  } else if (editForm.nama_lengkap.trim().length < 3) {
    errors.nama_lengkap = 'Nama minimal 3 karakter'
    isValid = false
  }

  // Email
  if (editForm.email && !isValidEmail(editForm.email)) {
    errors.email = 'Format email tidak valid'
    isValid = false
  }

  // Tanggal lahir
  if (editForm.tanggal_lahir) {
    const birthDate = new Date(editForm.tanggal_lahir)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()

    if (age < 17) {
      errors.tanggal_lahir = 'Usia minimal 17 tahun'
      isValid = false
    }
  }

  return isValid
}

// Validasi password
const validatePasswordForm = () => {
  passwordErrors.current_password = ''
  passwordErrors.new_password = ''
  passwordErrors.confirm_password = ''
  let isValid = true

  // Current password wajib
  if (!passwordForm.current_password) {
    passwordErrors.current_password = 'Password saat ini diperlukan'
    isValid = false
  }

  // Validasi new password
  if (!passwordForm.new_password) {
    passwordErrors.new_password = 'Password baru diperlukan'
    isValid = false
  } else {
    const strength = validatePasswordStrength(passwordForm.new_password)
    if (!strength.isValid) {
      passwordErrors.new_password = 'Password tidak memenuhi kriteria keamanan'
      isValid = false
    }
  }

  // Validasi confirm password
  if (!passwordForm.confirm_password) {
    passwordErrors.confirm_password = 'Konfirmasi password diperlukan'
    isValid = false
  } else if (passwordForm.new_password !== passwordForm.confirm_password) {
    passwordErrors.confirm_password = 'Password tidak cocok'
    isValid = false
  }

  return isValid
}

// Reset forms
const resetProfileForm = () => {
  editForm.nama_lengkap = profile.value.nama_lengkap || ''
  editForm.email = profile.value.email || ''
  editForm.telepon = profile.value.telepon || ''
  editForm.jenis_kelamin = profile.value.jenis_kelamin || 'L'
  editForm.tempat_lahir = profile.value.tempat_lahir || ''
  editForm.tanggal_lahir = profile.value.tanggal_lahir
    ? profile.value.tanggal_lahir.split('T')[0]
    : ''
  editForm.agama = profile.value.agama || ''
  editForm.pekerjaan = profile.value.pekerjaan || ''
  editForm.status_perkawinan = profile.value.status_perkawinan || ''

  errors.nama_lengkap = ''
  errors.email = ''
  errors.tanggal_lahir = ''
}

const resetPasswordForm = () => {
  passwordForm.current_password = ''
  passwordForm.new_password = ''
  passwordForm.confirm_password = ''
  passwordErrors.current_password = ''
  passwordErrors.new_password = ''
  passwordErrors.confirm_password = ''
}

// Handle submit profile
const handleSubmitProfile = async () => {
  if (!validateProfileForm()) return

  submitting.value.profile = true
  submitError.value = ''
  submitSuccess.value = ''

  try {
    const payload = {
      nama_lengkap: editForm.nama_lengkap,
      email: editForm.email || undefined,
      telepon: editForm.telepon || undefined,
      jenis_kelamin: editForm.jenis_kelamin,
      tempat_lahir: editForm.tempat_lahir || undefined,
      tanggal_lahir: editForm.tanggal_lahir || undefined,
      agama: editForm.agama || undefined,
      pekerjaan: editForm.pekerjaan || undefined,
      status_perkawinan: editForm.status_perkawinan || undefined,
    }

    const response = await profileService.updateProfile(payload)

    if (response.success) {
      submitSuccess.value = 'Profil berhasil diperbarui!'

      // Update profile data
      profile.value = {
        ...profile.value,
        ...response.data,
      }

      // Update auth store
      if (authStore.user) {
        authStore.user = {
          ...authStore.user,
          ...response.data,
        }
      }

      setTimeout(() => {
        submitSuccess.value = ''
      }, 3000)
    } else {
      throw new Error(response.message || 'Gagal update profil')
    }
  } catch (err) {
    console.error('Error updating profile:', err)
    submitError.value = err.message || 'Gagal memperbarui profil'
  } finally {
    submitting.value.profile = false
  }
}

// Handle submit password
const handleSubmitPassword = async () => {
  if (!validatePasswordForm()) return

  submitting.value.password = true
  submitError.value = ''
  submitSuccess.value = ''

  try {
    const payload = {
      current_password: passwordForm.current_password,
      new_password: passwordForm.new_password,
      confirm_password: passwordForm.confirm_password,
    }

    const response = await profileService.updatePassword(payload)

    if (response.success) {
      submitSuccess.value = 'Password berhasil diperbarui!'
      resetPasswordForm()

      setTimeout(() => {
        submitSuccess.value = ''
      }, 3000)
    } else {
      throw new Error(response.message || 'Gagal update password')
    }
  } catch (err) {
    console.error('Error updating password:', err)
    submitError.value = err.message || 'Gagal memperbarui password'
  } finally {
    submitting.value.password = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
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

/* Responsive breakpoints helpers */
.xs\:inline {
  @media (min-width: 480px) {
    display: inline;
  }
}

.xs\:hidden {
  @media (min-width: 480px) {
    display: none;
  }
}
</style>
