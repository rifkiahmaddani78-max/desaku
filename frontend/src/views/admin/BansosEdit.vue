<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 mb-2">Edit Bansos</h1>
          <p class="text-sm text-gray-600">Ubah informasi program bantuan sosial</p>
        </div>
        <div>
          <router-link :to="`/admin/daftar-bansos/${id}`">
            <button
              class="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Kembali ke Detail
            </button>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
      ></div>
      <p class="mt-2 text-sm text-gray-500">Memuat data bansos...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12 bg-white rounded-lg border border-gray-200">
      <div class="mx-auto h-12 w-12 text-red-500">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Terjadi Kesalahan</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{ error }}
      </p>
      <div class="mt-6">
        <router-link to="/admin/daftar-bansos">
          <button
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Kembali ke Daftar Bansos
          </button>
        </router-link>
      </div>
    </div>

    <!-- Main Form -->
    <form v-else @submit.prevent="submitForm">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Basic Information -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic Information Card -->
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 class="text-lg font-medium text-gray-900">Informasi Dasar</h2>
              <p class="text-sm text-gray-500 mt-1">Informasi utama program bansos</p>
            </div>
            <div class="p-6">
              <div class="space-y-6">
                <!-- Grid untuk Nama dan Kode -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Nama Bansos -->
                  <div>
                    <label for="nama_bansos" class="block text-sm font-medium text-gray-700 mb-2">
                      Nama Bansos <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nama_bansos"
                      v-model="form.nama_bansos"
                      :class="[
                        'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                        errors.nama_bansos ? 'border-red-300' : 'border-gray-300',
                      ]"
                      placeholder="Contoh: Bantuan Sembako Tahap 1"
                    />
                    <p v-if="errors.nama_bansos" class="mt-1 text-sm text-red-600">
                      {{ errors.nama_bansos }}
                    </p>
                  </div>

                  <!-- Kode Bansos -->
                  <div>
                    <label for="kode_bansos" class="block text-sm font-medium text-gray-700 mb-2">
                      Kode Bansos <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="kode_bansos"
                      v-model="form.kode_bansos"
                      :class="[
                        'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                        errors.kode_bansos ? 'border-red-300' : 'border-gray-300',
                      ]"
                      placeholder="Contoh: BS-T1-2024"
                    />
                    <p v-if="errors.kode_bansos" class="mt-1 text-sm text-red-600">
                      {{ errors.kode_bansos }}
                    </p>
                    <p class="mt-1 text-xs text-gray-500">Kode unik untuk identifikasi bansos</p>
                  </div>
                </div>

                <!-- Grid untuk Jenis, Kategori, Prioritas -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <!-- Jenis Bansos -->
                  <div>
                    <label for="jenis_bansos" class="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Bansos <span class="text-red-500">*</span>
                    </label>
                    <select
                      id="jenis_bansos"
                      v-model="form.jenis_bansos"
                      :class="[
                        'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                        errors.jenis_bansos ? 'border-red-300' : 'border-gray-300',
                      ]"
                    >
                      <option value="TUNAI">Tunai</option>
                      <option value="BARANG">Barang</option>
                      <option value="JASA">Jasa</option>
                    </select>
                    <p v-if="errors.jenis_bansos" class="mt-1 text-sm text-red-600">
                      {{ errors.jenis_bansos }}
                    </p>
                  </div>

                  <!-- Kategori -->
                  <div>
                    <label for="kategori" class="block text-sm font-medium text-gray-700 mb-2">
                      Kategori <span class="text-red-500">*</span>
                    </label>
                    <select
                      id="kategori"
                      v-model="form.kategori"
                      :class="[
                        'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                        errors.kategori ? 'border-red-300' : 'border-gray-300',
                      ]"
                    >
                      <option value="TUNAI">Tunai</option>
                      <option value="SEMBAKO">Sembako</option>
                      <option value="PENDIDIKAN">Pendidikan</option>
                      <option value="KESEHATAN">Kesehatan</option>
                      <option value="UMKM">UMKM</option>
                      <option value="LAINNYA">Lainnya</option>
                    </select>
                    <p v-if="errors.kategori" class="mt-1 text-sm text-red-600">
                      {{ errors.kategori }}
                    </p>
                  </div>

                  <!-- Prioritas -->
                  <div>
                    <label for="prioritas" class="block text-sm font-medium text-gray-700 mb-2">
                      Prioritas <span class="text-red-500">*</span>
                    </label>
                    <select
                      id="prioritas"
                      v-model="form.prioritas"
                      :class="[
                        'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                        errors.prioritas ? 'border-red-300' : 'border-gray-300',
                      ]"
                    >
                      <option value="">Pilih Prioritas</option>
                      <option value="TINGGI">Tinggi</option>
                      <option value="SEDANG">Sedang</option>
                      <option value="RENDAH">Rendah</option>
                      <option value="DARURAT">Darurat</option>
                    </select>
                    <p v-if="errors.prioritas" class="mt-1 text-sm text-red-600">
                      {{ errors.prioritas }}
                    </p>
                  </div>
                </div>

                <!-- Jumlah Nominal (jika jenis TUNAI) -->
                <div v-if="form.jenis_bansos === 'TUNAI'">
                  <label for="jumlah_nominal" class="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah Nominal (Rp) <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <div
                      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    >
                      <span class="text-gray-500 sm:text-sm">Rp</span>
                    </div>
                    <input
                      type="number"
                      id="jumlah_nominal"
                      v-model.number="form.jumlah_nominal"
                      :class="[
                        'w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                        errors.jumlah_nominal ? 'border-red-300' : 'border-gray-300',
                      ]"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <p v-if="errors.jumlah_nominal" class="mt-1 text-sm text-red-600">
                    {{ errors.jumlah_nominal }}
                  </p>
                </div>

                <!-- Penerima Manfaat -->
                <div>
                  <label
                    for="penerima_manfaat"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Penerima Manfaat <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="penerima_manfaat"
                    v-model="form.penerima_manfaat"
                    :class="[
                      'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                      errors.penerima_manfaat ? 'border-red-300' : 'border-gray-300',
                    ]"
                  >
                    <option value="">Pilih Penerima Manfaat</option>
                    <option value="Keluarga Miskin">Keluarga Miskin</option>
                    <option value="Lansia">Lansia</option>
                    <option value="Disabilitas">Disabilitas</option>
                    <option value="Anak Yatim">Anak Yatim</option>
                    <option value="Janda">Janda</option>
                    <option value="Dufa">Duafa</option>
                    <option value="Semua Warga">Semua Warga</option>
                  </select>
                  <p v-if="errors.penerima_manfaat" class="mt-1 text-sm text-red-600">
                    {{ errors.penerima_manfaat }}
                  </p>
                </div>

                <!-- Deskripsi -->
                <div>
                  <label for="deskripsi" class="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Lengkap <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    id="deskripsi"
                    v-model="form.deskripsi"
                    rows="4"
                    :class="[
                      'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none',
                      errors.deskripsi ? 'border-red-300' : 'border-gray-300',
                    ]"
                    placeholder="Deskripsi lengkap tentang program bansos, tujuan, kriteria penerima, dll."
                  ></textarea>
                  <p v-if="errors.deskripsi" class="mt-1 text-sm text-red-600">
                    {{ errors.deskripsi }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Timeline Card -->
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 class="text-lg font-medium text-gray-900">Timeline Program</h2>
              <p class="text-sm text-gray-500 mt-1">Tentukan periode pelaksanaan bansos</p>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Tanggal Mulai -->
                <div>
                  <label for="tanggal_mulai" class="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Mulai <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="tanggal_mulai"
                    v-model="form.tanggal_mulai"
                    :class="[
                      'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                      errors.tanggal_mulai ? 'border-red-300' : 'border-gray-300',
                    ]"
                    @change="validateDates"
                  />
                  <p v-if="errors.tanggal_mulai" class="mt-1 text-sm text-red-600">
                    {{ errors.tanggal_mulai }}
                  </p>
                </div>

                <!-- Tanggal Selesai -->
                <div>
                  <label for="tanggal_selesai" class="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Selesai <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="tanggal_selesai"
                    v-model="form.tanggal_selesai"
                    :class="[
                      'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                      errors.tanggal_selesai ? 'border-red-300' : 'border-gray-300',
                    ]"
                    :min="form.tanggal_mulai"
                    @change="validateDates"
                  />
                  <p v-if="errors.tanggal_selesai" class="mt-1 text-sm text-red-600">
                    {{ errors.tanggal_selesai }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Kuota Card -->
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-lg font-medium text-gray-900">Kuota Program</h2>
                  <p class="text-sm text-gray-500 mt-1">
                    Total kuota: {{ originalData?.kuota || 0 }} | Terpakai:
                    {{ originalData?.total_diterima || 0 }}
                  </p>
                </div>
                <div v-if="form.kuota_wilayah.length > 0" class="text-sm text-gray-700">
                  Total Alokasi: <span class="font-semibold">{{ totalAlokasiKuota }}</span>
                </div>
              </div>
            </div>
            <div class="p-6">
              <!-- Total Kuota (readonly karena sudah ada penerima) -->
              <div class="mb-6">
                <label for="kuota" class="block text-sm font-medium text-gray-700 mb-2">
                  Total Kuota
                </label>
                <input
                  type="number"
                  id="kuota"
                  v-model.number="form.kuota"
                  :class="[
                    'w-full px-4 py-2 border rounded-lg bg-gray-50',
                    errors.kuota ? 'border-red-300' : 'border-gray-300',
                  ]"
                />
                <p class="mt-1 text-xs text-gray-500">Tentukan kuota penerima bansos</p>
              </div>

              <!-- Distribusi Kuota Wilayah -->
              <div>
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-sm font-medium text-gray-700">Distribusi Kuota Wilayah</h3>
                  <button
                    type="button"
                    @click="tambahWilayah"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    :disabled="totalTerpakaiWilayah >= form.kuota"
                  >
                    <svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Tambah Wilayah
                  </button>
                </div>

                <!-- Warning jika ada penerima -->
                <div
                  v-if="totalTerpakaiWilayah > 0"
                  class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div class="flex items-start">
                    <svg
                      class="h-5 w-5 text-yellow-400 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <div class="ml-3">
                      <p class="text-sm text-yellow-700">
                        <strong>Perhatian:</strong> Ada {{ totalTerpakaiWilayah }} kuota yang sudah
                        terpakai. Pengurangan kuota wilayah dapat mempengaruhi penerima yang sudah
                        ada.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- List Kuota Wilayah -->
                <div v-if="form.kuota_wilayah.length > 0">
                  <div class="overflow-hidden border border-gray-200 rounded-lg">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Dusun
                          </th>
                          <th
                            scope="col"
                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Kuota (Terpakai)
                          </th>
                          <th
                            scope="col"
                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="(item, index) in form.kuota_wilayah" :key="index">
                          <td class="px-4 py-3 whitespace-nowrap">
                            <div
                              v-if="item.terpakai > 0"
                              class="text-sm font-medium text-gray-900 mb-1"
                            >
                              {{ getDusunName(item.dusun_id) }}
                              <span
                                class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                Terpakai: {{ item.terpakai }}
                              </span>
                            </div>
                            <select
                              v-else
                              v-model.number="item.dusun_id"
                              :class="[
                                'w-full px-2 py-1 border rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500',
                                errors[`kuota_wilayah_${index}`]
                                  ? 'border-red-300'
                                  : 'border-gray-300',
                              ]"
                              @change="validateWilayah(index)"
                            >
                              <option value="">Pilih Dusun</option>
                              <option
                                v-for="dusun in getAvailableDusun(index)"
                                :key="dusun.id"
                                :value="dusun.id"
                              >
                                {{ dusun.nama_dusun }}
                              </option>
                            </select>
                            <p
                              v-if="errors[`kuota_wilayah_${index}`]"
                              class="mt-1 text-xs text-red-600"
                            >
                              {{ errors[`kuota_wilayah_${index}`] }}
                            </p>
                          </td>
                          <td class="px-4 py-3 whitespace-nowrap">
                            <div class="flex items-center space-x-2">
                              <input
                                type="number"
                                v-model.number="item.kuota"
                                :min="item.terpakai || 0"
                                :max="maxKuotaWilayah + item.kuota"
                                :disabled="item.terpakai > 0"
                                class="w-24 px-2 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                                @input="validateKuotaWilayah(index)"
                              />
                              <span v-if="item.terpakai > 0" class="text-xs text-gray-500">
                                ({{ item.terpakai }})
                              </span>
                            </div>
                          </td>
                          <td class="px-4 py-3 whitespace-nowrap">
                            <button
                              type="button"
                              @click="hapusWilayah(index)"
                              class="text-red-600 hover:text-red-900 transition-colors"
                              :disabled="item.terpakai > 0 || form.kuota_wilayah.length === 1"
                            >
                              <svg
                                class="h-5 w-5"
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
                            </button>
                          </td>
                        </tr>
                      </tbody>
                      <tfoot class="bg-gray-50">
                        <tr>
                          <td class="px-4 py-3 text-sm font-medium text-gray-900">Total</td>
                          <td class="px-4 py-3 text-sm font-medium text-gray-900">
                            {{ totalAlokasiKuota }} ({{ totalTerpakaiWilayah }} terpakai)
                          </td>
                          <td class="px-4 py-3">
                            <span
                              :class="{
                                'text-green-600': totalAlokasiKuota <= form.kuota,
                                'text-red-600': totalAlokasiKuota > form.kuota,
                              }"
                              class="text-sm font-medium"
                            >
                              {{ kuotaStatus }}
                            </span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <p v-if="totalAlokasiKuota > form.kuota" class="mt-2 text-sm text-red-600">
                    Total alokasi kuota wilayah ({{ totalAlokasiKuota }}) melebihi total kuota ({{
                      form.kuota
                    }})
                  </p>
                </div>
                <div
                  v-else
                  class="text-center py-8 border-2 border-gray-300 border-dashed rounded-lg"
                >
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 class="mt-2 text-sm font-medium text-gray-900">
                    Belum ada distribusi wilayah
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">
                    Tambahkan wilayah untuk mendistribusikan kuota
                  </p>
                  <div class="mt-6">
                    <button
                      type="button"
                      @click="tambahWilayah"
                      class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      :disabled="totalTerpakaiWilayah >= form.kuota"
                    >
                      <svg
                        class="mr-2 h-4 w-4"
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
                      Tambah Wilayah
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Status & Actions -->
        <div class="space-y-6">
          <!-- Status Card -->
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 class="text-lg font-medium text-gray-900">Status Program</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <!-- Status -->
                <div>
                  <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                    Status Bansos <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    v-model="form.status"
                    :class="[
                      'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                      errors.status ? 'border-red-300' : 'border-gray-300',
                    ]"
                  >
                    <option value="">Pilih Status</option>
                    <option value="DRAFT">Draft</option>
                    <option value="AKTIF">Aktif</option>
                    <option value="SELESAI">Selesai</option>
                    <option value="DIBATALKAN">Di Batalkan</option>
                  </select>
                  <p v-if="errors.status" class="mt-1 text-sm text-red-600">
                    {{ errors.status }}
                  </p>
                  <p class="mt-1 text-xs text-gray-500">
                    Status akan menentukan apakah bansos dapat diakses
                  </p>
                </div>

                <!-- Satuan Barang (jika bukan TUNAI) -->
                <div v-if="form.jenis_bansos !== 'TUNAI'">
                  <label for="satuan_barang" class="block text-sm font-medium text-gray-700 mb-2">
                    Satuan Barang
                  </label>
                  <input
                    type="text"
                    id="satuan_barang"
                    v-model="form.satuan_barang"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Contoh: Paket, Liter, Kg, dll"
                  />
                  <p class="mt-1 text-xs text-gray-500">
                    Opsional: satuan untuk bansos berbentuk barang
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions Card -->
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 class="text-lg font-medium text-gray-900">Aksi</h2>
            </div>
            <div class="p-6">
              <div class="space-y-3">
                <button
                  type="submit"
                  :disabled="submitting || loading"
                  class="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    v-if="submitting"
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <svg
                    v-else
                    class="mr-2 h-4 w-4"
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
                  {{ submitting ? 'Menyimpan...' : 'Update Bansos' }}
                </button>

                <button
                  type="button"
                  @click="resetToOriginal"
                  class="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Reset Perubahan
                </button>

                <button
                  type="button"
                  @click="goBack"
                  class="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Batalkan
                </button>

                <!-- Delete Button -->
                <button
                  type="button"
                  @click="confirmDelete"
                  class="w-full flex justify-center items-center py-2 px-4 border border-red-300 rounded-lg shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Hapus Bansos
                </button>
              </div>
            </div>
          </div>

          <!-- Information Card -->
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 class="text-lg font-medium text-gray-900">Informasi</h2>
            </div>
            <div class="p-6">
              <div class="space-y-3">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-5 w-5 text-blue-500"
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
                    <p class="text-sm text-gray-600">
                      Total kuota tidak dapat diubah jika sudah ada penerima.
                    </p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-5 w-5 text-yellow-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-gray-600">
                      Kuota wilayah yang sudah terpakai tidak dapat dihapus atau dikurangi di bawah
                      jumlah terpakai.
                    </p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-5 w-5 text-green-500"
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
                    <p class="text-sm text-gray-600">
                      Pastikan semua informasi sudah benar sebelum menyimpan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0">
              <svg
                class="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium text-gray-900">Hapus Bansos</h3>
            </div>
          </div>

          <p class="text-sm text-gray-500 mb-4">
            Apakah Anda yakin ingin menghapus bansos "<strong>{{ form.nama_bansos }}</strong
            >"?
            <span v-if="totalTerpakaiWilayah > 0" class="block mt-2 text-red-600">
              ⚠️ Peringatan: Ada {{ totalTerpakaiWilayah }} penerima yang sudah terdaftar.
              Penghapusan akan mempengaruhi data penerima.
            </span>
          </p>

          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              @click="showDeleteModal = false"
              class="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Batal
            </button>
            <button
              type="button"
              @click="deleteBansos"
              :disabled="deleting"
              class="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              <svg
                v-if="deleting"
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ deleting ? 'Menghapus...' : 'Ya, Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { wilayahService } from '@/services/wilayah'
import { bansosService } from '@/services/bansos'

