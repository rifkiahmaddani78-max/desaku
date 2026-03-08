<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 mb-2">Tambah Bansos Baru</h1>
          <p class="text-sm text-gray-600">
            Isi form di bawah untuk menambahkan program bantuan sosial baru
          </p>
        </div>
        <div>
          <router-link to="/admin/daftar-bansos">
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
              Kembali ke Daftar
            </button>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Loading State for initial data -->
    <div v-if="loadingDusun" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
      ></div>
      <p class="mt-2 text-sm text-gray-500">Memuat data wilayah...</p>
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

                <!-- Satuan Barang (jika jenis BARANG) -->
                <div v-if="form.jenis_bansos === 'BARANG'">
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
                    :min="today"
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
                    :min="form.tanggal_mulai || today"
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
                  <p class="text-sm text-gray-500 mt-1">Atur total kuota dan distribusi wilayah</p>
                </div>
                <div v-if="form.kuota > 0" class="text-sm text-gray-700">
                  Total Alokasi: <span class="font-semibold">{{ totalAlokasiKuota }}</span> dari
                  <span class="font-semibold">{{ form.kuota }}</span>
                </div>
              </div>
            </div>
            <div class="p-6">
              <!-- Total Kuota -->
              <div class="mb-6">
                <label for="kuota" class="block text-sm font-medium text-gray-700 mb-2">
                  Total Kuota <span class="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="kuota"
                  v-model.number="form.kuota"
                  min="1"
                  :class="[
                    'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                    errors.kuota ? 'border-red-300' : 'border-gray-300',
                  ]"
                  placeholder="Contoh: 100"
                  @input="validateKuota"
                />
                <p v-if="errors.kuota" class="mt-1 text-sm text-red-600">
                  {{ errors.kuota }}
                </p>
                <p class="mt-1 text-xs text-gray-500">Jumlah total penerima yang dapat dilayani</p>
              </div>

              <!-- Distribusi Kuota Wilayah -->
              <div>
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-sm font-medium text-gray-700">Distribusi Kuota Wilayah</h3>
                  <button
                    type="button"
                    @click="tambahWilayah"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="totalAlokasiKuota >= form.kuota"
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
                            Kuota
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
                            <select
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
                              <option v-for="dusun in dusunList" :key="dusun.id" :value="dusun.id">
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
                            <input
                              type="number"
                              v-model.number="item.kuota"
                              min="1"
                              :max="getMaxKuotaWilayah(index)"
                              class="w-24 px-2 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                              @input="validateKuotaWilayah(index)"
                            />
                          </td>
                          <td class="px-4 py-3 whitespace-nowrap">
                            <button
                              type="button"
                              @click="hapusWilayah(index)"
                              class="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              :disabled="form.kuota_wilayah.length === 1"
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
                      <tfoot v-if="form.kuota > 0" class="bg-gray-50">
                        <tr>
                          <td class="px-4 py-3 text-sm font-medium text-gray-900">Total</td>
                          <td class="px-4 py-3 text-sm font-medium text-gray-900">
                            {{ totalAlokasiKuota }} / {{ form.kuota }}
                          </td>
                          <td class="px-4 py-3">
                            <span
                              :class="{
                                'text-green-600': totalAlokasiKuota === form.kuota,
                                'text-yellow-600':
                                  totalAlokasiKuota < form.kuota && totalAlokasiKuota > 0,
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
                  <p
                    v-if="totalAlokasiKuota !== form.kuota && form.kuota > 0"
                    class="mt-2 text-sm text-yellow-600"
                  >
                    Total alokasi kuota wilayah ({{ totalAlokasiKuota }}) tidak sama dengan total
                    kuota ({{ form.kuota }})
                  </p>
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
                      :disabled="form.kuota <= 0"
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
                    <p v-if="form.kuota <= 0" class="mt-2 text-xs text-gray-500">
                      Isi total kuota terlebih dahulu
                    </p>
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
                    <option value="DIBATALKAN">Dibatalkan</option>
                  </select>
                  <p v-if="errors.status" class="mt-1 text-sm text-red-600">
                    {{ errors.status }}
                  </p>
                  <p class="mt-1 text-xs text-gray-500">
                    Status akan menentukan apakah bansos dapat diakses
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
                  :disabled="loadingSubmit"
                  class="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    v-if="loadingSubmit"
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
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  {{ loadingSubmit ? 'Menyimpan...' : 'Simpan Bansos' }}
                </button>

                <button
                  type="button"
                  @click="resetForm"
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
                  Reset Form
                </button>

                <button
                  type="button"
                  @click="$router.push('/admin/daftar-bansos')"
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
                      Pastikan semua informasi sudah benar sebelum menyimpan.
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
                      Bansos yang sudah disimpan dapat diedit kapan saja.
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
                      Periksa kembali distribusi kuota wilayah agar sesuai dengan total kuota.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { dusunService } from '@/services/dusun'
