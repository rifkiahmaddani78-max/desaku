<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <button 
            @click="$router.back()" 
            class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Daftar
          </button>
          <h1 class="text-2xl font-semibold text-gray-900">Detail Pengajuan Bansos</h1>
        </div>
        
        <!-- Status Badge -->
        <Badge :variant="getStatusVariant(detail.status)" size="lg">
          {{ getStatusText(detail.status) }}
        </Badge>
      </div>
      <p class="text-sm text-gray-600 mt-2">
        Informasi lengkap pengajuan bansos yang Anda ajukan
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <p class="mt-2 text-sm text-gray-500">Memuat detail pengajuan...</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Main Info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Informasi Bansos Card -->
          <Card title="Informasi Bantuan Sosial">
            <div class="space-y-6">
              <!-- Header dengan Avatar -->
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="h-16 w-16 rounded-lg" :class="getJenisWarna(detail.jenis_bansos)">
                    <div class="h-full w-full flex items-center justify-center">
                      <span class="text-white font-bold text-xl">
                        {{ getInitials(detail.nama_bansos) }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex-1">
                  <h2 class="text-xl font-bold text-gray-900">{{ detail.nama_bansos }}</h2>
                  <p class="text-sm text-gray-500">Kode: {{ detail.kode_bansos }}</p>
                  <div class="flex items-center mt-2 space-x-2">
                    <Badge :variant="getJenisVariant(detail.jenis_bansos)" size="sm">
                      {{ detail.jenis_bansos }}
                    </Badge>
                    <Badge variant="info" size="sm">
                      {{ detail.kategori }}
                    </Badge>
                  </div>
                </div>
              </div>

              <!-- Detail Grid -->
              <div class="grid grid-cols-2 gap-4">
                <DetailItem label="Nominal" class="col-span-2 sm:col-span-1">
                  <p v-if="detail.jenis_bansos === 'TUNAI'" class="text-lg font-semibold text-green-600">
                    {{ formatCurrency(detail.jumlah_nominal) }}
                  </p>
                  <p v-else class="text-gray-500">-</p>
                </DetailItem>

                <DetailItem label="Satuan" class="col-span-2 sm:col-span-1">
                  <p>{{ detail.satuan_barang || '-' }}</p>
                </DetailItem>

                <DetailItem label="Periode" class="col-span-2">
                  <p>{{ formatDate(detail.tanggal_mulai) }} - {{ formatDate(detail.tanggal_selesai) }}</p>
                </DetailItem>
              </div>

              <!-- Alasan Pengajuan -->
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-gray-700 mb-2">Alasan Pengajuan</h3>
                <p class="text-sm text-gray-600">{{ detail.alasan_pengajuan }}</p>
              </div>

              <!-- Dokumen-dokumen -->
              <div v-if="hasDocuments" class="border-t border-gray-200 pt-4">
                <h3 class="text-sm font-medium text-gray-700 mb-3">Dokumen Pendukung</h3>
                <div class="grid grid-cols-2 gap-3">
                  <DocumentLink 
                    v-if="detail.dokumen_ktp_url"
                    :url="detail.dokumen_ktp_url"
                    label="KTP"
                  />
                  <DocumentLink 
                    v-if="detail.dokumen_kk_url"
                    :url="detail.dokumen_kk_url"
                    label="Kartu Keluarga"
                  />
                  <DocumentLink 
                    v-if="detail.dokumen_surat_permohonan_url"
                    :url="detail.dokumen_surat_permohonan_url"
                    label="Surat Permohonan"
                  />
                  <DocumentLink 
                    v-if="detail.dokumen_pendukung_url"
                    :url="detail.dokumen_pendukung_url"
                    label="Dokumen Pendukung"
                  />
                  <DocumentLink 
                    v-if="detail.dokumen_lainnya_url"
                    :url="detail.dokumen_lainnya_url"
                    label="Dokumen Lainnya"
                  />
                </div>
              </div>
            </div>
          </Card>

          <!-- Informasi Pemohon Card -->
          <Card title="Informasi Pemohon">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Nama Lengkap">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center mr-2">
                    <span class="text-primary-700 font-semibold text-xs">
                      {{ getInitials(detail.kk_nama) }}
                    </span>
                  </div>
                  <span class="font-medium">{{ detail.kk_nama }}</span>
                </div>
              </DetailItem>

              <DetailItem label="NIK">
                <p class="font-mono">{{ detail.kk_nik }}</p>
              </DetailItem>

              <DetailItem label="Telepon">
                <p>{{ detail.kk_telepon || '-' }}</p>
              </DetailItem>

              <DetailItem label="Alamat">
                <p>{{ detail.alamat_lengkap || '-' }}</p>
              </DetailItem>

              <DetailItem label="Dusun">
                <p>{{ detail.nama_dusun }}</p>
              </DetailItem>

              <DetailItem label="RW / RT">
                <p>RW {{ detail.nomor_rw || '-' }} / RT {{ detail.nomor_rt || '-' }}</p>
              </DetailItem>
            </div>
          </Card>
        </div>

        <!-- Right Column - Status & Timeline -->
        <div class="space-y-6">
          <!-- Status Info Card -->
          <Card title="Informasi Status">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Status Saat Ini</span>
                <Badge :variant="getStatusVariant(detail.status)" size="md">
                  {{ getStatusText(detail.status) }}
                </Badge>
              </div>

              <div v-if="detail.keterangan" class="bg-gray-50 p-3 rounded-lg">
                <p class="text-xs text-gray-500 mb-1">Keterangan</p>
                <p class="text-sm">{{ detail.keterangan }}</p>
              </div>

              <div v-if="detail.catatan_admin" class="bg-blue-50 p-3 rounded-lg">
                <p class="text-xs text-blue-500 mb-1">Catatan Admin</p>
                <p class="text-sm text-blue-700">{{ detail.catatan_admin }}</p>
              </div>
            </div>
          </Card>

          <!-- Timeline Card -->
          <Card title="Riwayat Aktivitas">
            <div class="flow-root">
              <ul role="list" class="-mb-8">
                <li v-for="(log, index) in detail.logs" :key="log.id">
                  <div class="relative pb-8">
                    <span 
                      v-if="index !== detail.logs.length - 1"
                      class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                    <div class="relative flex space-x-3">
                      <div>
                        <span :class="[getLogIconBg(log.aksi), 'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white']">
                          <component :is="getLogIcon(log.aksi)" class="h-5 w-5 text-white" />
                        </span>
                      </div>
                      <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p class="text-sm text-gray-900">
                            {{ log.deskripsi }}
                          </p>
                          <p class="mt-1 text-xs text-gray-500">
                            oleh {{ log.user_nama }}
                          </p>
                          <p v-if="log.metadata?.keterangan" class="mt-1 text-xs text-gray-600">
                            <span class="font-medium">Keterangan:</span> {{ log.metadata.keterangan }}
                          </p>
                        </div>
                        <div class="whitespace-nowrap text-right text-xs text-gray-500">
                          <time :datetime="log.created_at">{{ formatDateTime(log.created_at) }}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </Card>

          <!-- Info Tambahan Card -->
          <Card title="Informasi Tambahan">
            <div class="space-y-3">
              <div v-if="detail.diterima_oleh" class="flex items-start text-sm">
                <CheckCircleIcon class="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p class="text-gray-900">Diterima oleh:</p>
                  <p class="text-gray-600">{{ detail.admin_diterima_nama }}</p>
                  <p class="text-xs text-gray-500">{{ formatDateTime(detail.tanggal_diterima) }}</p>
                </div>
              </div>

              <div v-if="detail.ditolak_oleh" class="flex items-start text-sm">
                <XCircleIcon class="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p class="text-gray-900">Ditolak oleh:</p>
                  <p class="text-gray-600">{{ detail.admin_ditolak_nama }}</p>
                  <p class="text-xs text-gray-500">{{ formatDateTime(detail.tanggal_ditolak) }}</p>
                </div>
              </div>

              <div class="pt-3 border-t border-gray-200">
                <div class="flex justify-between text-xs text-gray-500">
                  <span>Dibuat:</span>
                  <span>{{ formatDateTime(detail.created_at) }}</span>
                </div>
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Diperbarui:</span>
                  <span>{{ formatDateTime(detail.updated_at) }}</span>
                </div>
              </div>
            </div>
          </Card>

          <!-- Action Buttons -->
          <div class="flex flex-col space-y-3">
            <!-- <Button 
              v-if="detail.status === 'MENUNGGU'"
              variant="danger"
              @click="confirmCancel"
              :loading="cancelling"
            >
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Batalkan Pengajuan
            </Button> -->

            <Button 
              v-if="detail.status === 'DITERIMA' && !detail.testimoni"
              variant="primary"
              @click="openTestimoniModal"
            >
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Beri Testimoni
            </Button>
          </div>
        </div>
      </div>

      <!-- Modal Testimoni -->
      <div v-if="showTestimoniModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" @click="showTestimoniModal = false">
            <div class="absolute inset-0 bg-gray-500 bg-opacity-75"></div>
          </div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                  <StarIcon class="h-6 w-6 text-yellow-600" />
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Beri Testimoni
                  </h3>
                  
                  <div class="mt-4 space-y-4">
                    <!-- Rating -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Rating <span class="text-red-500">*</span>
                      </label>
                      <div class="flex items-center space-x-2">
                        <button
                          v-for="star in 5"
                          :key="star"
                          @click="testimoniForm.rating = star"
                          type="button"
                          class="focus:outline-none"
                        >
                          <StarIcon 
                            :class="[
                              'h-8 w-8 transition-colors duration-200',
                              star <= testimoniForm.rating ? 'text-yellow-400' : 'text-gray-300'
                            ]"
                            :solid="star <= testimoniForm.rating"
                          />
                        </button>
                      </div>
                    </div>

                    <!-- Testimoni -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Testimoni Anda
                      </label>
                      <textarea
                        v-model="testimoniForm.testimoni"
                        rows="4"
                        class="input-field w-full"
                        placeholder="Tuliskan pengalaman Anda menerima bansos ini..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <Button
                type="button"
                variant="primary"
                @click="submitTestimoni"
                :loading="submittingTestimoni"
                :disabled="!testimoniForm.rating"
              >
                {{ submittingTestimoni ? 'Mengirim...' : 'Kirim Testimoni' }}
              </Button>
              <Button
                type="button"
                variant="outline"
                @click="showTestimoniModal = false"
                class="mr-3"
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { pengajuanService } from '@/services/pengajuan'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import DetailItem from '@/components/ui/DetailItem.vue'
import DocumentLink from '@/components/ui/DocumentLink.vue'
import { 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  PencilIcon,
  DocumentTextIcon,
  StarIcon
} from '@heroicons/vue/24/outline'
import { getInitials, formatCurrency, formatDate, formatDateTime } from '@/utils/helpers'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const cancelling = ref(false)
const submittingTestimoni = ref(false)
const showTestimoniModal = ref(false)
const detail = ref({
  logs: []
})