const route = useRoute()
const router = useRouter()

// Get ID from route
const id = route.params.id

// State
const dusunList = ref([])
const originalData = ref(null)
const loading = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const error = ref(null)
const showDeleteModal = ref(false)

// Form data
const form = ref({
  kode_bansos: '',
  nama_bansos: '',
  jenis_bansos: 'TUNAI',
  kategori: 'TUNAI',
  deskripsi: '',
  penerima_manfaat: '',
  jumlah_nominal: 0,
  kuota: 0,
  tanggal_mulai: '',
  tanggal_selesai: '',
  status: 'AKTIF',
  prioritas: 'TINGGI',
  satuan_barang: '',
  kuota_wilayah: [],
})

// Validation errors
const errors = ref({})

// Computed properties
const totalAlokasiKuota = computed(() => {
  return form.value.kuota_wilayah.reduce((total, wilayah) => {
    return total + (parseInt(wilayah.kuota) || 0)
  }, 0)
})

const totalTerpakaiWilayah = computed(() => {
  return form.value.kuota_wilayah.reduce((total, wilayah) => {
    return total + (parseInt(wilayah.terpakai) || 0)
  }, 0)
})

const maxKuotaWilayah = computed(() => {
  const used = totalAlokasiKuota.value
  const currentMax = form.value.kuota || 0
  return currentMax - used
})