import { bansosService } from '@/services/bansos'

const router = useRouter()

// State
const dusunList = ref([])
const loadingDusun = ref(false)
const loadingSubmit = ref(false)

// Form data sesuai dengan struktur API
const form = ref({
  kode_bansos: '',
  nama_bansos: '',
  jenis_bansos: 'TUNAI',
  kategori: 'TUNAI',
  deskripsi: '',
  penerima_manfaat: '',
  jumlah_nominal: 0,
  satuan_barang: '',
  kuota: 0,
  tanggal_mulai: '',
  tanggal_selesai: '',
  status: 'AKTIF',
  prioritas: 'TINGGI',
  kuota_wilayah: [],
})

// Validation errors
const errors = ref({})

// Computed properties
const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const totalAlokasiKuota = computed(() => {
  return form.value.kuota_wilayah.reduce((total, wilayah) => {
    return total + (parseInt(wilayah.kuota) || 0)
  }, 0)
})

const getMaxKuotaWilayah = (index) => {
  const currentKuota = parseInt(form.value.kuota) || 0

  const totalOther = form.value.kuota_wilayah.reduce((total, w, i) => {
    if (i !== index) {
      return total + (parseInt(w.kuota) || 0)
    }
    return total
  }, 0)

  return currentKuota - totalOther
}

const kuotaStatus = computed(() => {
  if (!form.value.kuota) return 'Isi kuota'
  if (totalAlokasiKuota.value === form.value.kuota) return 'Tepat'
  if (totalAlokasiKuota.value > form.value.kuota) return 'Kelebihan'
  return 'Kurang'
})

const availableDusun = computed(() => {
  // Filter dusun yang belum dipilih
  const selectedDusunIds = form.value.kuota_wilayah.map((w) => w.dusun_id).filter((id) => id)

  return dusunList.value.filter((dusun) => !selectedDusunIds.includes(dusun.id))
})

// Lifecycle
onMounted(async () => {
  await fetchDusunData()
})

// Methods
const fetchDusunData = async () => {
  try {
    loadingDusun.value = true
    const response = await dusunService.getDusunList()
    dusunList.value = response.data
  } catch (error) {
    console.error('Error mengambil data dusun:', error)
  } finally {
    loadingDusun.value = false
  }
}

const tambahWilayah = () => {
  if (form.value.kuota_wilayah.length === 0) {
    form.value.kuota_wilayah = [{ dusun_id: '', kuota: 1 }]
  } else {
    form.value.kuota_wilayah.push({ dusun_id: '', kuota: 1 })
  }
}

const hapusWilayah = (index) => {
  if (form.value.kuota_wilayah.length > 1) {
    form.value.kuota_wilayah.splice(index, 1)
  } else {
    // Reset the single row instead of removing
    form.value.kuota_wilayah[0] = { dusun_id: '', kuota: 1 }
  }
}