const testimoniForm = ref({
  rating: 0,
  testimoni: ''
})

// Check if has documents
const hasDocuments = computed(() => {
  return detail.value.dokumen_ktp_url ||
         detail.value.dokumen_kk_url ||
         detail.value.dokumen_surat_permohonan_url ||
         detail.value.dokumen_pendukung_url ||
         detail.value.dokumen_lainnya_url
})

// Get warna berdasarkan jenis bansos
const getJenisWarna = (jenis) => {
  const colors = {
    'TUNAI': 'bg-green-600',
    'BARANG': 'bg-purple-600',
    'JASA': 'bg-blue-600'
  }
  return colors[jenis] || 'bg-primary-600'
}

// Get variant untuk jenis bansos badge
const getJenisVariant = (jenis) => {
  const variants = {
    'TUNAI': 'success',
    'BARANG': 'info',
    'JASA': 'warning'
  }
  return variants[jenis] || 'gray'
}

// Status helpers
const getStatusVariant = (status) => {
  const variants = {
    'MENUNGGU': 'warning',
    'DIPROSES': 'info',
    'DITERIMA': 'success',
    'DITOLAK': 'danger'
  }
  return variants[status] || 'gray'
}

const getStatusText = (status) => {
  const texts = {
    'MENUNGGU': 'Menunggu',
    'DIPROSES': 'Diproses',
    'DITERIMA': 'Diterima',
    'DITOLAK': 'Ditolak'
  }
  return texts[status] || status
}