const getAvailableDusun = (currentIndex) => {
  const selectedIds = form.value.kuota_wilayah
    .filter((_, index) => index !== currentIndex) // kecuali row ini
    .map((w) => w.dusun_id)

  return dusunList.value.filter((dusun) => !selectedIds.includes(dusun.id))
}

const kuotaStatus = computed(() => {
  if (totalAlokasiKuota.value === form.value.kuota) return 'Tepat'
  if (totalAlokasiKuota.value < form.value.kuota) return 'Kurang'
  return 'Kelebihan'
})

onMounted(async () => {
  await fetchDusunData() // tunggu dusun selesai
  await fetchBansosData() // baru isi form
})

// Methods
const fetchBansosData = async () => {
  try {
    loading.value = true
    error.value = null

    const data = await bansosService.getBansosById(id)

    if (!data) {
      error.value = 'Data bansos tidak ditemukan'
      return
    }

    originalData.value = data

    form.value = {
      kode_bansos: data.kode_bansos || '',
      nama_bansos: data.nama_bansos || '',
      jenis_bansos: data.jenis_bansos || 'TUNAI',
      kategori: data.kategori || 'TUNAI',
      deskripsi: data.deskripsi || '',
      penerima_manfaat: data.penerima_manfaat || '',
      jumlah_nominal: data.jumlah_nominal || 0,
      kuota: data.kuota || 0,
      tanggal_mulai: data.tanggal_mulai ? data.tanggal_mulai.split('T')[0] : '',
      tanggal_selesai: data.tanggal_selesai ? data.tanggal_selesai.split('T')[0] : '',
      status: data.status || 'AKTIF',
      prioritas: data.prioritas || 'TINGGI',
      satuan_barang: data.satuan_barang || '',
      kuota_wilayah:
        data.kuota_wilayah?.map((w) => ({
          dusun_id: w.dusun_id,
          kuota: w.kuota || 0,
          terpakai: w.terpakai || 0,
          nama_dusun: w.nama_dusun || '',
        })) || [],
    }
    console.log('Kuota wilayah dari backend:', data.kuota_wilayah)
  } catch (err) {
    console.error('Error fetching bansos:', err)
    error.value = err.message || 'Terjadi kesalahan saat memuat data bansos'
  } finally {
    loading.value = false
  }
}