const validateForm = () => {
  const newErrors = {}

  // Required fields
  if (!form.value.nama_bansos?.trim()) {
    newErrors.nama_bansos = 'Nama bansos wajib diisi'
  }

  if (!form.value.kode_bansos?.trim()) {
    newErrors.kode_bansos = 'Kode bansos wajib diisi'
  }

  if (!form.value.deskripsi?.trim()) {
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

  if (!form.value.kuota || form.value.kuota <= 0) {
    newErrors.kuota = 'Kuota wajib diisi dan harus lebih dari 0'
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
  if (form.value.kuota_wilayah.length > 0) {
    let totalKuotaWilayah = 0
    let hasDuplicate = false
    const dusunIds = []

    form.value.kuota_wilayah.forEach((wilayah, index) => {
      // Check duplicate dusun
      if (wilayah.dusun_id) {
        if (dusunIds.includes(wilayah.dusun_id)) {
          hasDuplicate = true
          newErrors[`kuota_wilayah_${index}`] = 'Dusun tidak boleh duplikat'
        }
        dusunIds.push(wilayah.dusun_id)
      }

      if (!wilayah.dusun_id) {
        newErrors[`kuota_wilayah_${index}`] = 'Dusun wajib dipilih'
      }

      if (!wilayah.kuota || wilayah.kuota < 1) {
        newErrors[`kuota_wilayah_${index}`] = newErrors[`kuota_wilayah_${index}`]
          ? newErrors[`kuota_wilayah_${index}`] + ' dan kuota minimal 1'
          : 'Kuota minimal 1'
      } else {
        totalKuotaWilayah += parseInt(wilayah.kuota) || 0
      }
    })

    // Check if total kuota wilayah exceeds total kuota
    if (totalKuotaWilayah > form.value.kuota) {
      newErrors.kuota_wilayah = `Total kuota wilayah (${totalKuotaWilayah}) melebihi total kuota (${form.value.kuota})`
    }
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

const validateKuota = () => {
  if (form.value.kuota <= 0) {
    errors.value.kuota = 'Kuota harus lebih dari 0'
  } else {
    delete errors.value.kuota
  }

  // Adjust kuota wilayah if needed
  if (totalAlokasiKuota.value > form.value.kuota) {
    errors.value.kuota_wilayah = `Total kuota wilayah (${totalAlokasiKuota.value}) melebihi total kuota (${form.value.kuota})`
  } else {
    delete errors.value.kuota_wilayah
  }
}

const validateWilayah = (index) => {
  const wilayah = form.value.kuota_wilayah[index]

  if (wilayah.dusun_id) {
    delete errors.value[`kuota_wilayah_${index}`]
  }

  // Check for duplicate dusun
  const duplicateIndex = form.value.kuota_wilayah.findIndex(
    (w, i) => i !== index && w.dusun_id && w.dusun_id === wilayah.dusun_id,
  )

  if (duplicateIndex !== -1) {
    errors.value[`kuota_wilayah_${index}`] = 'Dusun tidak boleh duplikat'
    errors.value[`kuota_wilayah_${duplicateIndex}`] = 'Dusun tidak boleh duplikat'
  }
}

const validateKuotaWilayah = (index) => {
  const wilayah = form.value.kuota_wilayah[index]
  let kuota = parseInt(wilayah.kuota) || 0

  if (kuota < 1) {
    form.value.kuota_wilayah[index].kuota = 1
    kuota = 1
  }

  // Check if total exceeds
  const totalWilayah = form.value.kuota_wilayah.reduce((total, w, i) => {
    return total + (parseInt(w.kuota) || 0)
  }, 0)

  if (totalWilayah > form.value.kuota) {
    errors.value.kuota_wilayah = `Total kuota wilayah (${totalWilayah}) melebihi total kuota (${form.value.kuota})`
  } else {
    delete errors.value.kuota_wilayah
  }
}

const resetForm = () => {
  if (confirm('Apakah Anda yakin ingin mereset form? Semua data yang telah diisi akan hilang.')) {
    form.value = {
      kode_bansos: '',
      nama_bansos: '',
      jenis_bansos: 'TUNAI',
      kategori: 'TUNAI',
      deskripsi: '',
      penerima_manfaat: '',
      jumlah_nominal: 0,
      satuan_barang: '',
      kuota: 0,
      tanggal_mulai: '',
      tanggal_selesai: '',
      status: 'AKTIF',
      prioritas: 'TINGGI',
      kuota_wilayah: [],
    }
    errors.value = {}
  }
}

const submitForm = async () => {
  if (!validateForm()) {
    // Scroll to first error
    const firstErrorKey = Object.keys(errors.value)[0]
    if (firstErrorKey) {
      const element = document.getElementById(firstErrorKey)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.focus()
      } else {
        // If element not found, try to find by name
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
    return
  }

  // Warn if kuota distribution doesn't match total
  if (form.value.kuota_wilayah.length > 0 && totalAlokasiKuota.value !== form.value.kuota) {
    if (
      !confirm(
        `Total alokasi kuota wilayah (${totalAlokasiKuota.value}) tidak sama dengan total kuota (${form.value.kuota}). Lanjutkan?`,
      )
    ) {
      return
    }
  }

  try {
    loadingSubmit.value = true

    // Prepare data for API
    const submitData = {
      ...form.value,
      // Ensure proper number conversion
      jumlah_nominal: parseInt(form.value.jumlah_nominal) || 0,
      kuota: parseInt(form.value.kuota) || 0,
      // Process kuota wilayah
      kuota_wilayah: form.value.kuota_wilayah
        .map((w) => ({
          dusun_id: parseInt(w.dusun_id),
          kuota: parseInt(w.kuota) || 0,
        }))
        .filter((w) => w.dusun_id && w.kuota > 0), // Remove empty entries and zero kuota
    }

    const response = await bansosService.createBansos(submitData)

    if (response.success) {
      alert('Bansos berhasil ditambahkan!')
      router.push('/admin/daftar-bansos')
    } else {
      alert(`Gagal menambahkan bansos: ${response.message}`)
    }
  } catch (error) {
    console.error('Error creating bansos:', error)
    alert('Terjadi kesalahan saat menyimpan bansos. Silakan coba lagi.')
  } finally {
    loadingSubmit.value = false
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
</style>