// Log helpers
const getLogIcon = (aksi) => {
  const icons = {
    'PENGAJUAN': DocumentTextIcon,
    'VERIFIKASI': CheckCircleIcon,
    'PENOLAKAN': XCircleIcon,
    'PERUBAHAN': PencilIcon
  }
  return icons[aksi] || ClockIcon
}

const getLogIconBg = (aksi) => {
  const colors = {
    'PENGAJUAN': 'bg-blue-500',
    'VERIFIKASI': 'bg-green-500',
    'PENOLAKAN': 'bg-red-500',
    'PERUBAHAN': 'bg-yellow-500'
  }
  return colors[aksi] || 'bg-gray-500'
}

const fetchDetail = async () => {
  loading.value = true
  try {
    const response = await pengajuanService.getPengajuanById(route.params.id)
    
    if (response.success) {
      detail.value = response.data
    }
  } catch (err) {
    console.error('Error fetching detail:', err)
    alert('Gagal memuat detail pengajuan: ' + (err.message || 'Terjadi kesalahan'))
    router.back()
  } finally {
    loading.value = false
  }
}

// const confirmCancel = async () => {
//   if (!confirm('Yakin ingin membatalkan pengajuan bansos ini?')) {
//     return
//   }

//   cancelling.value = true
//   try {
//     await pengajuanService.cancelPengajuan(route.params.id)
//     alert('Pengajuan berhasil dibatalkan')
//     router.back()
//   } catch (err) {
//     console.error('Error canceling pengajuan:', err)
//     alert('Gagal membatalkan pengajuan: ' + (err.message || 'Terjadi kesalahan'))
//   } finally {
//     cancelling.value = false
//   }
// }

const openTestimoniModal = () => {
  testimoniForm.value = {
    rating: 0,
    testimoni: ''
  }
  showTestimoniModal.value = true
}

const submitTestimoni = async () => {
  if (!testimoniForm.value.rating) {
    alert('Pilih rating terlebih dahulu')
    return
  }

  submittingTestimoni.value = true
  try {
    await pengajuanService.addTestimoni(route.params.id, {
      rating: testimoniForm.value.rating,
      testimoni: testimoniForm.value.testimoni
    })
    alert('Testimoni berhasil dikirim!')
    showTestimoniModal.value = false
    await fetchDetail() // Refresh data
  } catch (err) {
    console.error('Error submitting testimoni:', err)
    alert('Gagal mengirim testimoni: ' + (err.message || 'Terjadi kesalahan'))
  } finally {
    submittingTestimoni.value = false
  }
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.input-field {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors duration-200;
}

/* Custom scrollbar for timeline */
.flow-root {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
}

.flow-root::-webkit-scrollbar {
  width: 6px;
}

.flow-root::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.flow-root::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.flow-root::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
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
</style>