const fetchDusunData = async () => {
  try {
    const response = await wilayahService.getDusun()
    dusunList.value = response
  } catch (err) {
    console.error('Error fetching dusun:', err)
  }
}

const getDusunName = (dusunId) => {
  const dusun = dusunList.value.find((d) => d.id === dusunId)
  return dusun ? dusun.nama_dusun : 'Tidak diketahui'
}

const tambahWilayah = () => {
  if (totalAlokasiKuota.value < form.value.kuota) {
    form.value.kuota_wilayah.push({ dusun_id: '', kuota: 0, terpakai: 0 })
  }
}

const hapusWilayah = (index) => {
  const wilayah = form.value.kuota_wilayah[index]

  if (wilayah.terpakai > 0) {
    alert('Tidak dapat menghapus wilayah yang sudah memiliki penerima')
    return
  }

  if (form.value.kuota_wilayah.length > 1) {
    form.value.kuota_wilayah.splice(index, 1)
  }
}

const validateForm = () => {
  const newErrors = {}

  // Required fields
  if (!form.value.nama_bansos.trim()) {
    newErrors.nama_bansos = 'Nama bansos wajib diisi'
  }

  if (!form.value.kode_bansos.trim()) {
    newErrors.kode_bansos = 'Kode bansos wajib diisi'
  }

  if (!form.value.deskripsi.trim()) {
    newErrors.deskripsi = 'Deskripsi wajib diisi'
  }

  if (!form.value.prioritas) {
    newErrors.prioritas = 'Prioritas wajib dipilih'
  }

  if (!form.value.penerima_manfaat) {
    newErrors.penerima_manfaat = 'Penerima manfaat wajib dipilih'
  }

  if (
    form.value.jenis_bansos === 'TUNAI' &&
    (!form.value.jumlah_nominal || form.value.jumlah_nominal <= 0)
  ) {
    newErrors.jumlah_nominal = 'Jumlah nominal wajib diisi dan harus lebih dari 0'
  }

  if (!form.value.tanggal_mulai) {
    newErrors.tanggal_mulai = 'Tanggal mulai wajib diisi'
  }

  if (!form.value.tanggal_selesai) {
    newErrors.tanggal_selesai = 'Tanggal selesai wajib diisi'
  }

  if (!form.value.status) {
    newErrors.status = 'Status wajib dipilih'
  }

  // Date validation
  if (form.value.tanggal_mulai && form.value.tanggal_selesai) {
    const startDate = new Date(form.value.tanggal_mulai)
    const endDate = new Date(form.value.tanggal_selesai)

    if (endDate < startDate) {
      newErrors.tanggal_selesai = 'Tanggal selesai harus setelah tanggal mulai'
    }
  }

  // Validate kuota wilayah
  let totalKuotaWilayah = 0
  form.value.kuota_wilayah.forEach((wilayah, index) => {
    if (wilayah.terpakai === 0 && !wilayah.dusun_id) {
      newErrors[`kuota_wilayah_${index}`] = 'Dusun wajib dipilih'
    }

    if (!wilayah.kuota || wilayah.kuota < (wilayah.terpakai || 0)) {
      newErrors[`kuota_wilayah_${index}`] = newErrors[`kuota_wilayah_${index}`]
        ? newErrors[`kuota_wilayah_${index}`] + ' dan kuota minimal ' + (wilayah.terpakai || 0)
        : `Kuota minimal ${wilayah.terpakai || 0}`
    } else {
      totalKuotaWilayah += parseInt(wilayah.kuota) || 0
    }
  })

  // Check if total kuota wilayah exceeds total kuota
  if (totalKuotaWilayah > form.value.kuota) {
    newErrors.kuota_wilayah = `Total kuota wilayah (${totalKuotaWilayah}) melebihi total kuota (${form.value.kuota})`
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const validateDates = () => {
  if (form.value.tanggal_mulai && form.value.tanggal_selesai) {
    const startDate = new Date(form.value.tanggal_mulai)
    const endDate = new Date(form.value.tanggal_selesai)

    if (endDate < startDate) {
      errors.value.tanggal_selesai = 'Tanggal selesai harus setelah tanggal mulai'
    } else {
      delete errors.value.tanggal_selesai
    }
  }
}

const validateWilayah = (index) => {
  const wilayah = form.value.kuota_wilayah[index]
  if (wilayah.terpakai === 0 && wilayah.dusun_id) {
    delete errors.value[`kuota_wilayah_${index}`]
  }
}

const validateKuotaWilayah = (index) => {
  const wilayah = form.value.kuota_wilayah[index]
  const kuota = parseInt(wilayah.kuota) || 0
  const terpakai = parseInt(wilayah.terpakai) || 0

  if (kuota < terpakai) {
    form.value.kuota_wilayah[index].kuota = terpakai
  }
}

const resetToOriginal = () => {
  if (originalData.value) {
    if (confirm('Apakah Anda yakin ingin membatalkan semua perubahan?')) {
      form.value = {
        kode_bansos: originalData.value.kode_bansos || '',
        nama_bansos: originalData.value.nama_bansos || '',
        jenis_bansos: originalData.value.jenis_bansos || 'TUNAI',
        kategori: originalData.value.kategori || 'TUNAI',
        deskripsi: originalData.value.deskripsi || '',
        penerima_manfaat: originalData.value.penerima_manfaat || '',
        jumlah_nominal: originalData.value.jumlah_nominal || 0,
        kuota: originalData.value.kuota || 0,
        tanggal_mulai: originalData.value.tanggal_mulai
          ? originalData.value.tanggal_mulai.split('T')[0]
          : '',
        tanggal_selesai: originalData.value.tanggal_selesai
          ? originalData.value.tanggal_selesai.split('T')[0]
          : '',
        status: originalData.value.status || 'AKTIF',
        prioritas: originalData.value.prioritas || 'TINGGI',
        satuan_barang: originalData.value.satuan_barang || '',
        kuota_wilayah:
          originalData.value.kuota_wilayah?.map((w) => ({
            dusun_id: w.dusun_id,
            kuota: w.kuota || 0,
            terpakai: w.terpakai || 0,
            nama_dusun: w.nama_dusun || '',
          })) || [],
      }
      errors.value = {}
    }
  }
}

const goBack = () => {
  router.push(`/admin/daftar-bansos/${id}`)
}

const submitForm = async () => {
  if (!validateForm()) {
    const firstErrorKey = Object.keys(errors.value)[0]
    if (firstErrorKey) {
      const element = document.getElementById(firstErrorKey)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.focus()
      }
    }
    return
  }

  // Warn if kuota distribution exceeds total
  if (totalAlokasiKuota.value > form.value.kuota) {
    if (
      !confirm(
        `Total alokasi kuota wilayah (${totalAlokasiKuota.value}) melebihi total kuota (${form.value.kuota}). Lanjutkan?`,
      )
    ) {
      return
    }
  }

  try {
    submitting.value = true

    // Prepare data for API
    const submitData = {
      ...form.value,
      // Ensure proper number conversion
      jumlah_nominal: parseInt(form.value.jumlah_nominal) || 0,
      // Process kuota wilayah
      kuota_wilayah: form.value.kuota_wilayah
        .map((w) => ({
          dusun_id: parseInt(w.dusun_id),
          kuota: parseInt(w.kuota) || 0,
        }))
        .filter((w) => w.dusun_id), // Remove empty entries
    }

    console.log('DATA DIKIRIM UPDATE:')
    console.log(JSON.stringify(submitData, null, 2))

    const response = await bansosService.updateBansos(id, submitData)

    if (response.success) {
      alert('Bansos berhasil diperbarui!')
      router.push(`/admin/daftar-bansos/${id}`)
    } else {
      alert(`Gagal memperbarui bansos: ${response.message}`)
    }
  } catch (error) {
    console.error('Error updating bansos:', error)
    alert('Terjadi kesalahan saat memperbarui bansos. Silakan coba lagi.')
  } finally {
    submitting.value = false
  }
}

const confirmDelete = () => {
  showDeleteModal.value = true
}

const deleteBansos = async () => {
  try {
    deleting.value = true

    const response = await bansosService.deleteBansos(id)

    if (response.success) {
      alert('Bansos berhasil dihapus!')
      router.push('/admin/bansos')
    } else {
      alert(`Gagal menghapus bansos: ${response.message}`)
      showDeleteModal.value = false
    }
  } catch (error) {
    console.error('Error deleting bansos:', error)
    alert('Terjadi kesalahan saat menghapus bansos. Silakan coba lagi.')
    showDeleteModal.value = false
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
input:focus,
select:focus,
textarea:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.disabled\:bg-gray-100:disabled {
  background-color: #f3f4f6;
}
</style>
